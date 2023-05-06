import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {environment} from "@environments/environment";
import axios from "axios";
import {Utils} from "@app/utils/utils";
import {Serie} from "@app/models/serie.model";
import {Comment} from "@app/models/comment.model";

interface NoteFormDialogData {
  obj: Serie;
  note: Comment;
  mode: string;
}

@Component({
  selector: 'app-note-form-dialog',
  templateUrl: './note-form-dialog.component.html',
  styleUrls: ['./note-form-dialog.component.css']
})
export class NoteFormDialogComponent implements OnInit {
  loading: Boolean = false;
  parentType: string = '';
  serieId: string = '';
  masterRecord: string = '';
  mode: string = '';
  defaultNoteTitle: string = '';
  defaultNoteDescription: string = '';
  defaultNoteBody: string = '';


  constructor(private dialogRef: MatDialogRef<NoteFormDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: NoteFormDialogData,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.serieId = this.data.obj.id;
    this.masterRecord = this.data.obj.id;
    this.mode = this.data.mode;
    if(this.mode == 'edit'){
      this.defaultNoteTitle = this.data.note.title ? this.data.note.title : '';
      this.defaultNoteDescription = this.data.note.description ?? '';
      this.defaultNoteBody = this.data.note.body;
    }
  }

  sendData(event: any){
    this.loading = true;
    this.postNote(event);
  }

  postNote(body: any){
    let url = environment.domain + environment.apiEndpoints.comments.postNote;
    let axiosMethod = axios.post;
    switch (this.data.mode) {
      case 'edit' : {
        url = environment.domain + environment.apiEndpoints.comments.update.replace('{:id}', this.data.note.id);
        axiosMethod = axios.patch;
        break;
      }
      case 'create' : {
        url = environment.domain + environment.apiEndpoints.comments.postNote;
        axiosMethod = axios.post;
        break
      }
    }

    axiosMethod(url, body)
      .then(res => {
        Utils.axiosPostResult(res, this.dialogRef, this.snackBar);
        this.loading = false;
      })
      .catch(err => {
        Utils.axiosPostError(err, this.snackBar);
        this.loading = false;
      })
  }
}
