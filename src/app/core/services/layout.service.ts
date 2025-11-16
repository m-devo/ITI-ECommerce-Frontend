import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  private featuredBookSource = new BehaviorSubject<any | null>(null);

  public featuredBook$ = this.featuredBookSource.asObservable()

  constructor() { }

  showAnnouncementBar(book: any): void {
    console.log('LayoutService: Broadcasting book:', book);
    this.featuredBookSource.next(book)
  }

  hideAnnouncementBar(): void {
    console.log('LayoutService: Hiding bar (broadcasting null)');
    this.featuredBookSource.next(null)
  }
}
