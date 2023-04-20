import { Component, OnInit, forwardRef } from '@angular/core';
import {LanTag} from "@app/components/forum/post-form-dialog/post-form-dialog.component";
import {LAN_ALL_FILTER, Language} from "@app/models/language.model";
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

  lanTags: LanTag = {} as LanTag
  onChange = (value: LanTag) => {};

  searchLanguage: Language[] = [];
  tagList: Tag[] = [];
  selectedLanguage: string = 'en-us'
  tagSelected: Set<string> = new Set<string>();

  subscriptionLanguage: Subscription | undefined;
  subscriptionTag: Subscription | undefined;

  tagCtrl = new FormControl('');
  filteredTags: Observable<Tag[]>;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(private languageService: LanguageService,
              private tagService: TagService,
              private snackBar: MatSnackBar) {
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => (tag ? this._filterNotNull(tag) : this._filterNull())),
    );
  }

  ngOnInit(): void {
    this.lanTags.tags = this.tagSelected;
    this.lanTags.language = this.selectedLanguage;
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

  remove(tag: string): void {
    this.tagSelected.delete(tag);
    this.tagCtrl.setValue(null);
  }

  onLanguageChange(){
    this.lanTags.language = this.selectedLanguage;
    this.formatLanTag();
    this.onChange(this.lanTags);
  }

  registerOnChange(fn: (value: LanTag) => void): void {
    this.onChange = fn;
    this.onChange(this.lanTags);
  }
  writeValue(value: LanTag) {
    if (Object.keys(value).length) {
      this.lanTags = value;
      this.selectedLanguage = value.language!;
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

  private checkMaxTagsNum(){
    return this.tagSelected.size < this.MAX_TAG_NUM;
  }

  private _filterNotNull(value: string): Tag[] {
    const filterValue = value.toLowerCase();

    return this.tagList.filter(tag => (tag.name.toLowerCase().includes(filterValue) && !this.tagSelected.has(tag.name)));
  }
  private _filterNull(): Tag[] {
    return this.tagList.filter(tag => !this.tagSelected.has(tag.name));
  }

  private displaySnackBar(message: string){
    this.snackBar.open(message,'X', {
      duration: 5000,
      verticalPosition: 'top',
    });
  }

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
