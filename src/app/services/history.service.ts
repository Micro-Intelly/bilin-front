import { Injectable } from '@angular/core';
import axios from "axios";
import {CommonHttpResponse} from "@app/models/common-http-response.model";
import {environment} from "@environments/environment";

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor() { }

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
