import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import axios from "axios";
import {environment} from "@environments/environment";
import {Post} from "@app/models/post.model";
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
  count: number = 0; // puede indicar el total sin traer todo desde principio
  gridSize: number = 4;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.page = ( this.activatedRoute.snapshot.params['page'] || 1 );
    this.getTests();
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
    this.filterTests();
  }
  filterTests(){
    this.testsFiltered = Utils.getSearcher(this.tests,this.selectedSearch).search(this.searchFilter).filter((elem: Test) => {
      return Utils.applyFilters(elem,this.selectedLanguage,this.tagSelected);
    });
    this.page = 1;
  }
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
