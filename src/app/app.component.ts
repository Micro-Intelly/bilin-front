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
  /**
   * Instance of translate service.
   * @type {TranslateService}
   */
  public translate: TranslateService;

  /**
   * Constructor
   * @param trans - Translate service to provide the translation function on our application
   */
  constructor(trans: TranslateService) {
    trans.addLangs(['en','es']);
    trans.setDefaultLang('en');
    this.translate = trans;
  }

  ngOnInit() {}
}
