import {Component, Input, OnInit} from '@angular/core';
import {environment} from "@environments/environment";
import {Comment} from "@app/models/comment.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Utils} from "@app/utils/utils";
import axios from "axios";
import {Router} from "@angular/router";

@Component({
  selector: 'app-comments-notes-list',
  templateUrl: './comments-notes-list.component.html',
  styleUrls: ['./comments-notes-list.component.css']
})
export class CommentsNotesListComponent implements OnInit {
  @Input() userId = '';

  domain: string = environment.domain;
  loading: boolean = true;
  gridSize: number = 4;
  page: number = 1;
  count: number = 0;

  recordList: Comment[] = [];

  constructor(private snackBar: MatSnackBar,
              private router: Router) { }

  ngOnInit(): void {
    if(this.userId){
      this.getRecords();
    }
  }

  onChangePage(event: any) {
    this.page = event;
  }

  getFormatDate(date:string){
    return Utils.getFormatDate(date);
  }

  goLink(comment: Comment){
    let res = ''
    if(comment.commentable_type.endsWith('Serie')){
      res = '/class/series/' + comment.commentable_id
    } else if(comment.commentable_type.endsWith('Episode')){
      res = '/class/series/' + comment.serie_id + '/ep/' + comment.commentable_id;
    } else if(comment.commentable_type.endsWith('Post')){
      res = '/forum/detail/' + comment.commentable_id
    } else if(comment.commentable_type.endsWith('Test')){
      res = '/test/detail/' + comment.commentable_id
    }
    this.router.navigate([res]);
  }

  private getRecords(){
    let endpoint: string = environment.domain + environment.apiEndpoints.user.commentsIndex.replace('{:id}', this.userId);
    axios.get(endpoint).then((res) => {
      this.recordList = res.data as Comment[];
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
