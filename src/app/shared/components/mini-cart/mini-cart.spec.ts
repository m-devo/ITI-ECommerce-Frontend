import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniCart } from './mini-cart';

describe('MiniCart', () => {
  let component: MiniCart;
  let fixture: ComponentFixture<MiniCart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniCart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiniCart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
