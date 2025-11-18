import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-trust-bar',
  standalone:true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './trust-bar.html',
  styleUrl: './trust-bar.css',
})
export class TrustBar {
  constructor() {}

}
