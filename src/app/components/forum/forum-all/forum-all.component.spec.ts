import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumAllComponent } from './forum-all.component';

describe('ForumAllComponent', () => {
  let component: ForumAllComponent;
  let fixture: ComponentFixture<ForumAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForumAllComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForumAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
