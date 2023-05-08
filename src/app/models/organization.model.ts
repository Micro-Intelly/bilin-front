import {User} from "@app/models/user.model";

export interface Organization {
  id:string;
  name:string;
  description?:string;
  users?: User[];
  created_at:string;
  updated_at:string;
}
