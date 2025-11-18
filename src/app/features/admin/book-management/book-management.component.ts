import { CommonModule, NgIfContext } from '@angular/common';
import { Component, TemplateRef } from '@angular/core';
import { AdminlayoutComponent } from '../adminlayout/adminlayout.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../../core/services/books.service';
import { DashboardService } from '../../../core/services/dasboard.service';

export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  stock: number;
  bookPath: string;
  imagePath: string;
  category: string;
  isDeleted: boolean;
  updatedAt: string;
  averageRating: number;
  descriptionVector: any[];
  recommendedBooks: any[];
  reviewCount: number;
}

@Component({
  selector: 'app-book-management',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AdminlayoutComponent,
    HttpClientModule,
    FormsModule
  ],
  templateUrl: './book-management.component.html',
  styleUrl: './book-management.component.css'
})
export class BookManagementComponent {
  Books: Book[] = [];
  filteredBooks: Book[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedPrice: string = '';
  selectedStock: string = '';
  categories: string[] = ['General', 'Database',
    'Machine Learning', 'AI'];

  currentPage = 1;
  limit = 9;
  pages: number[] = [];
  totalPages = 0;
  totalBooks = 0;
  selectedBook: Book | null = null;
  Math: any;
  frontErrors: any = {};
  constructor(private bookService: BookService,
    private dashboardService: DashboardService
  ) { }

  ngOnInit() {
    this.fetchBooks();
  }
  generatePages() {
    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.fetchBooks();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchBooks();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchBooks();
    }
  }
  fetchBooks() {
    this.bookService.getBooks(this.currentPage, this.limit).subscribe({
      next: (res: any) => {
        this.Books = res.data.data;
        this.totalBooks = res.data.totalBooks;
        this.totalPages = res.data.totalPages;
        this.generatePages();
        this.applyFilters(); 

        console.log('Books:', this.Books);
        console.log('Total Books:', this.totalBooks);

        this.dashboardService.setTotalBooks(this.totalBooks);
        this.dashboardService.setFirst10Books(this.Books);
      },
      error: (err) => console.error('Error fetching books:', err)
    });
  }

