import { Component, OnInit } from '@angular/core';
import axios from "axios";
import {environment} from "@environments/environment";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  url: string = environment.domain + '/api/video';

  constructor() {
    // axios.get(environment.domain + '/api/video').then(res => {
    //   console.log(res);
    // }).catch(err => { console.log(err); })
  }

  ngOnInit(): void {
  }

}
