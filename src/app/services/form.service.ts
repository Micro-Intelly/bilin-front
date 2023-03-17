import { Injectable } from '@angular/core';
import { FormGroup } from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class FormService {
  formGroup: FormGroup = new FormGroup<any>([]);

  /**
   * The constructor function is a special function that is called when a new instance of the class is created.
   */
  constructor() {}

  /**
   * It takes a FormGroup as a parameter and sets the formGroup property of the class to the parameter
   * @param {FormGroup} group - FormGroup - The FormGroup that the FormControl belongs to.
   */
  setFormGroup(group : FormGroup){
    this.formGroup = group;
  }

  /**
   * If the value of the controlName control is not equal to the value of the matchingControlName control, then set the
   * matchValues error on the matchingControlName control
   * @param {string} controlName - The name of the control that you want to validate.
   * @param {string} matchingControlName - The name of the control that you want to match the value of the controlName
   * control to.
   * @returns A function that takes a formGroup as a parameter.
   */
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

  /**
   * If the formGroup has any errors, return true
   * @returns The formGroup.invalid property is being returned.
   */
  checkFromHasErrors(){return this.formGroup.invalid;}

  /**
   * It returns true if the control is invalid and dirty or touched
   * @param {string} controlName - The name of the control you want to check.
   * @returns A boolean value.
   */
  checkHasErrors(controlName:string){
    return this.formGroup.controls[controlName]?.invalid &&
        (this.formGroup.controls[controlName]?.dirty ||
        this.formGroup.controls[controlName]?.touched)
  }

  /**
   * It checks if the control with the name passed in has an error of type 'required'
   * @param {string} controlName - The name of the control you want to check.
   * @returns A boolean value.
   */
  checkRequired(controlName:string){
    return this.formGroup.controls[controlName]?.hasError('required');
  }
  /**
   * It returns true if the control with the name passed in has a minlength error
   * @param {string} controlName - The name of the control you want to check.
   * @returns A boolean value.
   */
  checkMinLength(controlName:string){
    return this.formGroup.controls[controlName]?.hasError('minlength');
  }
  /**
   * It returns true if the control with the name passed in has a maxlength error
   * @param {string} controlName - The name of the control you want to check.
   * @returns A boolean value.
   */
  checkMaxLength(controlName:string){
    return this.formGroup.controls[controlName]?.hasError('maxlength');
  }
  /**
   * It checks if the control with the name passed in as a parameter has an error of type email
   * @param {string} controlName - The name of the control you want to check.
   * @returns A boolean value.
   */
  checkEmail(controlName:string){
    return this.formGroup.controls[controlName]?.hasError('email');
  }
  /**
   * It returns true if the control with the given name has the error 'requiredtrue'
   * @param {string} controlName - The name of the control you want to check.
   * @returns A boolean value.
   */
  checkRequiredTrue(controlName:string){
    return this.formGroup.controls[controlName]?.hasError('requiredtrue');
  }
  /**
   * It checks if the control has an error called matchValues
   * @param {string} controlName - The name of the control you want to check.
   * @returns A boolean value.
   */
  checkMatchValues(controlName:string){
    return this.formGroup.controls[controlName]?.hasError('matchValues');
  }
}
