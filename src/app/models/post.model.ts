import {User} from "@app/models/user.model";
import {Language} from "@app/models/language.model";
import {Tag} from "@app/models/tag.model";

export interface Post {
  id:string;
  title: string;
  body: string;
  author: User;
  language: Language;
  comments?:Comment[];
  tags?:Tag[];
  created_at:string;
  updated_at:string;
}
