import { Component, OnInit } from '@angular/core';
import {AbstractControlOptions, FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import { UserService } from '@app/services/user.service'

import axios from 'axios';
import {Router} from "@angular/router";
import {FormService} from "@app/services/form.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {
  user:string = '';
  onSubmitted:boolean = false;
  loading:boolean = false;
  errorAxios:boolean = false;
  userLoginFormGroup: FormGroup;

  /**
   * Constructor
   * @param router - Router service to redirect page
   * @param userService - User service to save logged user data
   * @param formBuilder - Form Builder service to create form group
   * @param formService - Form service to check form errors
   */
  constructor(private router: Router,
              private userService: UserService,
              private formBuilder: FormBuilder,
              public formService: FormService) {
    this.userLoginFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.maxLength(50),Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8),Validators.maxLength(50)]],
    });

    formService.setFormGroup(this.userLoginFormGroup);

  }

  ngOnInit(): void {
  }

  /**
   * onSubmit method to submit the login form
   */
  onSubmit() {
    this.onSubmitted = true;
    if(this.userLoginFormGroup.valid){
      let body = this.userLoginFormGroup.getRawValue();
      this.loading = true;
      axios.get('/sanctum/csrf-cookie' ).then(() => {
        axios.post('/api/login', body).then(res => {
          this.loading = false;
          this.userService.userIdChange(res.data.id);
          this.router.navigate(['/']);
        }).catch(err => {
          this.loading = false;
          this.errorAxios = true;
          console.log(err);
        })
      }).catch(err => {
        this.loading = false;
        this.errorAxios = true;
        console.log(err);
      })
    }
  }
}
