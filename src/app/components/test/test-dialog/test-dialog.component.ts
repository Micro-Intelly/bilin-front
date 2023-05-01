import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {environment} from "@environments/environment";
import axios from "axios";
import {Question} from "@app/models/question.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CloseRemindDialogComponent} from "@app/components/shared/close-remind-dialog/close-remind-dialog.component";
import {QuestionUtils} from "@app/components/test/question-utils";
import {Utils} from "@app/utils/utils";
import {CommonHttpResponse} from "@app/models/common-http-response.model";

interface ResultHttpResponse {
  status: number;
  message: string;
  score: number;
}

@Component({
  selector: 'app-test-dialog',
  templateUrl: './test-dialog.component.html',
  styleUrls: ['./test-dialog.component.css']
})
export class TestDialogComponent implements OnInit {
  loading:Boolean = true;
  questions: Question[] = [];
  result: number = -1;

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
          this.loading = true;
          this.postAnswers();
        }
      });
    }
  }

  private postAnswers(){
    const body: any = {answers: []};
    this.questions.forEach(elem => {
      body.answers.push({
        qid: elem.id, selectedAnswer: elem.selectedAnswer ?? -1
      });
    });

    const url = environment.domain + environment.apiEndpoints.tests.postAnswer.replace('{:id}', this.data);
    this.loading = true;
    axios.post(url, body)
      .then(res => {
        const response = res.data as ResultHttpResponse;
        this.snackBar.open(response.message, 'X', {
          duration: 5000,
          verticalPosition: 'top',
        })
        if(response.status === 200){
          this.result = response.score;
          const reminder = this.dialog.open(CloseRemindDialogComponent, {
            data: 'Your score is: ' + this.result,
          });
          reminder.afterClosed().subscribe(result => {
            this.dialogRef.close();
          });
        }
        this.loading = false;
      })
      .catch(err => {
        Utils.axiosPostError(err, this.snackBar);
        this.loading = false;
      })

    console.log(body);
  }
}
