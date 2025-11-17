import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AdminlayoutComponent } from '../adminlayout/adminlayout.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-authoradmin',
  standalone: true,
  imports: [CommonModule,
        RouterModule,AdminlayoutComponent],
  templateUrl: './authoradmin.component.html',
  styleUrl: './authoradmin.component.css'
})
export class AuthoradminComponent {

}
