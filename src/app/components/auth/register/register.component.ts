import { Component, OnInit } from '@angular/core';
import axios from "axios";
import { environment } from "@environments/environment";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControlOptions
} from "@angular/forms";
import { Router } from "@angular/router";
import {FormService} from "@app/services/form.service";

interface Role {
  id: string;
  name: string;
  need_key: boolean;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../auth.css']
})
export class RegisterComponent implements OnInit {

  onSubmitted:boolean = false;
  loading:boolean = false;
  errorAxios:boolean = false;
  selectedRoleId:string = '';
  roles: Role[] = [];
  rolesIdMap: Map<string, Role> = new Map<string, Role>();
  userRegisterFormGroup: FormGroup;

  /**
   * Constructor
   * @param router  - Router service to redirect page
   * @param formBuilder - Form Builder service to create form group
   * @param formService - Form service to check form errors
   */
  constructor(private router: Router,
              private formBuilder: FormBuilder,
              public formService: FormService) {
    this.userRegisterFormGroup = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.maxLength(50),Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8),Validators.maxLength(50)]],
      passwordRepeat: ['', [Validators.required]],
      role: ['', [Validators.required]],
      verificationKey: ['', []],
      privacy: ['', [Validators.requiredTrue]]
    }, {
      validators: [
        this.formService.matchValues('password', 'passwordRepeat'),
        this.keyRequired('role', 'verificationKey'),
      ]
    } as AbstractControlOptions);

    formService.setFormGroup(this.userRegisterFormGroup);

    axios.get(environment.domain + '/api/roles').then(res => {
      this.roles = res.data;
      this.roles.forEach((r) => {
        this.rolesIdMap.set(r.id, r);
      })
      this.selectedRoleId = res.data[0].id;
    }).catch(err => { console.log(err); })
  }

  ngOnInit(): void {}

  /**
   * Method that return whether the role selected need a verification key
   * @return {boolean} - Require or not a verification key
   */
  getNeedKey(){return this.roles.find(r => r.id == this.selectedRoleId)?.need_key;}

  /**
   * Method that check whether there is error for verification key required
   * @param controlName - Form control name of input field
   * @return {boolean} - There is error of key required
   */
  checkKeyRequired(controlName:string){
    return this.userRegisterFormGroup.controls[controlName]?.hasError('keyRequired');
  }

  /**
   * Validator that validate and set error for verification key input field
   * @param controlName - Form control name of input field, in this case we depend on role field
   * @param matchingControlName - Form control name which is checked, in this case, the verification key field
   * @return {function} - Return the verification function for form group
   */
  keyRequired(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors?.['keyRequired']) {
        return;
      }
      if (this.rolesIdMap.get(control.value)?.need_key && !matchingControl.value) {
        matchingControl.setErrors({ keyRequired: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
  // keyRequired(): ValidatorFn {
  //   return (control: AbstractControl): { [key: string]: any } | null =>
  //     (this.rolesIdMap.get(this.userRegisterFormGroup?.controls['role'].value)?.need_key && !control.value)
  //       ? {keyRequired: true} : null;
  // }

  /**
   * onSubmit method to submit the register form
   */
  onSubmit() {
    this.onSubmitted = true;
    if(this.userRegisterFormGroup.valid){
      let body = this.userRegisterFormGroup.getRawValue();
      body['role'] = this.rolesIdMap.get(body['role'])?.name;
      this.loading = true;
      axios.post('/api/signup', body).then(res => {
        this.loading = false;
        this.router.navigate(['/login']);
      }).catch(err => {
        this.loading = false;
        this.errorAxios = true;
        console.log(err);
      })
    }
  }
}
