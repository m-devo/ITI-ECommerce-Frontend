import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


type DialogResult = {
  text: string;
  rating: number;
  audioFile?: File | null;
} | null;

@Component({
  selector: 'app-review-edit-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './review-edit-dialog.html',
  styleUrls: ['./review-edit-dialog.css'],
})


export class ReviewEditDialog {
  updatedText = '';
  updatedRating = 0;

  audioPreviewUrl: string | null = null;
  selectedFile: File | null = null;

  isRecording = false;
  mediaRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];

  constructor(
    public dialogRef: MatDialogRef<ReviewEditDialog, DialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snack: MatSnackBar
  ) {
    this.updatedText = data?.text ?? '';
    this.updatedRating = data?.rating ?? 0;

    if (data?.audioUrl) {
      this.audioPreviewUrl = data.audioUrl;
    }
  }

    private showError(msg: string) {
  this.snack.open(msg, 'Close', {
    duration:9000,
    panelClass: ['error-snackbar']
  });
}


  setRating(star: number) {
    this.updatedRating = star;
  }

  // Upload audio file
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      this.selectedFile = file;
      this.audioPreviewUrl = URL.createObjectURL(file);
    }
  }

  removeAudio() {
    if (this.audioPreviewUrl) URL.revokeObjectURL(this.audioPreviewUrl);
    this.audioPreviewUrl = null;
    this.selectedFile = null;
  }

  // Start recording audio
  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (e) =>
        this.audioChunks.push(e.data);

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.selectedFile = new File([blob], 'recording.wav', {
          type: 'audio/wav',
        });
        this.audioPreviewUrl = URL.createObjectURL(blob);
      };

      this.mediaRecorder.start();
      this.isRecording = true;
    } catch (err) {
      this.showError('Microphone access denied.');
      console.error(err);
    }
  }

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach((t) => t.stop());
      this.isRecording = false;
    }
  }

  save() {
    this.dialogRef.close({
      text: this.updatedText,
      rating: this.updatedRating,
      audioFile: this.selectedFile,
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
