import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsNotesListComponent } from './comments-notes-list.component';

describe('CommentsNotesListComponent', () => {
  let component: CommentsNotesListComponent;
  let fixture: ComponentFixture<CommentsNotesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentsNotesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentsNotesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
