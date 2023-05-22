import {Component, Input, OnInit} from '@angular/core';
import {environment} from "@environments/environment";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {Utils} from "@app/utils/utils";
import axios from "axios";
import {History} from "@app/models/history.model";

@Component({
  selector: 'app-histories-list',
  templateUrl: './histories-list.component.html',
  styleUrls: ['./histories-list.component.css']
})
export class HistoriesListComponent implements OnInit {
  @Input() userId = '';
  @Input() type = '';

  domain: string = environment.domain;
  loading: boolean = true;
  gridSize: number = 4;
  page: number = 1;
  count: number = 0;

  historyList: History[] = [];

  /**
   * This is a constructor function that takes in two parameters, a MatSnackBar and a Router, and initializes them as
   * private properties of the class.
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
   */
  getFormatDate(date:string){
    return Utils.getFormatDate(date);
  }

  /**
   * The function takes a history object and navigates to a specific page based on the type of history.
   * @param {History} his
   */
  goLink(his: History){
    let res = ''
    switch (this.type) {
      case 'tests': {res='/test/detail/'+his.history_able_id;break;}
      case 'posts': {res='/forum/detail/'+his.history_able_id;break;}
      case 'episodes': {res='/class/series/'+his.serie_id+'/ep/'+his.history_able_id;break;}
    }
    this.router.navigate([res]);
  }

  /**
   * This TypeScript function returns the title of a history object, including the title of its associated series if
   * applicable.
   * @param {History} his
   * @returns {string} title
   */
  getTitle(his: History){
    return his.serie_id?
      his.history_able.title + ' | ' + his.serie?.title:
      his.history_able.title;
  }

  /**
   * This function retrieves a list of history records from an API endpoint based on the type of record and user ID.
   */
  private getRecords(){
    let endAux = '';
    switch (this.type) {
      case 'tests': {endAux=environment.apiEndpoints.user.history.testsIndex;break;}
      case 'posts': {endAux=environment.apiEndpoints.user.history.postsIndex;break;}
      case 'episodes': {endAux=environment.apiEndpoints.user.history.episodesIndex;break;}
    }
    let endpoint: string = environment.domain + endAux.replace('{:id}', this.userId);
    axios.get(endpoint).then((res) => {
      this.historyList = res.data as History[];
      this.count = this.historyList.length;
      this.loading = false;
    }).catch(err => {
      this.snackBar.open(err,'X', {
        duration: 5000,
        verticalPosition: 'top',
      });
    });
  }
}
