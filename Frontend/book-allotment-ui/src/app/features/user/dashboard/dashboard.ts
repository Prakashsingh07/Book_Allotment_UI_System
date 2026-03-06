import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../../../core/services/book.service';
import { RequestService } from '../../../core/services/request.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">

    <!-- Welcome Section -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800">
        Welcome, {{ username }} 👋
      </h1>
      <p class="text-gray-600 mt-1">
        Explore and request your favorite books below.
      </p>
    </div>

    <!-- Books Heading -->
    <h2 class="text-2xl font-semibold text-indigo-700 mb-6 border-b pb-2">
      📚 Books Available
    </h2>

    <!-- Books Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

      <div *ngFor="let book of books"
        class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-6 flex flex-col justify-between">

        <div>

          <!-- Availability Badge -->
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-xl font-bold text-gray-800">
              {{book.title}}
            </h3>

            <span 
              *ngIf="book.availableQuantity > 0; else outOfStock"
              class="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
              Available
            </span>

            <ng-template #outOfStock>
              <span class="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-700">
                Out of Stock
              </span>
            </ng-template>

          </div>

          <p class="text-gray-600 mb-4">
            by {{book.author}}
          </p>

        </div>

        <button 
          (click)="request(book.id)"
          [disabled]="book.availableQuantity <= 0"
          class="mt-auto font-medium py-2 px-4 rounded-xl transition duration-300"
          [ngClass]="book.availableQuantity > 0 
            ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
            : 'bg-gray-300 text-gray-600 cursor-not-allowed'">
          Request Book
        </button>

      </div>

    </div>

  </div>
  `
})
export class UserDashboardComponent implements OnInit {

  books: any[] = [];
  username: string = '';

  constructor(
    private bookService: BookService,
    private requestService: RequestService
  ) {}

ngOnInit() {

  const token = localStorage.getItem('token');
  console.log("TOKEN:", token);

  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log("PAYLOAD:", payload);

    this.username =
  payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
  || 'User';
  }

  this.bookService.getBooks()
    .subscribe(res => this.books = res);
}

  request(bookId: number) {
    this.requestService.requestBook(bookId)
      .subscribe({
        next: () => alert("Request sent successfully!"),
        error: () => alert("Request failed")
      });
  }
}