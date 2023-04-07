import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsPostsListComponent } from './tests-posts-list.component';

describe('TestsPostsListComponent', () => {
  let component: TestsPostsListComponent;
  let fixture: ComponentFixture<TestsPostsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestsPostsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestsPostsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
