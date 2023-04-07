import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import axios from "axios";
import {Serie} from "@app/models/serie.model";
import {environment} from "@environments/environment";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Utils} from "@app/utils/utils";

@Component({
  selector: 'app-class-all',
  templateUrl: './class-all.component.html',
  styleUrls: ['./class-all.component.css']
})
export class ClassAllComponent implements OnInit {
  domain: string = environment.domain;
  loading: boolean = true;

  tagSelected: Set<string> = new Set<string>();
  searchFilter: string = '';
  tabIndex: number = 1;
  selectedSearch: string = 'Title';
  selectedLanguage: string = 'all';

  videos: Array<Serie> = [];
  videosFiltered: Array<Serie> = [];
  pageV: number = 1;
  countV: number = 0; // puede indicar el total sin traer todo desde principling
  gridSizeV: number = 4;
  podcasts: Array<Serie> = [];
  podcastsFiltered: Array<Serie> = [];
  pageP: number = 1;
  countP: number = 0; // puede indicar el total sin traer todo desde principio
  gridSizeP: number = 4;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.pageV = ( this.activatedRoute.snapshot.params['pageV'] || 1 );
    this.pageP = ( this.activatedRoute.snapshot.params['pageP'] || 1 );
    this.tabIndex = ( this.activatedRoute.snapshot.params['tabIndex'] || 0 );
    this.getSeries();
  }

  onChangePageV(event: any) {
    this.pageV = event;
    this.keepFilters();
  }
  onChangePageP(event: any) {
    this.pageP = event;
    this.keepFilters();
  }
  onFilterChange(event: any) {
    this.searchFilter = event.searchFilter;
    this.tagSelected = event.tagSelected;
    this.selectedLanguage = event.selectedLanguage;
    this.selectedSearch = event.selectedSearch;
    this.keepFilters();
    this.filterSeries();
  }

  keepFilters(){
    this.router.navigate(
      [
        '/class/' + this.selectedLanguage,
        {
          tagSelected: Array.from(this.tagSelected).join('|'),
          selectedSearch: this.selectedSearch,
          searchFilter: this.searchFilter,
          pageV: this.pageV,
          pageP: this.pageP,
          tabIndex: this.tabIndex
        }
      ],
      {
        relativeTo: this.activatedRoute,
        replaceUrl: true
      }
    );
  }

  filterSeries(){
    this.videosFiltered = Utils.getSearcher(this.videos,this.selectedSearch).search(this.searchFilter).filter((elem: Serie) => {
      return Utils.applyFilters(elem,this.selectedLanguage,this.tagSelected);
    });
    this.podcastsFiltered = Utils.getSearcher(this.podcasts,this.selectedSearch).search(this.searchFilter).filter((elem: Serie) => {
      return Utils.applyFilters(elem,this.selectedLanguage,this.tagSelected);
    });
    this.pageP = 1; this.pageV = 1;
  }

  private getSeries(){
    let endpoint: string = environment.domain + environment.apiEndpoints.series.index;
    axios.get(endpoint).then((res) => {
      let result = res.data as Serie[];
      result.forEach(elem => {
        let arr = elem.type == 'video' ? this.videos : this.podcasts;
        arr.push(elem);
        this.videosFiltered = this.videos;
        this.podcastsFiltered = this.podcasts;
        this.filterSeries();
      })
      this.loading = false;
    }).catch(err => {
      this.snackBar.open(err,'X', {
        duration: 5000,
        verticalPosition: 'top',
      });
    });
  }
}
