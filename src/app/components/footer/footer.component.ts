import { Component, OnInit } from '@angular/core';
import {
  PrivacyPolicyDialogComponent
} from "@app/components/shared/privacy-policy-dialog/privacy-policy-dialog.component";
import {
  TermsOfServiceDialogComponent
} from "@app/components/shared/terms-of-service-dialog/terms-of-service-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  showPrivacyPolicy(){
    this.dialog.open(PrivacyPolicyDialogComponent, {
      height: '90%',
      width: '50%'
    });
  }
  showTermService(){
    this.dialog.open(TermsOfServiceDialogComponent, {
      height: '90%',
      width: '50%'
    });
  }
}
