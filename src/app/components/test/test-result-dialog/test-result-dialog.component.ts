import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid
} from "ng-apexcharts";
import {environment} from "@environments/environment";
import axios from "axios";
import {Test} from "@app/models/test.model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-test-result-dialog',
  templateUrl: './test-result-dialog.component.html',
  styleUrls: ['./test-result-dialog.component.css']
})
export class TestResultDialogComponent implements OnInit {
  loading:boolean = true;

  public chartOptions: Partial<ChartOptions> | any;

  /**
   * This is a constructor function that initializes variables for a dialog component in Angular
   * @param dialogRef
   * @param {string} data
   * @param {MatSnackBar} snackBar
   */
  constructor(public dialogRef: MatDialogRef<TestResultDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string,
              private snackBar: MatSnackBar) {
  }

  /**
   * The ngOnInit function sets chart options and retrieves results.
   */
  ngOnInit(): void {
    this.setChartOptions();
    this.getResults();
  }

  /**
   * This function retrieves test results from an API endpoint and updates a chart with the average results.
   */
  private getResults(){
    let endpoint: string = environment.domain + environment.apiEndpoints.tests.showResultAverage.replace('{:id}', this.data);
    axios.get(endpoint).then((res) => {
      (res.data as Array<{n_try:number,avg_result:number}>).forEach((elem,index) => {
        this.chartOptions.series[0].data[index] = elem.avg_result;
      })
      this.loading = false;
    }).catch(err => {
      this.snackBar.open(err,'X', {
        duration: 5000,
        verticalPosition: 'top',
      });
    });
  }

  /**
   * This function sets the options for a line chart displaying average results.
   */
  private setChartOptions(){
    this.chartOptions = {
      series: [
        {
          name: "Average",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0,0]
        }
      ],
      chart: {
        height: 350,
        width: 500,
        type: "line",
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "Average Results",
        align: "center"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5
        }
      },
      xaxis: {
        title: {
          text: "Tries"
        },
        categories: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
      },
      yaxis: {
        title: {
          text: "Average"
        },
        min: 0,
        max: 10,
        forceNiceScale: false,
        decimalsInFloat: 2
      },
    };
  }
}
