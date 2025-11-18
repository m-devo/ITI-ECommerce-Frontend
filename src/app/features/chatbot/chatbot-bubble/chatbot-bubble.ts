import { Component, OnInit, inject, signal, ElementRef, ViewChild, AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

type ChatMessage = {
  sender: 'user' | 'bot';
  message: string;
  timestamp: Date;
};

type WSServerMessage = {
  type?: 'new_reply' | 'live_chat_started' | 'live_chat_ended' | 'live_chat_message';
  message: string;
  options?: string[];
  replyContent?: string;
  senderName?: string;
};

@Component({
  selector: 'app-chat-bubble',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    DatePipe
  ],
  templateUrl: './chatbot-bubble.html',
  styleUrl: './chatbot-bubble.css'
})

export class ChatBubble implements OnInit, AfterViewChecked, OnDestroy {

  private authService = inject(AuthService);

  isChatOpen = signal(false);
  isConnecting = signal(true);
  isTyping = signal(false);
  chatMessages = signal<ChatMessage[]>([]);
  chatOptions = signal<string[]>([]);

  private ws: WebSocket | null = null;
  private authSub: Subscription | null = null;
  private connectionTimer: any = null;

  messageForm = new FormGroup({
    message: new FormControl('', Validators.required)
  });

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  private shouldScroll = false;

  ngOnInit(): void {
  // listen to any change
    this.authSub = this.authService.currentUser$.subscribe(() => {
    //  if user state changed start a new connection

      if (this.ws) {
        // stop automatic try connection
        this.ws.onclose = null;
        this.ws.close();
      }
      // stop any old timer
      if (this.connectionTimer) {
        clearTimeout(this.connectionTimer);
      }
      // start a new connection if there is a token
      this.connect();
    });
  }

  ngOnDestroy(): void {
    if (this.authSub) this.authSub.unsubscribe();
    if (this.connectionTimer) clearTimeout(this.connectionTimer);
    if (this.ws) {
      this.ws.close();
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  connect(): void {
    this.isConnecting.set(true);
    const token = this.authService.getToken();

    let wsUrl = "ws://localhost:4000";

    if (token) {
      wsUrl += `?token=${token}`;
    }

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      this.isConnecting.set(false);
      console.log("Chat WebSocket Connected");
      if (this.connectionTimer) clearTimeout(this.connectionTimer);
    };

    this.ws.onmessage = (event) => {
      this.isTyping.set(false);
      const data: WSServerMessage = JSON.parse(event.data);

      let messageContent = data.message;

      if (data.type === 'new_reply' && data.replyContent) {
        messageContent = `${data.message}<br><strong class="font-medium">"${data.replyContent}"</strong>`;
      }

      if (data.type === 'live_chat_message' && data.senderName) {
         messageContent = `<span class="font-bold">${data.senderName}:</span> ${data.message}`;
      }

      this.chatMessages.update(msgs => [
        ...msgs,
        { sender: 'bot', message: messageContent, timestamp: new Date() }
      ]);

      if (data.options && data.options.length > 0) {
        this.chatOptions.set(data.options);
      }
      this.shouldScroll = true;
    };

    this.ws.onclose = () => {
      this.isConnecting.set(true);
      console.log("Chat WebSocket Disconnected. Retrying...");
      if (this.connectionTimer) clearTimeout(this.connectionTimer);
      this.connectionTimer = setTimeout(() => this.connect(), 3000);
    };

    this.ws.onerror = (err) => {
      this.isConnecting.set(true);
      console.error("Chat WebSocket Error:", err);
    };
  }

  sendMessage(): void {
    if (this.messageForm.invalid || !this.ws || this.chatOptions().length > 0) return;

    const message = this.messageForm.value.message!;
    this.ws.send(message);

    this.chatMessages.update(msgs => [
      ...msgs,
      { sender: 'user', message: message, timestamp: new Date() }
    ]);

    this.messageForm.reset();
    this.isTyping.set(true);
    this.shouldScroll = true;
  }

  sendOption(option: string): void {
    if (!this.ws) return;

    const optionNumber = option.split('.')[0];
    this.ws.send(optionNumber);

    this.chatMessages.update(msgs => [
      ...msgs,
      { sender: 'user', message: option, timestamp: new Date() }
    ]);

    this.chatOptions.set([]);
    this.isTyping.set(true);
    this.shouldScroll = true;
  }

  toggleChat(): void {
    this.isChatOpen.update(open => !open);
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) { }
  }
}
