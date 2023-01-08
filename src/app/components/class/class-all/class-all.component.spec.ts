import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassAllComponent } from './class-all.component';

describe('ClassAllComponent', () => {
  let component: ClassAllComponent;
  let fixture: ComponentFixture<ClassAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassAllComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
