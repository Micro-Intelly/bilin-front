import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesFormDialogComponent } from './series-form-dialog.component';

describe('SeriesFormDialogComponent', () => {
  let component: SeriesFormDialogComponent;
  let fixture: ComponentFixture<SeriesFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeriesFormDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeriesFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
