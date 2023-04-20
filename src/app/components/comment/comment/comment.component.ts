import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {environment} from "@environments/environment";
import {UserService} from "@app/services/user.service";
import {Subscription} from "rxjs";
import axios from "axios";
import {Comment} from "@app/models/comment.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {User} from "@app/models/user.model";
import {MatDialog} from "@angular/material/dialog";
import {PreviewNoteDialogComponent} from "@app/components/shared/preview-note-dialog/preview-note-dialog.component";
import {Utils} from "@app/utils/utils";
import {FormService} from "@app/services/form.service";
import { HttpClient, HttpHeaders, HttpXsrfTokenExtractor } from '@angular/common/http';
import { UploadResponse } from '@kolkov/angular-editor';
import {CommonHttpResponse} from "@app/models/common-http-response.model";
import {CommentEditDialogComponent} from "@app/components/comment/comment-edit-dialog/comment-edit-dialog.component";
import {CloseRemindDialogComponent} from "@app/components/shared/close-remind-dialog/close-remind-dialog.component";

interface PageSetting {
  gridSize: number,
  currentPage: number,
  totalItems: number,
}

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  defaultPageSetting: PageSetting = {
    gridSize: 5,
    currentPage: 1,
    totalItems: 0,
  }
  pageHandler = {
    comm: {...this.defaultPageSetting},
    note: {...this.defaultPageSetting},
    subComment: new Map<number, PageSetting>
  }

  @Input() mode: string = '';
  @Input() defaultCommBody: string = '';
  @Input() defaultNoteTitle: string = '';
  @Input() defaultNoteDescription: string = '';
  @Input() withNoteDescription: boolean = true;
  @Input() defaultNoteBody: string = '';
  @Input() withoutBody: boolean = false;
  @Input() withoutHeader: boolean = false;
  @Input() hideToggle: boolean = false;
  @Input() commentOnly: boolean = false;
  @Input() noteOnly: boolean = false;
  @Input() inReplyTo: string = '';
  @Input() rootCommId: string = '';
  @Input() parentType: string = '';
  @Input() serieId: string | undefined = '';
  _masterRecord: string | undefined = '';
  @Input()
  set masterRecord(value: string | undefined) {
    this._masterRecord = value;
    if(!this.withoutBody){
      this.loading = true;
      this.getComments();
    } else {
      this.loading = false;
    }
  }
  get masterRecord(): string | undefined {
    return this._masterRecord;
  }

  @Output() commToSend: EventEmitter<any> = new EventEmitter<any>();

  loading: boolean = true;
  submitComment: FormGroup | undefined;
  submitNote: FormGroup | undefined;
  commentTypeSelected: string = 'comment';
  isLoggedIn: boolean = false;
  subscriptionUser: Subscription | undefined;
  commentList: Comment[] = [];
  noteList: Comment[] = [];
  userMap: Map<string, User> = new Map<string, User>();
  noteContent: string = '';
  commentPostEndpoint: string = environment.domain + environment.apiEndpoints.comments.postComment;
  notePostEndpoint: string = environment.domain + environment.apiEndpoints.comments.postNote;

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

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              public formServiceC: FormService,
              public formServiceN: FormService,
              private httpClient: HttpClient,
              private tokenService: HttpXsrfTokenExtractor) {
  }

  getFormatDate(date:string){
    return Utils.getFormatDate(date);
  }

  getNoteCardClass(note: Comment){
    if(note.title && note.description){
      return 'note-card';
    }
    else if(note.title || note.description){
      return 'note-card-without1row';
    }
    else{
      return 'note-card-without2row';
    }
  }

  absoluteIndex(page: PageSetting, indexOnPage: number): number {
    return page.gridSize * (page.currentPage - 1) + indexOnPage;
  }

  ngOnInit(): void {
    this.submitComment = this.formBuilder.group({
      comment: [this.defaultCommBody, [Validators.required, Validators.maxLength(500)]],
    });
    this.submitNote = this.formBuilder.group({
      note: [this.defaultNoteBody, [Validators.required,Validators.maxLength(10000)]],
      title: [this.defaultNoteTitle, [Validators.maxLength(50)]],
      description: [this.defaultNoteDescription, [Validators.required, Validators.maxLength(100)]],
    });

    this.formServiceC.setFormGroup(this.submitComment);
    this.formServiceN.setFormGroup(this.submitNote);

    this.subscriptionUser = this.userService.user.subscribe((value) => {
      this.isLoggedIn = Boolean(value);
    });

    if(this.noteOnly){this.commentTypeSelected = 'note';}
  }

  onChangePage(event: number, id: string, index: number){
    switch (id) {
      case 'commPagination': {
        this.pageHandler.comm.currentPage = event;
        break;
      }
      case 'subCommPagination': {
        this.pageHandler.subComment.get(index)!.currentPage = event;
        break;
      }
      case 'notePagination': {
        this.pageHandler.note.currentPage = event;
        break;
      }
    }
  }

  onNoteClick(obj: Comment) {
    this.dialog.open(PreviewNoteDialogComponent, {
      data: obj,
      height: '90%',
      width: '90%'
    });
  }

  onSubmitComment(){
    if(this.submitComment?.valid){
      const body = this.submitComment.getRawValue();
      this.formatBody(body,'comment');

      if(this.mode == 'edit' || this.mode == 'reply'){
        this.commToSend.emit(body);
      } else {
        this.postCommNote(this.commentPostEndpoint, body);
      }
    }
  }
  onSubmitNote(){
    if(this.submitNote?.valid){
      const body = this.submitNote.getRawValue();
      this.formatBody(body,'note');

      if(this.mode == 'edit' || this.mode == 'reply'){
        this.commToSend.emit(body);
      } else {
        this.postCommNote(this.notePostEndpoint, body);
      }
    }
  }
  onEdit(comm: Comment){
    const dRes = this.dialog.open(CommentEditDialogComponent, {
      data: {obj:comm, mode:'edit', serieId: this.serieId},
      disableClose: false,
      width: '60',
      height: '60'
    })
    dRes.afterClosed().subscribe(result => {
      if(result == 'OK'){
        this.loading = true;
        this.getComments();
      }
    });
  }
  onReply(comm: Comment){
    const dRes = this.dialog.open(CommentEditDialogComponent, {
      data: {obj:comm, mode:'reply', serieId: this.serieId},
      disableClose: false,
      width: '60',
      height: '60'
    })
    dRes.afterClosed().subscribe(result => {
      if(result == 'OK'){
        this.loading = true;
        this.getComments();
      }
    });
  }
  onDelete(comm: Comment){
    const reminder = this.dialog.open(CloseRemindDialogComponent, {
      data: 'Are you sure delete this content? This action will be not reversible.',
      disableClose: true,
    });
    reminder.afterClosed().subscribe(result => {
      if(result){
        const url = environment.domain + environment.apiEndpoints.comments.delete.replace('{:id}', comm.id);
        this.deleteComm(url);
      }
    });
  }


  private formatBody(body: any, key: string){
    body['body'] = body[key];
    body[key] = null;
    body['type'] = key;
    body['commentable_id'] = this._masterRecord;
    body['commentable_type'] = this.parentType;
    body['in_reply_to_id'] = this.inReplyTo;
    body['root_comm_id'] = this.rootCommId;
    body['serie_id'] = this.serieId;
  }
  /**
   * Unsubscribe the user refresh event when component is destroyed
   */
  ngOnDestroy() {
    this.subscriptionUser?.unsubscribe();
  }


  private getComments(){
    this.commentList = [];
    this.noteList = [];
    let endpoint: string = environment.domain + environment.apiEndpoints.comments.index.replace('{:id}', this._masterRecord ? this._masterRecord! : '');
    axios.get(endpoint).then((res) => {
      let result = res.data as Comment[];
      result.forEach((elem: Comment) => {
        let arr = [];
        if(elem.type == 'comment'){
          arr = this.commentList;
          let pageSetAux: PageSetting = this.defaultPageSetting;
          pageSetAux.totalItems = elem.comments ? elem.comments.length : 0;
          if(pageSetAux.totalItems){
            this.pageHandler.subComment.set(this.commentList.length, {...this.defaultPageSetting});
          }
        } else {arr = this.noteList;}
        arr.push(elem);

        this.userMap.set(elem.id, elem.author!);
        elem.comments?.forEach((subComm) => {
          this.userMap.set(subComm.id, subComm.author!);
        })
      });
      this.pageHandler.comm.totalItems = this.commentList.length;
      this.pageHandler.note.totalItems = this.noteList.length;
      this.loading = false;
    }).catch(err => {
      this.snackBar.open(err,'X', {
        duration: 5000,
        verticalPosition: 'top',
      });
    });
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

  private postCommNote(url: string, body: any){
    this.loading = true;
    axios.post(url, body).then((res) => {
      const response = res.data as CommonHttpResponse;
      this.snackBar.open(response.message, 'X', {
        duration: 5000,
        verticalPosition: 'top',
      })
      if(response.status === 200){
        this.getComments();
        this.submitComment?.reset();
        this.submitNote?.reset();
      }
      this.loading = false;
    }).catch(err => {
      this.snackBar.open(err, 'X', {
        duration: 5000,
        verticalPosition: 'top',
      })
      this.loading = false;
    });
  }

  private deleteComm(url: string){
    this.loading = true;
    axios.delete(url).then((res) => {
      const response = res.data as CommonHttpResponse;
      this.snackBar.open(response.message, 'X', {
        duration: 5000,
        verticalPosition: 'top',
      })
      if(response.status === 200){
        this.getComments();
      }
      this.loading = false;
    }).catch(err => {
      this.snackBar.open(err, 'X', {
        duration: 5000,
        verticalPosition: 'top',
      })
      this.loading = false;
    });
  }
}
