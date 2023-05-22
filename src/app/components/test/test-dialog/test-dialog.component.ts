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

  /**
   * This is a constructor function that initializes various dependencies for the TestDialogComponent.
   * @param {MatDialog} dialog
   * @param dialogRef
   * @param {string} data
   * @param {MatSnackBar} snackBar
   * @param {QuestionUtils} questionUtils
   */
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<TestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private snackBar: MatSnackBar,
    private questionUtils: QuestionUtils
  ) {}

  /**
   * The ngOnInit function retrieves questions using the questionUtils service and assigns the response to the questions
   * variable, while also setting the loading variable to false.
   */
  ngOnInit() {
    this.questionUtils.getQuestions(this.data).subscribe(res => {
      this.questions = res;
      this.loading = false;
    });
  }

  /**
   * The function checks if a loading flag is set and either closes a dialog or opens a confirmation dialog before setting
   * the loading flag and posting answers.
   */
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

  /**
   * This function sends a POST request to a server with answers to questions and displays a result and message in a dialog
   * box.
   */
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
