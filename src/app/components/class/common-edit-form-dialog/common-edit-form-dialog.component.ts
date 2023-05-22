import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Serie} from "@app/models/serie.model";
import {FileUploader} from "ng2-file-upload";
import axios from "axios";
import {Utils} from "@app/utils/utils";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FormService} from "@app/services/form.service";
import {environment} from "@environments/environment";
import Resumable from "resumablejs";
import {CookieService} from "ngx-cookie-service";
import {HttpXsrfTokenExtractor} from "@angular/common/http";
import ResumableFile = Resumable.ResumableFile;
import {CommonHttpResponse} from "@app/models/common-http-response.model";

export interface CommonEditData {
  serie: Serie;
  obj: string;
  name: string;
  description: string;
  url: string;
  mode: string;
}

@Component({
  selector: 'app-common-edit-form-dialog',
  templateUrl: './common-edit-form-dialog.component.html',
  styleUrls: ['./common-edit-form-dialog.component.css']
})
export class CommonEditFormDialogComponent implements OnInit {
  loading: Boolean = false;
  ready: boolean = false;
  thumb: string = "";
  uploader = new FileUploader({url: ''});

  defaultName: string = '';
  defaultDescription: string = '';
  submitRecord: FormGroup | undefined;
  progress: number = 0.0;
  filePath: string = '';
  fileId: string = '';
  resumable = new Resumable({
    target:environment.domain + '/api/file/upload',
    chunkSize: 1024 * 1024,
    simultaneousUploads: 3,
    testChunks: false,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-XSRF-TOKEN': this.tokenService.getToken()
    },
    maxChunkRetries: 2,
    maxFiles: 1,
    withCredentials: true,
    fileType: ['mp3', 'mp4', 'pdf'],
  });

  /**
   * This is a constructor function
   * @param {MatDialogRef} dialogRef
   * @param {CommonEditData} data
   * @param {MatSnackBar} snackBar
   * @param {FormService} formService
   * @param {FormBuilder} formBuilder
   * @param {HttpXsrfTokenExtractor} tokenService
   */
  constructor(private dialogRef: MatDialogRef<CommonEditFormDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: CommonEditData,
              private snackBar: MatSnackBar,
              public formService: FormService,
              private formBuilder: FormBuilder,
              private tokenService: HttpXsrfTokenExtractor) { }

  /**
   * The function initializes variables and sets options for a file upload process using Resumable.js, based on the type of
   * file being uploaded and the mode of operation.
   */
  ngOnInit(): void {
    let allowType: string[] = [];
    let maxSize: number = 10 * 1024 * 1024;
    switch (this.data.obj) {
      case 'episode': {
        if(this.data.serie.type == 'video'){
          allowType = ['mp4'];
        } else if(this.data.serie.type == 'podcast'){
          allowType = ['mp3'];
        }
        maxSize = 200 * 1024 * 1024;
        break;
      }
      case 'file': {
        allowType = ['pdf'];
        maxSize = 10 * 1024 * 1024;
        break;
      }
    }
    this.resumable.opts.fileType = allowType;
    // @ts-ignore
    this.resumable.opts.maxFileSize = maxSize;

    if(this.data.mode == 'edit'){
      this.defaultName = this.data.name ?? '';
      this.defaultDescription = this.data.description ?? '';
    }

    this.submitRecord = this.formBuilder.group({
      name: [this.defaultName, [Validators.required,Validators.maxLength(100)]],
      description: [this.defaultDescription, [Validators.required,Validators.maxLength(500)]],
    });

    if(this.data.mode == 'create' &&
      (this.data.obj == 'episode' || this.data.obj == 'file')){
      this.resumable.assignBrowse(document.getElementById('browseButton')!,false);

    }
    let thisComp = this;
    this.resumable.on('fileAdded', function(file, event){
      thisComp.dialogRef.disableClose = true;
      thisComp.fileId = file.uniqueIdentifier;
      thisComp.resumable.upload();
    });
    this.resumable.on('fileSuccess', function(response, message){
      let res = JSON.parse(message);
      thisComp.filePath = res.path + res.name;
    });
    this.resumable.on('fileError', function(file, message){
      thisComp.snackBar.open(message, 'X', {
        verticalPosition: 'top',
      });
    });
    this.resumable.on('fileProgress', function(file, message){
      thisComp.progress = thisComp.resumable.progress();
    });
  }

  /**
   * This function checks if a file has been uploaded in a specific mode and context.
   * @returns {boolean} isFileUploaded
   */
  get isFileUploaded(): boolean{
    return this.data.obj != 'section' && this.data.mode == 'create' && this.filePath == '';
  }

  /**
   * This function returns a boolean value indicating whether the upload section should be hidden or not
   * @returns {boolean} hideUpload
   */
  get hideUpload(){
    return ! (this.data.mode == 'create' &&
    (this.data.obj == 'episode' || this.data.obj == 'file') && !this.loading && this.progress == 0)
  }

  /**
   * This function checks if a task is in progress based on its progress and loading status.
   * @returns {boolean} inProgress
   */
  get inProgress(){
    return this.progress > 0 && this.progress < 1 && !this.loading;
  }

  /**
   * This function returns true if the progress is 1 and the loading is false.
   * @returns {boolean} completed
   */
  get completed(){
    return this.progress == 1 && !this.loading;
  }

  /**
   * The function cancels a file upload and sends a request to the server to cancel the upload.
   */
  onFileCancel(){
    this.resumable.pause();
    const url = environment.domain + environment.apiEndpoints.series.file.cancelUpload.replace('{uniqueId}', this.fileId);
    axios.post(url)
      .then(res => {
        const response = res.data as CommonHttpResponse;
        this.snackBar.open(response.message, 'X', {
          duration: 5000,
          verticalPosition: 'top',
        })
        if(response.status === 200){
          this.resumable.cancel();
          this.progress = 0.0;
        }
      })
      .catch(err => {
        this.snackBar.open(err, 'X', {
          duration: 5000,
          verticalPosition: 'top',
        });
        this.resumable.upload();
      })
  }

  /**
   * This function sends a request to delete a file from a server and displays a message based on the response.
   */
  onFileDelete(){
    const url = environment.domain + environment.apiEndpoints.series.file.deleteUpload;
    const body = {};
    body['name'] = this.filePath.split('/').at(-1);
    body['type'] = this.filePath.split('/').at(-2);

    axios.post(url, body)
      .then(res => {
        const response = res.data as CommonHttpResponse;
        this.snackBar.open(response.message, 'X', {
          duration: 5000,
          verticalPosition: 'top',
        })
        if(response.status === 200){
          this.filePath = '';
          this.progress = 0.0;
          this.dialogRef.disableClose = false;
        }
      })
      .catch(err => {
        this.snackBar.open(err, 'X', {
          duration: 5000,
          verticalPosition: 'top',
        });
      })
  }

  /**
   * The function handles form submission and sends a POST or PATCH request to create or edit records.
   */
  onSubmit(){
    if(this.submitRecord?.valid && (
      this.data.mode == 'edit' || this.data.obj == 'section' ||
      (this.data.mode == 'create' && this.filePath != '')
    ))
    {
      let body = this.submitRecord.getRawValue();
      body['title'] = body['name'];
      body['path'] = this.filePath;

      let axiosMethod = axios.post;
      switch (this.data.mode) {
        case 'create': {
          axiosMethod = axios.post;
          break;
        }
        case 'edit': {
          axiosMethod = axios.patch;
          break;
        }
      }

      this.loading = true;
      axiosMethod(this.data.url,body).then(res => {
        Utils.axiosPostResult(res, this.dialogRef, this.snackBar);
        this.loading = false;
      }).catch(err => {
        Utils.axiosPostError(err, this.snackBar);
        this.loading = false;
      })
    }
  }
}
