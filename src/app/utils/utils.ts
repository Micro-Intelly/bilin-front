// @ts-ignore
import FuzzySearch from "fuzzy-search";
import {Post} from "@app/models/post.model";
import {Serie} from "@app/models/serie.model";
import {Test} from "@app/models/test.model";

export class Utils {
  // @ts-ignore
  public static getRandomSubArray<T>(arr: T[], size: number = arr.length) : T[]
  {
    return arr.sort(() => .5 - Math.random()).slice(0, size);
  }

  public static getSearcher<T extends object> (list: T[], selectedSearch:string): FuzzySearch<T> {
    let searchField = '';
    switch (selectedSearch) {
      case 'Title': {searchField = 'title';break;}
      case 'Author': {searchField = 'author.name';break;}
    }
    return new FuzzySearch<T>(list,[searchField], {
      sort: true
    });
  }

  public static applyFilters (elem: (Post | Serie | Test), selectedLanguage: string, tagSelected: Set<string>): boolean {
    let result: boolean = true;
    if(elem.language!.code != selectedLanguage &&
      selectedLanguage != 'all'){
      result = false;
    }
    const even = (e: string) => tagSelected.has(e);
    if(tagSelected.size > 0 &&
      !(elem.tags!.map(tag => tag.name).some(even))){
      result = false;
    }

    return result;
  }

  public static getFormatDate(date:string){
    return (new Date(date)).toLocaleString();
  }
}
