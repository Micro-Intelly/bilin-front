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

  updateExampleTagsList() {
    this.exampleTagsList = this.tagList.slice(0,50).map(tag => {
      const selected: boolean = this.tagSelected.has(tag.name);
      return {tag: tag, selected: selected};
    });
  }

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

  remove(tag: string): void {
    this.tagSelected.delete(tag);
    this.emitFilterChange();
    this.updateExampleTagsList();
    this.tagCtrl.setValue(null);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tagSelected.add(event.option.viewValue);
    this.emitFilterChange();
    this.updateExampleTagsList();
    // this.tagInput!.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  onSearchChange(){
    this.emitFilterChange();
  }
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
  onTagClick(tag: {tag: Tag, selected: boolean}){
    if(tag.selected){this.tagSelected.delete(tag.tag.name);}
    else {this.tagSelected.add(tag.tag.name);}
    this.updateExampleTagsList();
    this.emitFilterChange();
  }
  onClearClick(){
    Array.from(this.tagSelected).forEach((tag)=>this.remove(tag));
    this.updateExampleTagsList();
    this.emitFilterChange();
  }

  private emitFilterChange(){
    this.filterChanged.emit({
      searchFilter: this.searchFilter,
      tagSelected: this.tagSelected,
      selectedLanguage: this.selectedLanguage,
      selectedSearch: this.selectedSearch
    });
  }

  private _filterNotNull(value: string): Tag[] {
    const filterValue = value.toLowerCase();

    return this.tagList.filter(tag => (tag.name.toLowerCase().includes(filterValue) && !this.tagSelected.has(tag.name)));
  }
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
