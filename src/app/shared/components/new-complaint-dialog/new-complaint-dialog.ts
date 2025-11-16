import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormControl, Validators, FormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-new-complaint-dialog',
  standalone:true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './new-complaint-dialog.html',
  styleUrl: './new-complaint-dialog.css',
})
export class NewComplaintDialog {
complaintForm = new FormGroup({
    details: new FormControl('', [Validators.required, Validators.minLength(10)])
  });
public dialogRef = inject(MatDialogRef<NewComplaintDialog>);

  onSubmit(): void {
    if (this.complaintForm.valid) {
      this.dialogRef.close({ details: this.complaintForm.value.details });
    }
  }
}
