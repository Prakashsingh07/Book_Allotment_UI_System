import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogService } from '../../../core/services/log.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="p-6 min-h-screen bg-gray-100">

    <h2 class="text-3xl font-bold mb-6 text-gray-800">
      📚 Allotted Books
    </h2>

    <!-- 🔍 SEARCH + FILTER -->
    <div class="bg-white p-4 rounded-xl shadow mb-6 flex flex-wrap gap-4">

      <!-- Search -->
      <input
        type="text"
        [(ngModel)]="searchText"
        placeholder="Search by book, user, email..."
        class="border p-2 rounded w-64" />

      <!-- Status Filter -->
      <select
        [(ngModel)]="selectedStatus"
        class="border p-2 rounded">

        <option value="">All Status</option>
        <option value="Allotted">Allotted</option>
        <option value="Revoked">Revoked</option>
        <option value="Overdue">Overdue</option>
      </select>

    </div>

    <!-- LOG LIST -->
    <div *ngFor="let log of paginatedLogs()"
         class="bg-white p-6 shadow rounded-xl mb-4 flex justify-between">

      <div>
        <p class="font-semibold text-lg">
          {{log.bookTitle}}
        </p>

        <p class="text-gray-600">
          👤 {{log.userName}} ({{log.userEmail}})
        </p>

        <p class="text-sm text-gray-500">
          📅 {{log.allotDate | date:'medium'}}
        </p>

        <span class="px-3 py-1 text-sm rounded-full"
              [ngClass]="{
                'bg-green-100 text-green-700': log.status === 'Allotted',
                'bg-red-100 text-red-700': log.status === 'Revoked',
                'bg-yellow-100 text-yellow-700': log.status === 'Overdue'
              }">
          {{log.status}}
        </span>
      </div>

      <div *ngIf="log.status === 'Allotted'">
        <button
          (click)="revoke(log.id)"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
          Revoke
        </button>
      </div>

    </div>

    <!-- 📄 PAGINATION -->
    <div class="flex justify-center gap-2 mt-6">

      <button
        (click)="previousPage()"
        [disabled]="currentPage === 1"
        class="px-4 py-2 bg-gray-300 rounded">
        Prev
      </button>

      <span class="px-4 py-2">
        Page {{currentPage}} / {{ totalPages() }}
      </span>

      <button
        (click)="nextPage()"
        [disabled]="currentPage === totalPages()"
        class="px-4 py-2 bg-gray-300 rounded">
        Next
      </button>

    </div>

  </div>
  `
})
export class LogsComponent implements OnInit {

  logs: any[] = [];
  searchText: string = '';
  selectedStatus: string = '';

  currentPage: number = 1;
  pageSize: number = 5;

  constructor(private logService: LogService) {}

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
    this.logService.getAllLogs()
      .subscribe(res => this.logs = res);
  }

  revoke(id: number) {
    if(confirm('Revoke this book?')) {
      this.logService.revokeBook(id)
        .subscribe(() => this.loadLogs());
    }
  }

  // 🔍 Filtered logs
  filteredLogs() {
    return this.logs.filter(log => {

      const matchesSearch =
        log.bookTitle?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        log.userName?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        log.userEmail?.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesStatus =
        !this.selectedStatus || log.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  // 📄 Pagination logic
  paginatedLogs() {
    const filtered = this.filteredLogs();
    const start = (this.currentPage - 1) * this.pageSize;
    return filtered.slice(start, start + this.pageSize);
  }

  totalPages() {
    return Math.ceil(this.filteredLogs().length / this.pageSize) || 1;
  }

  nextPage() {
    if(this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  previousPage() {
    if(this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
