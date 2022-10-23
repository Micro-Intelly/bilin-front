import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";

import axios from 'axios';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {
  user:String = '';

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    console.log(value);
    axios.get('/sanctum/csrf-cookie' ).then(() => {
      axios.post('/api/login', value).then(res => {
        console.log(res);
      })
    })
  }

  onClick(){
      axios.get('/api/example').then(res => {
        this.user = res.data;
      })
  }
}
