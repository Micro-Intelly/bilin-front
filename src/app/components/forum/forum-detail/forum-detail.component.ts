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

@Component({
  selector: 'app-forum-detail',
  templateUrl: './forum-detail.component.html',
  styleUrls: ['./forum-detail.component.css']
})
export class ForumDetailComponent implements OnInit {
  loading: boolean = true;
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

  onEdit(postRecord: Post){
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

  onDelete(postRecord: Post){
    const reminder = this.dialog.open(CloseRemindDialogComponent, {
      data: 'Are you sure delete this content? This action will be not reversible.',
      disableClose: true,
    });
    reminder.afterClosed().subscribe(result => {
      if(result){
        this.deletePost(postRecord);
      }
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

  private deletePost(postRecord: Post){
    this.loading = true;
    const url = environment.domain + environment.apiEndpoints.posts.delete.replace('{:id}', postRecord.id);
    axios.delete(url).then((res) => {
      const response = res.data as CommonHttpResponse;
      this.snackBar.open(response.message, 'X', {
        duration: 5000,
        verticalPosition: 'top',
      })
      if(response.status === 200){
        this.router.navigate(['/forum/all']);
      }
      this.loading = false;
    }).catch(err => {
      this.snackBar.open(err, 'X', {
        duration: 5000,
        verticalPosition: 'top',
      })
      this.loading = false;
    });
  }
}
