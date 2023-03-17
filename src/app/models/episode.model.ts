import {Section} from "@app/models/section.model";
import {User} from "@app/models/user.model";

export interface Episode {
  id:string;
  name:string;
  description?:string;
  type:string;
  path:string;
  section:Section;
  comments?:Comment[];
  author?:User;
  created_at:string;
  updated_at:string;
}
