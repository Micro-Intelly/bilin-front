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

  /**
   * This is a constructor function
   * @param {ActivatedRoute} activatedRoute
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   */
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar) {
  }

  /**
   * The ngOnInit function initializes variables and calls the getSeries function based on the activated route parameters.
   */
  ngOnInit(): void {
    this.pageV = ( this.activatedRoute.snapshot.params['pageV'] || 1 );
    this.pageP = ( this.activatedRoute.snapshot.params['pageP'] || 1 );
    this.tabIndex = ( this.activatedRoute.snapshot.params['tabIndex'] || 0 );
    this.getSeries();
  }

  /**
   * The function updates the current page number and calls another function to keep filters.
   * @param {any} event
   */
  onChangePageV(event: any) {
    this.pageV = event;
    this.keepFilters();
  }
  /**
   * The function updates the current page number and keeps the current filters.
   * @param {any} event
   */
  onChangePageP(event: any) {
    this.pageP = event;
    this.keepFilters();
  }
  /**
   * The function updates filter variables and applies them to filter a series.
   * @param {any} event
   */
  onFilterChange(event: any) {
    this.searchFilter = event.searchFilter;
    this.tagSelected = event.tagSelected;
    this.selectedLanguage = event.selectedLanguage;
    this.selectedSearch = event.selectedSearch;
    this.keepFilters();
    this.filterSeries();
  }

  /**
   * The function that replace current url to keep the filters
   */
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

  /**
   * This function filters a list of videos and podcasts based on selected search criteria, language, and tags.
   */
  filterSeries(){
    this.videosFiltered = Utils.getSearcher(this.videos,this.selectedSearch).search(this.searchFilter).filter((elem: Serie) => {
      return Utils.applyFilters(elem,this.selectedLanguage,this.tagSelected);
    });
    this.podcastsFiltered = Utils.getSearcher(this.podcasts,this.selectedSearch).search(this.searchFilter).filter((elem: Serie) => {
      return Utils.applyFilters(elem,this.selectedLanguage,this.tagSelected);
    });
    this.pageP = 1; this.pageV = 1;
  }

  /**
   * This function retrieves a list of series from an API endpoint and filters them based on their type.
   */
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
