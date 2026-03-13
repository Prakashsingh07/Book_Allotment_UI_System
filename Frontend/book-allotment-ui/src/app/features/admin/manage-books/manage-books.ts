import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../../core/services/book.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-6">

    <!-- Toast -->
    <div *ngIf="toastMessage"
         class="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl
                backdrop-blur-md border text-sm font-bold"
         [ngClass]="toastSuccess ? 'bg-emerald-600/90 text-white border-emerald-400/30' : 'bg-rose-600/90 text-white border-rose-400/30'">
      {{ toastSuccess ? '✅' : '❌' }} {{ toastMessage }}
    </div>

    <!-- Header -->
    <div class="relative bg-gradient-to-r from-indigo-600/40 to-purple-600/40 backdrop-blur-md
                rounded-3xl border border-white/10 p-8 mb-8 overflow-hidden shadow-2xl">
      <div class="absolute -top-10 -right-10 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl"></div>
      <div class="absolute -bottom-10 -left-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl"></div>
      <div class="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p class="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-1">Admin Panel</p>
          <h1 class="text-4xl font-extrabold text-white">Manage Books</h1>
          <p class="text-indigo-200/70 mt-1 text-sm">Add, update and manage the book inventory</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="bg-white/10 border border-white/10 rounded-2xl px-5 py-3 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <div>
              <p class="text-white/40 text-xs">Total Books</p>
              <p class="text-white font-extrabold text-xl leading-none">{{ books.length }}</p>
            </div>
          </div>
          <!-- Category Filter -->
          <select [(ngModel)]="selectedCategory"
                  class="bg-white/10 border border-white/10 text-white rounded-xl px-4 py-3 text-sm
                         focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <option value="" class="bg-slate-800">All Categories</option>
            <option value="Fiction" class="bg-slate-800">Fiction</option>
            <option value="Technology" class="bg-slate-800">Technology</option>
            <option value="History" class="bg-slate-800">History</option>
            <option value="Science" class="bg-slate-800">Science</option>
          </select>
          <button (click)="clearFilter()"
                  class="px-4 py-3 rounded-xl text-sm font-bold bg-white/10 text-white/60 border border-white/10
                         hover:bg-white/15 hover:text-white transition-all">
            Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Add Book Form -->
    <div class="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 mb-8 shadow-xl">
      <div class="flex items-center gap-3 mb-5">
        <div class="w-9 h-9 rounded-xl bg-purple-500/30 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div>
          <h3 class="text-white font-bold">Add New Book</h3>
          <p class="text-white/40 text-xs">Fill in all required fields to add a book to inventory</p>
        </div>
      </div>

      <form #bookForm="ngForm">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div>
            <label class="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Title *</label>
            <input name="title" required [(ngModel)]="form.title" placeholder="Book title"
                   class="w-full bg-white/10 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm
                          focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Author *</label>
            <input name="author" required [(ngModel)]="form.author" placeholder="Author name"
                   class="w-full bg-white/10 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm
                          focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Quantity *</label>
            <input type="number" name="quantity" required min="1" [(ngModel)]="form.quantity" placeholder="1"
                   class="w-full bg-white/10 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm
                          focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Category</label>
            <select name="category" [(ngModel)]="form.category"
                    class="w-full bg-white/10 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option value="" class="bg-slate-800">Select category</option>
              <option value="Fiction" class="bg-slate-800">Fiction</option>
              <option value="Technology" class="bg-slate-800">Technology</option>
              <option value="History" class="bg-slate-800">History</option>
              <option value="Science" class="bg-slate-800">Science</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Tags</label>
            <input name="tags" [(ngModel)]="form.tags" placeholder="tag1, tag2"
                   class="w-full bg-white/10 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm
                          focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
        </div>
        <button type="button" (click)="addBook()" [disabled]="bookForm.invalid"
                class="w-full py-3 rounded-xl text-sm font-bold transition-all
                       bg-gradient-to-r from-indigo-500 to-purple-600 text-white
                       hover:from-indigo-400 hover:to-purple-500
                       shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40
                       disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Book to Inventory
        </button>
      </form>
    </div>

    <!-- Books Table -->
    <div class="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-2xl">

      <div class="px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <h2 class="text-white font-bold">Book Inventory</h2>
          <p class="text-white/40 text-xs mt-0.5">{{ filteredBooks().length }} book{{ filteredBooks().length !== 1 ? 's' : '' }} found</p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-white/10">
              <th class="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Title</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Author</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Category</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Tags</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Qty</th>
              <th class="px-6 py-4 text-center text-xs font-bold text-white/40 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">

            <tr *ngFor="let book of filteredBooks()" class="hover:bg-white/5 transition-colors">

              <!-- Title -->
              <td class="px-6 py-4">
                <ng-container *ngIf="editId !== book.id">
                  <span class="font-semibold text-white text-sm">{{ book.title }}</span>
                </ng-container>
                <ng-container *ngIf="editId === book.id">
                  <input [(ngModel)]="book.title"
                         class="bg-white/10 border border-indigo-400/50 text-white rounded-lg px-3 py-1.5 text-sm
                                focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full" />
                </ng-container>
              </td>

              <!-- Author -->
              <td class="px-6 py-4 text-sm text-white/60">
                <ng-container *ngIf="editId !== book.id">{{ book.author }}</ng-container>
                <ng-container *ngIf="editId === book.id">
                  <input [(ngModel)]="book.author"
                         class="bg-white/10 border border-indigo-400/50 text-white rounded-lg px-3 py-1.5 text-sm
                                focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full" />
                </ng-container>
              </td>

              <!-- Category -->
              <td class="px-6 py-4">
                <ng-container *ngIf="editId !== book.id">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold
                               bg-purple-500/15 text-purple-400 border border-purple-500/25">
                    {{ book.category || '—' }}
                  </span>
                </ng-container>
                <ng-container *ngIf="editId === book.id">
                  <select [(ngModel)]="book.category"
                          class="bg-slate-800 border border-indigo-400/50 text-white rounded-lg px-3 py-1.5 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                    <option value="Fiction">Fiction</option>
                    <option value="Technology">Technology</option>
                    <option value="History">History</option>
                    <option value="Science">Science</option>
                  </select>
                </ng-container>
              </td>

              <!-- Tags -->
              <td class="px-6 py-4">
                <ng-container *ngIf="editId !== book.id">
                  <div class="flex flex-wrap gap-1">
                    <span *ngFor="let tag of (book.tags || '').split(',')"
                          class="px-2 py-0.5 text-xs rounded-md bg-white/10 text-white/50 border border-white/10">
                      {{ tag.trim() }}
                    </span>
                  </div>
                </ng-container>
                <ng-container *ngIf="editId === book.id">
                  <input [(ngModel)]="book.tags"
                         class="bg-white/10 border border-indigo-400/50 text-white rounded-lg px-3 py-1.5 text-sm
                                focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full" />
                </ng-container>
              </td>

              <!-- Quantity -->
              <td class="px-6 py-4">
                <ng-container *ngIf="editId !== book.id">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold"
                        [ngClass]="book.quantity > 0
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/25'">
                    {{ book.quantity }}
                  </span>
                </ng-container>
                <ng-container *ngIf="editId === book.id">
                  <input type="number" [(ngModel)]="book.quantity"
                         class="bg-white/10 border border-indigo-400/50 text-white rounded-lg px-3 py-1.5 text-sm
                                focus:outline-none focus:ring-2 focus:ring-indigo-400 w-20" />
                </ng-container>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4">
                <div class="flex items-center justify-center gap-2">
                  <ng-container *ngIf="editId !== book.id">
                    <button (click)="startEdit(book.id)"
                            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold
                                   bg-amber-500/15 text-amber-400 border border-amber-500/25 hover:bg-amber-500/25 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button (click)="delete(book.id)"
                            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold
                                   bg-rose-500/15 text-rose-400 border border-rose-500/25 hover:bg-rose-500/25 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </ng-container>
                  <ng-container *ngIf="editId === book.id">
                    <button (click)="updateBook(book)"
                            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold
                                   bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Save
                    </button>
                    <button (click)="cancelEdit()"
                            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold
                                   bg-white/10 text-white/50 border border-white/10 hover:bg-white/15 transition-all">
                      Cancel
                    </button>
                  </ng-container>
                </div>
              </td>
            </tr>

            <tr *ngIf="filteredBooks().length === 0">
              <td colspan="6" class="py-20 text-center">
                <div class="flex flex-col items-center gap-3">
                  <div class="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <p class="text-white/30 font-semibold">No books found</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  `
})
export class ManageBooksComponent implements OnInit {
  books: any[] = [];
  editId: number | null = null;
  selectedCategory = '';
  toastMessage = '';
  toastSuccess = true;
  form: any = { title: '', author: '', quantity: 1, category: '', tags: '' };

