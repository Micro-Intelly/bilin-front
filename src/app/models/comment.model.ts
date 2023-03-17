import {User} from "@app/models/user.model";

export interface Comment {
  id:string;
  title?:string;
  description?:string;
  body:string;
  author?:User;
  comments?:Comment[];
  type:string;
  created_at:string;
  updated_at:string;
}
