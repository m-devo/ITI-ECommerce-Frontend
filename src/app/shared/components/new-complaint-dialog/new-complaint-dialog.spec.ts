import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewComplaintDialog } from './new-complaint-dialog';

describe('NewComplaintDialog', () => {
  let component: NewComplaintDialog;
  let fixture: ComponentFixture<NewComplaintDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewComplaintDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewComplaintDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
