import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassEpisodeComponent } from './class-episode.component';

describe('ClassEpisodeComponent', () => {
  let component: ClassEpisodeComponent;
  let fixture: ComponentFixture<ClassEpisodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassEpisodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassEpisodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
