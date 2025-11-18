import { Component, inject } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogRef } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-prompt',
  standalone:true,
  imports: [MatDialogActions, MatDialogContent, MatIcon],
  templateUrl: './login-prompt.html',
  styleUrl: './login-prompt.css',
})
export class LoginPrompt {
private dialogRef = inject(MatDialogRef<LoginPrompt>);
  private router = inject(Router);

  onLogin(): void {
    this.dialogRef.close();
    this.router.navigate(['/login']);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
