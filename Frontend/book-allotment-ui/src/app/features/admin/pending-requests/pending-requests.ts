import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestService } from '../../../core/services/request.service';

@Component({
  standalone: true,
  imports: [CommonModule],
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
      <div class="absolute -top-10 -right-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl"></div>
      <div class="absolute -bottom-10 -left-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl"></div>
      <div class="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p class="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-1">Admin Panel</p>
          <h1 class="text-4xl font-extrabold text-white">Pending Requests</h1>
          <p class="text-indigo-200/70 mt-1 text-sm">Review and action book requests from users</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="bg-amber-500/15 border border-amber-500/25 rounded-2xl px-5 py-3 flex items-center gap-3">
            <div class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></div>
            <div>
              <p class="text-amber-300 text-xs">Awaiting Review</p>
              <p class="text-amber-400 font-extrabold text-2xl leading-none">{{ requests.length }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div *ngIf="loading" class="flex flex-col items-center justify-center py-24 gap-4">
      <div class="w-14 h-14 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-indigo-300 text-sm">Loading requests...</p>
    </div>

    <!-- Empty State -->
    <div *ngIf="!loading && requests.length === 0"
         class="flex flex-col items-center justify-center py-24 gap-4">
      <div class="w-24 h-24 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-emerald-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="text-xl font-bold text-white/30">All caught up!</p>
      <p class="text-sm text-white/20">No pending requests at this time.</p>
    </div>

    <!-- Request Cards -->
    <div *ngIf="!loading && requests.length > 0"
         class="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

      <div *ngFor="let req of requests"
           class="group relative bg-gradient-to-b from-white/8 to-white/4 backdrop-blur-md
                  rounded-3xl border border-white/10 overflow-hidden
                  hover:border-indigo-400/40 hover:shadow-2xl hover:shadow-indigo-500/10
                  hover:-translate-y-0.5 transition-all duration-300">

        <!-- Pending indicator stripe -->
        <div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"></div>

        <div class="p-6">

          <!-- Top: Avatar + Book info -->
          <div class="flex items-start gap-4 mb-5">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600
                        flex items-center justify-center text-lg font-extrabold text-white
                        flex-shrink-0 shadow-lg shadow-indigo-500/30">
              {{ req.userName?.charAt(0)?.toUpperCase() }}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-white text-base leading-snug truncate">{{ req.bookTitle }}</h3>
              <p class="text-white/50 text-sm mt-0.5">
                Requested by <span class="text-indigo-300 font-semibold">{{ req.userName }}</span>
              </p>
            </div>
            <span class="flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold
                         bg-amber-500/15 text-amber-400 border border-amber-500/25">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              Pending
            </span>
          </div>

          <!-- Meta info -->
          <div class="grid grid-cols-2 gap-3 mb-5">
            <div class="bg-white/5 rounded-xl p-3 border border-white/8">
              <p class="text-white/30 text-xs mb-1">Request Date</p>
              <p class="text-white/80 text-xs font-semibold">{{ req.requestDate | date:'mediumDate' }}</p>
            </div>
            <div class="bg-white/5 rounded-xl p-3 border border-white/8">
              <p class="text-white/30 text-xs mb-1">Time</p>
              <p class="text-white/80 text-xs font-semibold">{{ req.requestDate | date:'shortTime' }}</p>
            </div>
          </div>

          <!-- Divider -->
          <div class="w-full h-px bg-white/8 mb-5"></div>

          <!-- Action Buttons -->
          <div class="flex gap-3">
            <button (click)="approve(req.id)"
                    class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold
                           bg-emerald-500/15 text-emerald-400 border border-emerald-500/25
                           hover:bg-emerald-500 hover:text-white hover:border-emerald-500
                           hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Approve
            </button>
            <button (click)="reject(req.id)"
                    class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold
                           bg-rose-500/15 text-rose-400 border border-rose-500/25
                           hover:bg-rose-500 hover:text-white hover:border-rose-500
                           hover:shadow-lg hover:shadow-rose-500/30 transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reject
            </button>
          </div>

        </div>
      </div>

    </div>
  </div>
  `
})
export class PendingRequestsComponent implements OnInit {
  requests: any[] = [];
  loading = true;
  toastMessage = '';
  toastSuccess = true;

  constructor(private requestService: RequestService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.requestService.getPending().subscribe({
      next: (res) => { this.requests = res; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  showToast(message: string, success = true) {
    this.toastMessage = message; this.toastSuccess = success;
    setTimeout(() => this.toastMessage = '', 3000);
  }

  approve(id: number) {
    this.requestService.approve(id).subscribe({
      next: () => { this.requests = this.requests.filter(r => r.id !== id); this.showToast('Request approved!'); },
      error: () => this.showToast('Failed to approve.', false)
    });
  }

  reject(id: number) {
    this.requestService.reject(id).subscribe({
      next: () => { this.load(); this.showToast('Request rejected.'); },
      error: () => this.showToast('Failed to reject.', false)
    });
  }
}
