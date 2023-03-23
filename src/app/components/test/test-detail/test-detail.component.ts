import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {TestDialogComponent} from "@app/components/test/test-dialog/test-dialog.component";
import {Test} from "@app/models/test.model";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {environment} from "@environments/environment";
import axios from "axios";
import {Utils} from "@app/utils/utils";

@Component({
  selector: 'app-test-detail',
  templateUrl: './test-detail.component.html',
  styleUrls: ['./test-detail.component.css']
})
export class TestDetailComponent implements OnInit {
  loading: boolean = true;
  testId: string | undefined;
  testRecord: Test | undefined;

  animal:string = '';

  constructor(public dialog: MatDialog,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.testId = this.route.snapshot.paramMap.get('test-id') ?? undefined;
    if(this.testId) {
      this.getTests();
    } else {
      this.snackBar.open('Invalid URI','X', {
        duration: 5000,
        verticalPosition: 'top',
      });
    }
  }

  startTest(){
    const dialogRef = this.dialog.open(TestDialogComponent, {
      data: {name: 'example', animal: 'example2'},disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

  getFormatDate(date:string){
    return Utils.getFormatDate(date);
  }

  private getTests(){
    let endpoint: string = environment.domain + environment.apiEndpoints.tests.show.replace('{:id}', this.testId!);
    axios.get(endpoint).then((res) => {
      this.testRecord = res.data as Test;
      this.loading = false;
    }).catch(err => {
      this.snackBar.open(err,'X', {
        duration: 5000,
        verticalPosition: 'top',
      });
    });
  }
}
