import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AdminlayoutComponent } from '../adminlayout/adminlayout.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-book-management',
  standalone: true,
  imports: [CommonModule,
      RouterModule,AdminlayoutComponent],
  templateUrl: './book-management.component.html',
  styleUrl: './book-management.component.css'
})
export class BookManagementComponent {

}
