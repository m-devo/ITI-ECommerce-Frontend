import { Component, OnInit, inject, signal, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../../core/services/auth.service';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AdminlayoutComponent } from '../../admin/adminlayout/adminlayout.component';

type AdminWSMessage = {
  type: 'welcome_admin' |
  'new_chat_request' |
  'live_chat_started' |
  'live_chat_ended' |
  'live_chat_message' |
  'pairing_failed' |
  'error' |
  'info';
  message: string;
  data?: any;
  sender?: 'admin' | 'customer';
  senderName?: string;
};

type ChatMessage = {
  senderName: string;
  message: string;
  isUser: boolean;
};

type PendingUser = {
  customerId: string;
  customerName: string;
};

@Component({
  selector: 'app-admin-chat-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePipe,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatBadgeModule,
    AdminlayoutComponent
  ],
  templateUrl: './admin-chatboard.html',
  styleUrl: './admin-chatboard.css'
})

export class AdminChatboard implements OnInit, OnDestroy, AfterViewChecked {

  private authService = inject(AuthService);
  private ws: WebSocket | null = null;
  private authSub: Subscription | null = null;
  private connectionTimer: any = null;

  isConnecting = signal(true);

  pendingUsers = signal<PendingUser[]>([]);

  activeChat = signal<{
    customerId: string,
    customerName: string,
    messages: ChatMessage[]
  } | null>(null);

  chatForm = new FormGroup({
    message: new FormControl('')
  });

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  private shouldScroll = false;

  ngOnInit(): void {
    this.authSub = this.authService.authStatusChecked$.pipe(
      filter(isChecked => isChecked === true)
    ).subscribe(() => {
      this.connect();
    });
  }

  ngOnDestroy(): void {
    if (this.authSub) this.authSub.unsubscribe();
    if (this.connectionTimer) clearTimeout(this.connectionTimer);
    if (this.ws) this.ws.close();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  connect(): void {
    this.isConnecting.set(true);
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Admin Chat: No token found. Cannot connect.");
      this.isConnecting.set(false);
      return;
    }

    let wsUrl = `ws://localhost:4000?role=admin&token=${token}`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      this.isConnecting.set(false);
      console.log("Admin Chat WebSocket Connected");
    };

    this.ws.onmessage = (event) => {
      const data: AdminWSMessage = JSON.parse(event.data);
      console.log("Admin WS Message:", data);

      switch (data.type) {
        case 'new_chat_request':
          this.pendingUsers.update(users =>
            users.find(u => u.customerId === data.data.customerId) ? users : [...users, data.data]
          );
          break;

        case 'live_chat_started':
          this.activeChat.set({
            customerId: data.data.customerId,
            customerName: data.message.includes(data.data.customerId.substring(0, 4)) ?
            `User ${data.data.customerId.substring(0, 4)}` : data.message.split(' ')[2],
            messages: []
          });
          this.pendingUsers.update(users => users.filter(u => u.customerId !== data.data.customerId));
          break;

        case 'live_chat_message':
          if (this.activeChat() && data.sender === 'customer') {
            this.activeChat.update(chat => {
              chat!.messages.push({
                senderName: data.senderName || 'User',
                message: data.message,
                isUser: true
              });
              return chat;
            });
            this.shouldScroll = true;
          }
          break;

        case 'live_chat_ended':
          this.activeChat.set(null);
          this.chatForm.reset();
          break;

        case 'pairing_failed':
          if(data.message.includes("Another admin")) {
          }
          console.warn("Pairing failed:", data.message);
          break;
      }
    };

    this.ws.onclose = () => {
      this.isConnecting.set(true);
      console.log("Admin Chat WebSocket Disconnected. Retrying...");
      this.connectionTimer = setTimeout(() => this.connect(), 5000);
    };

    this.ws.onerror = (err) => {
      this.isConnecting.set(true);
      console.error("Admin Chat WebSocket Error:", err);
    };
  }


  acceptChat(customerId: string): void {
    if (!this.ws) return;

    this.ws.send(JSON.stringify({
      type: "admin_accept_chat",
      data: { customerId: customerId }
    }));
  }

  sendChatMessage(): void {
    const message = this.chatForm.value.message;
    if (!message || !this.ws || !this.activeChat()) return;

    this.ws.send(message);

    this.activeChat.update(chat => {
      chat!.messages.push({
        senderName: 'You (Support)',
        message: message,
        isUser: false
      });
      return chat;
    });

    this.chatForm.reset();
    this.shouldScroll = true;
  }

  endChat(): void {
    if (!this.ws || !this.activeChat()) return;

    this.ws.send("/endchat");

    this.activeChat.set(null);
    this.chatForm.reset();
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop
        = this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) { }
  }
}
