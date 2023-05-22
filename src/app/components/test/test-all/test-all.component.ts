import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import axios from "axios";
import {environment} from "@environments/environment";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Test} from "@app/models/test.model";
import {Utils} from "@app/utils/utils";

@Component({
  selector: 'app-test-all',
  templateUrl: './test-all.component.html',
  styleUrls: ['./test-all.component.css']
})
export class TestAllComponent implements OnInit {
  domain: string = environment.domain;
  loading: boolean = true;

  tagSelected: Set<string> = new Set<string>();
  searchFilter: string = '';
  selectedSearch: string = 'Name';
  selectedLanguage: string = 'all';

  tests: Array<Test> = [];
  testsFiltered: Array<Test> = [];
  page: number = 1;
  count: number = 0; 
  gridSize: number = 4;

  /**
   * Constructor function
   * @param {ActivatedRoute} activatedRoute
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   */
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar) {
  }

  /**
   * The ngOnInit function initializes the page variable and calls the getTests function with the current page parameter.
   */
  ngOnInit(): void {
    this.page = ( this.activatedRoute.snapshot.params['page'] || 1 );
    this.getTests();
  }

  /**
   * The function updates the current page and keeps the filters applied.
   * @param {any} event
   */
  onChangePageV(event: any) {
    this.page = event;
    this.keepFilters();
  }
  /**
   * The function updates filter variables and calls another function to filter tests based on the updated variables.
   * @param {any} event
   */
  onFilterChange(event: any) {
    this.searchFilter = event.searchFilter;
    this.tagSelected = event.tagSelected;
    this.selectedLanguage = event.selectedLanguage;
    this.selectedSearch = event.selectedSearch;
    this.filterTests();
  }
  /**
   * This function filters a list of tests based on selected search criteria, language, and tags.
   */
  filterTests(){
    this.testsFiltered = Utils.getSearcher(this.tests,this.selectedSearch).search(this.searchFilter).filter((elem: Test) => {
      return Utils.applyFilters(elem,this.selectedLanguage,this.tagSelected);
    });
    this.page = 1;
  }
  /**
   * This function navigates to a specific route with selected filters and replaces the current URL.
   */
  private keepFilters(){
    this.router.navigate(
      [
        '/test/' + this.selectedLanguage,
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
  /**
   * This function retrieves a list of tests from an API endpoint using Axios in a TypeScript environment.
   */
  private getTests(){
    let endpoint: string = environment.domain + environment.apiEndpoints.tests.index;
    axios.get(endpoint).then((res) => {
      this.tests = res.data as Test[];
      this.loading = false;
      this.testsFiltered = this.tests;
    }).catch(err => {
      this.snackBar.open(err,'X', {
        duration: 5000,
        verticalPosition: 'top',
      });
    });
  }
}
