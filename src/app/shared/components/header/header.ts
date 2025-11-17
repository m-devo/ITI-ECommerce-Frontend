import { AfterViewInit, Component, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { SearchModal } from '../search-modal/search-modal';
import {MatDividerModule} from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';


@Component({
  selector: 'app-header',
  standalone:true,
  imports: [
    RouterLink,
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    RouterLinkActive,
    CommonModule,
    MatDialogModule,
    MatMenuModule,
    MatDividerModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header{
  isLoggedIn: boolean = true;
  isAdmin: boolean = true;
  public isScrolled = false;

    constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    public cartService : CartService,
    private router: Router
  ) { }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const verticalOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = verticalOffset > 10;
    console.log('SCROLLING! isScrolled is now:', this.isScrolled);
  }
  @Output() toggleNav = new EventEmitter<void>()
  onToggleNav(): void {
    this.toggleNav.emit()
  }


  logout():void {
    this.authService.logout()
  }

  openSearchModal(): void {
    this.dialog.open(SearchModal, {
      width: '90vw',
      maxWidth: '600px',
      panelClass: 'search-modal-dialog'
    });
  }

  openCartModal() {
    this.cartService.openMiniCart()
  }

  isShopMenuOpen: boolean = false;

toggleShopMenu(): void {
  this.isShopMenuOpen = true;

  this.router.navigate(['/shop'], {
    queryParams: {}
    });
  }

}

