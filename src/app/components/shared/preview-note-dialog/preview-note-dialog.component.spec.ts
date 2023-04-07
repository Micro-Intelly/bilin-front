import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewNoteDialogComponent } from './preview-note-dialog.component';

describe('PreviewNoteDialogComponent', () => {
  let component: PreviewNoteDialogComponent;
  let fixture: ComponentFixture<PreviewNoteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewNoteDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewNoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
