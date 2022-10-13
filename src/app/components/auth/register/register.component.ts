import { Component, OnInit } from '@angular/core';
import axios from "axios";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user:String = '';

  constructor() { }

  ngOnInit(): void {
    axios.get(environment.domain + '/api/user').then(res => {
      this.user = JSON.stringify(res.data);
    })
  }
}
