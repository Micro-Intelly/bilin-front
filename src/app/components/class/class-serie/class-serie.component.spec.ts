import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSerieComponent } from './class-serie.component';

describe('ClassSerieComponent', () => {
  let component: ClassSerieComponent;
  let fixture: ComponentFixture<ClassSerieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassSerieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassSerieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
