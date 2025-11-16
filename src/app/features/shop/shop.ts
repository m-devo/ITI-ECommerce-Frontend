import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BookService } from '../../core/services/book.service';
import { BookCardComponent } from '../../shared/components/book-card/book-card.component';
import { QuickView } from '../../shared/components/quick-view/quick-view';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, catchError} from 'rxjs/operators';
import { Subscription, forkJoin, of } from 'rxjs';
import { MatDivider } from "@angular/material/divider";

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    TitleCasePipe,
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    BookCardComponent,
    MatDivider
],
  templateUrl: './shop.html',
  styleUrl: './shop.css'
})
export class Shop implements OnInit {

  private bookService = inject(BookService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);

  isCategoryExpanded = signal(true);
  isAuthorExpanded = signal(true);
  isPriceExpanded = signal(true);

  totalBooks = signal(0)

  books = signal<any[]>([]);
  facets = signal<any>({});
  isLoading = signal(true);

  currentPage = signal(0);
  pageSize = signal(12);

  filterForm: FormGroup;
  sortControl = new FormControl('createdAt:desc');
  searchControl = new FormControl('');

constructor() {
  this.filterForm = new FormGroup({
    categories: new FormControl([]),
    authors: new FormControl([]),
    minPrice: new FormControl(null),
    maxPrice: new FormControl(null)
  });
}

  ngOnInit(): void {
    this.route.queryParams.pipe(
      debounceTime(50)
    ).subscribe(params => {
      if (params['category']) {
        this.filterForm.controls['categories'].setValue(params['category'].split(','), { emitEvent: false });
      } else {
        this.filterForm.controls['categories'].setValue([], { emitEvent: false });
      }

      if (params['author']) {
        this.filterForm.controls['authors'].setValue(params['author'].split(','), { emitEvent: false });
      } else {
        this.filterForm.controls['authors'].setValue([], { emitEvent: false });
      }
      if (params['minPrice']) {
          this.filterForm.controls['minPrice'].setValue(Number(params['minPrice']), { emitEvent: false });
        } else {
          this.filterForm.controls['minPrice'].setValue(null, { emitEvent: false });
        }

        if (params['maxPrice']) {
          this.filterForm.controls['maxPrice'].setValue(Number(params['maxPrice']), { emitEvent: false });
        } else {
          this.filterForm.controls['maxPrice'].setValue(null, { emitEvent: false });
        }
      if (params['sort']) {
        this.sortControl.setValue(params['sort'], { emitEvent: false });
      }

      if (params['page']) {
        this.currentPage.set(Number(params['page']) - 1);
      }

      if (params['search']) {
        this.searchControl.setValue(params['search'], { emitEvent: false });
      }

      this.loadBooks();
    });

    this.sortControl.valueChanges.subscribe(value => {
      this.updateQueryParams({ sort: value, page: 1 });
    });

    this.filterForm.valueChanges.pipe(
      debounceTime(300) //  300ms
    ).subscribe(values => {
      this.updateQueryParams({
        category: values.categories.join(',') || null,
        author: values.authors.join(',') || null,
        minPrice: values.minPrice || null,
        maxPrice: values.maxPrice || null,
        page: 1
      });
    });

  this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(value => {
      this.updateQueryParams({ search: value || null, page: 1 });
    });
  }
loadBooks(): void {
    this.isLoading.set(true);
    const currentParams = this.route.snapshot.queryParams;

    const filterKeys = Object.keys(currentParams).filter(key => key !== 'page');

    if (filterKeys.length === 0) {

      const booksRequest = this.bookService.getPublicBooks(currentParams).pipe(
        catchError(() => of({ books: [], totalBooks: 0 }))
      );

      const facetsRequest = this.bookService.getFilterdBooks({}).pipe(
        catchError(() => of({ data: { facets: {} } }))
      );

      forkJoin([booksRequest, facetsRequest]).subscribe(
        ([booksResponse, facetsResponse]) => {

          this.books.set(booksResponse.books || []);
          this.totalBooks.set(booksResponse.totalBooks || 0);

          this.facets.set(facetsResponse.data.facets || {});

          this.isLoading.set(false);
        }
      );

    }
    else {

      this.bookService.getFilterdBooks(currentParams).subscribe(response => {
        this.books.set(response.data.books);
        this.facets.set(response.data.facets);
        this.totalBooks.set(response.data.totalBooks);
        this.isLoading.set(false);
      });
    }
  }
  updateQueryParams(newParams: any): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: newParams,
      queryParamsHandling: 'merge'
    });
  }

  onQuickView(book: any): void {
    this.dialog.open(QuickView, {
      data: book,
      width: '80vw',
      maxWidth: '800px',
      panelClass: 'quick-view-dialog'
    });
  }
clearFilters(): void {
  this.searchControl.setValue('');
  this.filterForm.reset({
    categories: [],
    authors: [],
    minPrice: null,
    maxPrice: null
  });
}
  isCategorySelected(id: string): boolean {
  const currentCategories = this.filterForm.controls['categories'].value as string[];
  return currentCategories.includes(id);
}

onCategoryChange(event: Event, id: string): void {
  const input = event.target as HTMLInputElement;
  const currentCategories = [...this.filterForm.controls['categories'].value] as string[];

  if (input.checked) {
    if (!currentCategories.includes(id)) {
      currentCategories.push(id);
    }
  } else {
    const index = currentCategories.indexOf(id);
    if (index > -1) {
      currentCategories.splice(index, 1);
    }
  }

  this.filterForm.controls['categories'].setValue(currentCategories);
}

isAuthorSelected(id: string): boolean {
  const currentAuthors = this.filterForm.controls['authors'].value as string[];
  return currentAuthors.includes(id);
}

onAuthorChange(event: Event, id: string): void {
  const input = event.target as HTMLInputElement;
  const currentAuthors = [...this.filterForm.controls['authors'].value] as string[];

  if (input.checked) {
    if (!currentAuthors.includes(id)) {
      currentAuthors.push(id);
    }
  } else {
    const index = currentAuthors.indexOf(id);
    if (index > -1) {
      currentAuthors.splice(index, 1);
    }
  }
  this.filterForm.controls['authors'].setValue(currentAuthors);
}

isLastPage(): boolean {
  const totalPages = Math.ceil(this.totalBooks() / this.pageSize());
  return this.currentPage() + 1 >= totalPages;
}

goToPage(pageIndex: number): void {
  if (pageIndex < 0 || (pageIndex > 0 && this.isLastPage())) {
    return;
  }
  this.currentPage.set(pageIndex);
  this.updateQueryParams({ page: pageIndex + 1 });
}

totalPages(): number {
  return Math.ceil(this.totalBooks() / this.pageSize());
}
}
