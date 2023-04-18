import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Comment} from "@app/models/comment.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import axios, {AxiosResponse} from "axios";
import {CommonHttpResponse} from "@app/models/common-http-response.model";
import {environment} from "@environments/environment";


interface CommEditDialogData {
  obj: Comment;
  mode: string;
  serieId: string;
}

@Component({
  selector: 'app-comment-edit-dialog',
  templateUrl: './comment-edit-dialog.component.html',
  styleUrls: ['./comment-edit-dialog.component.css']
})
export class CommentEditDialogComponent implements OnInit {
  loading: boolean = false;
  commentOnly: boolean = true;
  noteOnly: boolean = false;
  inReplyTo: string = '';
  rootCommId: string = '';
  parentType: string = '';
  serieId: string = '';
  masterRecord: string = '';
  mode: string = '';
  defaultCommBody: string = '';
  defaultNoteTitle: string = '';
  defaultNoteDescription: string = '';
  defaultNoteBody: string = '';


  constructor(private dialogRef: MatDialogRef<CommentEditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: CommEditDialogData,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.serieId = this.data.serieId;
    this.mode = this.data.mode;
    switch (this.data.mode) {
      case 'edit': {
        const type = this.data.obj.type;
        if(type == 'comment'){
          this.commentOnly = true;
          this.noteOnly = false;
          this.defaultCommBody = this.data.obj.body;
        } else if(type == 'note'){
          this.commentOnly = false;
          this.noteOnly = true;
          this.defaultNoteTitle = this.data.obj.title ? this.data.obj.title : '';
          this.defaultNoteDescription = this.data.obj.description ? this.data.obj.description : '';
          this.defaultNoteBody = this.data.obj.body;
        }
        break;
      }
      case 'reply': {
        this.inReplyTo = this.data.obj.id;
        this.rootCommId = this.data.obj.root_comm_id ? this.data.obj.root_comm_id : this.data.obj.id;
        if(this.data.obj.commentable_type.endsWith('Episode')){
          this.parentType = 'episode'
        } else if(this.data.obj.commentable_type.endsWith('Post')){
          this.parentType = 'post'
        } else if(this.data.obj.commentable_type.endsWith('Test')) {
          this.parentType = 'test'
        }
        this.masterRecord = this.data.obj.commentable_id;
        break;
      }
    }
  }

  sendData(event: any){
    this.loading = true;
    switch (this.data.mode) {
      case 'edit': {this.updateComm(event);break;}
      case 'reply': {this.postReply(event);break;}
    }
  }
  updateComm(body: any){
    const url = environment.domain + environment.apiEndpoints.comments.update.replace('{:id}', this.data.obj.id);
    axios.patch(url, body)
      .then(res => this.axiosPostResult(res))
      .catch(err => this.axiosPostError(err))
  }

  postReply(body: any){
    const url = environment.domain + environment.apiEndpoints.comments.postComment;
    axios.post(url, body)
      .then(res => this.axiosPostResult(res))
      .catch(err => this.axiosPostError(err))
  }

  axiosPostResult(res:AxiosResponse<any>){
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

  axiosPostError(err: any) {
    this.snackBar.open(err, 'X', {
      duration: 5000,
      verticalPosition: 'top',
    });
    this.loading = false;
  }
}
