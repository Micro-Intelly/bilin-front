import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonEditFormDialogComponent } from './common-edit-form-dialog.component';

describe('CommonEditFormDialogComponent', () => {
  let component: CommonEditFormDialogComponent;
  let fixture: ComponentFixture<CommonEditFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonEditFormDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonEditFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
