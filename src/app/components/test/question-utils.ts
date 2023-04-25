import {environment} from "@environments/environment";
import axios from "axios";
import {Question} from "@app/models/question.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";

@Injectable()
export class QuestionUtils {
  constructor(private snackBar: MatSnackBar) {
  }

  getQuestions(qId: string): Observable<Question[]> {
    const loading: Subject<Question[]> = new Subject<Question[]>();
    let endpoint: string = environment.domain + environment.apiEndpoints.questions.index.replace('{:id}', qId);
    axios.get(endpoint).then((res) => {
      const questions = res.data as Question[];
      questions.forEach(question => {
        question.answersMap = new Map(Object.entries(JSON.parse(question.answers)));
      });

      loading.next(questions);
    }).catch(err => {
      this.snackBar.open(err,'X', {
        duration: 5000,
        verticalPosition: 'top',
      });
    });
    return loading.asObservable();
  }
}
