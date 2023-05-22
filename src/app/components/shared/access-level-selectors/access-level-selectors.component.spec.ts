import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessLevelSelectorsComponent } from './access-level-selectors.component';

describe('AccessLevelSelectorsComponent', () => {
  let component: AccessLevelSelectorsComponent;
  let fixture: ComponentFixture<AccessLevelSelectorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessLevelSelectorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessLevelSelectorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
