import {Component, Input, OnInit} from '@angular/core';
import {environment} from "@environments/environment";
import axios from "axios";
import {Serie} from "@app/models/serie.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Test} from "@app/models/test.model";
import {Post} from "@app/models/post.model";
import {Utils} from "@app/utils/utils";
import {Router} from "@angular/router";
import {SerieService} from "@app/services/serie.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-series-grid',
  templateUrl: './series-grid.component.html',
  styleUrls: ['./series-grid.component.css']
})
export class SeriesGridComponent implements OnInit {
  @Input() userId = '';
  _reloadToggle: boolean = false;
  @Input()
  set reloadToggle(value:boolean) {
    if(value != this._reloadToggle){
      this._reloadToggle = value;
      this.serieService.getUsersSeries(this.userId);
    }
  }
  get reloadToggle() {
    return this._reloadToggle;
  }

  domain: string = environment.domain;
  loading: boolean = true;
  gridSize: number = 4;
  page: number = 1;
  count: number = 0;

  seriesList: Serie[] = [];
  subscriptionSerie: Subscription | undefined;

  /**
   * Constructor function
   * @param {MatSnackBar} snackBar
   * @param {Router} router
   * @param {SerieService} serieService
   */
  constructor(private snackBar: MatSnackBar,
              private router: Router,
              private serieService: SerieService) { }

  /**
   * The ngOnInit function subscribes to a series service and sets the seriesList variable to the value received from the
   * subscription.
   */
  ngOnInit(): void {
    if(this.userId){
      this.serieService.getUsersSeries(this.userId);
    }
    this.subscriptionSerie = this.serieService.series.subscribe((value) => {
      this.seriesList = value;
      this.loading = false;
    });
  }
  /**
   * The ngOnDestroy function unsubscribes from a subscription if it exists.
   */
  ngOnDestroy() {
    this.subscriptionSerie?.unsubscribe();
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
   * This function navigates to a specific series page using the series ID.
   * @param {Serie} serie
   */
  goLink(serie: Serie){
    let res = '/class/series/'+serie.id;
    this.router.navigate([res]);
  }

  // private getSeries(){
  //   let endpoint: string = environment.domain + environment.apiEndpoints.user.seriesIndex.replace('{:id}', this.userId);
  //   axios.get(endpoint).then((res) => {
  //     this.seriesList = res.data as Serie[];
  //     this.count = this.seriesList.length;
  //     this.loading = false;
  //   }).catch(err => {
  //     this.snackBar.open(err,'X', {
  //       duration: 5000,
  //       verticalPosition: 'top',
  //     });
  //   });
  // }
}
