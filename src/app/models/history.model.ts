import {User} from "@app/models/user.model";
import {Serie} from "@app/models/serie.model";
import {Test} from "@app/models/test.model";
import {Post} from "@app/models/post.model";
import {Episode} from "@app/models/episode.model";

export interface History {
  id:string;
  history_able_id: string;
  history_able_type: string;
  history_able: (Test | Post | Episode);
  serie_id?: string;
  serie?: Serie;
  author?:User;
  created_at:string;
  updated_at:string;
}
