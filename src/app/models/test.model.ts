import {Serie} from "@app/models/serie.model";
import {Language} from "@app/models/language.model";
import {User} from "@app/models/user.model";
import {Question} from "@app/models/question.model";
import {Result} from "@app/models/result.model";
import {Tag} from "@app/models/tag.model";

export interface Test {
  id:string;
  title:string;
  description?:string;
  serie?:Serie;
  language?:Language;
  author?:User;
  comments?:Comment[];
  questions_count?:number;
  questions?:Question[];
  result_count?:number;
  results?:Result[];
  tags?:Tag[];
  created_at:string;
  updated_at:string;
}
