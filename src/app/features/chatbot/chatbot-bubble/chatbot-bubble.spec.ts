import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotBubble } from './chatbot-bubble';

describe('ChatbotBubble', () => {
  let component: ChatbotBubble;
  let fixture: ComponentFixture<ChatbotBubble>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotBubble]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatbotBubble);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
