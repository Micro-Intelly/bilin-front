import {Serie} from "@app/models/serie.model";
import {Post} from "@app/models/post.model";
import {Test} from "@app/models/test.model";
import {Organization} from "@app/models/organization.model";

export interface User {
  id:string;
  name:string;
  email:string;
  thumbnail:string;
  role:string;
  orgs:string;
  episode_used:number;
  test_used:number;
  org_count:number;
  series?:Serie[];
  posts?:Post[];
  tests?:Test[];
  organization_id?:string;
  organization?:Organization;
  favorites?: (Serie | Post | Test)[];
  histories?: (Serie | Post | Test)[];
  created_at:string;
  updated_at:string;
}
