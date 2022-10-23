import { Component } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

import { environment } from '@environments/environment';

import axios from 'axios';

axios.defaults.baseURL = environment.domain;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public translate: TranslateService;

  constructor(trans: TranslateService) {
    trans.addLangs(['en','es']);
    trans.setDefaultLang('en');
    this.translate = trans;
  }

  ngOnInit() {

  }

  switchLanguage(lang: string){
    this.translate.use(lang);
  }
}
