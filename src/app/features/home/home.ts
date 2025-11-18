import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef, AfterViewInit, OnInit, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { BookCardComponent } from "../../shared/components/book-card/book-card.component";
import { CommonModule } from "@angular/common";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { QuickView } from "../../shared/components/quick-view/quick-view";
import { TrustBar } from "../../shared/components/trust-bar/trust-bar";
import { CartService } from "../../core/services/cart.service";
import { BookService } from "../../core/services/book.service";
import { AuthService } from "../../core/services/auth.service";
import { BehaviorSubject, catchError, map, Observable, of, switchMap } from "rxjs";
import { LayoutService } from "../../core/services/layout.service";

import { FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { RouterLink } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";


@Component({
  selector: "app-home",
  standalone:true,
  imports: [
    MatButtonModule,
    BookCardComponent,
    CommonModule,
    MatDialogModule,
    TrustBar,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./home.html",
  styleUrl: "./home.css",
})

export class Home implements OnInit{
//Registeration
  private fb = inject(FormBuilder);
// news service snackbar
  private snackBar = inject(MatSnackBar);

    constructor(
      public dialog: MatDialog,
      private cartService: CartService,
      private bookService: BookService,
      public authService: AuthService,
      private layoutService: LayoutService
    ) {}

 ///////////////////////////////////////////////////////
  // news service
  subscribeForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

    public homeData$!: Observable<any>;
    public featuredBook$!: Observable<any>;
    public bestSellers$!: Observable<any[]>;
    public categoriesSummary$!: Observable<any[] | null>;
    private categoryFilter$ = new BehaviorSubject<string>("All");
    public filteredBooks$!: Observable<any[]>;
    public activeCategory: string = "All";


  ngOnInit(): void {

    this.homeData$ = this.bookService.getHomePageData().pipe(
      map(response => response.data),
      catchError(error => of(null))
    );

    this.featuredBook$ = this.homeData$.pipe(
      map(data => data.featuredBook)
    );

    this.bestSellers$ = this.homeData$.pipe(
      map(data => data.bestSellers),
    );

    this.categoriesSummary$ = this.homeData$.pipe(
      map(data => data.categorySummary),
      catchError(error => of(null))
    );

    this.featuredBook$.subscribe(book => {
      console.log("Home: Sending book to LayoutService:", book);
      if (book) {
        this.layoutService.showAnnouncementBar(book);
      }
    });

  this.filteredBooks$ = this.categoryFilter$.pipe(
      switchMap(category => {
        if (category === "All") {

          return this.bookService.getPublicBooks({page:1, limit: 8 }).pipe(
            map(response => response.books)
          );

        } else {
          return this.bookService.getFilterdBooks({
            category: category,
            limit: 8
          }).pipe(
            map(response => response.data.books)
          );
        }
      })
    );
  }

  ngOnDestroy(): void {
    console.log("Home: Hiding bar (ngOnDestroy)");
    this.layoutService.hideAnnouncementBar();
  }

  changeCategory(category: string): void {
    this.activeCategory = category;
    this.categoryFilter$.next(category);
  }

  onQuickView(book: any): void {
    console.log("Quick View clicked for:", book.title);

    this.dialog.open(QuickView, {
      data: book,
      width: "90vw",
      maxWidth: "900px",
      panelClass: "quick-view-dialog"
    });
  }

  onAddToCart(book: any): void {
    this.cartService.addItem(book)
  }

  public encodeImageUrl(url: string): string {
    if (!url) {
      return "";
    }
    return encodeURI(url);
  }

  onSubscribe(): void {
    if (this.subscribeForm.invalid) {
      this.snackBar.open('Please enter a valid email address.', 'Close', { duration: 3000 });
      return;
    }

    const email = this.subscribeForm.value.email as string;

    this.bookService.subscribeToNewsletter(email).subscribe({
      next: (response) => {
        this.snackBar.open(response.message, 'OK', {
          duration: 3000,
          panelClass: ['bg-green-500', 'text-white']
        });
        this.subscribeForm.reset();
      },
      error: (err) => {
        this.snackBar.open(err.error.message, 'Close', {
          duration: 3000,
          panelClass: ['bg-red-500', 'text-white']
        });
      }
    });
  }
}

