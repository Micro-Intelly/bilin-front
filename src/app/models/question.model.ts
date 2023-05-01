export interface Question {
  id: string;
  question: string;
  answers: string;
  correct_answer?: string;
  answersMap: Map<string,string>;
  selectedAnswer?:number;
}
