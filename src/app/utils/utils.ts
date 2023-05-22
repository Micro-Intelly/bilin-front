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

  /**
   * This function returns a random subarray of a given array.
   * @param {T[]} arr - an array of elements of type T from which a random subarray will be generated.
   * @param {number} size - The `size` parameter is an optional parameter that specifies the size of the subarray that will
   * be returned. If `size` is not provided, the function will return a subarray with the same length as the original
   * array. If `size` is provided, the function will return a subarray
   * @returns The function `getRandomSubArray` is returning a randomly sorted subarray of type `T` from the input array
   * `arr`.
   */
  // @ts-ignore
  public static getRandomSubArray<T>(arr: T[], size: number = arr.length) : T[]
  {
    return arr.sort(() => .5 - Math.random()).slice(0, size);
  }

  /**
   * This function returns a FuzzySearch object based on a list of objects and a selected search field.
   * @param {T[]} list - An array of objects of type T that will be searched through using the FuzzySearch algorithm.
   * @param {string} selectedSearch - The selectedSearch parameter is a string that determines which field to search for in
   * the list of objects. It can be one of four options: 'Title', 'Author', 'Name', or 'Email'. Depending on the selected
   * option, the function sets the searchField variable to the corresponding property name of
   * @returns The function `getSearcher` returns an instance of the `FuzzySearch` class
   */
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

  /**
   * This function applies filters to a given element based on selected language and tags.
   * @param elem - The `elem` parameter is of type `Post | Serie | Test`, which means it can be an object of any of these
   * three types. It represents the element that needs to be filtered based on the selected language and tags.
   * @param {string} selectedLanguage - A string representing the language selected by the user to filter the elements. It
   * can be either a specific language code or "all" to show all languages.
   * @param tagSelected - `tagSelected` is a `Set` of strings representing the selected tags for filtering.
   * @returns The function `applyFilters` is returning a boolean value.
   */
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

  /**
   * This function takes a string date and returns it in a formatted string format.
   * @param {string} date - The parameter "date" is a string representing a date in a specific format. It is used as input
   * to create a new Date object and then format it using the toLocaleString() method.
   * @returns The function `getFormatDate` takes a string parameter `date`, converts it to a `Date` object, and returns a
   * formatted string representation of the date using the `toLocaleString()` method. The exact format of the returned
   * string will depend on the user's locale settings.
   */
  public static getFormatDate(date:string){
    return (new Date(date)).toLocaleString();
  }

  /**
   * This function handles the response of an Axios POST request and returns an Observable with a boolean value indicating
   * the success of the request.
   * @param res - AxiosResponse<any> is the response object returned by an Axios HTTP request.
   * @param {MatDialogRef} dialogRef
   * @param {MatSnackBar} snackBar
   * @returns An Observable of type boolean is being returned.
   */
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

  /**
   * This function returns an Observable that emits a boolean value and displays an error message in a snackbar.
   * @param {any} err - The `err` parameter is an object that represents an error that occurred during an HTTP POST request
   * made using the Axios library.
   * @param {MatSnackBar} snackBar
   * @returns An Observable of type boolean is being returned.
   */
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

  /**
   * This function opens a dialog box to confirm deletion of content and returns an observable with the response status.
   * @param {string} url - a string representing the URL of the resource to be deleted
   * @param {MatDialog} dialog
   * @param {MatSnackBar} snackBar
   * @returns An Observable<boolean> is being returned.
   */
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

  /**
   * This is a TypeScript function that sends a DELETE request using Axios and returns an Observable that emits a boolean
   * value indicating the success or failure of the request.
   * @param {string} url - The URL of the API endpoint that needs to be called for the DELETE request.
   * @param {MatSnackBar} snackBar
   * @returns An Observable of type boolean is being returned.
   */
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
