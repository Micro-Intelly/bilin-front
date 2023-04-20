import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import axios from "axios";
import {environment} from "@environments/environment";
import {User} from "@app/models/user.model";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: BehaviorSubject<User> = new BehaviorSubject<User>(null as any);
  /**
   * Constructor
   * @param cookieService - managing cookies
   * @param snackBar
   */
  constructor(private cookieService: CookieService,
              private snackBar: MatSnackBar) { }

  /**
   * get if user is logged in
   * @return boolean
   */
  public isLoggedIn(): boolean {
    let isLogged = false;
    if(this.cookieService.check('XSRF-TOKEN') && Boolean(this.user.getValue())){
      isLogged = true;
    } else if(this.cookieService.check('XSRF-TOKEN')) {
      axios.get(environment.domain + '/api/isLoggedIn').then(res => {
        // console.log(res.data);
        if(Object.keys(res.data).length !== 0){
          this.userChange(res.data as User);
          isLogged = true;
        } else {
          this.userChange(null as any);
          isLogged = false;
        }
      }).catch(err => {
        this.snackBar.open(err,'X', {
          duration: 5000,
          verticalPosition: 'top',
        });
      })
    }
    return isLogged;
  }

  public getCurrentUserData() {
    axios.get(environment.domain + '/api/user/currentUser').then(res => {
      if(Object.keys(res.data).length !== 0){
        this.userChange(res.data as User);
      }
    }).catch(err => {
      this.snackBar.open(err,'X', {
        duration: 5000,
        verticalPosition: 'top',
      });
    })
  }

  userChange(user: User) {
    this.user.next(user);
  }
}
