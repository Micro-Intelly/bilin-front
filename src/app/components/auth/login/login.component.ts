import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { UserService } from '@app/services/user.service'

import axios from 'axios';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {
  user:string = '';

  constructor(private router: Router,private userService: UserService) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    axios.get('/sanctum/csrf-cookie' ).then(() => {
      axios.post('/api/login', value).then(res => {
        this.userService.userIdChange(res.data.id);
        this.router.navigate(['/']);
      })
    })
  }
}
