import { Component, OnInit } from '@angular/core';
import {environment} from "@environments/environment";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Language} from "@app/models/language.model";
import {LanguageService} from "@app/services/language.service";
import {Subscription} from "rxjs";
import {Utils} from "@app/utils/utils";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  domain: string = environment.domain;
  url: string = this.domain + '/api/video';
  languageList: Language[] = [];
  loading: boolean = true;
  randomHomeImg: Language[] = [];
  subscriptionLanguage: Subscription | undefined;

  /**
   * The constructor function is a special function that is called when a new instance of the class is created
   * @param {MatSnackBar} snackBar - MatSnackBar - This is the service that will be used to display the snackbar.
   * @param {LanguageService} languageService - This is the service that we created earlier.
   */
  constructor(private snackBar: MatSnackBar,
              private languageService: LanguageService) {}

  /**
   * The function is called when the component is initialized. It calls the getLanguages() function in the language
   * service, which makes a GET request to the API and returns an observable. The observable is subscribed to, and the
   * value is assigned to the languageList variable. The languageList variable is then used to populate the language cards
   * on the home page
   */
  ngOnInit(): void {
    this.languageService.getLanguages();
    this.subscriptionLanguage = this.languageService.languages.subscribe((value) => {
      this.languageList = value;
      if(value){
        this.randomHomeImg = Utils.getRandomSubArray(value);
      }
      if(value){this.loading = false;}
    });
  }

  /**
   * It unsubscribes from the subscriptionLanguage.
   */
  ngOnDestroy(){
    this.subscriptionLanguage?.unsubscribe();
  }
}
