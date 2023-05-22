import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrgUsersComponent } from './manage-org-users.component';

describe('ManageOrgUsersComponent', () => {
  let component: ManageOrgUsersComponent;
  let fixture: ComponentFixture<ManageOrgUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrgUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageOrgUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
