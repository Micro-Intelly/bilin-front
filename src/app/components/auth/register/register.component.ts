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
  viewUser:Boolean = false;
  deleteUser:Boolean = false;
  admin:Boolean = false;

  constructor() { }

  ngOnInit(): void {
    axios.get(environment.domain + '/api/user/viewTest').then(res => {
      this.viewUser = true;
      this.user = JSON.stringify(res.data);
    }).catch(err => { console.log(err); })
    axios.get(environment.domain + '/api/user/deleteTest').then(res => {
      this.deleteUser = true;
      this.user = JSON.stringify(res.data);
    }).catch(err => { console.log(err); })
    axios.get(environment.domain + '/api/user/adminTest').then(res => {
      this.admin = true;
      this.user = JSON.stringify(res.data);
    }).catch(err => { console.log(err); })
    axios.get(environment.domain + '/api/userCan').then(res => {
      console.log(res);
    }).catch(err => { console.log(err); })
  }
}
