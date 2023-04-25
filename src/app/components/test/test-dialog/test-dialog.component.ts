import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {environment} from "@environments/environment";
import axios from "axios";
import {Question} from "@app/models/question.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CloseRemindDialogComponent} from "@app/components/shared/close-remind-dialog/close-remind-dialog.component";
import {QuestionUtils} from "@app/components/test/question-utils";

@Component({
  selector: 'app-test-dialog',
  templateUrl: './test-dialog.component.html',
  styleUrls: ['./test-dialog.component.css']
})
export class TestDialogComponent implements OnInit {
  loading:Boolean = true;
  questions: Question[] = [];

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<TestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private snackBar: MatSnackBar,
    private questionUtils: QuestionUtils
  ) {}

  ngOnInit() {
    this.questionUtils.getQuestions(this.data).subscribe(res => {
      this.questions = res;
      this.loading = false;
    });
  }

  onOkClick(): void {
    if(this.loading){
      this.dialogRef.close();
    } else {
      const reminder = this.dialog.open(CloseRemindDialogComponent, {
        data: 'Do you sure to close the dialog panel? Your answers will be saved as a result.',
        disableClose: true,
      });
      reminder.afterClosed().subscribe(result => {
        if(result){
          // send post
          this.loading = true;
          this.dialogRef.close();
        }
      });
    }
  }

  private getQuestions() {
    let endpoint: string = environment.domain + environment.apiEndpoints.questions.index.replace('{:id}', this.data);
    axios.get(endpoint).then((res) => {
      this.questions = res.data as Question[];
      this.questions.forEach(question => {
        question.answersMap = new Map(Object.entries(JSON.parse(question.answers)));
      });

      this.loading = false;
    }).catch(err => {
      this.snackBar.open(err,'X', {
        duration: 5000,
        verticalPosition: 'top',
      });
    });
  }

  private postAnswers(){

  }
}
