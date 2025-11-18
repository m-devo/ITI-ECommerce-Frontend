import { Component, OnInit, HostListener } from '@angular/core';
import { SearchService , Book} from '../../../core/services/search.service'
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone:true,
  imports: [RouterModule, FormsModule , CommonModule],
  templateUrl: './search.html',
  styleUrls: ['./search.css']
})
export class SearchComponent implements OnInit {

  //
  searchQuery: string = '';
  books: any = [];
  // categories: string[] = ['All', 'Fiction', 'Database', 'History', 'Science', 'Self-help'];
  // selectedCategory: string = 'All';

  //
  showResults = false;
  isSearching = false;

  //
  private searchSubject = new Subject<string>();

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(query => {
        if (query.trim()) {
          this.fetchSuggestions(query);
        } else {
          this.books = [];
          this.showResults = false;
        }
      });
  }


  onSearchChange() {
    this.searchSubject.next(this.searchQuery);
  }


  onSearch() {
    if (!this.searchQuery.trim()) return;
    this.isSearching = true;
    this.showResults = true;

    this.searchService.basicSearch(this.searchQuery).subscribe({
      next: (response) => {
        this.books = response.data;
        this.isSearching = false;
        console.log(this.books);
      },
      error: () => {
        this.isSearching = false;
        this.books = [];
      }
    });
  }

  private fetchSuggestions(query: string) {
    this.isSearching = true;
    this.showResults = true;

    this.searchService.suggestSearch(query).subscribe({
      next: (res) => {
        this.books = res.data;
        this.isSearching = false;
        console.log(this.books);
      },
      error: () => {
        this.isSearching = false;
        this.books = [];
      }
    });
  }

  selectBook(book: any) {
    this.searchQuery = '';
    this.showResults = false;

  }

  // filterByCategory(category: string) {
  //   this.selectedCategory = category;
  //   this.searchQuery = '';
  //   this.onSearch();
  // }

  clearSearch() {
    this.searchQuery = '';
    this.books = [];
    this.showResults = false;
  }

  //
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.search-wrapper')) {
      this.showResults = false;
    }
  }
}
