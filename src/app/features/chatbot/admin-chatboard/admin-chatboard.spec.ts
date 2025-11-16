import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminChatboard } from './admin-chatboard';

describe('AdminChatboard', () => {
  let component: AdminChatboard;
  let fixture: ComponentFixture<AdminChatboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminChatboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminChatboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
