import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassStreamComponent } from './class-stream.component';

describe('ClassStreamComponent', () => {
  let component: ClassStreamComponent;
  let fixture: ComponentFixture<ClassStreamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassStreamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
