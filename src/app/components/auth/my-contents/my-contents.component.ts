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

  constructor(private userService: UserService,
              private dialog: MatDialog) { }

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

  onNewSerie(){
    this.openCreateDialog(SeriesFormDialogComponent, 'serie');
  }

  onNewPost(){
    this.openCreateDialog(PostFormDialogComponent, 'post');
  }

  onNewTest(){
    this.openCreateDialog(TestFormDialogComponent, 'test');
  }

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
