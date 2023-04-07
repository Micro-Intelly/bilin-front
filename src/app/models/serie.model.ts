import {User} from "@app/models/user.model";
import {Language} from "@app/models/language.model";
import {Organization} from "@app/models/organization.model";
import {Tag} from "@app/models/tag.model";
import {Section} from "@app/models/section.model";
import {File} from "@app/models/file.model";
import {Comment} from "@app/models/comment.model";

export interface Serie {
  id:string;
  title:string;
  description?:string;
  image:string;
  type:string;
  access?:string;
  level?:string;
  author?:User;
  language?:Language;
  organization?:Organization;
  tags?:Tag[];
  comments?:Comment[];
  sections?:Section[];
  files?:File[];
  created_at:string;
  updated_at:string;
}
