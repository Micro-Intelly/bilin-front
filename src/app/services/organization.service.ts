import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {environment} from "@environments/environment";
import axios from "axios";
import {Organization} from "@app/models/organization.model";

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  organizations: BehaviorSubject<Organization[]> = new BehaviorSubject<Organization[]>([]);
  constructor(private snackBar: MatSnackBar) { }

  public getUsersOrganization(userId: string) {
    let endpoint: string = environment.domain + environment.apiEndpoints.user.orgIndex.replace('{:id}', userId);
    axios.get(endpoint).then((res) => {
      if(Object.keys(res.data).length !== 0){
        this.organizationsChange(res.data as Organization[]);
      }
    }).catch(err => {
      this.snackBar.open(err,'X', {
        duration: 5000,
        verticalPosition: 'top',
      });
    });
  }

  organizationsChange(organizations: Organization[]) {
    this.organizations.next(organizations);
  }
}
