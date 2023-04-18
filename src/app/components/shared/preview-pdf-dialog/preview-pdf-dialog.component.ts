import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {File} from "@app/models/file.model";
import {environment} from "@environments/environment";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-preview-pdf-dialog',
  templateUrl: './preview-pdf-dialog.component.html',
  styleUrls: ['./preview-pdf-dialog.component.css']
})
export class PreviewPdfDialogComponent implements OnInit {
  domain: string = environment.domain;
  pdfSrc: string = '';
  constructor(private dialogRef: MatDialogRef<PreviewPdfDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: File,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.pdfSrc = environment.domain + environment.apiEndpoints.files.show.replace('{:id}', this.data.id);
  }

  onError(error: any) {
    this.snackBar.open(error,'X', {
      duration: 5000,
      verticalPosition: 'top',
    });
  }
}
