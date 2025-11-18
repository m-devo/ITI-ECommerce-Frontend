import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewEditDialog } from './review-edit-dialog';



describe('ReviewEditDialog', () => {
  let component: ReviewEditDialog;
  let fixture: ComponentFixture<ReviewEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewEditDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewEditDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
