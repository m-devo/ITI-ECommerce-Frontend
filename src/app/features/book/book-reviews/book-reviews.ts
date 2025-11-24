import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';
import { ReviewsService, Review as ApiReviewResponse, ApiResponse } from '../../../core/services/reviews.service'
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import { ReviewEditDialog } from '../../book/review-edit-dialog/review-edit-dialog';
/**
 * Internal component Review shape (used by the template)
 * - we map backend ApiReviewResponse -> ComponentReview
 */
interface ComponentReview {
  _id: string;
  bookId: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  title?: string;
  comment: string;
  audioUrl?: string;
  transcription?: string;
  createdAt: string; // keep as string for template and formatDate
}

interface RatingDistribution {
  stars: number;
  count: number;
  percentage: number;
}

@Component({
  selector: 'app-book-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule,MatIconModule ],
  templateUrl: './book-reviews.html',
  styleUrl: './book-reviews.css',
})
export class BookReviewsComponent implements OnInit {
  @Input() bookId!: string;
  
  private originalReviews: ComponentReview[] = [];

  // state
  reviews: ComponentReview[] = [];
  displayedReviews: ComponentReview[] = []; // after filters/sort
  isLoading = false;


  // stats
  averageRating = 0;
  totalReviews = 0;
  ratingDistribution: RatingDistribution[] = [];
  get roundedRating() {
    return Math.round(this.averageRating || 0);
  }

  // filters/sort (bound to template if you enable UI)
  sortBy: 'recent' |'highest' | 'lowest' = 'recent';
  filterRating: 'all' | '1' | '2' | '3' | '4' | '5' = 'all';

  // housekeeping
  private apiUrl = environment.apiUrl;
  private destroy$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private reviewsService: ReviewsService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // fallback: try to get bookId from route if not provided as @Input
    if (!this.bookId) {
      this.bookId = this.route.snapshot.paramMap.get('id') || '';
    }

    if (this.bookId) {
      this.loadReviews();
    }
  }



  // -------------------------
  // Loading & mapping
  // -------------------------
  private mapApiReviewToComponent(r: ApiReviewResponse): ComponentReview {
    const userObj = (r as any).user || (r as any).userId || { _id: 'unknown', name: 'Anonymous' };
    const bookObj = (r as any).book || (r as any).bookId || { _id: this.bookId };

    return {
      _id: r._id,
      bookId: bookObj._id || (r as any).bookId || this.bookId,
      user: {
        _id: userObj._id,
        name: userObj.name || (userObj.email ? userObj.email.split('@')[0] : 'Anonymous'),
        avatar: (userObj as any).avatar || undefined,
      },
      rating: (r as any).rating ?? 0,
      title: (r as any).title ?? '',
      comment: (r as any).comment ?? '',
      audioUrl: (r as any).audioUrl ?? undefined,
      transcription: (r as any).transcription ?? undefined,
      createdAt: (r as any).createdAt ?? (r as any).createdAtString ?? new Date().toISOString(),
    };
  }

  loadReviews(): void {
    this.isLoading = true;

    // use ReviewsService which returns ApiResponse { data: Review[] }
    this.reviewsService
      .getReviewsByBook(this.bookId)
      .subscribe({
        next: (res: ApiResponse) => {
          // defensive: if backend returns ApiResponse, map its data; if it returns array directly handle both
          const rawData = (res && Array.isArray((res as any).data)) ? (res as any).data : (res as any);
          this.originalReviews = (rawData as ApiReviewResponse[]).map(r => this.mapApiReviewToComponent(r));
          this.totalReviews = this.originalReviews.length;
          this.calculateStats();
          this.applyFiltersAndSort();
          this.isLoading = false;
          console.log('Loaded originalReviews:', this.originalReviews);
        },
        error: (err) => {
          console.error('Error loading originalReviews:', err);
          this.originalReviews = [];
          this.totalReviews = 0;
          this.ratingDistribution = [];
          this.averageRating = 0;
          this.isLoading = false;
        },
      });
  }

  // -------------------------
  // Stats: average & distribution
  // -------------------------
  private calculateStats(): void {
    this.totalReviews = this.originalReviews.length;

    if (this.totalReviews === 0) {
      this.averageRating = 0;
      this.ratingDistribution = Array.from({ length: 5 }, (_, i) => ({
        stars: 5 - i,
        count: 0,
        percentage: 0,
      }));
      return;
    }

    const sum = this.originalReviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    this.averageRating = sum / this.totalReviews;

    const dist: RatingDistribution[] = [];
    for (let s = 5; s >= 1; s--) {
      const count = this.originalReviews.filter(r => Number(r.rating) === s).length;
      const percentage = this.totalReviews ? (count / this.totalReviews) * 100 : 0;
      dist.push({ stars: s, count, percentage: Math.round(percentage) }); // round % for easier style binding
    }
    this.ratingDistribution = dist;
  }


  
  // -------------------------
  // Filtering & Sorting (client-side)
  // -------------------------
  applyFilters(): void {
    // called by template when filter UI changes
    this.applyFiltersAndSort();
  }

  private applyFiltersAndSort(): void {
    // start from original originalReviews

    let list = [...this.originalReviews];

    // filter by rating
    if (this.filterRating !== 'all') {
      const r = Number(this.filterRating);
      list = list.filter(item => Number(item.rating) === r);
    }

    // sort
    switch (this.sortBy) {
    
      case 'highest':
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'lowest':
        list.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        break;
      case 'recent':
      default:
        list.sort((a, b) => {
          const da = new Date(a.createdAt).getTime();
          const db = new Date(b.createdAt).getTime();
          return db - da;
        });
        break;
    }

    this.displayedReviews = list;
    // the template currently iterates `reviews` — update it to use displayedReviews OR
    // overwrite reviews so template continues working:
    this.reviews = list;
  }


  // -------------------------
  // Template helpers
  // -------------------------
  getStarArray(): number[] {
    return [1, 2, 3, 4, 5];
  }

  formatDate(date: string | Date): string {
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return String(date);
    }
  }

  canEdit(review: ComponentReview): boolean {
  return this.reviewsService.isReviewOwner(review.user._id);
}
deleteReview(id: string) {
  const confirmDelete = confirm("Are you sure you want to delete this review?");
  if (!confirmDelete) return;

  this.reviewsService.deleteReview(id).subscribe({
    next: (res) => {
      if (res.success) { 
        this.snack.open('Review deleted successfully!', 'Close', {
          duration: 10000,
          panelClass: 'toast-success',
        });
        this.loadReviews();
      }
    },
    error: (err) => {
      this.snack.open('Failed to delete review!', 'Close', {
          duration: 10000,
          panelClass: 'toast-error',
        });
    }
  });
}



openEdit(review: ComponentReview){const dialogRef = this.dialog.open(ReviewEditDialog, {
    width: '500px',
    data: { text: review.comment, rating: review.rating, audioFile: review.audioUrl ? review.audioUrl : null },
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (!result) return; // cancel
        
    const form = new FormData();
    if (result.audioFile) {
  form.append('audio', result.audioFile);
}
    form.append('comment', result.text);
    form.append('rating', result.rating.toString());

    this.reviewsService.updateReview(review._id, form).subscribe({
      next: () => {
        this.snack.open('Review updated successfully!', 'Close', {
          duration: 10000,
          panelClass: 'toast-success',
        });
        this.loadReviews();
      },
      error: () => {
        this.snack.open('Failed to update review!', 'Close', {
          duration: 10000,
          panelClass: 'toast-error',
        });
      },
    });
  });
}


}