  filterBooks() {
    const term = this.searchTerm.toLowerCase();

    this.filteredBooks = this.Books.filter(book =>
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term)
    );
  }
  applyFilters() {
    const term = this.searchTerm.toLowerCase();

    this.filteredBooks = this.Books.filter(book => {
      const matchesTerm = book.title.toLowerCase().includes(term) || book.author.toLowerCase().includes(term);

      const matchesCategory = this.selectedCategory ? book.category === this.selectedCategory : true;

      let matchesPrice = true;
      if (this.selectedPrice) {
        const [min, max] = this.selectedPrice.split('-').map(Number);
        matchesPrice = book.price >= min && book.price <= max;
      }

      let matchesStock = true;
      if (this.selectedStock === 'low') matchesStock = book.stock < 5;
      if (this.selectedStock === 'in') matchesStock = book.stock > 5;

      return matchesTerm && matchesCategory && matchesPrice && matchesStock;
    });
  }
  stars = [1, 2, 3, 4, 5];
  getStarClass(book: any, index: number) {
    return index < Math.floor(book.averageRating) ? 'checked' : '';
  }
  getCategoryClass(category: string): string {
    switch (category) {
      case 'General': return 'cat-general';
      case 'Database': return 'cat-database';
      case 'Machine Learning': return 'cat-machine';
      case 'AI': return 'cat-ai';
      default: return '';
    }
  }
  showModal: boolean = false;

  showBook(bookId: string) {
    const book = this.Books.find(b => b._id === bookId);
    if (book) {
      this.selectedBook = book;
      this.showModal = true;
    }
  }

  closeModal() {
    this.showModal = false;
    this.selectedBook = null;
  }

  editMode = false;
  editBookData: any = {};
  selectedBookId: string = "";

  openEditModel(req: any) {
    this.selectedBookId = req._id;
    this.editBookData = {
      title: req.title || '',
      price: req.price || '',
      stock: req.stock || '',
      category: req.category || '',
      description: req.description || '',
      author: req.author || '',
      bookPath: req.bookPath || '',
      imagePath: req.imagePath || ''

    };

    this.editMode = true;
  }


  saveBookEdits() {
    this.frontErrors = this.validateBookData(this.editBookData);
    if (Object.keys(this.frontErrors).length > 0) {
      return; // stop saving
    }

    const formData = new FormData();
    formData.append("title", this.editBookData.title);
    formData.append("author", this.editBookData.author);
    formData.append("price", this.editBookData.price);
    formData.append("stock", this.editBookData.stock);
    formData.append("description", this.editBookData.description);
    formData.append("category", this.editBookData.category);

    if (this.editBookData.imageFile)
      formData.append("image", this.editBookData.imageFile);

    if (this.editBookData.bookFile)
      formData.append("book", this.editBookData.bookFile);

    this.bookService.updateBooks(
      this.selectedBookId,
      formData
    ).subscribe({
      next: res => {
        this.editMode = false;
        this.fetchBooks();
      },
      error: err => {
        console.log(err);
        this.frontErrors = err.error?.errors || ["Update failed"];
      }
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.editBookData.imageFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.editBookData.imagePath = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onBookSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.editBookData.bookFile = file;
    this.editBookData.bookPath = file.name;
  }

  validateBookData(data: any) {
    const errors: any = {};

    if (data.title !== undefined && !data.title.trim() && data.title.length < 5) {
      errors.title = "Title cannot be empty and must be at least 5 characters long";
    }
    if (data.author !== undefined && !data.author.trim() && data.author.length < 2) {
      errors.author = "Author cannot be empty and must be at least 2 characters long";
    }

    if (data.description !== undefined && !data.description.trim() && data.description.length < 20) {
      errors.description = "Description cannot be empty and must be at least 20 characters long";
    }

    if (data.price !== undefined) {
      if (isNaN(data.price)) errors.price = "Price must be a number";
      else if (Number(data.price) <= 0)
        errors.price = "Price must be a positive number";
    }

    if (data.stock !== undefined) {
      if (isNaN(data.stock)) errors.stock = "Stock must be a number";
      else if (Number(data.stock) < 0)
        errors.stock = "Stock must be ≥ 0";
    }
    if (data.category !== undefined && !data.category.trim()) {
      errors.category = "Category cannot be empty";
    }

    const MAX_FILE_SIZE = 15 * 1024 * 1024 * 1024;

    if (data.bookPath && data.bookPath.size > MAX_FILE_SIZE)
      errors.push("Book file size exceeds 15GB");

    if (data.imagePath && data.imagePath.size > MAX_FILE_SIZE)
      errors.push("Image file size exceeds 15GB");


    return errors;
  }
  createMode = false;
  newBookData: any = {};

  openCreateModel() {
    this.newBookData = {
      title: '',
      price: '',
      stock: '',
      category: '',
      description: '',
      author: '',
      imageFile: null,
      bookFile: null
    };
    this.createMode = true;
  }
  onNewImageSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.newBookData.imageFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.newBookData.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
  onNewBookSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.newBookData.bookFile = file;
    this.newBookData.bookName = file.name;
  }
  saveNewBook() {
    this.frontErrors = this.validateBookData(this.newBookData);

    if (Object.keys(this.frontErrors).length > 0) {
      return;
    }

    const formData = new FormData();
    formData.append("title", this.newBookData.title);
    formData.append("author", this.newBookData.author);
    formData.append("price", this.newBookData.price);
    formData.append("stock", this.newBookData.stock);
    formData.append("description", this.newBookData.description);
    formData.append("category", this.newBookData.category);

    if (this.newBookData.imageFile)
      formData.append("image", this.newBookData.imageFile);

    if (this.newBookData.bookFile)
      formData.append("book", this.newBookData.bookFile);

    this.bookService.createBooks(formData).subscribe({
      next: (res) => {
        this.createMode = false;
        this.fetchBooks();
      },
      error: (err) => {
        console.log(err);
        this.frontErrors = err.error?.errors || ["Creation failed"];
      }
    });
  }

  deleteBook(req: any) {
    if (!confirm(`Are you want to delete book from ${req.title}?`)) return;
    this.bookService.deleteBooks(req._id).subscribe({
      next: (res) => {
        this.Books = this.Books.filter(u => u._id == req._id);
        console.log("user deleted");

        this.fetchBooks();
      },
      error: (err) => {
        console.error(err);

      }
    })
  }



}