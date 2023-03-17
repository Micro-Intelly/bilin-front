import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersTemplateComponent } from './filters-template.component';

describe('FiltersTemplateComponent', () => {
  let component: FiltersTemplateComponent;
  let fixture: ComponentFixture<FiltersTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltersTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltersTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
