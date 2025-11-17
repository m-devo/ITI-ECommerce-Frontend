import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminlayoutComponent } from '../adminlayout/adminlayout.component';

@Component({
  selector: 'app-orderadmin',
  standalone: true,
  imports: [CommonModule,
          RouterModule,AdminlayoutComponent],
  templateUrl: './orderadmin.component.html',
  styleUrl: './orderadmin.component.css'
})
export class OrderadminComponent {

}
