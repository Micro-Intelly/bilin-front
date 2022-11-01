import { Injectable } from '@angular/core';
import { FormGroup } from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class FormService {
  formGroup: FormGroup = new FormGroup<any>([]);

  constructor() {}

  setFormGroup(group : FormGroup){
    this.formGroup = group;
  }

  matchValues(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors?.['matchValues']) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ matchValues: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  checkFromHasErrors(){return this.formGroup.invalid;}

  checkHasErrors(controlName:string){
    return this.formGroup.controls[controlName]?.invalid &&
        (this.formGroup.controls[controlName]?.dirty ||
        this.formGroup.controls[controlName]?.touched)
  }

  checkRequired(controlName:string){
    return this.formGroup.controls[controlName]?.hasError('required');
  }
  checkMinLength(controlName:string){
    return this.formGroup.controls[controlName]?.hasError('minlength');
  }
  checkMaxLength(controlName:string){
    return this.formGroup.controls[controlName]?.hasError('maxlength');
  }
  checkEmail(controlName:string){
    return this.formGroup.controls[controlName]?.hasError('email');
  }
  checkRequiredTrue(controlName:string){
    return this.formGroup.controls[controlName]?.hasError('requiredtrue');
  }
  checkMatchValues(controlName:string){
    return this.formGroup.controls[controlName]?.hasError('matchValues');
  }
}
