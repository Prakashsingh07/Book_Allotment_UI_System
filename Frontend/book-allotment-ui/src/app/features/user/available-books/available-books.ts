import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../../core/services/book.service';
import { RequestService } from '../../../core/services/request.service';
import { RatingService } from '../../../core/services/rating.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-6">

    <div class="mb-8 text-center">
      <h1 class="text-4xl font-extrabold text-white tracking-tight">📖 Book Library</h1>
      <p class="text-indigo-300 text-sm mt-2">Browse, request and rate your next great read</p>
    </div>

    <!-- Search + Filter Bar -->
    <div class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-4 mb-6 flex flex-col md:flex-row gap-3 items-center shadow-lg">
      <div class="relative flex-1 w-full">
        <span class="absolute inset-y-0 left-3 flex items-center text-indigo-300">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
          </svg>
        </span>
        <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="cdr.markForCheck()" placeholder="Search by title or author..."
               class="w-full pl-9 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-indigo-300
                      focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent">
      </div>
      <select [(ngModel)]="selectedCategory" (ngModelChange)="cdr.markForCheck()"
              class="px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full md:w-48">
        <option value="" class="text-gray-900">All Categories</option>
        <option value="Fiction" class="text-gray-900">Fiction</option>
        <option value="Technology" class="text-gray-900">Technology</option>
        <option value="History" class="text-gray-900">History</option>
        <option value="Science" class="text-gray-900">Science</option>
      </select>
      <label class="flex items-center gap-2 cursor-pointer text-sm text-indigo-200 whitespace-nowrap">
        <div class="relative">
          <input type="checkbox" [(ngModel)]="showOnlyAvailable" (ngModelChange)="cdr.markForCheck()" class="sr-only peer">
          <div class="w-10 h-5 bg-white/20 rounded-full peer-checked:bg-indigo-500 transition-colors"></div>
          <div class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5"></div>
        </div>
        Only Available
      </label>
      <button (click)="resetFilters()" class="px-4 py-2.5 bg-white/10 text-indigo-200 border border-white/20 rounded-xl text-sm hover:bg-white/20 transition whitespace-nowrap">
        Reset
      </button>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-gradient-to-br from-indigo-600/40 to-indigo-700/40 backdrop-blur-sm rounded-2xl border border-indigo-500/30 p-4 flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-indigo-500/30 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div><p class="text-xs text-indigo-300">Total Books</p><p class="text-2xl font-bold text-white">{{ books.length }}</p></div>
      </div>
      <div class="bg-gradient-to-br from-emerald-600/40 to-emerald-700/40 backdrop-blur-sm rounded-2xl border border-emerald-500/30 p-4 flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-emerald-500/30 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div><p class="text-xs text-emerald-300">Available</p><p class="text-2xl font-bold text-white">{{ availableCount() }}</p></div>
      </div>
      <div class="bg-gradient-to-br from-rose-600/40 to-rose-700/40 backdrop-blur-sm rounded-2xl border border-rose-500/30 p-4 flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-rose-500/30 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-rose-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div><p class="text-xs text-rose-300">Unavailable</p><p class="text-2xl font-bold text-white">{{ books.length - availableCount() }}</p></div>
      </div>
      <div class="bg-gradient-to-br from-purple-600/40 to-purple-700/40 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-4 flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-purple-500/30 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
        </div>
        <div><p class="text-xs text-purple-300">Showing</p><p class="text-2xl font-bold text-white">{{ filteredBooks().length }}</p></div>
      </div>
    </div>

    <!-- Loading -->
    <div *ngIf="loading" class="flex flex-col items-center justify-center py-24 gap-4">
      <div class="w-14 h-14 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-indigo-300 text-sm">Loading books...</p>
    </div>

    <!-- Books Grid -->
    <div *ngIf="!loading">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div *ngFor="let book of filteredBooks()"
             class="group relative bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md rounded-3xl border border-white/10
                    overflow-hidden hover:border-indigo-400/50 hover:shadow-2xl hover:shadow-indigo-500/20
                    hover:-translate-y-1 transition-all duration-300 flex flex-col">
          <div class="relative h-52 overflow-hidden flex-shrink-0">
            <div class="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"></div>
            <div class="absolute inset-0 opacity-20"
                 style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px);">
            </div>
            <img *ngIf="book.imageUrl" [src]="book.imageUrl"
                 class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="cover">
            <div *ngIf="!book.imageUrl" class="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-14 h-14 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span class="text-white/50 text-xs font-medium">No Cover</span>
            </div>
            <div class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent"></div>
            <span class="absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm"
                  [ngClass]="(book.availableQuantity ?? 0) > 0 ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white'">
              {{ (book.availableQuantity ?? 0) > 0 ? '✓ Available' : '✗ Unavailable' }}
            </span>
            <span *ngIf="book.category"
                  class="absolute bottom-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-black/40 text-white backdrop-blur-sm border border-white/20">
              {{ book.category }}
            </span>
          </div>
          <div class="p-5 flex flex-col flex-1">
            <h3 class="font-bold text-white text-base leading-tight line-clamp-2 group-hover:text-indigo-200 transition-colors">
              {{ book.title }}
            </h3>
            <p class="text-indigo-300/80 text-xs mt-1 truncate">by {{ book.author }}</p>
            <div class="my-3 border-t border-white/10"></div>
            <div class="mb-3">
              <div class="flex justify-between text-xs mb-1.5">
                <span class="text-white/50">Stock</span>
                <span class="font-bold" [ngClass]="(book.availableQuantity ?? 0) > 0 ? 'text-emerald-400' : 'text-rose-400'">
                  {{ book.availableQuantity ?? 0 }}/{{ book.quantity ?? 0 }} left
                </span>
              </div>
              <div class="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div class="h-2 rounded-full transition-all duration-500 shadow-sm"
                     [ngClass]="(book.availableQuantity ?? 0) > 0 ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : 'bg-gradient-to-r from-rose-400 to-red-500'"
                     [style.width]="getAvailabilityPercent(book) + '%'"></div>
              </div>
            </div>
            <div class="flex items-center justify-between mb-4">
              <div class="flex gap-0.5">
                <span *ngFor="let s of [1,2,3,4,5]" class="text-lg leading-none"
                      [ngClass]="s <= (bookRatings[book.id]?.averageRating ?? 0) ? 'text-yellow-400' : 'text-white/15'">★</span>
              </div>
              <span class="text-xs text-white/40">
                {{ bookRatings[book.id]?.averageRating ?? 0 }} · {{ bookRatings[book.id]?.totalReviews ?? 0 }} reviews
              </span>
            </div>
            <div class="mt-auto flex flex-col gap-2">
              <button (click)="requestBook(book)"
                      [disabled]="(book.availableQuantity ?? 0) === 0 || requestedBooks[book.id]"
                      class="w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
                      [ngClass]="{
                        'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-400 hover:to-purple-400 hover:shadow-lg hover:shadow-indigo-500/30': (book.availableQuantity ?? 0) > 0 && !requestedBooks[book.id],
                        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default': requestedBooks[book.id],
                        'bg-white/5 text-white/25 cursor-not-allowed border border-white/10': (book.availableQuantity ?? 0) === 0 && !requestedBooks[book.id]
                      }">
                <svg *ngIf="!requestedBooks[book.id] && (book.availableQuantity ?? 0) > 0" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <svg *ngIf="requestedBooks[book.id]" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ requestedBooks[book.id] ? 'Requested!' : (book.availableQuantity ?? 0) === 0 ? 'Out of Stock' : 'Request Book' }}
              </button>
              <button (click)="toggleRating(book.id)"
                      class="w-full py-2.5 rounded-xl text-sm font-semibold border border-white/10 text-white/60
                             hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-200
                             flex items-center justify-center gap-2">
                <span class="text-yellow-400">★</span>
                {{ activeRatingBookId === book.id ? 'Close' : 'Rate This Book' }}
              </button>
            </div>
            <div *ngIf="activeRatingBookId === book.id" class="mt-3 bg-white/5 rounded-2xl p-4 border border-white/10">
              <p class="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-3">Your Rating</p>
              <div class="flex gap-1.5 justify-center mb-3">
                <button *ngFor="let s of [1,2,3,4,5]"
                        (click)="setRating(book.id, s)"
                        class="text-3xl transition-all duration-150 hover:scale-125 focus:outline-none"
                        [ngClass]="s <= (pendingRatings[book.id]?.star ?? 0) ? 'text-yellow-400 drop-shadow-sm' : 'text-white/20 hover:text-yellow-300'">
                  ★
                </button>
              </div>
              <textarea [(ngModel)]="pendingRatings[book.id].review"
                        rows="2" placeholder="Write a short review (optional)..."
                        class="w-full text-xs bg-white/10 border border-white/10 rounded-xl px-3 py-2.5 resize-none
                               text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent">
              </textarea>
              <button (click)="submitRating(book.id)"
                      [disabled]="!pendingRatings[book.id]?.star"
                      class="mt-2.5 w-full py-2 rounded-xl text-xs font-bold transition-all duration-200"
                      [ngClass]="pendingRatings[book.id]?.star
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:opacity-90 shadow-md'
                        : 'bg-white/5 text-white/25 cursor-not-allowed'">
                Submit Rating ⭐
              </button>
              <p *ngIf="ratingMessages[book.id]" class="mt-2 text-xs text-center font-semibold"
                 [ngClass]="ratingMessages[book.id].success ? 'text-emerald-400' : 'text-rose-400'">
                {{ ratingMessages[book.id].text }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="filteredBooks().length === 0" class="flex flex-col items-center justify-center py-24 gap-4">
        <div class="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <p class="text-xl font-bold text-white/40">No books found</p>
        <p class="text-sm text-white/25">Try adjusting your search or filters.</p>
      </div>
    </div>

    <!-- Toast -->
    <div *ngIf="toast.show"
         class="fixed bottom-6 right-6 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-bold flex items-center gap-2.5 z-50 backdrop-blur-md border"
         [ngClass]="toast.success
           ? 'bg-emerald-600/90 text-white border-emerald-400/30 shadow-emerald-500/30'
           : 'bg-rose-600/90 text-white border-rose-400/30 shadow-rose-500/30'">
      <span class="text-base">{{ toast.success ? '✅' : '❌' }}</span>
      {{ toast.message }}
    </div>

  </div>
  `
})
export class AvailableBooksComponent implements OnInit {

  books: any[] = [];
  loading = true;
  searchQuery = '';
  selectedCategory = '';
  showOnlyAvailable = false;

  activeRatingBookId: number | null = null;
  bookRatings: { [bookId: number]: any } = {};
  pendingRatings: { [bookId: number]: { star: number; review: string } } = {};
  ratingMessages: { [bookId: number]: { text: string; success: boolean } } = {};
  requestedBooks: { [bookId: number]: boolean } = {};
  toast = { show: false, message: '', success: true };

  constructor(
    private bookService: BookService,
    private requestService: RequestService,
    private ratingService: RatingService,
    public cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.bookService.getBooks().subscribe({
      next: (res) => {
        this.books = res;
        this.loading = false;
        res.forEach(book => {
          this.pendingRatings[book.id] = { star: 0, review: '' };
          this.ratingService.getRatings(book.id).subscribe({
            next: (r) => { this.bookRatings[book.id] = r; this.cdr.markForCheck(); },
            error: () => {}
          });
        });
        this.cdr.markForCheck();
      },
      error: () => { this.loading = false; this.cdr.markForCheck(); }
    });
  }

  filteredBooks(): any[] {
    return this.books.filter(book => {
      const matchesSearch = !this.searchQuery ||
        book.title?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        book.author?.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = !this.selectedCategory || book.category === this.selectedCategory;
      const matchesAvailability = !this.showOnlyAvailable || (book.availableQuantity ?? 0) > 0;
      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }

  availableCount(): number { return this.books.filter(b => (b.availableQuantity ?? 0) > 0).length; }

  getAvailabilityPercent(book: any): number {
    if (!book.quantity || book.quantity === 0) return 0;
    return Math.round(((book.availableQuantity ?? 0) / book.quantity) * 100);
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.showOnlyAvailable = false;
    this.cdr.markForCheck();
  }

  requestBook(book: any): void {
    if ((book.availableQuantity ?? 0) === 0 || this.requestedBooks[book.id]) return;
    this.requestService.requestBook(book.id).subscribe({
      next: () => {
        this.requestedBooks[book.id] = true;
        this.showToast('Request sent successfully!', true);
      },
      error: () => this.showToast('Request failed. Please try again.', false)
    });
  }

  toggleRating(bookId: number): void {
    this.activeRatingBookId = this.activeRatingBookId === bookId ? null : bookId;
    if (!this.pendingRatings[bookId]) this.pendingRatings[bookId] = { star: 0, review: '' };
    delete this.ratingMessages[bookId];
    this.cdr.markForCheck();
  }

  setRating(bookId: number, star: number): void {
    if (!this.pendingRatings[bookId]) this.pendingRatings[bookId] = { star: 0, review: '' };
    this.pendingRatings[bookId].star = star;
    this.cdr.markForCheck();
  }

  submitRating(bookId: number): void {
    const pending = this.pendingRatings[bookId];
    if (!pending?.star) return;
    this.ratingService.submitRating(bookId, pending.star, pending.review).subscribe({
      next: () => {
        this.ratingMessages[bookId] = { text: '⭐ Rating submitted! Thank you', success: true };
        this.pendingRatings[bookId] = { star: 0, review: '' };
        this.ratingService.getRatings(bookId).subscribe(r => { this.bookRatings[bookId] = r; this.cdr.markForCheck(); });
        this.cdr.markForCheck();
        setTimeout(() => { this.activeRatingBookId = null; this.cdr.markForCheck(); }, 1500);
      },
      error: () => {
        this.ratingMessages[bookId] = { text: 'Failed to submit. Try again.', success: false };
        this.cdr.markForCheck();
      }
    });
  }

  showToast(message: string, success: boolean): void {
    this.toast = { show: true, message, success };
    this.cdr.markForCheck();
    setTimeout(() => { this.toast.show = false; this.cdr.markForCheck(); }, 3000);
  }
}
