import {Component, Input, OnInit} from '@angular/core';
import { UserService } from '@app/services/user.service'
import { Router } from "@angular/router";
import axios from "axios";
import { Subscription } from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {User} from "@app/models/user.model";
import {environment} from "@environments/environment";

interface DropdownItem {
  name:string;
  code:string;
  class:string[];
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  subscriptionUser: Subscription | undefined;
  dropdownLanguageItem:Map<string,DropdownItem> = new Map<string,DropdownItem>();
  activeLanguage:string = 'en';
  toolbarColor = '';
  currentUser: User = null as any;
  currentUserThumbnail: string = '';


  @Input()
  translateService: TranslateService | undefined;


  /**
   * Constructor
   * @param router - Router service to redirect page
   * @param userService - User service to check logged user data
   */
  constructor(private router: Router,private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.isLoggedIn();
    this.subscriptionUser = this.userService.user.subscribe((value) => {
      this.isLoggedIn = Boolean(value); // this.username will hold your value and modify it every time it changes
      if(this.isLoggedIn){
        this.currentUser = value;
        this.currentUserThumbnail = environment.domain + '/'+ value.thumbnail;
      }
    });
    this.dropdownLanguageItem.set('es', {name:'Español', code:'es', class:[]});
    this.dropdownLanguageItem.set('en', {name:'English', code:'en', class:['bg-secondary', 'text-light']});
  }

  /**
   * Method to request the logout of user
   */
  logout(){
    axios.post('/api/logout').then(res => {
      this.userService.userChange(null as any);
      this.router.navigate(['/']);
    })
  }

  getLangClass(langCode: string){
    return this.dropdownLanguageItem.get(langCode)?.class.join(' ');
  }

  /**
   * Unsubscribe the user refresh event when component is destroyed
   */
  ngOnDestroy() {
    this.subscriptionUser?.unsubscribe();
  }


  /**
   * Switch language method
   * @param langCode
   */
  switchLanguage(langCode: string){
    this.translateService?.use(langCode);
    this.dropdownLanguageItem.get(this.activeLanguage)!.class = [];
    this.dropdownLanguageItem.get(langCode)!.class = ['bg-secondary', 'text-light'];
    this.activeLanguage = langCode;
  }

  onwindowScroll(){
    if (window.scrollY === 0) {
      this.toolbarColor = '';
    } else {
      this.toolbarColor = 'primary';
    }
  }
}
