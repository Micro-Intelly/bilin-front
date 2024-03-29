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
import {KeyValue} from "@angular/common";

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
  readonly DEFAULT_PAGE_SETTING: PageSetting = {
    gridSize: 5,
    currentPage: 1,
    totalItems: 0,
  }
  readonly DEFAULT_COMM_ACTION = {
    edit: {icon: 'edit', name: 'Edit', action:'edit', order:0},
    reply: {icon: 'reply', name: 'Reply', action:'reply', order:1},
    delete: {icon: 'delete', name: 'Delete', action:'delete', order:2},
  }
  menuOrder = (a: KeyValue<string,any>, b: KeyValue<string,any>): number => {
    return a.value.order - b.value.order;
  }

  pageHandler = {
    comm: {...this.DEFAULT_PAGE_SETTING},
    note: {...this.DEFAULT_PAGE_SETTING},
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
  currentUser: User = null as any;
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

  /**
   * This is a constructor function that initializes various services and dependencies for a TypeScript class.
   * @param {FormBuilder} formBuilder
   * @param {UserService} userService
   * @param {MatSnackBar} snackBar
   * @param {MatDialog} dialog
   * @param {FormService} formServiceC
   * @param {FormService} formServiceN
   * @param {HttpClient} httpClient
   * @param {HttpXsrfTokenExtractor} tokenService
   */
  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              public formServiceC: FormService,
              public formServiceN: FormService,
              private httpClient: HttpClient,
              private tokenService: HttpXsrfTokenExtractor) {
  }

  /**
   * The function calls a method from the Utils class to format a given date string.
   * @param {string} date
   * @returns {string} formatted date
   */
  getFormatDate(date:string){
    return Utils.getFormatDate(date);
  }

  /**
   * This function returns a CSS class based on the properties of a Comment object.
   * @param {Comment} note
   * @returns The function `getNoteCardClass` returns a string that represents the CSS class name for a note card
   */
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

  /**
   * The function calculates the absolute index of an item on a specific page based on the page size and current page
   * number.
   * @param {PageSetting} page
   * @param {number} indexOnPage
   * @returns The function `absoluteIndex` is returning the absolute index of an item on a given page
   */
  absoluteIndex(page: PageSetting, indexOnPage: number): number {
    return page.gridSize * (page.currentPage - 1) + indexOnPage;
  }

  /**
   * The ngOnInit function initializes form groups and sets up subscriptions for user authentication.
   */
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
      if(this.isLoggedIn){
        this.currentUser = value;
      }
    });

    if(this.noteOnly){this.commentTypeSelected = 'note';}
  }

  /**
   * Unsubscribe the user refresh event when component is destroyed
   */
  ngOnDestroy() {
    this.subscriptionUser?.unsubscribe();
  }

  /**
   * This function checks if the current user has permission to access a comment based on their role and the author of the
   * comment.
   * @param {Comment} comm
   * user.
   * @returns A boolean value is being returned.
   */
  getUserHasPermission(comm: Comment): boolean {
    return <boolean>(this.currentUser && comm && (this.currentUser.id === comm.author?.id || this.currentUser.role?.includes(environment.constants.role.manager) || this.currentUser.role?.includes(environment.constants.role.admin)));
  }

  /**
   * This function returns a set of comment actions, with the edit and delete actions removed if the user does not have
   * permission.
   * @param {Comment} comm
   * @returns The function `getCommActions` is returning an object `action`
   */
  getCommActions(comm: Comment) {
    let action = {...this.DEFAULT_COMM_ACTION};
    if(! this.getUserHasPermission(comm)){
      // @ts-ignore
      delete action.edit;
      // @ts-ignore
      delete action.delete;
    }
    return action
  }

  /**
   * This function handles page changes for different types of pagination.
   * @param {number} event
   * @param {string} id
   * @param {number} index
   */
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

  /**
   * This function opens a dialog box with a preview of a comment when the comment is clicked.
   * @param {Comment} obj
   */
  onNoteClick(obj: Comment) {
    this.dialog.open(PreviewNoteDialogComponent, {
      data: obj,
      height: '90%',
      width: '90%'
    });
  }

  /**
   * This function handles the submission of a comment and sends it to the appropriate endpoint.
   */
  onSubmitComment(){
    if(this.submitComment?.valid){
      const body = this.submitComment.getRawValue();
      this.formatBody(body,'comment');

      if(this.mode == 'edit' || this.mode == 'reply' ||
        (this.mode == 'create' && this.parentType == 'serie')){
        this.commToSend.emit(body);
      } else {
        this.postCommNote(this.commentPostEndpoint, body);
      }
    }
  }
  /**
   * The function onSubmitNote checks if the submitted note is valid, formats the body, and either emits the body or posts
   * it to the notePostEndpoint depending on the mode and parentType.
   */
  onSubmitNote(){
    if(this.submitNote?.valid){
      const body = this.submitNote.getRawValue();
      this.formatBody(body,'note');

      if(this.mode == 'edit' || this.mode == 'reply' ||
        (this.mode == 'create' && this.parentType == 'serie')){
        this.commToSend.emit(body);
      } else {
        this.postCommNote(this.notePostEndpoint, body);
      }
    }
  }

  /**
   * The function handles different actions (edit, reply, delete) for a comment.
   * @param {string} action
   * @param {Comment} comm
   */
  onActionClick(action: string, comm: Comment){
    switch (action) {
      case 'edit': {
        this.onEdit(comm);
        break;
      }
      case 'reply': {
        this.onReply(comm);
        break;
      }
      case 'delete': {
        this.onDeleteComm(comm);
        break;
      }
    }
  }

  /**
   * This function opens a dialog box for editing a comment and updates the comments list upon closure.
   * @param {Comment} comm
   */
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
  /**
   * This function opens a dialog box for replying to a comment and updates the comments section upon closure.
   * @param {Comment} comm
   */
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
  /**
   * This function deletes a comment and updates the comments list.
   * @param {Comment} comm
   */
  onDeleteComm(comm: Comment){
    const url = environment.domain + environment.apiEndpoints.comments.delete.replace('{:id}', comm.id);
    Utils.onDeleteDialog(url,this.dialog,this.snackBar)
      .subscribe(responseStatus => {
        if(responseStatus){
          this.getComments();
        }
      });
  }


  /**
   * This function formats the body of a comment by assigning values to various properties.
   * @param {any} body
   * @param {string} key
   */
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
   * This function retrieves comments and notes from an API endpoint and stores them in arrays while also setting page
   * settings and user mappings.
   */
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
          if(elem.comments && elem.comments.length){
            this.pageHandler.subComment.set(this.commentList.length, {...this.DEFAULT_PAGE_SETTING});
            this.pageHandler.subComment.get(this.commentList.length)!.totalItems = elem.comments!.length
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

  /**
   * This function posts an image file to a specified URL using HttpClient in Angular, with options for observing events,
   * reporting progress, and including headers and credentials.
   * @param {File} file
   * @returns The `postImage` function is returning an Observable of type `Observable<UploadResponse>`.
   */
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

  /**
   * This function sends a POST request to create comment or note with a given body and displays a message based on the response
   * status.
   * @param {string} url
   * @param {any} body
   */
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
}
