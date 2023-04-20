import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Post} from "@app/models/post.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FormService} from "@app/services/form.service";
import {AngularEditorConfig, UploadResponse} from "@kolkov/angular-editor";
import {environment} from "@environments/environment";
import {HttpClient, HttpHeaders, HttpXsrfTokenExtractor} from "@angular/common/http";
import axios, {AxiosResponse} from "axios";
import {CommonHttpResponse} from "@app/models/common-http-response.model";

interface PostEditDialogData {
  obj: Post;
  mode: string;
}
export interface LanTag {
  language: string | undefined;
  tags: Set<string> | undefined;
  languageId: string;
  tagsId: Set<string> | undefined;
  newTags: Set<string>;
}

@Component({
  selector: 'app-post-form-dialog',
  templateUrl: './post-form-dialog.component.html',
  styleUrls: ['./post-form-dialog.component.css']
})
export class PostFormDialogComponent implements OnInit {
  loading: boolean = false;
  defaultTitle: string = '';
  defaultBody: string = '';
  defaultLanTag: LanTag = {} as LanTag;
  submitPost: FormGroup | undefined;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '250px',
    maxHeight: '250px',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    upload: (file: File) => {
      return this.postImage(file);
    },
    uploadWithCredentials: true,
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['undo', 'redo', 'fontName'],
    ]
  };

  constructor(private dialogRef: MatDialogRef<PostFormDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: PostEditDialogData,
              private snackBar: MatSnackBar,
              public formService: FormService,
              private formBuilder: FormBuilder,
              private httpClient: HttpClient,
              private tokenService: HttpXsrfTokenExtractor) { }

  ngOnInit(): void {
    if(this.data.mode == 'edit'){
      this.defaultTitle = this.data.obj.title;
      this.defaultBody = this.data.obj.body;
      this.defaultLanTag.language = this.data.obj.language?.code;
      this.defaultLanTag.tags = new Set<string>(this.data.obj.tags?.map(elem => elem.name));
    }

    this.submitPost = this.formBuilder.group({
      body: [this.defaultBody, [Validators.required,Validators.maxLength(10000)]],
      title: [this.defaultTitle, [Validators.required,Validators.maxLength(100)]],
      lantag: [this.defaultLanTag, [Validators.required]]
    });


  }

  onSubmit(){
    if(this.submitPost?.valid){
      const body = this.submitPost.getRawValue();
      this.formatBody(body);

      if(this.data.mode == 'edit'){
        this.patchPost(body);
      } else {
        this.creatPost(body);
      }
    }
  }

  private formatBody(body: any){
    body['language_id'] = body['lantag'].languageId;
    body['tags_id'] = body['lantag'].tagsId ? Array.from(body['lantag'].tagsId) : [];
    body['new_tags'] = body['lantag'].newTags ? Array.from(body['lantag'].newTags) : [];
  }

  private postImage(file: File){
    const url = environment.domain + environment.apiEndpoints.comments.fileUpload;
    let formData = new FormData();

    formData.append('image', file);
    return this.httpClient.post<UploadResponse>(url, formData, {
      observe: 'events',
      reportProgress: true,
      headers: new HttpHeaders({
        'X-XSRF-TOKEN':  this.tokenService.getToken()!,
        'X-Requested-With':'XMLHttpRequest',
      }),
      withCredentials: true,
    });
  }

  private patchPost(body: any){
    const url = environment.domain + environment.apiEndpoints.posts.update.replace('{:id}', this.data.obj.id);
    axios.patch(url, body)
      .then(res => this.axiosPostResult(res))
      .catch(err => this.axiosPostError(err))
  }
  private creatPost(body: any){
    const url = environment.domain + environment.apiEndpoints.posts.create;
    axios.post(url, body)
      .then(res => this.axiosPostResult(res))
      .catch(err => this.axiosPostError(err))
  }

  private axiosPostResult(res:AxiosResponse<any>){
    const response = res.data as CommonHttpResponse;
    this.snackBar.open(response.message, 'X', {
      duration: 5000,
      verticalPosition: 'top',
    })
    if(response.status === 200){
      this.dialogRef.close('OK');
    }
    this.loading = false;
  }

  private axiosPostError(err: any) {
    this.snackBar.open(err, 'X', {
      duration: 5000,
      verticalPosition: 'top',
    });
    this.loading = false;
  }
}
