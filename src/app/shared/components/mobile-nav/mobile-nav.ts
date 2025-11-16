import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../../core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { SearchModal } from '../search-modal/search-modal';

@Component({
  selector: 'app-mobile-nav',
  standalone:true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatListModule
  ],
  templateUrl: './mobile-nav.html',
  styleUrl: './mobile-nav.css',
})
export class MobileNav {
  public authService = inject(AuthService);
  public dialog = inject(MatDialog);

  constructor(){}

  logout() {
    this.authService.logout();
  }

  openSearchModal(): void {
    this.dialog.open(SearchModal, {
      width: '90vw',
      maxWidth: '600px',
      panelClass: 'search-modal-dialog'
    });
  }
}
