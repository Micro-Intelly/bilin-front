import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Serie} from "@app/models/serie.model";
import {FileUploader} from "ng2-file-upload";
import axios from "axios";
import {Utils} from "@app/utils/utils";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FormService} from "@app/services/form.service";
import * as Dropzone from "dropzone";

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
  file: File | undefined;
  thumb: string = "";
  uploader = new FileUploader({url: ''});

  defaultName: string = '';
  defaultDescription: string = '';
  submitRecord: FormGroup | undefined;

  constructor(private dialogRef: MatDialogRef<CommonEditFormDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: CommonEditData,
              private snackBar: MatSnackBar,
              public formService: FormService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    let allowType: string[] = [];
    switch (this.data.obj) {
      case 'episode': {
        allowType = ['mp3','mp4'];
        break;
      }
      case 'file': {
        allowType = ['pdf'];
        break;
      }
    }

    this.uploader.onAfterAddingFile = (file) => {
      // validate size

      // validate type


      this.file = file._file;
    }

    if(this.data.mode == 'edit'){
      this.defaultName = this.data.name ?? '';
      this.defaultDescription = this.data.description ?? '';
    }

    this.submitRecord = this.formBuilder.group({
      name: [this.defaultName, [Validators.required,Validators.maxLength(100)]],
      description: [this.defaultDescription, [Validators.required,Validators.maxLength(500)]],
    });
  }

  get isFileUploaded(){
    return this.data.obj != 'section' && this.data.mode == 'create' && this.file == undefined;
  }

  onSubmit(){
    if(this.submitRecord?.valid && (
      this.data.mode == 'edit' || this.data.obj == 'section' ||
      (this.data.mode == 'create' && this.file != undefined)
    ))
    {
      let body = this.submitRecord.getRawValue();
      body['title'] = body['name'];

      let formData = new FormData();
      formData.append('name', body['name']);
      formData.append('title', body['name']);
      formData.append('description', body['description']);
      if(this.data.mode == 'create' && this.file != undefined){
        formData.append('file', this.file!);
        body = formData;
      }

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
