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

  constructor(private snackBar: MatSnackBar,
              private router: Router) { }

  ngOnInit(): void {
    if(this.userId && this.type){
      this.getRecords();
    }
  }

  onChangePage(event: any) {
    this.page = event;
  }

  getFormatDate(date:string){
    return Utils.getFormatDate(date);
  }

  goLink(his: History){
    let res = ''
    switch (this.type) {
      case 'tests': {res='/test/detail/'+his.history_able_id;break;}
      case 'posts': {res='/forum/detail/'+his.history_able_id;break;}
      case 'episodes': {res='/class/series/'+his.serie_id+'/ep/'+his.history_able_id;break;}
    }
    this.router.navigate([res]);
  }

  getTitle(his: History){
    return his.serie_id?
      his.history_able.title + ' | ' + his.serie?.title:
      his.history_able.title;
  }

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
