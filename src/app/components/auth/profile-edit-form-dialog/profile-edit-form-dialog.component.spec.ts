import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileEditFormDialogComponent } from './profile-edit-form-dialog.component';

describe('ProfileEditFormDialogComponent', () => {
  let component: ProfileEditFormDialogComponent;
  let fixture: ComponentFixture<ProfileEditFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileEditFormDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileEditFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
