import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {TestDialogComponent} from "@app/components/test/test-dialog/test-dialog.component";
import {Test} from "@app/models/test.model";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {environment} from "@environments/environment";
import axios from "axios";
import {Utils} from "@app/utils/utils";
import {Subscription} from "rxjs";
import {UserService} from "@app/services/user.service";
import {TestResultDialogComponent} from "@app/components/test/test-result-dialog/test-result-dialog.component";
import {TestFormDialogComponent} from "@app/components/test/test-form-dialog/test-form-dialog.component";
import {QuestionFormDialogComponent} from "@app/components/test/question-form-dialog/question-form-dialog.component";
import {QuestionUtils} from "@app/components/test/question-utils";
import {User} from "@app/models/user.model";

@Component({
  selector: 'app-test-detail',
  templateUrl: './test-detail.component.html',
  styleUrls: ['./test-detail.component.css'],
  providers: [QuestionUtils]
})
export class TestDetailComponent implements OnInit {
  loading: boolean = true;
  isLoggedIn: boolean = false;
  testId: string | undefined;
  testRecord: Test | undefined;

  subscriptionUser: Subscription | undefined;
  currentUser: User = null as any;

  animal:string = '';


  constructor(public dialog: MatDialog,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar,
              private userService: UserService,
              private router: Router) {

  }

  ngOnInit(): void {
    this.testId = this.route.snapshot.paramMap.get('test-id') ?? undefined;
    if(this.testId) {
      this.getTest();
      this.subscriptionUser = this.userService.user.subscribe((value) => {
        this.isLoggedIn = Boolean(value);
        if(this.isLoggedIn){
          this.currentUser = value;
        }
      });
    } else {
      this.snackBar.open('Invalid URI','X', {
        duration: 5000,
        verticalPosition: 'top',
      });
    }
  }

  startTest(){
    if(this.testRecord?.questions_count){
      const dialog = this.dialog.open(TestDialogComponent, {
        data: this.testId,
        disableClose: true,
        width: "60%",
        height: "80%"
      });
      dialog.afterClosed().subscribe(result => {
        this.getTest();
      });
    } else {
      this.snackBar.open('No questions is here','X', {
        duration: 5000,
        verticalPosition: 'top',
      });
    }
  }
  viewResult(){
    this.dialog.open(TestResultDialogComponent, {
      data: this.testId
    });
  }

  onEditTest(testRecord: Test){
    const dRes = this.dialog.open(TestFormDialogComponent, {
      data: {obj:testRecord, mode:'edit', user: this.currentUser},
      disableClose: false,
      width: '60',
      height: '60'
    })
    dRes.afterClosed().subscribe(result => {
      if(result == 'OK'){
        this.loading = true;
        this.getTest();
      }
    });
  }
  onEditQuestions(testRecord: Test){
    const dRes = this.dialog.open(QuestionFormDialogComponent, {
      data: testRecord.id,
      disableClose: false,
      width: "60%",
      height: "80%"
    })
    dRes.afterClosed().subscribe(result => {
      if(result == 'OK'){
        this.loading = true;
        this.getTest();
      }
    });
  }

  onDeleteTest(testRecord: Test){
    const url = environment.domain + environment.apiEndpoints.tests.delete.replace('{:id}', testRecord.id);
    const redirection = '/test/all';
    this.loading = true;
    Utils.onDeleteDialog(url,this.dialog,this.snackBar)
      .subscribe(responseStatus => {
        if(responseStatus){
          this.router.navigate([redirection]);
        }
        this.loading = false
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

  private getTest(){
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
