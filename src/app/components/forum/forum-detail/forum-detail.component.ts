import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {environment} from "@environments/environment";
import axios from "axios";
import {Episode} from "@app/models/episode.model";
import {Post} from "@app/models/post.model";
import {Serie} from "@app/models/serie.model";

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
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('post-id') ?? undefined;
    if(this.postId) {
      this.getPosts();
    } else {
      this.snackBar.open('Incorrect URI','X', {
        duration: 5000,
        verticalPosition: 'top',
      });
    }
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
