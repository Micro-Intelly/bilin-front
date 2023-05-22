import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {LAN_ALL_FILTER, Language} from "@app/models/language.model";
import {Tag} from "@app/models/tag.model";
import {Observable, Subscription} from "rxjs";
import {FormControl} from "@angular/forms";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {LanguageService} from "@app/services/language.service";
import {TagService} from "@app/services/tag.service";
import {map, startWith} from "rxjs/operators";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";

@Component({
  selector: 'app-filters-template',
  templateUrl: './filters-template.component.html',
  styleUrls: ['./filters-template.component.css']
})
export class FiltersTemplateComponent implements OnInit {
  filter: string = '';
  searchBy = [
    {value: 'Title', label: 'Title'},
    {value: 'Author', label: 'Author'},
  ];
  searchLanguage: Language[] = [
    LAN_ALL_FILTER,
  ];
  tagList: Tag[] = [];
  exampleTagsList: {tag: Tag, selected: boolean}[] = [];
  tagSelected: Set<string> = new Set<string>();
  filteredTags: Observable<Tag[]>;
  searchFilter: string = '';

  selectedSearch: string = 'Title';
  selectedLanguage: string = 'all';

  tagCtrl = new FormControl('');
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement> | undefined;

  subscriptionLanguage: Subscription | undefined;
  subscriptionTag: Subscription | undefined;

  @Output()
  filterChanged = new EventEmitter<{searchFilter: string, tagSelected: Set<string>, selectedLanguage: string, selectedSearch: string}>();



  /**
   * This is a constructor function that initializes variables and sets up an observable for filtering tags.
   * @param {ActivatedRoute} activatedRoute
   * @param {Router} router
   * @param {Location} location
   * @param {LanguageService} languageService
   * @param {TagService} tagService
   */
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private location: Location,
              private languageService: LanguageService,
              private tagService: TagService) {
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => (tag ? this._filterNotNull(tag) : this._filterNull())),
    );
  }

  /**
   * The ngOnInit function initializes various variables and subscriptions for a component in a TypeScript Angular
   * application.
   */
  ngOnInit(): void {
    if(this.activatedRoute.snapshot.params['tagSelected']){
      this.tagSelected = ( new Set<string>(this.activatedRoute.snapshot.params['tagSelected']?.split('|')) || new Set<string>());
    }

    this.searchFilter = ( this.activatedRoute.snapshot.params['searchFilter'] || "" );
    this.selectedSearch = ( this.activatedRoute.snapshot.params['selectedSearch'] || "Title" );

    this.languageService.getLanguages();
    this.subscriptionLanguage = this.languageService.languages.subscribe((value) => {
      if(value){
        this.searchLanguage = this.searchLanguage.concat(value);
      }
    });

    this.tagService.getTags();
    this.subscriptionTag = this.tagService.tags.subscribe((value) => {
      if(value){
        this.tagList = value;
        this.updateExampleTagsList();
      }
    });
    this.selectedLanguage = this.activatedRoute.snapshot!.params['language'];
    this.emitFilterChange();
  }

  /**
   * This function updates a list of example tags by selecting the first 50 tags from a tag list and checking if they are
   * already selected.
   */
  updateExampleTagsList() {
    this.exampleTagsList = this.tagList.slice(0,50).map(tag => {
      const selected: boolean = this.tagSelected.has(tag.name);
      return {tag: tag, selected: selected};
    });
  }

  /**
   * This function adds a new tag to a set, emits a filter change event, updates a list of example tags, clears the input
   * field, and sets the tag control value to null.
   * @param {MatChipInputEvent} event
   */
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tagSelected.add(value);
      this.emitFilterChange();
      this.updateExampleTagsList();
    }
    event.chipInput!.clear();

    this.tagCtrl.setValue(null);
  }

  /**
   * This function removes a tag from a set, emits a filter change event, updates a list of example tags, and sets the
   * value of a tag control to null.
   * @param {string} tag
   */
  remove(tag: string): void {
    this.tagSelected.delete(tag);
    this.emitFilterChange();
    this.updateExampleTagsList();
    this.tagCtrl.setValue(null);
  }

  /**
   * This function adds a selected tag to a set, emits a filter change event, updates a list of example tags, and resets
   * the value of a tag input field.
   * @param {MatAutocompleteSelectedEvent} event
   */
  selected(event: MatAutocompleteSelectedEvent): void {
    this.tagSelected.add(event.option.viewValue);
    this.emitFilterChange();
    this.updateExampleTagsList();
    // this.tagInput!.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  /**
   * The function calls the emitFilterChange method.
   */
  onSearchChange(){
    this.emitFilterChange();
  }
  /**
   * This function changes the language in the URL and emits a filter change event.
   */
  onLanguageChange(){
    const pathname: string = this.location.path();
    let filters;
    if(pathname.indexOf(';') >= 0){
      filters = pathname.slice(pathname.indexOf(';'));
    }
    let url = pathname.substring(0,pathname.indexOf('/', 1)) +
              '/'+this.selectedLanguage;
    if(filters) {url += filters;}
    this.location.replaceState(url);
    this.emitFilterChange();
  }
  /**
   * This function toggles the selection of a tag and updates the list of selected tags.
   * @param tag
   */
  onTagClick(tag: {tag: Tag, selected: boolean}){
    if(tag.selected){this.tagSelected.delete(tag.tag.name);}
    else {this.tagSelected.add(tag.tag.name);}
    this.updateExampleTagsList();
    this.emitFilterChange();
  }
  /**
   * The function clears selected tags, updates the example tags list, and emits a filter change event.
   */
  onClearClick(){
    Array.from(this.tagSelected).forEach((tag)=>this.remove(tag));
    this.updateExampleTagsList();
    this.emitFilterChange();
  }

  /**
   * This function emits an event with filter parameters.
   */
  private emitFilterChange(){
    this.filterChanged.emit({
      searchFilter: this.searchFilter,
      tagSelected: this.tagSelected,
      selectedLanguage: this.selectedLanguage,
      selectedSearch: this.selectedSearch
    });
  }

  /**
   * This function filters a list of tags based on a given string value and returns only the tags that are not already
   * selected.
   * @param {string} value
   * @returns The `_filterNotNull` function is returning an array of `Tag` objects that match the search criteria.
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
   * It unsubscribes from the subscriptionLanguage.
   */
  ngOnDestroy(){
    this.subscriptionLanguage?.unsubscribe();
    this.subscriptionTag?.unsubscribe();
  }
}
