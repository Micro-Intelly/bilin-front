import {Component, EventEmitter, Input, OnInit, Output, SimpleChange} from '@angular/core';
import {environment} from "@environments/environment";
import {Post} from "@app/models/post.model";
import {Test} from "@app/models/test.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import axios from "axios";
import {Utils} from "@app/utils/utils";
import {Router} from "@angular/router";

@Component({
  selector: 'app-tests-posts-list',
  templateUrl: './tests-posts-list.component.html',
  styleUrls: ['./tests-posts-list.component.css']
})
export class TestsPostsListComponent implements OnInit {
  @Input() userId = '';
  @Input() type = '';
  _reloadToggle: boolean = false;
  @Input()
  set reloadToggle(value:boolean) {
    if(value != this._reloadToggle){
      this._reloadToggle = value;
      this.loading = true;
      this.getRecords();
    }
  }
  get reloadToggle() {
    return this._reloadToggle;
  }

  domain: string = environment.domain;
  loading: boolean = true;
  gridSize: number = 4;
  page: number = 1;
  count: number = 0;

  recordList: (Test | Post) [] = [];

  /**
   * Constructor function
   * @param {MatSnackBar} snackBar
   * @param {Router} router
   */
  constructor(private snackBar: MatSnackBar,
              private router: Router) { }

  /**
   * The ngOnInit function checks if userId and type are defined and calls the getRecords function if they are.
   */
  ngOnInit(): void {
    if(this.userId && this.type){
      this.getRecords();
    }
  }

  /**
   * The function updates the current page based on the input event.
   * @param {any} event
   */
  onChangePage(event: any) {
    this.page = event;
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
   * The function takes a record of type Test or Post and navigates to a specific page based on the type of record.
   * @param {(Test | Post)} record
   */
  goLink(record: (Test | Post)){
    let res = ''
    switch (this.type) {
      case 'tests': {res='/test/detail/'+record.id;break;}
      case 'posts': {res='/forum/detail/'+record.id;break;}
    }
    this.router.navigate([res]);
  }

  /**
   * This function retrieves records from an API endpoint based on the type of record and user ID, and updates the record
   * list and count.
   */
  private getRecords(){
    let endAux = '';
    switch (this.type) {
      case 'tests': {endAux=environment.apiEndpoints.user.testsIndex;break;}
      case 'posts': {endAux=environment.apiEndpoints.user.postsIndex;break;}
    }
    let endpoint: string = environment.domain + endAux.replace('{:id}', this.userId);
    axios.get(endpoint).then((res) => {
      this.recordList = res.data as (Test | Post)[];
      this.count = this.recordList.length;
      this.loading = false;
    }).catch(err => {
      this.snackBar.open(err,'X', {
        duration: 5000,
        verticalPosition: 'top',
      });
    });
  }
}
