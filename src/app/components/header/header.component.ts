import {Component, Input, OnInit} from '@angular/core';
import { UserService } from '@app/services/user.service'
import { Router } from "@angular/router";
import axios from "axios";
import { Subscription } from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {User} from "@app/models/user.model";
import {environment} from "@environments/environment";
import {KeyValue} from "@angular/common";

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
  readonly DEFAULT_MENU = {
    profile: {icon: 'manage_accounts', name: 'Profile', link:'/profile', order:0},
    myContent: {icon: 'dashboard', name: 'My Content', link:'/mycontents', order:1},
    manageOrgUser: {icon: 'settings', name: 'Manage Org Users', link:'/manage-org-user', order:2},
    manageAllUser: {icon: 'settings', name: 'Manage Users', link:'/manage-all-user', order:3},
    history: {icon: 'history', name: 'History', link:'/history', order:4}
  };

  environment = environment;
  isLoggedIn: boolean = false;
  subscriptionUser: Subscription | undefined;
  dropdownLanguageItem:Map<string,DropdownItem> = new Map<string,DropdownItem>();
  activeLanguage:string = 'en';
  toolbarColor = '';
  currentUser: User = null as any;
  currentUserThumbnail: string = '';
  profileMenu = {...this.DEFAULT_MENU};
  menuOrder = (a: KeyValue<string,any>, b: KeyValue<string,any>): number => {
    return a.value.order - b.value.order;
  }


  @Input()
  translateService: TranslateService | undefined;


  /**
   * Constructor
   * @param router - Router service to redirect page
   * @param userService - User service to check logged user data
   */
  constructor(private router: Router,private userService: UserService) {
  }

  /**
   * The ngOnInit function initializes various properties and subscriptions, including checking if the user is logged in
   * and modifying the profile menu based on the user's role.
   */
  ngOnInit(): void {
    this.userService.isLoggedIn();
    this.subscriptionUser = this.userService.user.subscribe((value) => {
      this.isLoggedIn = Boolean(value); // this.username will hold your value and modify it every time it changes
      if(this.isLoggedIn){
        this.currentUser = value;
        this.currentUserThumbnail = environment.cdnDomain + '/'+ value.thumbnail;
        this.profileMenu = {...this.DEFAULT_MENU};
        if(! this.currentUser.role?.includes(environment.constants.role.organization)){
          // @ts-ignore
          delete this.profileMenu.manageOrgUser;
        }
        if(! this.currentUser.role?.includes(environment.constants.role.admin)){
          // @ts-ignore
          delete this.profileMenu.manageAllUser;
        }
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

  /**
   * This function returns the class of a language dropdown item based on its language code.
   * @param {string} langCode
   * @returns The function `getLangClass` is returning a string that represents the class of a language dropdown item
   */
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

  /**
   * This function changes the color of a toolbar based on the user's scrolling position.
   */
  onwindowScroll(){
    if (window.scrollY === 0) {
      this.toolbarColor = '';
    } else {
      this.toolbarColor = 'primary';
    }
  }
}
