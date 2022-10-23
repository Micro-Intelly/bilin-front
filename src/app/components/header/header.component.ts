import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/services/user.service'
import { Router } from "@angular/router";
import axios from "axios";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  private subscriptionUserId: Subscription;

  constructor(private router: Router,private userService: UserService) {
    this.userService.isLoggedIn();
    this.subscriptionUserId = this.userService.userId.subscribe((value) => {
      this.isLoggedIn = Boolean(value); // this.username will hold your value and modify it every time it changes
    });
  }

  ngOnInit(): void {
  }

  logout(){
    axios.post('/api/logout').then(res => {
      this.userService.userIdChange('');
      this.router.navigate(['/']);
    })
  }

  ngOnDestroy() {
    this.subscriptionUserId.unsubscribe();
  }
}
