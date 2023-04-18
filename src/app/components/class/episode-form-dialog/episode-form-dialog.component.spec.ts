import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodeFormDialogComponent } from './episode-form-dialog.component';

describe('EpisodeFormDialogComponent', () => {
  let component: EpisodeFormDialogComponent;
  let fixture: ComponentFixture<EpisodeFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EpisodeFormDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpisodeFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
