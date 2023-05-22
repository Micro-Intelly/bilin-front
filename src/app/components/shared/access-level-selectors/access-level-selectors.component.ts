import {Component, forwardRef, OnInit, Input} from '@angular/core';
import {Organization} from "@app/models/organization.model";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {Subscription} from "rxjs";
import {OrganizationService} from "@app/services/organization.service";

export interface AccessLevel {
  selectedOrg: string;
  disableOrg: Boolean;

  selectedAccess: string;
  disableAccess: Boolean;

  selectedLevel: string;
  disableLevel: Boolean;
}

@Component({
  selector: 'app-access-level-selectors',
  templateUrl: './access-level-selectors.component.html',
  styleUrls: ['./access-level-selectors.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => AccessLevelSelectorsComponent)
  }]
})
export class AccessLevelSelectorsComponent implements OnInit {
  @Input() userId:string = '';

  onChange = (value: AccessLevel) => {};
  accessLevel: AccessLevel = {} as AccessLevel

  orgList: Organization[] = [];
  subscriptionOrg: Subscription | undefined;

  accessList: string[] = ['public','registered','org'];
  levelList: string[] = ['basic','intermediate','advanced'];

  /**
   * This is a constructor function that takes an instance of the OrganizationService class as a parameter and assigns it
   * to a private property.
   * @param {OrganizationService} orgService
   */
  constructor(private orgService: OrganizationService) { }

  /**
   * The ngOnInit function retrieves a list of organizations for a user and adds a "None" option to the beginning of the
   * list if it doesn't already exist.
   */
  ngOnInit(): void {
    this.orgService.getUsersOrganization(this.userId);
    this.subscriptionOrg = this.orgService.organizations.subscribe((value) => {
      this.orgList = [...value];
      if(this.orgList.findIndex(elem => elem.id == '') < 0){
        this.orgList.unshift({id:'',name:'None'} as Organization);
      }
    });
  }

  /**
   * The function disables the organization option if a different access level is selected.
   */
  onAccessChange(){
    if(this.accessLevel.selectedAccess != 'org'){
      this.accessLevel.disableOrg = true;
      this.accessLevel.selectedOrg = '';
    } else {
      this.accessLevel.disableOrg = false;
    }
  }

  /**
   * This function registers a change listener for the access level and triggers the listener with the current access level
   * value.
   * @param fn
   */
  registerOnChange(fn: (value: AccessLevel) => void): void {
    this.onChange = fn;
    this.onChange(this.accessLevel);
    this.onAccessChange();
  }
  /**
   * The function sets the access level based on the provided value or defaults to a basic access level if no value is
   * provided.
   * @param {AccessLevel} value
   */
  writeValue(value: AccessLevel) {
    if (Object.keys(value).length) {
      this.accessLevel = value;
    } else {
      this.accessLevel = {
        selectedOrg: '',
        disableOrg: false,
        selectedAccess: 'public',
        disableAccess: false,
        selectedLevel: 'basic',
        disableLevel: false
      } as AccessLevel
    }
  }
  registerOnTouched(){}


}
