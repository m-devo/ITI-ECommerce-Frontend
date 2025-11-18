import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReviews } from './add-reviews';



describe('AddReviews', () => {
  let component: AddReviews;
  let fixture: ComponentFixture<AddReviews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddReviews]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddReviews);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
