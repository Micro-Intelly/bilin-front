import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestResultDialogComponent } from './test-result-dialog.component';

describe('TestResultDialogComponent', () => {
  let component: TestResultDialogComponent;
  let fixture: ComponentFixture<TestResultDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestResultDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestResultDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
