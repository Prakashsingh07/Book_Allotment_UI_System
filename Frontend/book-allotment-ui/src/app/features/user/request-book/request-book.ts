import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService, Book } from '../../../core/services/book.service';
import { RequestService } from '../../../core/services/request.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="p-6">

    <h2 class="text-2xl font-bold mb-6 text-green-600">
      Request Book
    </h2>

    <div *ngIf="books.length === 0" class="text-gray-500">
      No books available.
    </div>

    <div *ngFor="let book of books"
      class="bg-white p-4 shadow rounded-lg mb-4 border-l-4 border-green-500">

      <p><strong>Title:</strong> {{book.title}}</p>
      <p><strong>Author:</strong> {{book.author}}</p>
      <p><strong>Available:</strong> {{book.availableQuantity}}</p>

      <button 
        (click)="requestBook(book.id)"
        class="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Request Book
      </button>

    </div>

  </div>
  `
})
export class RequestBookComponent implements OnInit {

  books: Book[] = [];

  constructor(
    private bookService: BookService,
    private requestService: RequestService
  ) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getBooks()
      .subscribe(res => this.books = res);
  }

  requestBook(bookId: number) {
    this.requestService.requestBook(bookId)
      .subscribe({
        next: () => {
          alert("Request sent successfully!");
          this.loadBooks();   // refresh list
        },
        error: () => alert("Request failed")
      });
  }
}