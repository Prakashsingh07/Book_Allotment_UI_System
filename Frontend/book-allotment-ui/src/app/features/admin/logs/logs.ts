import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogService } from '../../../core/services/log.service';

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
      <div class="absolute -top-10 -right-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl"></div>
      <div class="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl"></div>
      <div class="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p class="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-1">Admin Panel</p>
          <h1 class="text-4xl font-extrabold text-white">Allotment Logs</h1>
          <p class="text-indigo-200/70 mt-1 text-sm">Full history of book allotments and returns</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="bg-white/10 border border-white/10 rounded-2xl px-5 py-3 text-center">
            <p class="text-white/40 text-xs">Total Records</p>
            <p class="text-white font-extrabold text-xl leading-none">{{ logs.length }}</p>
          </div>
          <div class="bg-emerald-500/15 border border-emerald-500/25 rounded-2xl px-5 py-3 text-center">
            <p class="text-emerald-300 text-xs">Allotted</p>
            <p class="text-emerald-400 font-extrabold text-xl leading-none">{{ countByStatus('Allotted') }}</p>
          </div>
          <div class="bg-rose-500/15 border border-rose-500/25 rounded-2xl px-5 py-3 text-center">
            <p class="text-rose-300 text-xs">Overdue</p>
            <p class="text-rose-400 font-extrabold text-xl leading-none">{{ countByStatus('Overdue') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search + Filter -->
    <div class="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 mb-6 shadow-xl
                flex flex-col md:flex-row items-start md:items-center gap-4">
      <div class="relative flex-1 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"
             fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" [(ngModel)]="searchText" placeholder="Search by book, user or email..."
               class="w-full bg-white/10 border border-white/10 text-white placeholder-white/30 rounded-xl
                      pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
      </div>
      <div class="flex gap-2 flex-wrap">
        <button *ngFor="let s of ['', 'Allotted', 'Revoked', 'Overdue']"
                (click)="selectedStatus = s; currentPage = 1"
                class="px-4 py-2 rounded-xl text-xs font-bold border transition-all"
                [ngClass]="selectedStatus === s
                  ? 'bg-indigo-500 text-white border-indigo-400'
                  : 'bg-white/10 text-white/50 border-white/10 hover:bg-white/15 hover:text-white'">
          {{ s || 'All' }}
        </button>
      </div>
    </div>

    <!-- Logs Table -->
    <div class="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-2xl">

      <div class="px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <h2 class="text-white font-bold">Transaction Log</h2>
          <p class="text-white/40 text-xs mt-0.5">{{ filteredLogs().length }} record{{ filteredLogs().length !== 1 ? 's' : '' }}</p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-white/10">
              <th class="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Book</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">User</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Allot Date</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-center text-xs font-bold text-white/40 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">

            <tr *ngFor="let log of paginatedLogs()"
                class="hover:bg-white/5 transition-colors"
                [class.bg-rose-500/5]="log.status === 'Overdue'">

              <!-- Book -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex-shrink-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <span class="font-semibold text-white text-sm">{{ log.bookTitle }}</span>
                </div>
              </td>

              <!-- User -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600
                              flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {{ log.userName?.charAt(0)?.toUpperCase() }}
                  </div>
                  <div>
                    <p class="text-white text-sm font-medium">{{ log.userName }}</p>
                    <p class="text-white/40 text-xs">{{ log.userEmail }}</p>
                  </div>
                </div>
              </td>

              <!-- Date -->
              <td class="px-6 py-4 text-sm text-white/50">
                {{ log.allotDate | date:'mediumDate' }}
              </td>

              <!-- Status -->
              <td class="px-6 py-4">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                      [ngClass]="{
                        'bg-emerald-500/15 text-emerald-400 border-emerald-500/25': log.status === 'Allotted',
                        'bg-rose-500/15 text-rose-400 border-rose-500/25': log.status === 'Revoked' || log.status === 'Overdue',
                        'bg-blue-500/15 text-blue-400 border-blue-500/25': log.status === 'Returned',
                        'bg-gray-500/15 text-gray-400 border-gray-500/25': log.status !== 'Allotted' && log.status !== 'Revoked' && log.status !== 'Overdue' && log.status !== 'Returned'
                      }">
                  <span class="w-1.5 h-1.5 rounded-full"
                        [ngClass]="{
                          'bg-emerald-400': log.status === 'Allotted',
                          'bg-rose-400': log.status === 'Revoked' || log.status === 'Overdue',
                          'bg-blue-400': log.status === 'Returned'
                        }"></span>
                  {{ log.status }}
                </span>
              </td>

              <!-- Action -->
              <td class="px-6 py-4 text-center">
                <button *ngIf="log.status === 'Allotted'"
                        (click)="revoke(log.id)"
                        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold mx-auto
                               bg-rose-500/15 text-rose-400 border border-rose-500/25 hover:bg-rose-500/25 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  Revoke
                </button>
                <span *ngIf="log.status !== 'Allotted'" class="text-white/20 text-xs italic">—</span>
              </td>

            </tr>

            <tr *ngIf="filteredLogs().length === 0">
              <td colspan="5" class="py-20 text-center">
                <div class="flex flex-col items-center gap-3">
                  <div class="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p class="text-white/30 font-semibold">No logs found</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-white/10 flex items-center justify-between">
        <p class="text-xs text-white/30">
          Page {{ currentPage }} of {{ totalPages() }}
        </p>
        <div class="flex items-center gap-2">
          <button (click)="previousPage()" [disabled]="currentPage === 1"
                  class="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 text-white/60 border border-white/10
                         hover:bg-white/15 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            ← Prev
          </button>
          <span class="px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/25">
            {{ currentPage }} / {{ totalPages() }}
          </span>
          <button (click)="nextPage()" [disabled]="currentPage === totalPages()"
                  class="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 text-white/60 border border-white/10
                         hover:bg-white/15 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            Next →
          </button>
        </div>
      </div>
    </div>
  </div>
  `
})
export class LogsComponent implements OnInit {
  logs: any[] = [];
  searchText = '';
  selectedStatus = '';
  currentPage = 1;
  pageSize = 8;
  toastMessage = '';
  toastSuccess = true;

  constructor(private logService: LogService) {}

  ngOnInit() { this.loadLogs(); }

  loadLogs() { this.logService.getAllLogs().subscribe(res => this.logs = res); }

  countByStatus(status: string) { return this.logs.filter(l => l.status === status).length; }

  showToast(message: string, success = true) {
    this.toastMessage = message; this.toastSuccess = success;
    setTimeout(() => this.toastMessage = '', 3000);
  }

  revoke(id: number) {
    if (confirm('Revoke this allotment?')) {
      this.logService.revokeBook(id).subscribe({
        next: () => { this.loadLogs(); this.showToast('Book revoked successfully.'); },
        error: () => this.showToast('Failed to revoke.', false)
      });
    }
  }

  filteredLogs() {
    return this.logs.filter(log => {
      const s = this.searchText.toLowerCase();
      const matchSearch = !s ||
        log.bookTitle?.toLowerCase().includes(s) ||
        log.userName?.toLowerCase().includes(s) ||
        log.userEmail?.toLowerCase().includes(s);
      const matchStatus = !this.selectedStatus || log.status === this.selectedStatus;
      return matchSearch && matchStatus;
    });
  }

  paginatedLogs() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredLogs().slice(start, start + this.pageSize);
  }

  totalPages() { return Math.ceil(this.filteredLogs().length / this.pageSize) || 1; }
  nextPage() { if (this.currentPage < this.totalPages()) this.currentPage++; }
  previousPage() { if (this.currentPage > 1) this.currentPage--; }
}
