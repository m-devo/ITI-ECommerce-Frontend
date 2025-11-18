import { CommonModule } from '@angular/common';
import { Component,HostListener } from '@angular/core';

@Component({
  selector: 'app-adminlayout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './adminlayout.component.html',
  styleUrl: './adminlayout.component.css'
})
export class AdminlayoutComponent {
 collapsed = false;
  dropdownOpen = false;

  admin = {
    name: 'Admin',
    profileImage: 'https://i.pravatar.cc/100'
  };

  links = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: '🏠' },
    { label: 'Books', path: '/admin/books', icon: '📚' },
    { label: 'Authors', path: '/admin/authors', icon: '✍️' },
    { label: 'Orders', path: '/admin/orders', icon: '📦' },
    { label: 'Users', path: '/admin/users', icon: '👥' },
    { label: 'Complaints', path: '/admin/complaints', icon: '🗣️' },
    { label: 'Live Chat', path: '/admin/chat', icon: '💬' },

  ];
    toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  scrolled = false;
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = typeof window !== 'undefined' && typeof window.scrollY === 'number' && window.scrollY > 30;
  }
}
