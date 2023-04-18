import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeiresFormDialogComponent } from './seires-form-dialog.component';

describe('SeiresFormDialogComponent', () => {
  let component: SeiresFormDialogComponent;
  let fixture: ComponentFixture<SeiresFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeiresFormDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeiresFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
