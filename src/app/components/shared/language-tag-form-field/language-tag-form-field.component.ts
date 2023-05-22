import {Component, OnInit, forwardRef, Input} from '@angular/core';
import {Language} from "@app/models/language.model";
import {Observable, Subscription} from "rxjs";
import {LanguageService} from "@app/services/language.service";
import {TagService} from "@app/services/tag.service";
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from "@angular/forms";
import {map, startWith} from "rxjs/operators";
import {Tag} from "@app/models/tag.model";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatSnackBar} from "@angular/material/snack-bar";

export interface LanTag {
  language: string | undefined;
  tags: Set<string> | undefined;
  languageId: string;
  tagsId: Set<string> | undefined;
  newTags: Set<string>;
}

@Component({
  selector: 'app-language-tag-form-field',
  templateUrl: './language-tag-form-field.component.html',
  styleUrls: ['./language-tag-form-field.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => LanguageTagFormFieldComponent)
  }]
})
export class LanguageTagFormFieldComponent implements OnInit,ControlValueAccessor {
  readonly MAX_TAG_NUM: number = 10;

  @Input() disableLanguage: boolean = false;

  lanTags: LanTag = {} as LanTag
  onChange = (value: LanTag) => {};

  searchLanguage: Language[] = [];
  tagList: Tag[] = [];
  tagSelected: Set<string> = new Set<string>();

  subscriptionLanguage: Subscription | undefined;
  subscriptionTag: Subscription | undefined;

  tagCtrl = new FormControl('');
  filteredTags: Observable<Tag[]>;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  /**
   * This is a constructor function that initializes some services and sets up a filtered list of tags based on user input.
   * @param {LanguageService} languageService
   * @param {TagService} tagService
   * @param {MatSnackBar} snackBar
   */
  constructor(private languageService: LanguageService,
              private tagService: TagService,
              private snackBar: MatSnackBar) {
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => (tag ? this._filterNotNull(tag) : this._filterNull())),
    );
  }

  /**
   * The ngOnInit function initializes variables and subscribes to language and tag services.
   */
  ngOnInit(): void {
    this.lanTags.tags = this.tagSelected;
    this.formatLanTag();

    this.languageService.getLanguages();
    this.subscriptionLanguage = this.languageService.languages.subscribe((value) => {
      if(value){
        this.searchLanguage = this.searchLanguage.concat(value);
        this.formatLanTag();
      }
    });
    this.tagService.getTags();
    this.subscriptionTag = this.tagService.tags.subscribe((value) => {
      if(value){
        this.tagList = value;
        this.formatLanTag();
      }
    });
  }

  /**
   * This function adds a new tag to a set of selected tags and formats them, while also checking if the maximum number of
   * tags has been exceeded.
   * @param {MatChipInputEvent} event
   */
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value && this.checkMaxTagsNum()) {
      this.tagSelected.add(value);
      this.formatLanTag();
      this.onChange(this.lanTags);
    } else {
      this.displaySnackBar('Max number of tags exceeded! (Max 10 tags)');
    }
    event.chipInput!.clear();

    this.tagCtrl.setValue(null);
  }

  /**
   * This function adds a selected tag to a set and updates the list of language tags if the maximum number of tags has not
   * been exceeded.
   * @param {MatAutocompleteSelectedEvent} event
   */
  selected(event: MatAutocompleteSelectedEvent): void {
    if(this.checkMaxTagsNum()){
      this.tagSelected.add(event.option.viewValue);
      this.formatLanTag();
      this.onChange(this.lanTags);
    } else {
      this.displaySnackBar('Max number of tags exceeded! (Max 10 tags)');
    }
    this.tagCtrl.setValue(null);
  }

  /**
   * The function removes a tag from a set and sets the value of a control to null.
   * @param {string} tag
   */
  remove(tag: string): void {
    this.tagSelected.delete(tag);
    this.tagCtrl.setValue(null);
  }

  /**
   * The function updates language tags and triggers a change event.
   */
  onLanguageChange(){
    this.formatLanTag();
    this.onChange(this.lanTags);
  }

  /**
   * This function registers a callback function to be called when the value of a LanTag is changed and immediately calls
   * the callback function with the current value.
   * @param fn
   */
  registerOnChange(fn: (value: LanTag) => void): void {
    this.onChange = fn;
    this.onChange(this.lanTags);
  }
  /**
   * The function assigns a value to a property and formats it if it is not empty.
   * @param {LanTag} value
   */
  writeValue(value: LanTag) {
    if (Object.keys(value).length) {
      this.lanTags = value;
      this.tagSelected = value.tags!;
      this.formatLanTag();
    }
  }
  registerOnTouched(){}

  /**
   * It unsubscribes from the subscriptionLanguage.
   */
  ngOnDestroy(){
    this.subscriptionLanguage?.unsubscribe();
    this.subscriptionTag?.unsubscribe();
  }

  /**
   * This function checks if the number of selected tags is less than the maximum allowed number.
   * @returns The function `checkMaxTagsNum()` is returning a boolean value that indicates whether the number of items in
   * the `tagSelected` set is less than the maximum number of tags allowed (`MAX_TAG_NUM`).
   */
  private checkMaxTagsNum(){
    return this.tagSelected.size < this.MAX_TAG_NUM;
  }

  /**
   * This function filters a list of tags based on a given value and whether or not they have already been selected.
   * @param {string} value
   * @returns The `_filterNotNull` function is returning an array of `Tag` objects that match the search criteria specified
   * by the `value` parameter.
   */
  private _filterNotNull(value: string): Tag[] {
    const filterValue = value.toLowerCase();

    return this.tagList.filter(tag => (tag.name.toLowerCase().includes(filterValue) && !this.tagSelected.has(tag.name)));
  }
  /**
   * This function filters out any null values from a list of tags based on a set of selected tags.
   * @returns The `_filterNull()` method is returning an array of `Tag` objects that are not present in the `tagSelected`
   * set.
   */
  private _filterNull(): Tag[] {
    return this.tagList.filter(tag => !this.tagSelected.has(tag.name));
  }

  /**
   * This is a private function in TypeScript that displays a snackbar message with a close button.
   * @param {string} message
   */
  private displaySnackBar(message: string){
    this.snackBar.open(message,'X', {
      duration: 5000,
      verticalPosition: 'top',
    });
  }

  /**
   * This function formats language and tag data for use in a TypeScript application.
   */
  private formatLanTag() {
    this.lanTags.languageId = this.searchLanguage.filter(
      elem => elem.code == this.lanTags.language)[0]?.id;
    this.lanTags.tagsId = new Set<string>(this.tagList.filter(
      elem => this.lanTags.tags?.has(elem.name)
    ).map(elem => elem.id));
    this.lanTags.newTags = new Set<string>(Array.from(this.tagSelected).filter(
      elem => this.tagList.map(tag => tag.name).indexOf(elem) < 0
    ));
  }
}
