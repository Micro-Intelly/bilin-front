import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageTagFormFieldComponent } from './language-tag-form-field.component';

describe('LanguageTagFormFieldComponent', () => {
  let component: LanguageTagFormFieldComponent;
  let fixture: ComponentFixture<LanguageTagFormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LanguageTagFormFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageTagFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
