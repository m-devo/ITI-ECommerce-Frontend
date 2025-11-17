import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookReviews } from './book-reviews';

describe('BookReviews', () => {
  let component: BookReviews;
  let fixture: ComponentFixture<BookReviews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookReviews]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookReviews);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
