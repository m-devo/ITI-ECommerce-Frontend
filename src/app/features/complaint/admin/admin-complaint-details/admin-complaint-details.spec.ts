import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComplaintDetails } from './admin-complaint-details';

describe('AdminComplaintDetails', () => {
  let component: AdminComplaintDetails;
  let fixture: ComponentFixture<AdminComplaintDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminComplaintDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminComplaintDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
