import { Component, OnInit } from '@angular/core';
import {User} from "@app/models/user.model";
import {environment} from "@environments/environment";
import axios from "axios";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "@app/services/user.service";
import {Subscription} from "rxjs";
import {Organization} from "@app/models/organization.model";
import {
  ProfileEditFormDialogComponent
} from "@app/components/auth/profile-edit-form-dialog/profile-edit-form-dialog.component";
import {Utils} from "@app/utils/utils";
import {MatDialog} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FormService} from "@app/services/form.service";
import {CommonHttpResponse} from "@app/models/common-http-response.model";

@Component({
  selector: 'app-manage-org-users',
  templateUrl: './manage-org-users.component.html',
  styleUrls: ['./manage-org-users.component.css']
})
export class ManageOrgUsersComponent implements OnInit {

  userList: User[] = [];
  subscriptionUser: Subscription | undefined;
  isLoggedIn: boolean = false;
  currentUser: User = null as any;
  submitAddUser: FormGroup | undefined;
  userEmail: string = '';

  constructor(private snackBar: MatSnackBar,
              private userService: UserService,
              private dialog: MatDialog,
              public formService: FormService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.subscriptionUser = this.userService.user.subscribe((value) => {
      this.isLoggedIn = Boolean(value);
      if(this.isLoggedIn){
        this.currentUser = value;
        this.getOrgUsers();
      }
    });
    this.submitAddUser = this.formBuilder.group({
      email: [this.userEmail, [Validators.required,Validators.maxLength(100), Validators.email]]
    });
  }

  /**
   * Unsubscribe the user refresh event when component is destroyed
   */
  ngOnDestroy() {
    this.subscriptionUser?.unsubscribe();
  }

  actionHandler(event: any){
    if(event.user) {
      if (event.action == 'delete') {
        const url = environment.domain + environment.apiEndpoints.organization.user.delete.replace('{:id}', this.currentUser.organization!.id).replace('{:idU}', event.user.id);
        Utils.onDeleteDialog(url, this.dialog, this.snackBar)
          .subscribe(responseStatus => {
            if (responseStatus) {
              this.getOrgUsers();
            }
          });
      }
    }
  }

  onSubmit(){
    if(this.submitAddUser?.valid){
      const body = this.submitAddUser.getRawValue();
      const url = environment.domain + environment.apiEndpoints.organization.user.create.replace('{:id}', this.currentUser.organization!.id);
      axios.post(url, body)
        .then(res => {
          const response = res.data as CommonHttpResponse;
          this.snackBar.open(response.message, 'X', {
            duration: 5000,
            verticalPosition: 'top',
          })
          if(response.status === 200){
            this.getOrgUsers();
          }
        })
        .catch(err => {
          this.snackBar.open('Email not exist', 'X', {
            duration: 5000,
            verticalPosition: 'top',
          });
        })
    }
  }

  private getOrgUsers() {
    if(this.currentUser.organization?.id){
      const url = environment.domain + environment.apiEndpoints.organization.user.index.replace('{:id}', this.currentUser.organization!.id);
      axios.get(url).then((res) => {
        this.userList = (res.data as Organization[])[0].users ?? [];
      }).catch(err => {
        this.snackBar.open(err, 'X', {
          duration: 5000,
          verticalPosition: 'top',
        });
      });
    } else {
      this.snackBar.open('Error, your are not an organization admin', 'X', {
        duration: 5000,
        verticalPosition: 'top',
      });
    }
  }
}