  constructor(private bookService: BookService) {}

  ngOnInit() { this.loadBooks(); }

  loadBooks() { this.bookService.getBooks().subscribe(res => this.books = res); }

  filteredBooks() {
    return this.selectedCategory ? this.books.filter(b => b.category === this.selectedCategory) : this.books;
  }

  clearFilter() { this.selectedCategory = ''; }

  showToast(message: string, success = true) {
    this.toastMessage = message; this.toastSuccess = success;
    setTimeout(() => this.toastMessage = '', 3000);
  }

  addBook() {
    if (!this.form.title || !this.form.author || this.form.quantity < 1) return;
    this.bookService.addBook(this.form).subscribe({
      next: () => {
        this.form = { title: '', author: '', quantity: 1, category: '', tags: '' };
        this.loadBooks();
        this.showToast('Book added successfully!');
      },
      error: () => this.showToast('Failed to add book.', false)
    });
  }

  startEdit(id: number) { this.editId = id; }
  cancelEdit() { this.editId = null; this.loadBooks(); }

  updateBook(book: any) {
    this.bookService.updateBook(book.id, book).subscribe({
      next: () => { this.editId = null; this.loadBooks(); this.showToast('Book updated!'); },
      error: () => this.showToast('Failed to update book.', false)
    });
  }

  delete(id: number) {
    if (confirm('Delete this book?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => { this.books = this.books.filter(b => b.id !== id); this.showToast('Book deleted.'); },
        error: () => this.showToast('Failed to delete book.', false)
      });
    }
  }
}
