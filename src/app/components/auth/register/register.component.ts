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
import {MatDialog} from "@angular/material/dialog";
import {
  PrivacyPolicyDialogComponent
} from "@app/components/shared/privacy-policy-dialog/privacy-policy-dialog.component";
import {
  TermsOfServiceDialogComponent
} from "@app/components/shared/terms-of-service-dialog/terms-of-service-dialog.component";
import {CommonHttpResponse} from "@app/models/common-http-response.model";
import {MatSnackBar} from "@angular/material/snack-bar";

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
   * @param dialog - Dialog
   * @param snackBar
   */
  constructor(private router: Router,
              private formBuilder: FormBuilder,
              public formService: FormService,
              private dialog: MatDialog,
              private snackBar:MatSnackBar) {
    this.userRegisterFormGroup = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.maxLength(100),Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8),Validators.maxLength(50)]],
      passwordRepeat: ['', [Validators.required]],
      role: ['', [Validators.required]],
      verificationKey: ['', []],
      orgName: ['', []],
      orgDescription: ['', []],
      privacy: ['', [Validators.requiredTrue]]
    }, {
      validators: [
        this.formService.matchValues('password', 'passwordRepeat'),
        this.keyRequired('role', 'verificationKey'),
        this.keyRequired('role', 'orgName'),
        this.keyRequired('role', 'orgDescription'),
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

  getNeedOrgData(){return this.roles.find(r => r.id == this.selectedRoleId)?.name == 'Organization'}

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
      if (!matchingControl.value) {
        if(matchingControlName == 'verificationKey' && this.rolesIdMap.get(control.value)?.need_key){
          matchingControl.setErrors({ keyRequired: true });
        }
        if(matchingControlName == 'orgName' || matchingControlName == 'orgDescription'){
          matchingControl.setErrors({ keyRequired: true });
        }
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
        let response = res.data as CommonHttpResponse;
        if(response.status == 200){
          this.router.navigate(['/login']);
        } else {
          this.snackBar.open(response.message,'X', {
            duration: 5000,
            verticalPosition: 'top',
          });
        }
        this.loading = false;
      }).catch(err => {
        this.loading = false;
        this.errorAxios = true;
        console.log(err);
      })
    }
  }

  /**
   * This function opens a privacy policy dialog component
   */
  showPrivacyPolicy(){
    this.dialog.open(PrivacyPolicyDialogComponent, {
      height: '90%',
      width: '50%'
    });
  }
  /**
   * This function opens a dialog box displaying the terms of service.
   */
  showTermService(){
    this.dialog.open(TermsOfServiceDialogComponent, {
      height: '90%',
      width: '50%'
    });
  }
}
