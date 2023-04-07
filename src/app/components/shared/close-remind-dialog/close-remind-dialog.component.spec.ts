import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseRemindDialogComponent } from './close-remind-dialog.component';

describe('CloseRemindDialogComponent', () => {
  let component: CloseRemindDialogComponent;
  let fixture: ComponentFixture<CloseRemindDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseRemindDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloseRemindDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
