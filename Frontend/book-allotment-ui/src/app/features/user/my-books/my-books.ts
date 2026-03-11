import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { LogService } from '../../../core/services/log.service';
import { RequestService } from '../../../core/services/request.service';

@Component({
  standalone: true,
  imports: [CommonModule, NgClass],
  template: `

  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-8">

    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-800">
        📖 My Books
      </h2>
      <p class="text-gray-600 mt-1">
        View and manage your issued books
      </p>
    </div>

    <!-- Empty State -->
    <div *ngIf="logs.length === 0"
         class="bg-white p-8 rounded-2xl shadow text-center text-gray-500">
      You don’t have any books yet.
    </div>

    <!-- Books Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">

      <div *ngFor="let log of logs"

        class="bg-white rounded-xl shadow-md overflow-hidden
        transform transition duration-300 hover:-translate-y-2 hover:shadow-xl">

        <!-- Book Image -->
        <img
          [src]="log.imageUrl || 'https://via.placeholder.com/200x300?text=Book'"
          class="w-full h-56 object-cover"
        />

        <!-- Book Info -->
        <div class="p-4 flex flex-col">

          <h3 class="text-sm font-semibold text-gray-800">
            {{ log.bookTitle }}
          </h3>

          <!-- Status -->
          <span 
            [ngClass]="{
              'bg-green-100 text-green-700': log.status === 'Allotted',
              'bg-blue-100 text-blue-700': log.status === 'Returned',
              'bg-red-100 text-red-700': log.status === 'Revoked'
            }"
            class="mt-2 w-fit px-2 py-1 rounded text-xs font-semibold">
            {{ log.status }}
          </span>

          <!-- Return Button -->
          <button 
            *ngIf="log.status === 'Allotted'"
            (click)="returnBook(log.id)"
            class="mt-3 text-sm bg-indigo-600 hover:bg-indigo-700 
                   text-white py-2 rounded-lg transition">
            Return
          </button>

        </div>

      </div>

    </div>

  </div>

  `
})
export class MyBooksComponent implements OnInit {

  logs: any[] = [];

  constructor(
    private logService: LogService,
    private requestService: RequestService
  ) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.logService.getMyLogs()
      .subscribe(res => {
        console.log("Logs:", res); // ⭐ check if imageUrl exists
        this.logs = res;
      });
  }

  returnBook(allotmentId: number) {
    this.requestService.returnBook(allotmentId)
      .subscribe(() => {

        this.logs = this.logs.map(log =>
          log.id === allotmentId
            ? { ...log, status: 'Returned' }
            : log
        );

      });
  }
}
