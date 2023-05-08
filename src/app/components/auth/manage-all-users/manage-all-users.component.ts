import { Component, OnInit } from '@angular/core';
import {User} from "@app/models/user.model";
import {environment} from "@environments/environment";
import {MatSnackBar} from "@angular/material/snack-bar";
import axios from 'axios';
import {Utils} from "@app/utils/utils";
import {MatDialog} from "@angular/material/dialog";
import {
  ThumbnailEditFormDialogComponent
} from "@app/components/shared/thumbnail-edit-form-dialog/thumbnail-edit-form-dialog.component";
import {
  ProfileEditFormDialogComponent
} from "@app/components/auth/profile-edit-form-dialog/profile-edit-form-dialog.component";

@Component({
  selector: 'app-manage-all-users',
  templateUrl: './manage-all-users.component.html',
  styleUrls: ['./manage-all-users.component.css']
})
export class ManageAllUsersComponent implements OnInit {

  userList: User[] = [];

  constructor(private snackBar: MatSnackBar,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  actionHandler(event: any){
    if(event.user){
      switch (event.action) {
        case 'edit': {
          const dRes = this.dialog.open(ProfileEditFormDialogComponent, {
            data: {obj: event.user}
          })
          dRes.afterClosed().subscribe(result => {
            if(result == 'OK'){
              this.getAllUsers();
            }
          });
          break;
        }
        case 'delete': {
          const url = environment.domain + environment.apiEndpoints.user.delete.replace('{:id}', event.user.id);
          Utils.onDeleteDialog(url,this.dialog,this.snackBar)
            .subscribe(responseStatus => {
              if(responseStatus){
                this.getAllUsers();
              }
            });
          break;
        }
      }
    }
  }

  private getAllUsers() {
    const url = environment.domain + environment.apiEndpoints.user.index;
    axios.get(url).then((res) => {
      this.userList = res.data as User[];
    }).catch(err => {
      this.snackBar.open(err, 'X', {
        duration: 5000,
        verticalPosition: 'top',
      });
    });
  }
}
