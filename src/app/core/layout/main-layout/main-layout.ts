import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../../shared/components/header/header';
import { Footer } from '../../../shared/components/footer/footer';
import {MatDrawer, MatDrawerContainer, MatSidenavModule} from '@angular/material/sidenav';
import { MobileNav } from '../../../shared/components/mobile-nav/mobile-nav';
import { LayoutService } from '../../services/layout.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AnnouncementBar } from '../../../shared/components/announcement-bar/announcement-bar';
import { ChatBubble } from "../../../features/chatbot/chatbot-bubble/chatbot-bubble";

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    Header,
    Footer,
    MatSidenavModule,
    MobileNav,
    CommonModule,
    AnnouncementBar,
    ChatBubble
],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  @ViewChild('navDrawer') navDrawer!: MatDrawer;

public featuredBook$!: Observable<any | null>;

  constructor(private layoutService: LayoutService) {
    this.featuredBook$ = this.layoutService.featuredBook$;
  }
  toggleNavDrawer() : void {
    this.navDrawer.toggle()
  }
}
