import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import axios from "axios";
import {environment} from "@environments/environment";
import {Language} from "@app/models/language.model";

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  languages: BehaviorSubject<Language[]> = new BehaviorSubject<Language[]>(null as any);

  /**
   * The constructor function
   * @param {MatSnackBar} snackBar - MatSnackBar - This is the service that we're going to use to display the snackbar.
   */
  constructor(private snackBar: MatSnackBar) { }

  /**
   * If the languages observable is empty, make a request to the backend to get the languages and update the observable
   */
  public getLanguages(): void {
    if(! Boolean(this.languages.getValue())){
      axios.get(environment.domain + '/api/languages').then(res => {
        if(Object.keys(res.data).length !== 0){
          this.languages.next(res.data as Language[]);
        } else {
          this.languages.next(null as any);
        }
      }).catch(err => {
        this.snackBar.open(err,'X', {
          duration: 5000,
          verticalPosition: 'top',
        });
      })
    }
  }
}
