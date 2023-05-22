import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Serie} from "@app/models/serie.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import axios from "axios";
import {environment} from "@environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SerieService {
  series: BehaviorSubject<Serie[]> = new BehaviorSubject<Serie[]>([]);
  constructor(private snackBar: MatSnackBar) { }

  /**
   * This function retrieves a user's series data from an API endpoint using Axios in a TypeScript environment.
   * @param {string} userId - The `userId` parameter is a string that represents the unique identifier of a user.
   */
  public getUsersSeries(userId: string) {
    let endpoint: string = environment.domain + environment.apiEndpoints.user.seriesIndex.replace('{:id}', userId);
    axios.get(endpoint).then((res) => {
      if(Object.keys(res.data).length !== 0){
        this.seriesChange(res.data as Serie[]);
      }
    }).catch(err => {
      this.snackBar.open(err,'X', {
        duration: 5000,
        verticalPosition: 'top',
      });
    });
  }

  /**
   * The function updates the value of a BehaviorSubject with a new array of Serie objects.
   * @param {Serie[]} series - An array of objects of type Serie.
   */
  seriesChange(series: Serie[]) {
    this.series.next(series);
  }
}
