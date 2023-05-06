import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Comment} from "@app/models/comment.model";

@Component({
  selector: 'app-preview-note-dialog',
  templateUrl: './preview-note-dialog.component.html',
  styleUrls: ['./preview-note-dialog.component.css']
})
export class PreviewNoteDialogComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<PreviewNoteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Comment) {
    // console.log(this.data.body);
  }

  ngOnInit(): void {
    // console.log(this.data.body);
  }
}
