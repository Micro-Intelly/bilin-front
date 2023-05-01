import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {QuestionUtils} from "@app/components/test/question-utils";
import {Question} from "@app/models/question.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {FormService} from "@app/services/form.service";
import {environment} from "@environments/environment";
import axios from "axios";
import {Utils} from "@app/utils/utils";

@Component({
  selector: 'app-question-form-dialog',
  templateUrl: './question-form-dialog.component.html',
  styleUrls: ['./question-form-dialog.component.css']
})
export class QuestionFormDialogComponent implements OnInit {
  loading:Boolean = true;
  questions: Question[] = [];
  newQuestions: Question[] = [];
  deletedQuestionIds: string[] = [];
  submitQuestion: FormGroup | undefined;

  test = '2';

  constructor(public dialogRef: MatDialogRef<QuestionFormDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string,
              private snackBar: MatSnackBar,
              private questionUtils: QuestionUtils,
              public formService: FormService,
              private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.questionUtils.getQuestions(this.data).subscribe(res => {
      this.submitQuestion = this.formBuilder.group({});
      this.questions = [...res];
      this.loading = false;
      this.questions.forEach(elem => {
        this.submitQuestion!.addControl(
          elem.id, this.formBuilder.group({})
        );
        (this.submitQuestion!.get(elem.id) as FormGroup).addControl(
          'question ' + elem.id,
          new FormControl(elem.question,[Validators.required, Validators.maxLength(500)])
        );
        (this.submitQuestion!.get(elem.id) as FormGroup).addControl(
          'correctAnswer ' + elem.id,
          new FormControl(String(elem.correct_answer),[Validators.required])
        );
        (this.submitQuestion!.get(elem.id) as FormGroup).addControl(
          'answers ' + elem.id, this.formBuilder.group({})
        );
        elem.answersMap.forEach((value: string, key: string) => {
          ((this.submitQuestion!.get(elem.id) as FormGroup)
            .get("answers " + elem.id) as FormGroup)
            .addControl(
            'answer ' + key + ' ' + elem.id,
            new FormControl(value, [Validators.required, Validators.maxLength(100)])
          );
        });
      });
    });
  }

  get disableSubmit() {
    return this.submitQuestion?.invalid || !Object.keys(this.submitQuestion?.getRawValue()).length;
  }

  getAnswerKeys(ansMap: Map<string,string>) {
    return Array.from(ansMap.keys());
  }

  addAnswer(qid: string){
    const answerMap = this.questions.find(elem=>elem.id==qid)!.answersMap;
    const size = answerMap.size + 1;

    ((this.submitQuestion!.get(qid) as FormGroup)
      .get("answers " + qid) as FormGroup)
      .addControl(
        'answer ' + size + ' ' + qid,
        new FormControl('', [Validators.required, Validators.maxLength(100)])
      );

    answerMap.set(String(size), '');
  }

  deleteAnswer(qid: string, ansKey: string){
    const answerMap = this.questions.find(elem=>elem.id==qid)!.answersMap;
    const size = answerMap.size;

    for (let i = Number(ansKey); i < size; i++) {
      answerMap.set(String(i), answerMap.get(String(i+1)) ?? '');
      const contValue = ((this.submitQuestion!.get(qid) as FormGroup)
        .get("answers " + qid) as FormGroup)
        .get('answer ' + (i+1) + ' ' + qid)?.value ?? '';

      ((this.submitQuestion!.get(qid) as FormGroup)
        .get("answers " + qid) as FormGroup)
        .get('answer ' + i + ' ' + qid)!
        .setValue(contValue);
    }

    const corrAnswerControl = (this.submitQuestion!.get(qid) as FormGroup)
      .get("correctAnswer " + qid);
    if(corrAnswerControl?.value &&
      Number(corrAnswerControl?.value) > Number(ansKey)
    ){
      if(Number(corrAnswerControl!.value)-1 > 0){
        corrAnswerControl.setValue(String(Number(corrAnswerControl!.value)-1));
      } else {
        corrAnswerControl!.setValue('');
      }
    } else if(Number(corrAnswerControl?.value) == Number(ansKey)){
      corrAnswerControl!.setValue('');
    }

    ((this.submitQuestion!.get(qid) as FormGroup)
      .get("answers " + qid) as FormGroup)
      .removeControl('answer ' + size + ' ' + qid);

    answerMap.delete(String(size));
  }

  addQuestion(){
    const emptyQuestion = {
      id: 'newQ-' + this.newQuestions.length,
      question: '',
      answers: '',
      answersMap: new Map<string, string>()
    } as Question;
    this.newQuestions.push(emptyQuestion);
    this.questions.push(emptyQuestion);

    this.submitQuestion!.addControl(
      emptyQuestion.id, this.formBuilder.group({})
    );
    (this.submitQuestion!.get(emptyQuestion.id) as FormGroup).addControl(
      'question ' + emptyQuestion.id,
      new FormControl(emptyQuestion.question,[Validators.required, Validators.maxLength(500)])
    );
    (this.submitQuestion!.get(emptyQuestion.id) as FormGroup).addControl(
      'correctAnswer ' + emptyQuestion.id,
      new FormControl('',[Validators.required])
    );
    (this.submitQuestion!.get(emptyQuestion.id) as FormGroup).addControl(
      'answers ' + emptyQuestion.id, this.formBuilder.group({})
    );
  }

  deleteQuestion(qid: string){
    this.questions = this.questions.filter(elem => elem.id != qid);
    this.newQuestions = this.newQuestions.filter(elem => elem.id != qid);
    if(! qid.startsWith('newQ')){
      this.deletedQuestionIds.push(qid);
    }
    this.submitQuestion!.removeControl(qid);
  }

  onSubmit(){
    if(!this.submitQuestion?.invalid){
      const body = this.formatBody(this.submitQuestion?.getRawValue());
      this.postQuestions(body);
    } else {
      this.snackBar.open('Invalid form','X', {
        duration: 5000,
        verticalPosition: 'top',
      });
    }
  }

  private formatBody(body: any): any {
    const res: any = {upsert:[], destroy: []};
    this.questions.forEach(elem => {
      const questionFormGroup = (this.submitQuestion!.get(elem.id) as FormGroup);
      if(questionFormGroup){
        const singleQuestion = questionFormGroup.getRawValue();
        const answersToFormat = singleQuestion['answers '+elem.id];
        const formatAnswers: any = {};
        Object.keys(answersToFormat).forEach(key => {
          formatAnswers[key.split(' ')[1]] = answersToFormat[key];
        })

        const singleQFormat = {
          id: elem.id.startsWith('newQ') ? '' : elem.id,
          question: singleQuestion['question '+elem.id],
          correct_answer: singleQuestion['correctAnswer '+elem.id],
          answers: JSON.stringify(formatAnswers)
        }

        res.upsert.push(singleQFormat);
      }
    })
    this.deletedQuestionIds.forEach(elem => res.destroy.push(elem));

    return res;
  }

  private postQuestions(body: any){
    const url = environment.domain + environment.apiEndpoints.tests.updateQuestions.replace('{:id}', this.data);
    this.loading = true;
    axios.post(url, body)
      .then(res => {
        Utils.axiosPostResult(res, this.dialogRef, this.snackBar);
        this.loading = false;
      })
      .catch(err => {
        Utils.axiosPostError(err, this.snackBar);
        this.loading = false;
      })
  }
}
