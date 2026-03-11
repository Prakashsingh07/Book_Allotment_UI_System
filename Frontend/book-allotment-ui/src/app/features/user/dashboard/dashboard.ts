import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BookService } from '../../../core/services/book.service';
import { RequestService } from '../../../core/services/request.service';

@Component({
  standalone: true,
  imports: [CommonModule, NgClass],
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
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">

      <div *ngFor="let book of books"
        class="bg-white rounded-xl shadow-md overflow-hidden 
        transform transition duration-300 hover:-translate-y-3 hover:shadow-2xl 
        cursor-pointer flex flex-col">

        <!-- Book Image -->
        <img 
          [src]="book.imageUrl"
          (error)="setDefaultImage($event)"
          class="w-full h-64 object-cover"
        />

        <!-- Book Info -->
        <div class="p-4 flex flex-col flex-grow">

          <!-- Title -->
          <h3 class="text-sm font-semibold text-gray-800 line-clamp-2">
            {{ book.title }}
          </h3>

          <!-- Author -->
          <p class="text-xs text-gray-500 mt-1 mb-2">
            {{ book.author }}
          </p>

          <!-- ⭐ Rating Stars -->
          <div class="flex space-x-1 mb-2">
            <span
              *ngFor="let star of [1,2,3,4,5]"
              (click)="rateBook(book.id, star)"
              class="cursor-pointer text-yellow-400 text-lg hover:scale-125 transition">
              ★
            </span>
          </div>

          <!-- Availability -->
          <span
            *ngIf="book.availableQuantity > 0; else outStock"
            class="text-xs font-semibold px-2 py-1 rounded bg-green-100 text-green-700 w-fit">
            Available
          </span>

          <ng-template #outStock>
            <span class="text-xs font-semibold px-2 py-1 rounded bg-red-100 text-red-700 w-fit">
              Out of Stock
            </span>
          </ng-template>

          <!-- Request Button -->
          <button
            (click)="request(book.id)"
            [disabled]="book.availableQuantity <= 0"
            class="mt-auto mt-4 text-sm font-medium py-2 rounded-lg transition"
            [ngClass]="book.availableQuantity > 0
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'">

            Request Book

          </button>

        </div>

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
    private requestService: RequestService,
    private http: HttpClient
  ) {}

  ngOnInit() {

    const token = localStorage.getItem('token');

    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));

      this.username =
        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
        || 'User';
    }

    this.bookService.getBooks()
      .subscribe({
        next: (res:any) => {
          console.log("Books API:", res);
          this.books = res;
        }
      });
  }

  request(bookId: number) {
    this.requestService.requestBook(bookId)
      .subscribe({
        next: () => alert("Request sent successfully!"),
        error: () => alert("Request failed")
      });
  }

   rateBook(bookId:number, rating:number){

    this.http.post('https://localhost:7278/api/ratings',{
      bookId:bookId,
      rating:rating
    }).subscribe(()=>{
      alert("Rating submitted ⭐");
    })

  }

  setDefaultImage(event:any){
    event.target.src = 'https://via.placeholder.com/200x300?text=Book';
  }

}

