import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../../core/services/book.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-10">

  <!-- Header + Filter -->
  <div class="mb-10 bg-white rounded-3xl shadow-xl p-8 flex justify-between items-center">

    <div>
      <h2 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 
                 bg-clip-text text-transparent">
        Manage Books
      </h2>
      <p class="text-gray-500 mt-2 text-lg">
        Add, update and manage book inventory
      </p>
    </div>

    <!-- Compact Category Filter -->
    <div class="flex items-center gap-3">

      <select [(ngModel)]="selectedCategory"
              class="px-3 py-2 rounded-lg border text-sm w-40
                     focus:ring-2 focus:ring-indigo-500 outline-none">
        <option value="">All</option>
        <option value="Fiction">Fiction</option>
        <option value="Technology">Technology</option>
        <option value="History">History</option>
        <option value="Science">Science</option>
      </select>

      <button
        (click)="clearFilter()"
        class="px-3 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600">
        Reset
      </button>

    </div>

  </div>

  <!-- Add Book -->
  <div class="bg-white rounded-3xl shadow-xl p-8 mb-10 border border-gray-100">
    <h3 class="text-xl font-semibold mb-6 text-gray-700">
      Add New Book
    </h3>

    <form #bookForm="ngForm">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-6">

        <input name="title" required
          [(ngModel)]="form.title"
          placeholder="Title"
          class="input-field"/>

        <input name="author" required
          [(ngModel)]="form.author"
          placeholder="Author"
          class="input-field"/>

        <input type="number" name="quantity" required min="1"
          [(ngModel)]="form.quantity"
          placeholder="Quantity"
          class="input-field"/>

        <select name="category"
          [(ngModel)]="form.category"
          class="input-field">
          <option value="">Select Category</option>
          <option value="Fiction">Fiction</option>
          <option value="Technology">Technology</option>
          <option value="History">History</option>
          <option value="Science">Science</option>
        </select>

        <input name="tags"
          [(ngModel)]="form.tags"
          placeholder="Tags (comma separated)"
          class="input-field"/>

        <div class="md:col-span-5">
          <button type="button"
            (click)="addBook()"
            [disabled]="bookForm.invalid"
            class="w-full py-3 rounded-xl text-white font-semibold
                   bg-gradient-to-r from-indigo-600 to-purple-600
                   hover:opacity-90 shadow-lg transition
                   disabled:opacity-50">
            Add Book
          </button>
        </div>

      </div>
    </form>
  </div>

  <!-- Books Table -->
  <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
    <table class="min-w-full">

      <thead class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <tr>
          <th class="px-6 py-4 text-left">Title</th>
          <th class="px-6 py-4 text-left">Author</th>
          <th class="px-6 py-4 text-left">Category</th>
          <th class="px-6 py-4 text-left">Tags</th>
          <th class="px-6 py-4 text-left">Qty</th>
          <th class="px-6 py-4 text-center">Actions</th>
        </tr>
      </thead>

      <tbody class="divide-y divide-gray-200">

        <tr *ngFor="let book of filteredBooks()"
            class="hover:bg-indigo-50 transition">

          <!-- Title -->
          <td class="px-6 py-4">
            <input *ngIf="editId === book.id"
              [(ngModel)]="book.title"
              class="input-edit"/>
            <span *ngIf="editId !== book.id">
              {{book.title}}
            </span>
          </td>

          <!-- Author -->
          <td class="px-6 py-4">
            <input *ngIf="editId === book.id"
              [(ngModel)]="book.author"
              class="input-edit"/>
            <span *ngIf="editId !== book.id">
              {{book.author}}
            </span>
          </td>

          <!-- Category -->
          <td class="px-6 py-4">
            <select *ngIf="editId === book.id"
              [(ngModel)]="book.category"
              class="input-edit">
              <option value="Fiction">Fiction</option>
              <option value="Technology">Technology</option>
              <option value="History">History</option>
              <option value="Science">Science</option>
            </select>

            <span *ngIf="editId !== book.id"
                  class="text-indigo-600 font-medium">
              {{book.category}}
            </span>
          </td>

          <!-- Tags -->
          <td class="px-6 py-4">
            <input *ngIf="editId === book.id"
              [(ngModel)]="book.tags"
              class="input-edit"/>

            <div *ngIf="editId !== book.id">
              <span *ngFor="let tag of book.tags?.split(',')"
                class="bg-gray-200 px-2 py-1 text-xs rounded mr-1">
                {{tag}}
              </span>
            </div>
          </td>

          <!-- Quantity -->
          <td class="px-6 py-4">
            <input *ngIf="editId === book.id"
              type="number"
              [(ngModel)]="book.quantity"
              class="input-edit"/>

            <span *ngIf="editId !== book.id">
              {{book.quantity}}
            </span>
          </td>

          <!-- Actions -->
          <td class="px-6 py-4 text-center space-x-2">

            <button *ngIf="editId !== book.id"
              (click)="startEdit(book.id)"
              class="btn-yellow">Edit</button>

            <button *ngIf="editId === book.id"
              (click)="updateBook(book)"
              class="btn-green">Save</button>

            <button *ngIf="editId === book.id"
              (click)="cancelEdit()"
              class="btn-gray">Cancel</button>

            <button (click)="delete(book.id)"
              class="btn-red">Delete</button>

          </td>

        </tr>

        <tr *ngIf="filteredBooks().length === 0">
          <td colspan="6" class="text-center py-8 text-gray-500">
            No books available
          </td>
        </tr>

      </tbody>
    </table>
  </div>

</div>
`,
styles: [`
  .input-field {
    width:100%;
    padding:12px;
    border-radius:12px;
    border:1px solid #ccc;
  }
  .input-edit {
    width:100%;
    padding:6px;
    border:1px solid #ccc;
    border-radius:6px;
  }
  .btn-yellow { background:#eab308; color:white; padding:6px 12px; border-radius:8px; }
  .btn-green { background:#16a34a; color:white; padding:6px 12px; border-radius:8px; }
  .btn-gray { background:#6b7280; color:white; padding:6px 12px; border-radius:8px; }
  .btn-red { background:#dc2626; color:white; padding:6px 12px; border-radius:8px; }
`]
})
export class ManageBooksComponent implements OnInit {

  books: any[] = [];
  editId: number | null = null;
  selectedCategory: string = '';

  form: any = {
    title: '',
    author: '',
    quantity: 1,
    category: '',
    tags: ''
  };

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getBooks()
      .subscribe(res => this.books = res);
  }

  filteredBooks() {
    if (!this.selectedCategory) {
      return this.books;
    }

    return this.books.filter(book =>
      book.category === this.selectedCategory
    );
  }

  clearFilter() {
    this.selectedCategory = '';
  }

  addBook() {
    if (!this.form.title || !this.form.author || this.form.quantity < 1) {
      return;
    }

    this.bookService.addBook(this.form)
      .subscribe(() => {
        this.form = {
          title: '',
          author: '',
          quantity: 1,
          category: '',
          tags: ''
        };
        this.loadBooks();
      });
  }

  startEdit(id: number) {
    this.editId = id;
  }

  cancelEdit() {
    this.editId = null;
    this.loadBooks();
  }

  updateBook(book: any) {
    this.bookService.updateBook(book.id, book)
      .subscribe(() => {
        this.editId = null;
        this.loadBooks();
      });
  }

  delete(id: number) {
    this.bookService.deleteBook(id)
      .subscribe(() => {
        this.books = this.books.filter(b => b.id !== id);
      });
  }
}