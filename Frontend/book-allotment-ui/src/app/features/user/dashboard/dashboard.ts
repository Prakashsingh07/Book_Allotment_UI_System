import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { BookService } from '../../../core/services/book.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
  template: `
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-6">

    <!-- Welcome Hero -->
    <div class="relative bg-gradient-to-r from-indigo-600/40 to-purple-600/40 backdrop-blur-md
                rounded-3xl border border-white/10 p-8 mb-8 overflow-hidden shadow-2xl">
      <div class="absolute -top-10 -right-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl"></div>
      <div class="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl"></div>
      <div class="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <p class="text-indigo-300 text-sm font-medium uppercase tracking-widest mb-1">Welcome back</p>
          <h1 class="text-4xl font-extrabold text-white">{{ username }} 👋</h1>
          <p class="text-indigo-200/70 mt-2 text-sm max-w-md">
            Your personal library dashboard. Browse books, track your activity, and manage your profile.
          </p>
        </div>
        <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600
                    flex items-center justify-center shadow-xl flex-shrink-0 border border-white/20">
          <span class="text-4xl">{{ username.charAt(0).toUpperCase() }}</span>
        </div>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

      <div class="bg-gradient-to-br from-indigo-600/30 to-indigo-700/30 backdrop-blur-sm
                  rounded-2xl border border-indigo-500/20 p-5 flex items-center gap-4 shadow-lg">
        <div class="w-12 h-12 rounded-xl bg-indigo-500/30 flex items-center justify-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div>
          <p class="text-indigo-300 text-xs">Total Books</p>
          <p class="text-3xl font-extrabold text-white">{{ totalBooks }}</p>
        </div>
      </div>

      <div class="bg-gradient-to-br from-emerald-600/30 to-emerald-700/30 backdrop-blur-sm
                  rounded-2xl border border-emerald-500/20 p-5 flex items-center gap-4 shadow-lg">
        <div class="w-12 h-12 rounded-xl bg-emerald-500/30 flex items-center justify-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p class="text-emerald-300 text-xs">Available Now</p>
          <p class="text-3xl font-extrabold text-white">{{ availableBooks }}</p>
        </div>
      </div>

      <div class="bg-gradient-to-br from-purple-600/30 to-purple-700/30 backdrop-blur-sm
                  rounded-2xl border border-purple-500/20 p-5 flex items-center gap-4 shadow-lg">
        <div class="w-12 h-12 rounded-xl bg-purple-500/30 flex items-center justify-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div>
          <p class="text-purple-300 text-xs">My Active Books</p>
          <p class="text-3xl font-extrabold text-white">{{ activeBooks }}</p>
        </div>
      </div>

      <!-- Overdue — glows red only when there are unpaid overdue books -->
      <div class="backdrop-blur-sm rounded-2xl p-5 flex items-center gap-4 shadow-lg transition-all duration-300"
           [ngClass]="overdueBooks > 0
             ? 'bg-gradient-to-br from-rose-600/40 to-rose-700/40 border border-rose-400/50 ring-1 ring-rose-500/30'
             : 'bg-gradient-to-br from-rose-600/30 to-rose-700/30 border border-rose-500/20'">
        <div class="relative w-12 h-12 rounded-xl bg-rose-500/30 flex items-center justify-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-rose-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span *ngIf="overdueBooks > 0"
                class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-400
                       border-2 border-slate-900 animate-pulse"></span>
        </div>
        <div>
          <p class="text-rose-300 text-xs">Overdue</p>
          <p class="text-3xl font-extrabold" [ngClass]="overdueBooks > 0 ? 'text-rose-400' : 'text-white'">
            {{ overdueBooks }}
          </p>
          <p *ngIf="overdueBooks > 0" class="text-rose-400/80 text-xs font-semibold mt-0.5 animate-pulse">
            Fine accumulating!
          </p>
        </div>
      </div>

    </div>

    <!-- Overdue Warning Banner — only when fine is still unpaid -->
    <div *ngIf="overdueBooks > 0"
         class="mb-8 bg-rose-500/10 border border-rose-500/30 rounded-2xl px-6 py-4
                flex items-center gap-4 shadow-lg">
      <div class="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
        </svg>
      </div>
      <div class="flex-1">
        <p class="text-rose-300 font-bold text-sm">
          You have {{ overdueBooks }} overdue book{{ overdueBooks !== 1 ? 's' : '' }} with unpaid fine{{ overdueBooks !== 1 ? 's' : '' }}!
        </p>
        <p class="text-rose-400/60 text-xs mt-0.5">Fines are accumulating daily. Pay your fine to be able to return the book.</p>
      </div>
      <a routerLink="/user/my-activity"
         class="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500/20 text-rose-300
                border border-rose-500/30 hover:bg-rose-500/30 transition-all whitespace-nowrap">
        Pay Fine →
      </a>
    </div>

    <!-- Quick Actions -->
    <div class="mb-8">
      <h2 class="text-white/70 text-xs font-bold uppercase tracking-widest mb-4">Quick Actions</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">

        <a routerLink="/user/available-books"
           class="group bg-white/5 hover:bg-indigo-600/30 border border-white/10 hover:border-indigo-400/40
                  rounded-2xl p-5 flex flex-col items-center gap-3 text-center
                  transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/20 cursor-pointer">
          <div class="w-12 h-12 rounded-xl bg-indigo-500/20 group-hover:bg-indigo-500/40 flex items-center justify-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <p class="text-white text-sm font-semibold">Browse Books</p>
            <p class="text-white/40 text-xs mt-0.5">Find & request books</p>
          </div>
        </a>

        <a routerLink="/user/my-books"
           class="group bg-white/5 hover:bg-purple-600/30 border border-white/10 hover:border-purple-400/40
                  rounded-2xl p-5 flex flex-col items-center gap-3 text-center
                  transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/20 cursor-pointer">
          <div class="w-12 h-12 rounded-xl bg-purple-500/20 group-hover:bg-purple-500/40 flex items-center justify-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <div>
            <p class="text-white text-sm font-semibold">My Books</p>
            <p class="text-white/40 text-xs mt-0.5">View borrowed books</p>
          </div>
        </a>

        <a routerLink="/user/my-activity"
           class="group relative bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col items-center gap-3
                  text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
           [ngClass]="overdueBooks > 0
             ? 'hover:bg-rose-600/20 hover:border-rose-400/40 hover:shadow-rose-500/20'
             : 'hover:bg-emerald-600/30 hover:border-emerald-400/40 hover:shadow-emerald-500/20'">
          <span *ngIf="overdueBooks > 0"
                class="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-rose-500
                       flex items-center justify-center text-white text-xs font-extrabold
                       shadow-lg shadow-rose-500/50 animate-bounce">
            {{ overdueBooks }}
          </span>
          <div class="w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
               [ngClass]="overdueBooks > 0 ? 'bg-rose-500/20 group-hover:bg-rose-500/40' : 'bg-emerald-500/20 group-hover:bg-emerald-500/40'">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                 [ngClass]="overdueBooks > 0 ? 'text-rose-300' : 'text-emerald-300'">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <p class="text-white text-sm font-semibold">My Activity</p>
            <p class="text-xs mt-0.5"
               [ngClass]="overdueBooks > 0 ? 'text-rose-400/80 font-bold' : 'text-white/40'">
              {{ overdueBooks > 0 ? overdueBooks + ' unpaid fine' + (overdueBooks !== 1 ? 's' : '') + '!' : 'History & fines' }}
            </p>
          </div>
        </a>

        <a routerLink="/user/profile"
           class="group bg-white/5 hover:bg-pink-600/30 border border-white/10 hover:border-pink-400/40
                  rounded-2xl p-5 flex flex-col items-center gap-3 text-center
                  transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/20 cursor-pointer">
          <div class="w-12 h-12 rounded-xl bg-pink-500/20 group-hover:bg-pink-500/40 flex items-center justify-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A9 9 0 1118.88 6.196M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p class="text-white text-sm font-semibold">My Profile</p>
            <p class="text-white/40 text-xs mt-0.5">Update your details</p>
          </div>
        </a>

      </div>
    </div>

    <!-- Recent Activity Table -->
    <div class="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-xl">
      <div class="px-6 py-5 border-b border-white/10 flex items-center justify-between">
        <div>
          <h2 class="text-white font-bold text-lg">Recent Activity</h2>
          <p class="text-white/40 text-xs mt-0.5">Your latest book transactions</p>
        </div>
        <a routerLink="/user/my-activity"
           class="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition flex items-center gap-1">
          View All
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      <div *ngIf="loadingActivity" class="flex items-center justify-center py-12 gap-3">
        <div class="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-white/40 text-sm">Loading activity...</p>
      </div>

      <div *ngIf="!loadingActivity" class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-white/5">
              <th class="px-6 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Book</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Allot Date</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Due Date</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Fine</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr *ngFor="let item of recentActivity"
                class="hover:bg-white/5 transition-colors"
                [class.bg-rose-500/5]="getLiveStatus(item) === 'Overdue' && !item.finePaid">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <span class="text-white text-sm font-medium">{{ item.bookTitle }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-white/50 text-sm">{{ item.allotDate | date:'mediumDate' }}</td>
              <td class="px-6 py-4 text-sm"
                  [class.text-rose-400]="getLiveStatus(item) === 'Overdue' && !item.finePaid"
                  [class.text-white/50]="getLiveStatus(item) !== 'Overdue' || item.finePaid">
                {{ item.dueDate ? (item.dueDate | date:'mediumDate') : '—' }}
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                      [ngClass]="{
                        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30': getLiveStatus(item) === 'Active',
                        'bg-rose-500/20 text-rose-400 border border-rose-500/30':         getLiveStatus(item) === 'Overdue' && !item.finePaid,
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30':      getLiveStatus(item) === 'Overdue' && item.finePaid,
                        'bg-blue-500/20 text-blue-400 border border-blue-500/30':         getLiveStatus(item) === 'Returned',
                        'bg-gray-500/20 text-gray-400 border border-gray-500/30':         getLiveStatus(item) === 'Revoked'
                      }">
                  <span class="w-1.5 h-1.5 rounded-full"
                        [ngClass]="{
                          'bg-emerald-400': getLiveStatus(item) === 'Active',
                          'bg-rose-400':    getLiveStatus(item) === 'Overdue' && !item.finePaid,
                          'bg-amber-400':   getLiveStatus(item) === 'Overdue' && item.finePaid,
                          'bg-blue-400':    getLiveStatus(item) === 'Returned',
                          'bg-gray-400':    getLiveStatus(item) === 'Revoked'
                        }"></span>
                  {{ getLiveStatus(item) === 'Overdue' && item.finePaid ? 'Fine Paid' : getLiveStatus(item) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span *ngIf="getLiveFine(item) > 0"
                      class="font-bold text-sm"
                      [ngClass]="item.finePaid ? 'text-emerald-400 line-through opacity-60' : 'text-rose-400'">
                  ₹ {{ getLiveFine(item) }}
                </span>
                <span *ngIf="getLiveFine(item) === 0" class="text-emerald-400 font-semibold text-sm">₹ 0</span>
              </td>
            </tr>

            <tr *ngIf="recentActivity.length === 0">
              <td colspan="5" class="py-16 text-center">
                <div class="flex flex-col items-center gap-3">
                  <div class="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p class="text-white/30 text-sm font-medium">No activity yet</p>
                  <a routerLink="/user/available-books" class="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition">
                    Browse books to get started →
                  </a>
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
export class UserDashboardComponent implements OnInit {

  username       = '';
  totalBooks     = 0;
  availableBooks = 0;
  activeBooks    = 0;
  overdueBooks   = 0;   // only books that are overdue AND fine unpaid
  finePerDay     = 5;
  recentActivity: any[] = [];
  loadingActivity = true;

  private nowMs = Date.now();

  constructor(
    private bookService: BookService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.username = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'User';
      } catch { this.username = 'User'; }
    }

    this.bookService.getBooks().subscribe({
      next: (books: any[]) => {
        this.totalBooks     = books.length;
        this.availableBooks = books.filter(b => (b.availableQuantity ?? 0) > 0).length;
        this.cdr.markForCheck();
      },
      error: () => {}
    });

    this.userService.getMyActivity().subscribe({
      next: (activity: any[]) => {
        const sample = activity.find((a: any) => a.finePerDay != null);
        if (sample) this.finePerDay = sample.finePerDay;

        this.nowMs = Date.now();

        // Active = currently out and NOT overdue
        this.activeBooks = activity.filter(a => this.getLiveStatus(a) === 'Active').length;

        // Overdue = past due date AND fine has NOT been paid yet
        // If finePaid is true the user has settled up — don't count as actionable overdue
        this.overdueBooks = activity.filter(a =>
          this.getLiveStatus(a) === 'Overdue' && !a.finePaid
        ).length;

        this.recentActivity  = activity.slice(0, 5);
        this.loadingActivity = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loadingActivity = false;
        this.cdr.markForCheck();
      }
    });
  }

  private parseDueMs(dateStr: string | null | undefined): number {
    if (!dateStr) return 0;
    const s  = dateStr.endsWith('Z') ? dateStr : dateStr + 'Z';
    const ms = new Date(s).getTime();
    return ms > 946684800000 ? ms : 0;
  }

  getLiveStatus(item: any): string {
    if (item.status === 'Returned' || item.status === 'Revoked') return item.status;
    const dueMs = this.parseDueMs(item.dueDate);
    if (!dueMs) return 'Active';
    return this.nowMs > dueMs ? 'Overdue' : 'Active';
  }

  getLiveFine(item: any): number {
    if (item.status === 'Returned') return item.fine || 0;
    if (item.status === 'Revoked')  return 0;
    const dueMs  = this.parseDueMs(item.dueDate);
    if (!dueMs)  return 0;
    const diffMs = this.nowMs - dueMs;
    if (diffMs <= 0) return 0;
    return Math.floor(diffMs / 86_400_000) * this.finePerDay;
  }
}
