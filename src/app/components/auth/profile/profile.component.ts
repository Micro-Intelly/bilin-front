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
import axios from "axios";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Utils} from "@app/utils/utils";
import {Router} from "@angular/router";
import {
  ThumbnailEditFormDialogComponent
} from "@app/components/shared/thumbnail-edit-form-dialog/thumbnail-edit-form-dialog.component";
import {CloseRemindDialogComponent} from "@app/components/shared/close-remind-dialog/close-remind-dialog.component";

interface Limits {
  episode_limit: number;
  test_limit: number;
  episode_limit_org: number;
  test_limit_org: number;
  question_per_test: number;
}

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
  currentlimits: Limits = {
    episode_limit: -1,
    test_limit: -1,
    episode_limit_org: -1,
    test_limit_org: -1
  } as Limits;

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
        this.getLimits();
      }
    });
  }

  onEditUser(){
    this.openDialog(ProfileEditFormDialogComponent, {obj:this.currentUser})
  }

  onEditThumbnail(){
    const url = environment.domain + environment.apiEndpoints.user.updateThumbnail.replace('{:id}', this.currentUser.id);
    this.openDialog(ThumbnailEditFormDialogComponent, url);
  }

  onDeleteUser(){
    const url = environment.domain + environment.apiEndpoints.user.delete.replace('{:id}', this.currentUser.id);
    const redirection = '/';
    Utils.onDeleteDialog(url,this.dialog,this.snackBar)
      .subscribe(responseStatus => {
        if(responseStatus){
          this.userService.userChange(null as any);
          this.router.navigate([redirection]);
        }
        this.loading = false;
      });
  }

  resetPassword(){
    this.dialog.open(CloseRemindDialogComponent, {
      data: 'This function is not supported for now',
      disableClose: false,
    })
  }

  /**
   * Unsubscribe the user refresh event when component is destroyed
   */
  ngOnDestroy() {
    this.subscriptionUser?.unsubscribe();
  }

  private openDialog(component: ComponentType<any>, dialogData: any){
    const dRes = this.dialog.open(component, {
      data: dialogData,
      disableClose: false,
    })
    dRes.afterClosed().subscribe(result => {
      if(result == 'OK'){
        this.userService.getCurrentUserData();
      }
    });
  }

  private getLimits() {
    const url = environment.domain + environment.apiEndpoints.user.getLimits;
    axios.get(url).then((res) => {
      const limits = res.data as Limits;
      this.currentlimits.episode_limit = limits.episode_limit;
      this.currentlimits.test_limit = limits.test_limit;
      if(this.currentUser.org_count){
        this.currentlimits.episode_limit = limits.episode_limit_org;
        this.currentlimits.test_limit = limits.test_limit_org;
      }
    }).catch(err => {console.error(err)});
  }
}
