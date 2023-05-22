import { Injectable } from '@angular/core';
import axios from "axios";
import {CommonHttpResponse} from "@app/models/common-http-response.model";
import {environment} from "@environments/environment";

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor() { }

  /**
   * This function sends a post request to create a history record with the given parameters.
   * @param {string} type - The type of the object being posted to the history.
   * @param {string} id - The `id` parameter is the identifier of the item for which the history is being created.
   * @param {string | null | undefined} serie_id - The ID of the series that the history is being created for. It can be
   * null or undefined if the history is not related to a specific series.
   */
  public postHistory(type: string, id: string, serie_id: string | null | undefined) {
    const url = environment.domain + environment.apiEndpoints.history.create;
    const body: any = {};
    body['serie_id'] = serie_id;
    body['history_able_id'] = id;
    body['history_able_type'] = type;

    axios.post(url,body).then((res) => {
      const response = res.data as CommonHttpResponse;
      console.log(response.message);
    }).catch(err => {
      console.error(err);
    });
  }
}
