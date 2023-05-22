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
  /**
   * Constructor function
   * @param {MatSnackBar} snackBar
   */
  constructor(private snackBar: MatSnackBar) { }

  /**
   * This function retrieves the organizations associated with a user ID and updates the state with the retrieved data.
   * @param {string} userId - The `userId` parameter is a string representing the unique identifier of a user.
   */
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

  /**
   * This function updates the list of organizations.
   * @param {Organization[]} organizations - An array of Organization objects. The function updates the value of the
   * "organizations" subject with the new array of organizations passed as a parameter.
   */
  organizationsChange(organizations: Organization[]) {
    this.organizations.next(organizations);
  }
}
