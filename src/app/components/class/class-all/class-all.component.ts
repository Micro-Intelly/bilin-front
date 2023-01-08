import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
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

  constructor(private route: ActivatedRoute) {
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => (tag ? this._filterNotNull(tag) : this._filterNull())),
    );
  }

  ngOnInit(): void {
    this.filter = this.route.snapshot!.params['language'];
    this.videos = Array(150).fill(0).map((x, i) => ({ id: (i + 1), name: `Item ${i + 1}`}));
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tagSelected.add(value);
    }
    event.chipInput!.clear();

    this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
    this.tagSelected.delete(tag);
    this.tagCtrl.setValue(null);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tagSelected.add(event.option.viewValue);
    // this.tagInput!.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  onChangePageV(event: any) {
    this.pageV = event;
  }
  onChangePageP(event: any) {
    this.pageP = event;
  }

  private _filterNotNull(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.tagList.filter(tag => (tag.toLowerCase().includes(filterValue) && !this.tagSelected.has(tag)));
  }
  private _filterNull(): string[] {
    return this.tagList.filter(tag => !this.tagSelected.has(tag));
  }
}
