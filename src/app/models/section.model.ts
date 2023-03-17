import {Episode} from "@app/models/episode.model";
import {Serie} from "@app/models/serie.model";

export interface Section {
  id:string;
  name:string;
  description?:string;
  episodes?:Episode[];
  serie?:Serie;
  created_at:string;
  updated_at:string;
}
