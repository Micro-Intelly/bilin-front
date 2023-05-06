import {Component, Inject, OnInit} from '@angular/core';
import {FileUploader} from "ng2-file-upload";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import axios from "axios";
import {Utils} from "@app/utils/utils";

@Component({
  selector: 'app-thumbnail-edit-form-dialog',
  templateUrl: './thumbnail-edit-form-dialog.component.html',
  styleUrls: ['./thumbnail-edit-form-dialog.component.css']
})
export class ThumbnailEditFormDialogComponent implements OnInit {
  loading: Boolean = false;
  url: string = '';
  ready: boolean = false;
  file: File = {} as File;
  thumb: string = "";
  uploader = new FileUploader({
    url: this.url,
    maxFileSize: 1024 * 1024,
  });

  constructor(private dialogRef: MatDialogRef<ThumbnailEditFormDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.url = this.data;
    this.uploader.onAfterAddingFile = (file) => {
      this.file = file._file;
      const image_file = file._file;
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        this.ready = true;
        this.thumb = reader.result ? reader.result.toString() : "";
      });
      reader.readAsDataURL(image_file);
    }

    this.uploader.onWhenAddingFileFailed = (item: any, filter: any, options: any) => {
      this.snackBar.open('File upload with error','X', {
        duration: 5000,
        verticalPosition: 'top',
      });
    }
  }

  onUpload(){
    let formData = new FormData();
    formData.append('thumbnail', this.file);
    axios.post(this.url,formData).then(res => {
      Utils.axiosPostResult(res, this.dialogRef, this.snackBar);
      this.loading = false;
    }).catch(err => {
      Utils.axiosPostError(err, this.snackBar);
      this.loading = false;
    })
  }
}
