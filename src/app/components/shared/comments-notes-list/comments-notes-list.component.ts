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

  /**
   * Constructor function
   * private properties of the class.
   * @param {MatSnackBar} snackBar
   * @param {Router} router
   */
  constructor(private snackBar: MatSnackBar,
              private router: Router) { }

  /**
   * The ngOnInit function checks if a userId exists and calls the getRecords function if it does.
   */
  ngOnInit(): void {
    if(this.userId){
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
   * The function takes a comment object and navigates to a specific page based on the type of commentable object.
   * @param {Comment} comment
   */
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

  /**
   * This function retrieves comments for a user from an API endpoint using Axios in TypeScript.
   */
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
