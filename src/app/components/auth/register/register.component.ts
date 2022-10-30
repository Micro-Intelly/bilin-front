import { Component, OnInit } from '@angular/core';
import axios from "axios";
import { environment } from "@environments/environment";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  NgForm,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors, AbstractControlOptions
} from "@angular/forms";
import { Router } from "@angular/router";

interface Role {
  id: string;
  name: string;
  need_key: boolean;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  privacyCheck:boolean = false;
  selectedRoleId:string = '';
  roles: Role[] = [];
  rolesIdMap: Map<string, Role> = new Map<string, Role>();
  userRegisterFormGroup: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder) {
    this.userRegisterFormGroup = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(50),Validators.email]],
      password: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(50)]],
      passwordRepeat: ['', [Validators.required]],
      role: ['', [Validators.required]],
      key: ['', []],
      privacy: ['', [Validators.requiredTrue]]
    }, {
      validators: [
        this.matchValues('password', 'passwordRepeat'),
        this.keyRequired('role', 'key'),
      ]
    } as AbstractControlOptions);

    axios.get(environment.domain + '/api/roles').then(res => {
      this.roles = res.data;
      this.roles.forEach((r) => {
        this.rolesIdMap.set(r.id, r);
      })
      this.selectedRoleId = res.data[0].id;
    }).catch(err => { console.log(err); })
  }

  ngOnInit(): void {}

  getNeedKey(){return this.roles.find(r => r.id == this.selectedRoleId)?.need_key;}

  matchValues(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ matchValues: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  keyRequired(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      console.log(control.value);
      console.log(!matchingControl.value);
      if (this.rolesIdMap.get(control.value)?.need_key && !matchingControl.value) {
        matchingControl.setErrors({ keyRequired: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  onSubmit() {
    if(this.userRegisterFormGroup.valid){
      console.log(JSON.stringify(this.userRegisterFormGroup.getRawValue()));
      // let value = form.value;
      // value['role'] = this.selectedRole['name'];
      // value['privacy'] = this.privacyCheck;
      //
      // console.log (JSON.stringify(value));
      // axios.post('/api/signup', value).then(res => {
      //   this.router.navigate(['/']);
      // }).catch(err => { console.log(err); })
    }
  }
}
