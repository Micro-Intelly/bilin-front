import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewPdfDialogComponent } from './preview-pdf-dialog.component';

describe('PreviewPdfDialogComponent', () => {
  let component: PreviewPdfDialogComponent;
  let fixture: ComponentFixture<PreviewPdfDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewPdfDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewPdfDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
