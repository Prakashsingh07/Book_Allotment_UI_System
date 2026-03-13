import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogService } from '../../../core/services/log.service';
import { RequestService } from '../../../core/services/request.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-6">

    <div class="mb-8">
      <h1 class="text-4xl font-extrabold text-white tracking-tight">My Books 📖</h1>
      <p class="text-indigo-300 text-sm mt-2">Manage your currently issued and past books</p>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-gradient-to-br from-indigo-600/30 to-indigo-700/30 backdrop-blur-sm rounded-2xl border border-indigo-500/20 p-4 flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-indigo-500/30 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div>
          <p class="text-xs text-indigo-300">Total</p>
          <p class="text-2xl font-bold text-white">{{ logs.length }}</p>
        </div>
      </div>
      <div class="bg-gradient-to-br from-emerald-600/30 to-emerald-700/30 backdrop-blur-sm rounded-2xl border border-emerald-500/20 p-4 flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-emerald-500/30 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p class="text-xs text-emerald-300">Issued</p>
          <p class="text-2xl font-bold text-white">{{ countByStatus('Allotted') }}</p>
        </div>
      </div>
      <div class="bg-gradient-to-br from-blue-600/30 to-blue-700/30 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-4 flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-blue-500/30 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        <div>
          <p class="text-xs text-blue-300">Returned</p>
          <p class="text-2xl font-bold text-white">{{ countByStatus('Returned') }}</p>
        </div>
      </div>
      <div class="bg-gradient-to-br from-rose-600/30 to-rose-700/30 backdrop-blur-sm rounded-2xl border border-rose-500/20 p-4 flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-rose-500/30 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-rose-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div>
          <p class="text-xs text-rose-300">Revoked</p>
          <p class="text-2xl font-bold text-white">{{ countByStatus('Revoked') }}</p>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div *ngIf="loading" class="flex flex-col items-center justify-center py-24 gap-4">
      <div class="w-14 h-14 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-indigo-300 text-sm">Loading your books...</p>
    </div>

    <!-- Empty State -->
    <div *ngIf="!loading && logs.length === 0" class="flex flex-col items-center justify-center py-24 gap-4">
      <div class="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <p class="text-xl font-bold text-white/30">No books yet</p>
      <p class="text-sm text-white/20">Your issued books will appear here.</p>
    </div>

    <!-- Books Grid -->
    <div *ngIf="!loading && logs.length > 0"
         class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <div *ngFor="let log of logs"
           class="group relative bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md
                  rounded-3xl border border-white/10 overflow-hidden flex flex-col
                  hover:border-indigo-400/50 hover:shadow-2xl hover:shadow-indigo-500/20
                  hover:-translate-y-1 transition-all duration-300">
        <div class="relative h-52 overflow-hidden flex-shrink-0">
          <div class="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"></div>
          <div class="absolute inset-0 opacity-20"
               style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px);">
          </div>
          <img *ngIf="log.imageUrl" [src]="log.imageUrl"
               class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="cover">
          <div *ngIf="!log.imageUrl" class="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-14 h-14 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent"></div>
          <span class="absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm border"
                [ngClass]="{
                  'bg-emerald-500/80 text-white border-emerald-400/30': log.status === 'Allotted',
                  'bg-blue-500/80 text-white border-blue-400/30': log.status === 'Returned',
                  'bg-rose-500/80 text-white border-rose-400/30': log.status === 'Revoked'
                }">
            {{ log.status === 'Allotted' ? '✓ Issued' : log.status === 'Returned' ? '↩ Returned' : '✗ Revoked' }}
          </span>
        </div>
        <div class="p-4 flex flex-col flex-1">
          <h3 class="font-bold text-white text-sm leading-snug line-clamp-2 group-hover:text-indigo-200 transition-colors">
            {{ log.bookTitle }}
          </h3>
          <div class="mt-auto pt-4">
            <button *ngIf="log.status === 'Allotted'" (click)="returnBook(log.id)"
                    class="w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200
                           bg-gradient-to-r from-indigo-500 to-purple-500 text-white
                           hover:from-indigo-400 hover:to-purple-400
                           hover:shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              Return Book
            </button>
            <div *ngIf="log.status === 'Returned'"
                 class="w-full py-2.5 rounded-xl text-sm font-semibold text-center bg-blue-500/10 text-blue-400 border border-blue-500/20">
              ↩ Returned
            </div>
            <div *ngIf="log.status === 'Revoked'"
                 class="w-full py-2.5 rounded-xl text-sm font-semibold text-center bg-rose-500/10 text-rose-400 border border-rose-500/20">
              ✗ Revoked
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div *ngIf="toast.show"
         class="fixed bottom-6 right-6 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-bold
                flex items-center gap-2.5 z-50 backdrop-blur-md border"
         [ngClass]="toast.success ? 'bg-emerald-600/90 text-white border-emerald-400/30' : 'bg-rose-600/90 text-white border-rose-400/30'">
      {{ toast.success ? '✅' : '❌' }} {{ toast.message }}
    </div>

  </div>
  `
})
export class MyBooksComponent implements OnInit {

  logs: any[] = [];
  loading = true;
  toast = { show: false, message: '', success: true };

  constructor(
    private logService: LogService,
    private requestService: RequestService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.loadBooks(); }

  loadBooks() {
    this.logService.getMyLogs().subscribe({
      next: (res) => {
        this.logs = res;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  countByStatus(status: string): number {
    return this.logs.filter(l => l.status === status).length;
  }

  returnBook(allotmentId: number) {
    this.requestService.returnBook(allotmentId).subscribe({
      next: () => {
        this.logs = this.logs.map(log =>
          log.id === allotmentId ? { ...log, status: 'Returned' } : log
        );
        this.showToast('Book returned successfully!', true);
      },
      error: () => this.showToast('Return failed. Please try again.', false)
    });
  }

  showToast(message: string, success: boolean) {
    this.toast = { show: true, message, success };
    this.cdr.markForCheck();
    setTimeout(() => { this.toast.show = false; this.cdr.markForCheck(); }, 3000);
  }
}
