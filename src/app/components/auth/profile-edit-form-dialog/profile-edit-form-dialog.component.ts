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

  /**
   * This is a constructor function that initializes various dependencies for a dialog component used for editing user
   * profiles.
   * @param dialogRef
   * @param {ProfileEditData} data
   * @param {MatSnackBar} snackBar
   * @param {FormService} formService
   * @param {FormBuilder} formBuilder
   */
  constructor(private dialogRef: MatDialogRef<ProfileEditFormDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ProfileEditData,
              private snackBar: MatSnackBar,
              public formService: FormService,
              private formBuilder: FormBuilder,) { }

  /**
   * The ngOnInit function initializes a form group with pre-filled values for name, email, organization name, and
   * organization description.
   */
  ngOnInit(): void {
    this.submitUser = this.formBuilder.group({
      name: [this.data.obj.name, [Validators.required,Validators.maxLength(50)]],
      email: [this.data.obj.email, [Validators.required,Validators.maxLength(100), Validators.email]],
      orgName: [this.data.obj.organization?.name, []],
      orgDescription: [this.data.obj.organization?.description, []],
    });
  }

  /**
   * This function submits a patch request to update a user's information and handles the response and errors using Axios
   * and Utils.
   */
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
