import { Component, OnInit } from '@angular/core';
import {User} from "@app/models/user.model";
import {UserService} from "@app/services/user.service";
import {Subscription} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {PostFormDialogComponent} from "@app/components/forum/post-form-dialog/post-form-dialog.component";
import {ComponentType} from "@angular/cdk/overlay";
import {TestFormDialogComponent} from "@app/components/test/test-form-dialog/test-form-dialog.component";
import {SeriesFormDialogComponent} from "@app/components/class/series-form-dialog/series-form-dialog.component";
import {environment} from "@environments/environment";

@Component({
  selector: 'app-my-contents',
  templateUrl: './my-contents.component.html',
  styleUrls: ['./my-contents.component.css']
})
export class MyContentsComponent implements OnInit {
  subscriptionUser: Subscription | undefined;
  isLoggedIn: boolean = false;
  currentUser: User = null as any;
  reloadSerieToggle: boolean = false;
  reloadPostToggle: boolean = false;
  reloadTestToggle: boolean = false;
  environment = environment;

  /**
   * This is a constructor function that takes in a UserService and MatDialog as parameters.
   * @param {UserService} userService
   * @param {MatDialog} dialog
   */
  constructor(private userService: UserService,
              private dialog: MatDialog) { }

  /**
   * The ngOnInit function checks if the user is logged in and subscribes to changes in the user's login status.
   */
  ngOnInit(): void {
    this.userService.isLoggedIn();
    this.subscriptionUser = this.userService.user.subscribe((value) => {
      this.isLoggedIn = Boolean(value);
      if(this.isLoggedIn){
        this.currentUser = value;
      }
    });
  }
  /**
   * Unsubscribe the user refresh event when component is destroyed
   */
  ngOnDestroy() {
    this.subscriptionUser?.unsubscribe();
  }

  /**
   * The function opens a dialog box for creating a new series using a component called SeriesFormDialogComponent.
   */
  onNewSerie(){
    this.openCreateDialog(SeriesFormDialogComponent, 'serie');
  }

  /**
   * The function opens a dialog box for creating a new post.
   */
  onNewPost(){
    this.openCreateDialog(PostFormDialogComponent, 'post');
  }

  /**
   * The function opens a dialog box for creating a new test using a TestFormDialogComponent.
   */
  onNewTest(){
    this.openCreateDialog(TestFormDialogComponent, 'test');
  }

  /**
   * This function opens a dialog box for creating a new component and updates the corresponding toggle based on the user's
   * input.
   * @param component
   * @param {string} toggle
   */
  private openCreateDialog(component: ComponentType<any>, toggle: string){
    const dRes = this.dialog.open(component, {
      data: {obj:null, mode:'create', user: this.currentUser},
      disableClose: false,
      width: '60',
      height: '60'
    })
    dRes.afterClosed().subscribe(result => {
      if(result == 'OK'){
        switch (toggle){
          case 'serie': { this.reloadSerieToggle = !this.reloadSerieToggle; break;}
          case 'post': { this.reloadPostToggle = !this.reloadPostToggle; break;}
          case 'test': { this.reloadTestToggle = !this.reloadTestToggle; break;}
        }
      }
    });
  }
}
