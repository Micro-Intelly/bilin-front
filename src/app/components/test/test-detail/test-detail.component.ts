import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {TestDialogComponent} from "@app/components/test/test-dialog/test-dialog.component";
import {Test} from "@app/models/test.model";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {environment} from "@environments/environment";
import axios from "axios";
import {Utils} from "@app/utils/utils";
import {Subscription} from "rxjs";
import {UserService} from "@app/services/user.service";
import {TestResultDialogComponent} from "@app/components/test/test-result-dialog/test-result-dialog.component";

@Component({
  selector: 'app-test-detail',
  templateUrl: './test-detail.component.html',
  styleUrls: ['./test-detail.component.css']
})
export class TestDetailComponent implements OnInit {
  loading: boolean = true;
  isLoggedIn: boolean = false;
  testId: string | undefined;
  testRecord: Test | undefined;

  subscriptionUser: Subscription | undefined;

  animal:string = '';


  constructor(public dialog: MatDialog,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar,
              private userService: UserService) {

  }

  ngOnInit(): void {
    this.testId = this.route.snapshot.paramMap.get('test-id') ?? undefined;
    if(this.testId) {
      this.getTests();
      this.subscriptionUser = this.userService.user.subscribe((value) => {
        this.isLoggedIn = Boolean(value);
      });
    } else {
      this.snackBar.open('Invalid URI','X', {
        duration: 5000,
        verticalPosition: 'top',
      });
    }
  }

  startTest(){
    this.dialog.open(TestDialogComponent, {
      data: this.testId,
      disableClose: true,
      width: "60%",
      height: "80%"
    });
  }
  viewResult(){
    this.dialog.open(TestResultDialogComponent, {
      data: this.testId
    });
  }

  getFormatDate(date:string){
    return Utils.getFormatDate(date);
  }

  /**
   * Unsubscribe the user refresh event when component is destroyed
   */
  ngOnDestroy() {
    this.subscriptionUser?.unsubscribe();
  }

  private getTests(){
    let endpoint: string = environment.domain + environment.apiEndpoints.tests.show.replace('{:id}', this.testId!);
    axios.get(endpoint).then((res) => {
      this.testRecord = res.data as Test;
      this.loading = false;
    }).catch(err => {
      this.snackBar.open(err,'X', {
        duration: 5000,
        verticalPosition: 'top',
      });
    });
  }
}
