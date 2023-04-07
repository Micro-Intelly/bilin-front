import {Component, Input, OnInit} from '@angular/core';
import {environment} from "@environments/environment";
import {Post} from "@app/models/post.model";
import {Test} from "@app/models/test.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import axios from "axios";
import {Utils} from "@app/utils/utils";
import {Comment} from "@app/models/comment.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-tests-posts-list',
  templateUrl: './tests-posts-list.component.html',
  styleUrls: ['./tests-posts-list.component.css']
})
export class TestsPostsListComponent implements OnInit {
  @Input() userId = '';
  @Input() type = '';

  domain: string = environment.domain;
  loading: boolean = true;
  gridSize: number = 4;
  page: number = 1;
  count: number = 0;

  recordList: (Test | Post) [] = [];

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

  goLink(record: (Test | Post)){
    let res = ''
    switch (this.type) {
      case 'tests': {res='/test/detail/'+record.id;break;}
      case 'posts': {res='/forum/detail/'+record.id;break;}
    }
    this.router.navigate([res]);
  }

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
