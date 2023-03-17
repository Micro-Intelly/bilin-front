import {Serie} from "@app/models/serie.model";

export interface File {
  id:string;
  name:string;
  description?:string;
  path:string;
  series?:Serie;
}
