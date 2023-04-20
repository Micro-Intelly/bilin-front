import { Component, OnInit } from '@angular/core';
import {UserService} from "@app/services/user.service";
import {Subscription} from "rxjs";
import {environment} from "@environments/environment";
import {User} from "@app/models/user.model";
import {MatDialog} from "@angular/material/dialog";
import {
  ProfileEditFormDialogComponent
} from "@app/components/auth/profile-edit-form-dialog/profile-edit-form-dialog.component";
import {ComponentType} from "@angular/cdk/overlay";
import {
  ThumbnailEditFormDialogComponent
} from "@app/components/auth/thumbnail-edit-form-dialog/thumbnail-edit-form-dialog.component";
import axios from "axios";
import {CommonHttpResponse} from "@app/models/common-http-response.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Utils} from "@app/utils/utils";
import {Router} from "@angular/router";
import {CloseRemindDialogComponent} from "@app/components/shared/close-remind-dialog/close-remind-dialog.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  loading: Boolean = false;
  subscriptionUser: Subscription | undefined;
  isLoggedIn: boolean = false;
  currentUser: User = null as any;
  currentUserThumbnail: string = '';

  constructor(private userService: UserService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private router: Router) { }

  ngOnInit(): void {
    this.subscriptionUser = this.userService.user.subscribe((value) => {
      this.isLoggedIn = Boolean(value); // this.username will hold your value and modify it every time it changes
      if(this.isLoggedIn){
        this.currentUser = value;
        this.currentUserThumbnail = environment.domain + '/'+ value.thumbnail;
      }
    });
  }

  onEditUser(){
    this.openDialog(ProfileEditFormDialogComponent)
  }

  onEditThumbnail(){
    this.openDialog(ThumbnailEditFormDialogComponent);
  }

  onDeleteUser(){
    const reminder = this.dialog.open(CloseRemindDialogComponent, {
      data: 'Are you sure delete this content? This action will be not reversible.',
      disableClose: true,
    });
    reminder.afterClosed().subscribe(result => {
      if(result){
        this.deleteUser();
      }
    });
  }

  /**
   * Unsubscribe the user refresh event when component is destroyed
   */
  ngOnDestroy() {
    this.subscriptionUser?.unsubscribe();
  }

  private openDialog(component: ComponentType<any>){
    const dRes = this.dialog.open(component, {
      data: {obj:this.currentUser},
      disableClose: false,
      width: '60',
      height: '60'
    })
    dRes.afterClosed().subscribe(result => {
      if(result == 'OK'){
        this.userService.getCurrentUserData();
      }
    });
  }

  private deleteUser(){
    const url = environment.domain + environment.apiEndpoints.user.delete.replace('{:id}', this.currentUser.id)
    axios.delete(url).then(res => {
      const response = res.data as CommonHttpResponse;
      this.snackBar.open(response.message, 'X', {
        duration: 5000,
        verticalPosition: 'top',
      })
      if(response.status == 200){
        this.userService.userChange(null as any);
        this.router.navigate(['/']);
      }
    }).catch(err => {
      Utils.axiosPostError(err,this.snackBar,this.loading)
    })
  }
}
