import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogService } from '../../../core/services/log.service';
import { RequestService } from '../../../core/services/request.service';

@Component({
  standalone: true,
  imports: [CommonModule],
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

    <!-- Book Cards -->
    <div class="grid md:grid-cols-2 gap-6">

      <div *ngFor="let log of logs"
           class="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100">

        <div class="flex justify-between items-center mb-4">

          <div>
            <h3 class="text-lg font-bold text-gray-800">
              {{ log.bookTitle }}
            </h3>
          </div>

          <!-- Status Badge -->
          <span 
            [ngClass]="{
              'bg-green-100 text-green-700': log.status === 'Allotted',
              'bg-blue-100 text-blue-700': log.status === 'Returned',
              'bg-red-100 text-red-700': log.status === 'Revoked'
            }"
            class="px-3 py-1 rounded-full text-xs font-semibold">
            {{ log.status }}
          </span>

        </div>

        <!-- Return Button -->
        <button 
          *ngIf="log.status === 'Allotted'"
          (click)="returnBook(log.id)"
          class="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 
                 text-white py-2 rounded-xl transition transform hover:scale-105">
          Return Book
        </button>

        <div *ngIf="log.status === 'Returned'"
             class="mt-4 text-green-600 font-semibold text-sm">
          ✔ Book successfully returned
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
      .subscribe(res => this.logs = res);
  }

  returnBook(allotmentId: number) {
    this.requestService.returnBook(allotmentId)
      .subscribe(() => {
        // Update instantly without refresh
        this.logs = this.logs.map(log =>
          log.id === allotmentId
            ? { ...log, status: 'Returned' }
            : log
        );
      });
  }
}