import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbnailEditFormDialogComponent } from './thumbnail-edit-form-dialog.component';

describe('ThumbnailEditFormDialogComponent', () => {
  let component: ThumbnailEditFormDialogComponent;
  let fixture: ComponentFixture<ThumbnailEditFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThumbnailEditFormDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThumbnailEditFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
