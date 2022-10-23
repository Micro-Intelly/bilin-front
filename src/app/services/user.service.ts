import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import axios from "axios";
import {environment} from "@environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userId: BehaviorSubject<any> = new BehaviorSubject<any>('');

  constructor(private cookieService: CookieService) { }
  public isLoggedIn(): boolean {
    let isLogged = false;
    if(this.cookieService.check('XSRF-TOKEN') && Boolean(this.userId.getValue())){
      isLogged = true;
    } else if(this.cookieService.check('XSRF-TOKEN')) {
      axios.get(environment.domain + '/api/user').then(res => {
        this.userIdChange(res.data.id);
        isLogged = true;
      })
    }
    return isLogged;
  }

  userIdChange(id: string) {
    this.userId.next(id);
  }
}
