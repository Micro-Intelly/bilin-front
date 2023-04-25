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

  constructor(private snackBar: MatSnackBar,
              private router: Router,
              private serieService: SerieService) { }

  ngOnInit(): void {
    if(this.userId){
      this.serieService.getUsersSeries(this.userId);
    }
    this.subscriptionSerie = this.serieService.series.subscribe((value) => {
      this.seriesList = value;
      this.loading = false;
    });
  }
  ngOnDestroy() {
    this.subscriptionSerie?.unsubscribe();
  }

  onChangePage(event: any) {
    this.page = event;
  }

  getFormatDate(date:string){
    return Utils.getFormatDate(date);
  }

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
