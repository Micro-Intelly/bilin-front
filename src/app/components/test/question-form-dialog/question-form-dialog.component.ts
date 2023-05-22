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

  /**
   * Constructor function
   * @param {MatDialogRef} dialogRef
   * @param {string} data
   * @param {MatSnackBar} snackBar
   * @param {QuestionUtils} questionUtils
   * @param {FormService} formService
   * @param {FormBuilder} formBuilder
   */
  constructor(public dialogRef: MatDialogRef<QuestionFormDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string,
              private snackBar: MatSnackBar,
              private questionUtils: QuestionUtils,
              public formService: FormService,
              private formBuilder: FormBuilder,
  ) { }

  /**
   * The ngOnInit function initializes a form with questions and answers, retrieved from an API, and sets up form controls
   * with validators.
   */
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

  /**
   * This function returns a boolean value indicating whether the submitQuestion form is invalid or empty.
   * @returns {boolean}
   */
  get disableSubmit() {
    return this.submitQuestion?.invalid || !Object.keys(this.submitQuestion?.getRawValue()).length;
  }

  /**
   * This function returns an array of keys from a given map.
   * @param ansMap
   * @returns An array of all the keys in the input `ansMap` map.
   */
  getAnswerKeys(ansMap: Map<string,string>) {
    return Array.from(ansMap.keys());
  }

  /**
   * This function adds a new answer control to a form group if the number of answers is less than 8, and displays a
   * message if the maximum number of answers has been reached.
   * @param {string} qid
   */
  addAnswer(qid: string){
    const answerMap = this.questions.find(elem=>elem.id==qid)!.answersMap;
    if(answerMap.size < 8){
      const size = answerMap.size + 1;

      ((this.submitQuestion!.get(qid) as FormGroup)
        .get("answers " + qid) as FormGroup)
        .addControl(
          'answer ' + size + ' ' + qid,
          new FormControl('', [Validators.required, Validators.maxLength(100)])
        );

      answerMap.set(String(size), '');
    } else {
      this.snackBar.open('Max 8 answers','X', {
        duration: 5000,
        verticalPosition: 'top',
      });
    }
  }

  /**
   * This function deletes an answer from a question and updates the corresponding form controls.
   * @param {string} qid
   * @param {string} ansKey
   */
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

  /**
   * This function adds a new question to a list of questions if the list is not already at its maximum capacity of 30.
   */
  addQuestion(){
    if(this.questions.length < 30){

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
    } else {
      this.snackBar.open('Max 30 questions','X', {
        duration: 5000,
        verticalPosition: 'top',
      });
    }
  }

  /**
   * The function deletes a question from an array and adds its ID to a list of deleted question IDs if it is not a new
   * question.
   * @param {string} qid
   */
  deleteQuestion(qid: string){
    this.questions = this.questions.filter(elem => elem.id != qid);
    this.newQuestions = this.newQuestions.filter(elem => elem.id != qid);
    if(! qid.startsWith('newQ')){
      this.deletedQuestionIds.push(qid);
    }
    this.submitQuestion!.removeControl(qid);
  }

  /**
   * The function checks if a form is valid and either formats and posts the data or displays an error message.
   */
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

  /**
   * This function formats the body of a request by extracting and organizing data from a set of questions and their
   * answers.
   * @param {any} body
   * @returns {any} formatted body
   */
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

  /**
   * This function sends a POST request to update questions for a test using Axios in a TypeScript environment.
   * @param {any} body
   */
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
