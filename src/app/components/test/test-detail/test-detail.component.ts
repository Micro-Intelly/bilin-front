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
import {HistoryService} from "@app/services/history.service";
import {KeyValue} from "@angular/common";

@Component({
  selector: 'app-test-detail',
  templateUrl: './test-detail.component.html',
  styleUrls: ['./test-detail.component.css'],
  providers: [QuestionUtils]
})
export class TestDetailComponent implements OnInit {
  readonly DEFAULT_TEST_ACTION = {
    edit: {name: 'Edit', action:'editTest', color: 'primary', order:0},
    reply: {name: 'Edit Questions', action:'editQuestions', color: 'primary', order:1},
    delete: {name: 'Delete', action:'deleteTest', color: 'warn', order:2},
  }
  menuOrder = (a: KeyValue<string,any>, b: KeyValue<string,any>): number => {
    return a.value.order - b.value.order;
  }

  loading: boolean = true;
  isLoggedIn: boolean = false;
  testId: string | undefined;
  testRecord: Test | undefined;

  subscriptionUser: Subscription | undefined;
  currentUser: User = null as any;

  animal:string = '';


  /**
   * This is a constructor function that initializes various services and dependencies for a TypeScript class.
   * @param {MatDialog} dialog
   * @param {ActivatedRoute} route
   * @param {MatSnackBar} snackBar
   * @param {UserService} userService
   * @param {Router} router
   * @param {HistoryService} historyService
   */
  constructor(public dialog: MatDialog,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar,
              private userService: UserService,
              private router: Router,
              private historyService: HistoryService) {

  }

  /**
   * The ngOnInit function checks for a test ID in the route parameters and retrieves the test if it exists, otherwise it
   * displays an error message.
   */
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

  /**
   * Unsubscribe the user refresh event when component is destroyed
   */
  ngOnDestroy() {
    this.subscriptionUser?.unsubscribe();
  }

  /**
   * This function returns a boolean value indicating whether the current user has permission to access a test record based
   * on their role and authorship.
   * @returns {boolean}
   */
  getUserHasPermission(): boolean {
    return <boolean>(this.currentUser && this.testRecord && (this.currentUser.id === this.testRecord.author?.id || this.currentUser.role?.includes(environment.constants.role.manager) || this.currentUser.role?.includes(environment.constants.role.admin)));
  }

  /**
   * This function returns an object containing default test actions if the user has permission.
   * @returns An object containing the default test action if the user has permission, or an empty object if the user does
   * not have permission.
   */
  get actions() {
    let action = {};
    if(this.getUserHasPermission()){
      action = {...this.DEFAULT_TEST_ACTION}
    }
    return action;
  }

  /**
   * The function starts a test if there are questions available, otherwise it displays a message.
   */
  startTest(){
    if(this.testRecord?.questions_count){
      if(this.isLoggedIn && this.testId){
        this.historyService.postHistory('test',this.testId, null);
      }

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
  /**
   * This function opens a dialog box to display the test result using the test ID as data.
   */
  viewResult(){
    this.dialog.open(TestResultDialogComponent, {
      data: this.testId
    });
  }

  /**
   * The function handles different actions based on the input string and performs corresponding functions on the given
   * test object.
   * @param {string} action
   * @param {Test} test
   */
  onActionClick(action: string, test: Test){
    switch (action) {
      case 'editTest': {
        this.onEditTest(test);
        break;
      }
      case 'editQuestions': {
        this.onEditQuestions(test);
        break;
      }
      case 'deleteTest': {
        this.onDeleteTest(test);
        break;
      }
    }
  }

  /**
   * The function opens a dialog box for editing a test record and updates the record if the user clicks "OK".
   * @param {Test} testRecord
   */
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
  /**
   * The function opens a dialog box for editing test questions and updates the test record if changes are made.
   * @param {Test} testRecord
   */
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

  /**
   * This function handles the deletion of a test record and redirects the user to the test list page.
   * @param {Test} testRecord
   */
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

  /**
   * The function calls a method from the Utils class to format a given date string.
   * @param {string} date
   * @returns {string} formatted date
   */
  getFormatDate(date:string){
    return Utils.getFormatDate(date);
  }

  /**
   * This function retrieves a test record from an API endpoint using Axios in a TypeScript environment.
   */
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
