import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestFormDialogComponent } from './test-form-dialog.component';

describe('TestFormDialogComponent', () => {
  let component: TestFormDialogComponent;
  let fixture: ComponentFixture<TestFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestFormDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
