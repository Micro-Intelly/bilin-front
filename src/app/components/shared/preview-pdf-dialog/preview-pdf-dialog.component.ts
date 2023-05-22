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

  /**
   * The ngOnInit function sets the pdfSrc variable to a URL that displays a file with a specific ID.
   */
  ngOnInit(): void {
    this.pdfSrc = environment.domain + environment.apiEndpoints.files.show.replace('{:id}', this.data.id);
  }

  /**
   * The function displays an error message in a snack bar for a duration of 5 seconds.
   * @param {any} error
   */
  onError(error: any) {
    this.snackBar.open(error,'X', {
      duration: 5000,
      verticalPosition: 'top',
    });
  }
}
