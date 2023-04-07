import { Component, OnInit } from '@angular/core';
import {UserService} from "@app/services/user.service";
import {Subscription} from "rxjs";
import {environment} from "@environments/environment";
import {User} from "@app/models/user.model";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  subscriptionUser: Subscription | undefined;
  isLoggedIn: boolean = false;
  currentUser: User = null as any;
  currentUserThumbnail: string = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.subscriptionUser = this.userService.user.subscribe((value) => {
      this.isLoggedIn = Boolean(value); // this.username will hold your value and modify it every time it changes
      if(this.isLoggedIn){
        this.currentUser = value;
        this.currentUserThumbnail = environment.domain + '/'+ value.thumbnail;
      }
    });
  }

  /**
   * Unsubscribe the user refresh event when component is destroyed
   */
  ngOnDestroy() {
    this.subscriptionUser?.unsubscribe();
  }
}
