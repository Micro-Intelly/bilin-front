import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {environment} from "@environments/environment";
import axios from "axios";
import {Post} from "@app/models/post.model";
import {Utils} from "@app/utils/utils";
import {MatDialog} from "@angular/material/dialog";
import {PostFormDialogComponent} from "@app/components/forum/post-form-dialog/post-form-dialog.component";
import {HistoryService} from "@app/services/history.service";
import {UserService} from "@app/services/user.service";
import {Subscription} from "rxjs";
import {User} from "@app/models/user.model";

@Component({
  selector: 'app-forum-detail',
  templateUrl: './forum-detail.component.html',
  styleUrls: ['./forum-detail.component.css']
})
export class ForumDetailComponent implements OnInit {
  loading: Boolean = true;
  postId: string | undefined;
  postRecord: Post | undefined;

  isLoggedIn: boolean = false;
  subscriptionUser: Subscription | undefined;
  currentUser: User = null as any;

  constructor(private route: ActivatedRoute,
              private snackBar: MatSnackBar,
              private router: Router,
              private dialog: MatDialog,
              private historyService: HistoryService,
              private userService: UserService) { }

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('post-id') ?? undefined;
    if(this.postId) {
      this.getPosts();
      this.subscriptionUser = this.userService.user.subscribe((value) => {
        this.isLoggedIn = Boolean(value);
        if(this.isLoggedIn){
          this.currentUser = value;
          this.historyService.postHistory('post',this.postId!, null);
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
   * It unsubscribes from the subscriptionLanguage.
   */
  ngOnDestroy(){
    this.subscriptionUser?.unsubscribe();
  }

  get userHasPermission(): boolean {
    return <boolean>(this.currentUser && this.postRecord && (this.currentUser.id === this.postRecord.author?.id || this.currentUser.role?.includes(environment.constants.role.manager) || this.currentUser.role?.includes(environment.constants.role.admin)));
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
