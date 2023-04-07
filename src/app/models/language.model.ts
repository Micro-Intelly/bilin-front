export interface Language {
  id:string;
  language:string;
  home_phrase:string;
  code:string;
  home_img_mini:string;
  home_img:string;
}

export const LAN_ALL_FILTER: Language = {
  id: 'all', language:'All', home_phrase:'all',code:'all',home_img:'all',home_img_mini:'all'
};
