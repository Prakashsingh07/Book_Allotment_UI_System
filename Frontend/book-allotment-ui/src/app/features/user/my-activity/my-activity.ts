import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-6">

    <div class="mb-8">
      <h1 class="text-4xl font-extrabold text-white tracking-tight">My Activity 📚</h1>
      <p class="text-indigo-300 text-sm mt-2">Track your borrowed books, due dates and fines</p>
    </div>

    <div *ngIf="loading" class="flex flex-col items-center justify-center py-24 gap-4">
      <div class="w-14 h-14 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-indigo-300 text-sm">Loading your activity...</p>
    </div>

    <ng-container *ngIf="!loading">

      <!-- Stats Row -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-gradient-to-br from-indigo-600/30 to-indigo-700/30 backdrop-blur-sm rounded-2xl border border-indigo-500/20 p-5 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-indigo-500/30 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <p class="text-xs text-indigo-300">Total</p>
            <p class="text-3xl font-extrabold text-white">{{ activity.length }}</p>
          </div>
        </div>
        <div class="bg-gradient-to-br from-emerald-600/30 to-emerald-700/30 backdrop-blur-sm rounded-2xl border border-emerald-500/20 p-5 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-xs text-emerald-300">Active</p>
            <p class="text-3xl font-extrabold text-white">{{ countByStatus('Active') }}</p>
          </div>
        </div>
        <div class="bg-gradient-to-br from-rose-600/30 to-rose-700/30 backdrop-blur-sm rounded-2xl border border-rose-500/20 p-5 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-rose-500/30 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-rose-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-xs text-rose-300">Overdue</p>
            <p class="text-3xl font-extrabold text-white">{{ countByStatus('Overdue') }}</p>
          </div>
        </div>
        <div class="bg-gradient-to-br from-amber-600/30 to-amber-700/30 backdrop-blur-sm rounded-2xl border border-amber-500/20 p-5 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-amber-500/30 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-amber-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-xs text-amber-300">Total Fine</p>
            <p class="text-3xl font-extrabold text-white">₹{{ totalFine() }}</p>
          </div>
        </div>
      </div>

      <!-- Table Card -->
      <div class="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div class="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 class="text-white font-bold">Transaction History</h2>
            <p class="text-white/40 text-xs mt-0.5">All your book borrowing records</p>
          </div>
          <div class="text-xs text-white/30 font-medium">
            {{ activity.length }} record{{ activity.length !== 1 ? 's' : '' }}
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-white/10">
                <th class="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Book</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Allot Date</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Due Date</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Return Date</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Fine</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr *ngFor="let item of activity"
                  class="hover:bg-white/5 transition-colors duration-150"
                  [class.bg-rose-500/5]="item.status === 'Overdue'">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="relative w-10 h-12 flex-shrink-0 rounded-lg overflow-hidden">
                      <div class="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600"></div>
                      <img *ngIf="item.imageUrl" [src]="item.imageUrl" class="absolute inset-0 w-full h-full object-cover" alt="cover">
                      <div *ngIf="!item.imageUrl" class="absolute inset-0 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    </div>
                    <span class="font-semibold text-white text-sm">{{ item.bookTitle }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-white/50">{{ item.allotDate | date:'mediumDate' }}</td>
                <td class="px-6 py-4 text-sm font-medium">
                  <span [class.text-rose-400]="item.status === 'Overdue'" [class.text-white]="item.status !== 'Overdue'">
                    {{ item.dueDate | date:'mediumDate' }}
                  </span>
                  <span *ngIf="item.status === 'Overdue'"
                        class="ml-1.5 text-xs bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded-full border border-rose-500/20">
                    Overdue
                  </span>
                </td>
                <td class="px-6 py-4 text-sm">
                  <span *ngIf="item.returnDate" class="text-white/60">{{ item.returnDate | date:'mediumDate' }}</span>
                  <span *ngIf="!item.returnDate" class="italic text-white/25">—</span>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                        [ngClass]="{
                          'bg-emerald-500/15 text-emerald-400 border-emerald-500/25': item.status === 'Active',
                          'bg-rose-500/15 text-rose-400 border-rose-500/25': item.status === 'Overdue',
                          'bg-blue-500/15 text-blue-400 border-blue-500/25': item.status === 'Returned',
                          'bg-gray-500/15 text-gray-400 border-gray-500/25': item.status === 'Revoked'
                        }">
                    <span class="w-1.5 h-1.5 rounded-full"
                          [ngClass]="{
                            'bg-emerald-400': item.status === 'Active',
                            'bg-rose-400': item.status === 'Overdue',
                            'bg-blue-400': item.status === 'Returned',
                            'bg-gray-400': item.status === 'Revoked'
                          }"></span>
                    {{ item.status }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span *ngIf="item.fine > 0"
                        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/25">
                    ₹ {{ item.fine }}
                  </span>
                  <span *ngIf="!item.fine || item.fine === 0"
                        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                    ₹ 0
                  </span>
                </td>
              </tr>
              <tr *ngIf="activity.length === 0">
                <td colspan="6" class="py-24 text-center">
                  <div class="flex flex-col items-center gap-4">
                    <div class="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <p class="text-white/30 font-semibold">No activity yet</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div *ngIf="activity.length > 0" class="px-6 py-3 border-t border-white/5 text-xs text-white/25">
          Fine is charged at ₹5 per day after the due date.
        </div>
      </div>

    </ng-container>
  </div>
  `
})
export class MyActivityComponent implements OnInit {

  activity: any[] = [];
  loading = true;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userService.getMyActivity().subscribe({
      next: (res) => {
        this.activity = res;
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
    return this.activity.filter(a => a.status === status).length;
  }

  totalFine(): number {
    return this.activity.reduce((sum, a) => sum + (a.fine || 0), 0);
  }
}
