import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReviewsService , Review } from '../../../core/services/reviews.service';
import { environment } from '../../../../environments/environment.prod';
import { CommonModule } from '@angular/common';


interface RatingDistribution {
  stars: number;
  count: number;
  percentage: number;
}

@Component({
  selector: 'app-add-reviews',
  standalone: true,
  imports: [FormsModule, CommonModule ],
  templateUrl: './add-reviews.html',
  styleUrl: './add-reviews.css',
})
export class AddReviews {
  
  @Input() bookId!: string;

  constructor(
    private reviewsService: ReviewsService,
    private http: HttpClient
  ) {}

  apiUrl = environment.apiUrl;

  // Form fields
  rating = 0;
  hoverRating = 0;
  //reviewTitle = '';
  reviewText = '';
  selectedFile: File | null = null;
  audioPreviewUrl: string | null = null;
  isRecording = false;
  mediaRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];

  // Stats
  // reviews: Review[] = [];
  averageRating = 0;
  totalReviews = 0;
  ratingDistribution: RatingDistribution[] = [];

  isLoading = false;
  isSubmitting = false;
  isTranscribing = false;


  // ⭐ RATING FUNCTIONS
  setRating(stars: number) {
    this.rating = stars;
  }

  setHoverRating(stars: number) {
    this.hoverRating = stars;
  }

  // 🎧 AUDIO UPLOAD
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      this.selectedFile = file;
      this.audioPreviewUrl = URL.createObjectURL(file);
    } else {
      alert('Please select a valid audio file');
    }
  }

  removeAudio() {
    if (this.audioPreviewUrl) URL.revokeObjectURL(this.audioPreviewUrl);
    this.selectedFile = null;
    this.audioPreviewUrl = null;
  }

  // 🎤 RECORDING
  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (e) => this.audioChunks.push(e.data);

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.selectedFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
        this.audioPreviewUrl = URL.createObjectURL(audioBlob);
      };

      this.mediaRecorder.start();
      this.isRecording = true;
    } catch (error) {
      console.error(error);
      alert('Microphone access denied.');
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(t => t.stop());
      this.isRecording = false;
    }
  }

  // 📩 SUBMIT REVIEW
  submitReview() {
    if (!this.rating) {
      alert('Please select a rating');
      return;
    }
    if (!this.reviewText.trim() && !this.selectedFile) {
      alert('Please write a review or upload audio');
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('book', this.bookId);
    formData.append('rating', this.rating.toString());
    formData.append('comment', this.reviewText);

    if (this.selectedFile) formData.append('audio', this.selectedFile);

    this.reviewsService.addReview(formData).subscribe({
      next: () => {
        this.resetForm();
        this.isSubmitting = false;
        alert('Review submitted successfully!');
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting = false;
        alert('Error submitting review');
      }
    });
  }

  resetForm() {
    this.rating = 0;
    this.reviewText = '';
    this.removeAudio();
  }


  formatDate(date: Date | string) {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
    // Get star array for template
  getStarArray() {
    return [1, 2, 3, 4, 5];
  }

  
}
