// @ts-ignore
import FuzzySearch from "fuzzy-search";
import {Post} from "@app/models/post.model";
import {Serie} from "@app/models/serie.model";
import {Test} from "@app/models/test.model";
import axios, {AxiosResponse} from "axios";
import {CommonHttpResponse} from "@app/models/common-http-response.model";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CloseRemindDialogComponent} from "@app/components/shared/close-remind-dialog/close-remind-dialog.component";
import {Observable, Subject} from "rxjs";

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
      case 'Name': {searchField = 'name';break;}
      case 'Email': {searchField = 'email';break;}
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

  public static axiosPostResult(
    res:AxiosResponse<any>,
    dialogRef: MatDialogRef<any>,
    snackBar: MatSnackBar,
  ): Observable<boolean> {
    const responseStatus = new Subject<boolean>();
    const response = res.data as CommonHttpResponse;
    snackBar.open(response.message, 'X', {
      duration: 5000,
      verticalPosition: 'top',
    })
    if(response.status === 200){
      dialogRef.close('OK');
      responseStatus.next(true);
    } else {
      responseStatus.next(false);
    }
    return responseStatus.asObservable();
  }

  public static axiosPostError(
    err: any,
    snackBar: MatSnackBar,
  ): Observable<boolean> {
    const responseStatus = new Subject<boolean>();
    snackBar.open(err, 'X', {
      duration: 5000,
      verticalPosition: 'top',
    });
    responseStatus.next(false);
    return responseStatus.asObservable();
  }

  public static onDeleteDialog(
    url: string,
    dialog: MatDialog,
    snackBar: MatSnackBar,
    ): Observable<boolean>{
    const responseStatus = new Subject<boolean>();
    const reminder = dialog.open(CloseRemindDialogComponent, {
      data: 'Are you sure delete this content? This action will be not reversible.',
      disableClose: true,
    });
    reminder.afterClosed().subscribe(result => {
      if(result){
        Utils.axiosDelete(url,snackBar).subscribe(res => {
          responseStatus.next(res);
        });
      } else {
        responseStatus.next(false);
      }
    });

    return responseStatus.asObservable();
  }

  private static axiosDelete(
    url: string,
    snackBar: MatSnackBar,
  ): Observable<boolean>{
    const responseStatus = new Subject<boolean>();
    axios.delete(url).then((res) => {
      const response = res.data as CommonHttpResponse;
      snackBar.open(response.message, 'X', {
        duration: 5000,
        verticalPosition: 'top',
      })
      if(response.status === 200){
        responseStatus.next(true);
      } else {
        responseStatus.next(false);
      }
    }).catch(err => {
      Utils.axiosPostError(err,snackBar).subscribe(res => responseStatus.next(false));
    });
    return responseStatus.asObservable();
  }
}
