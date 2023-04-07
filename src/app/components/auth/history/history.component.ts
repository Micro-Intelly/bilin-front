import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {User} from "@app/models/user.model";
import {UserService} from "@app/services/user.service";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  subscriptionUser: Subscription | undefined;
  isLoggedIn: boolean = false;
  currentUser: User = null as any;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
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
}
