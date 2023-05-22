import {User} from "@app/models/user.model";
import {Language} from "@app/models/language.model";
import {Organization} from "@app/models/organization.model";
import {Tag} from "@app/models/tag.model";
import {Section} from "@app/models/section.model";
import {File} from "@app/models/file.model";
import {Comment} from "@app/models/comment.model";
import {Test} from "@app/models/test.model";

export interface Serie {
  id:string;
  title:string;
  description?:string;
  image:string;
  type:string;
  access?:string;
  level?:string;
  author?:User;
  language_id:string;
  language?:Language;
  organization_id: string;
  organization?:Organization;
  tags?:Tag[];
  tests?:Test[];
  comments?:Comment[];
  sections?:Section[];
  files?:File[];
  created_at:string;
  updated_at:string;
}
