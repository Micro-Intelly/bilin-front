import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import axios from "axios";
import {environment} from "@environments/environment";
import {Post} from "@app/models/post.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Utils} from "@app/utils/utils";

@Component({
  selector: 'app-forum-all',
  templateUrl: './forum-all.component.html',
  styleUrls: ['./forum-all.component.css']
})
export class ForumAllComponent implements OnInit {
  domain: string = environment.domain;
  loading: boolean = true;

  tagSelected: Set<string> = new Set<string>();
  searchFilter: string = '';
  selectedSearch: string = 'Name';
  selectedLanguage: string = 'all';

  posts: Array<Post> = [];
  postsFiltered: Array<Post> = [];
  page: number = 1;
  count: number = 0; // puede indicar el total sin traer todo desde principio
  gridSize: number = 4;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.page = ( this.activatedRoute.snapshot.params['page'] || 1 );
    this.getPosts();
  }

  getFormatDate(date:string){
    return Utils.getFormatDate(date);
  }

  onChangePageV(event: any) {
    this.page = event;
    this.keepFilters();
  }

  onFilterChange(event: any) {
    this.searchFilter = event.searchFilter;
    this.tagSelected = event.tagSelected;
    this.selectedLanguage = event.selectedLanguage;
    this.selectedSearch = event.selectedSearch;
    this.keepFilters();
    this.filterPosts();
  }
  filterPosts(){
    this.postsFiltered = Utils.getSearcher(this.posts,this.selectedSearch).search(this.searchFilter).filter((elem: Post) => {
      return Utils.applyFilters(elem,this.selectedLanguage,this.tagSelected);
    });
    this.page = 1;
  }

  private keepFilters(){
    this.router.navigate(
      [
        '/forum/' + this.selectedLanguage,
        {
          tagSelected: Array.from(this.tagSelected).join('|'),
          searchFilter: this.searchFilter,
          page: this.page,
          selectedSearch: this.selectedSearch
        }
      ],
      {
        relativeTo: this.activatedRoute,
        replaceUrl: true
      }
    );
  }
  private getPosts(){
    let endpoint: string = environment.domain + environment.apiEndpoints.posts.index;
    axios.get(endpoint).then((res) => {
      this.posts = res.data as Post[];
      this.loading = false;
      this.postsFiltered = this.posts;
    }).catch(err => {
      this.snackBar.open(err,'X', {
        duration: 5000,
        verticalPosition: 'top',
      });
    });
  }
}
