import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostFormDialogComponent } from './post-form-dialog.component';

describe('PostFormDialogComponent', () => {
  let component: PostFormDialogComponent;
  let fixture: ComponentFixture<PostFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostFormDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
