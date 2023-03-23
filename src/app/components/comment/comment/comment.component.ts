import {Component, Input, OnInit} from '@angular/core';
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


  @Input() withoutBody: boolean = false;
  @Input() withoutHeader: boolean = false;
  @Input() commentOnly: boolean = false;
  @Input() noteOnly: boolean = false;
  _masterRecord: string | undefined = '';
  @Input()
  set masterRecord(value: string | undefined) {
    this._masterRecord = value;
    this.loading = true;
    this.getComments();
  }
  get masterRecord(): string | undefined {
    return this._masterRecord;
  }

  loading: boolean = true;
  submitComment: FormGroup | undefined;
  submitNote: FormGroup | undefined;
  commentTypeSelected: string = 'comment';
  isLoggedIn: boolean = false;
  subscriptionUser: Subscription | undefined;
  commentList: Comment[] = [];
  noteList: Comment[] = [];
  userMap: Map<string, User> = new Map<string, User>();

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '250px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['undo', 'redo', 'fontName'],
    ]
  };

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog) {
  }

  getFormatDate(date:string){
    return Utils.getFormatDate(date);
  }

  absoluteIndex(page: PageSetting, indexOnPage: number): number {
    return page.gridSize * (page.currentPage - 1) + indexOnPage;
  }

  ngOnInit(): void {
    this.submitComment = this.formBuilder.group({
      comment: ['', [Validators.required, Validators.maxLength(500)]],
    });
    this.submitNote = this.formBuilder.group({
      note: ['', [Validators.required, Validators.maxLength(5000)]],
    });
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

  onSubmit(){

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
}
