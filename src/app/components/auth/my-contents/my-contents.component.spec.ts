import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyContentsComponent } from './my-contents.component';

describe('MyContentsComponent', () => {
  let component: MyContentsComponent;
  let fixture: ComponentFixture<MyContentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyContentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
