export interface Question {
  question: string;
  answers: string;
  answersMap: Map<string,string>;
  selectedAnswer?:number;
}
