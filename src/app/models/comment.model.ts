import {User} from "@app/models/user.model";

export interface Comment {
  id:string;
  title?:string;
  description?:string;
  body:string;
  commentable_id: string;
  commentable_type: string;
  serie_id?: string;
  author?:User;
  comments?:Comment[];
  type:string;
  root_comm_id?:string;
  in_reply_to_id?:string;
  created_at:string;
  updated_at:string;
}
