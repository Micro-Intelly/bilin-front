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

  seriesChange(series: Serie[]) {
    this.series.next(series);
  }
}
