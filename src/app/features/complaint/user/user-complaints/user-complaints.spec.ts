import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserComplaints } from './user-complaints';

describe('UserComplaints', () => {
  let component: UserComplaints;
  let fixture: ComponentFixture<UserComplaints>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserComplaints]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserComplaints);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
