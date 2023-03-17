import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {TestDialogComponent} from "@app/components/test/test-dialog/test-dialog.component";

@Component({
  selector: 'app-test-detail',
  templateUrl: './test-detail.component.html',
  styleUrls: ['./test-detail.component.css']
})
export class TestDetailComponent implements OnInit {
  animal:string = '';

  constructor(public dialog: MatDialog) {
    
  }

  ngOnInit(): void {
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
}
