import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {environment} from "@environments/environment";
import axios from "axios";
import {Post} from "@app/models/post.model";
import {Utils} from "@app/utils/utils";
import {CommonHttpResponse} from "@app/models/common-http-response.model";
import {CloseRemindDialogComponent} from "@app/components/shared/close-remind-dialog/close-remind-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {PostFormDialogComponent} from "@app/components/forum/post-form-dialog/post-form-dialog.component";
import * as Util from "util";

@Component({
  selector: 'app-forum-detail',
  templateUrl: './forum-detail.component.html',
  styleUrls: ['./forum-detail.component.css']
})
export class ForumDetailComponent implements OnInit {
  loading: Boolean = true;
  postId: string | undefined;
  postRecord: Post | undefined;

  constructor(private route: ActivatedRoute,
              private snackBar: MatSnackBar,
              private router: Router,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('post-id') ?? undefined;
    if(this.postId) {
      this.getPosts();
    } else {
      this.snackBar.open('Invalid URI','X', {
        duration: 5000,
        verticalPosition: 'top',
      });
    }
  }

  getFormatDate(date:string){
    return Utils.getFormatDate(date);
  }

  onEditPost(postRecord: Post){
    const dRes = this.dialog.open(PostFormDialogComponent, {
      data: {obj:postRecord, mode:'edit'},
      disableClose: false,
      width: '60',
      height: '60'
    })
    dRes.afterClosed().subscribe(result => {
      if(result == 'OK'){
        this.loading = true;
        this.getPosts();
      }
    });
  }

  onDeletePost(postRecord: Post){
    const url = environment.domain + environment.apiEndpoints.posts.delete.replace('{:id}', postRecord.id);
    const redirection = '/forum/all';
    this.loading = true
    Utils.onDeleteDialog(url,this.dialog,this.snackBar)
      .subscribe(responseStatus => {
        if(responseStatus){
          this.router.navigate([redirection]);
        }
        this.loading = false
    });
  }

  private getPosts(){
    let endpoint: string = environment.domain + environment.apiEndpoints.posts.show.replace('{:id}', this.postId!);
    axios.get(endpoint).then((res) => {
      this.postRecord = res.data as Post;
      this.loading = false;
    }).catch(err => {
      this.snackBar.open(err,'X', {
        duration: 5000,
        verticalPosition: 'top',
      });
    });
  }
}
