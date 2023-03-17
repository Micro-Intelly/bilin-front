import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import axios from "axios";
import {environment} from "@environments/environment";
import {Tag} from "@app/models/tag.model";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class TagService {
  tags: BehaviorSubject<Tag[]> = new BehaviorSubject<Tag[]>(null as any);

  /**
   * The constructor function
   * @param {MatSnackBar} snackBar - MatSnackBar - This is the service that we're going to use to display the snackbar.
   */
  constructor(private snackBar: MatSnackBar) { }

  /**
   * If the tags observable doesn't have a value, then make an API call to get the tags and set the tags observable to the response
   */
  public getTags(): void {
    if(! Boolean(this.tags.getValue())){
      axios.get(environment.domain + '/api/tags').then(res => {
        if(Object.keys(res.data).length !== 0){
          this.tags.next(res.data as Tag[]);
        } else {
          this.tags.next(null as any);
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
