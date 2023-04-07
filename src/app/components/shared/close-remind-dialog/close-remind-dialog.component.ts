import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-close-remind-dialog',
  templateUrl: './close-remind-dialog.component.html',
  styleUrls: ['./close-remind-dialog.component.css']
})
export class CloseRemindDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CloseRemindDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit(): void {
  }

  onNoClick(){
    this.dialogRef.close();
  }
}
