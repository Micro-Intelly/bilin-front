import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormService} from "@app/services/form.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "@app/models/user.model";
import {environment} from "@environments/environment";
import axios, {AxiosResponse} from "axios";
import {Utils} from "@app/utils/utils";


export interface ProfileEditData {
  obj: User;
}

@Component({
  selector: 'app-profile-edit-form-dialog',
  templateUrl: './profile-edit-form-dialog.component.html',
  styleUrls: ['./profile-edit-form-dialog.component.css']
})
export class ProfileEditFormDialogComponent implements OnInit {
  loading: Boolean = false;
  submitUser: FormGroup | undefined;

  constructor(private dialogRef: MatDialogRef<ProfileEditFormDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ProfileEditData,
              private snackBar: MatSnackBar,
              public formService: FormService,
              private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
    this.submitUser = this.formBuilder.group({
      name: [this.data.obj.name, [Validators.required,Validators.maxLength(20)]],
      email: [this.data.obj.email, [Validators.required,Validators.maxLength(100), Validators.email]],
    });
  }

  onSubmit(){
    if(this.submitUser?.valid){
      const body = this.submitUser.getRawValue();
      const url = environment.domain + environment.apiEndpoints.user.update.replace('{:id}', this.data.obj.id);
      axios.patch(url, body)
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
}
