import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAllComponent } from './test-all.component';

describe('TestAllComponent', () => {
  let component: TestAllComponent;
  let fixture: ComponentFixture<TestAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestAllComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
