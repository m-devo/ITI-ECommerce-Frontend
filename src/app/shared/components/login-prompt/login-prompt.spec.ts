import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPrompt } from './login-prompt';

describe('LoginPrompt', () => {
  let component: LoginPrompt;
  let fixture: ComponentFixture<LoginPrompt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPrompt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginPrompt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
