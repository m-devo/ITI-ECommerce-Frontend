import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-announcement-bar',
  standalone:true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './announcement-bar.html',
  styleUrl: './announcement-bar.css',
})
export class AnnouncementBar implements OnInit{
  @Input() featuredBook: any

  isVisible: boolean = false

ngOnInit(): void {
    const isBarClosed = localStorage.getItem("announcementBarClosed");
    if (isBarClosed !== "true") {
      this.isVisible = true;
    }
  }

  closeBar(): void {
    this.isVisible = false;
    localStorage.setItem("announcementBarClosed", "true");
  }
}
