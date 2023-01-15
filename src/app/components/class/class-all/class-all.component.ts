import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {FormControl} from "@angular/forms";
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Observable} from "rxjs";
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-class-all',
  templateUrl: './class-all.component.html',
  styleUrls: ['./class-all.component.css']
})
export class ClassAllComponent implements OnInit {
  filter: string = '';
  searchBy = [
    {value: 'Name', label: 'Name'},
    {value: 'Author', label: 'Author'},
  ];
  tagList = [
    't1','t2','t3'
  ];
  tagSelected: Set<string> = new Set<string>();
  filteredTags: Observable<string[]>;
  searchFilter: string = '';
  tabIndex: number = 1;

  selectedSearch: string = 'Name';
  tagCtrl = new FormControl('');
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement> | undefined;

  videos: Array<any> = [];
  pageV: number = 1;
  countV: number = 0; // puede indicar el total sin traer todo desde principio
  gridSizeV: number = 4;
  podcats: Array<any> = [];
  pageP: number = 1;
  countP: number = 0; // puede indicar el total sin traer todo desde principio
  gridSizeP: number = 4;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    if(activatedRoute.snapshot.params['tagSelected']){
      this.tagSelected = ( new Set<string>(activatedRoute.snapshot.params['tagSelected']?.split('|')) || new Set<string>());
    }
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => (tag ? this._filterNotNull(tag) : this._filterNull())),
    );
    this.searchFilter = ( activatedRoute.snapshot.params['searchFilter'] || "" );
    this.pageV = ( activatedRoute.snapshot.params['pageV'] || 1 );
    this.pageP = ( activatedRoute.snapshot.params['pageP'] || 1 );
    this.selectedSearch = ( activatedRoute.snapshot.params['selectedSearch'] || "Name" );
    this.tabIndex = ( activatedRoute.snapshot.params['tabIndex'] || 0 );
  }

  ngOnInit(): void {
    this.filter = this.activatedRoute.snapshot!.params['language'];
    this.videos = Array(150).fill(0).map((x, i) => ({ id: (i + 1), name: `Item ${i + 1}`}));
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tagSelected.add(value);
      this.keepFilters();
    }
    event.chipInput!.clear();

    this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
    this.tagSelected.delete(tag);
    this.keepFilters();
    this.tagCtrl.setValue(null);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tagSelected.add(event.option.viewValue);
    this.keepFilters();
    // this.tagInput!.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  onChangePageV(event: any) {
    this.pageV = event;
    this.keepFilters();
  }
  onChangePageP(event: any) {
    this.pageP = event;
    this.keepFilters();
  }
  onSearchChange(){
    this.keepFilters();
  }

  private keepFilters(){
    this.router.navigate(
      [
        {
          tagSelected: Array.from(this.tagSelected).join('|'),
          selectedSearch: this.selectedSearch,
          searchFilter: this.searchFilter,
          pageV: this.pageV,
          pageP: this.pageP,
          tabIndex: this.tabIndex
        }
      ],
      {
        relativeTo: this.activatedRoute,
        replaceUrl: true
      }
    );

    // document.title = `Search: ${ this.form.filter }`;
  }

  private _filterNotNull(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.tagList.filter(tag => (tag.toLowerCase().includes(filterValue) && !this.tagSelected.has(tag)));
  }
  private _filterNull(): string[] {
    return this.tagList.filter(tag => !this.tagSelected.has(tag));
  }
}
