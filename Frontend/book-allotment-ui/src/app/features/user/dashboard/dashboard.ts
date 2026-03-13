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
            Your personal library dashboard. Browse books, track your activity, and manage your profile — all in one place.
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
      <div class="bg-gradient-to-br from-indigo-600/30 to-indigo-700/30 backdrop-blur-sm rounded-2xl border border-indigo-500/20 p-5 flex items-center gap-4 shadow-lg">
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
      <div class="bg-gradient-to-br from-emerald-600/30 to-emerald-700/30 backdrop-blur-sm rounded-2xl border border-emerald-500/20 p-5 flex items-center gap-4 shadow-lg">
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
      <div class="bg-gradient-to-br from-purple-600/30 to-purple-700/30 backdrop-blur-sm rounded-2xl border border-purple-500/20 p-5 flex items-center gap-4 shadow-lg">
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
      <div class="bg-gradient-to-br from-rose-600/30 to-rose-700/30 backdrop-blur-sm rounded-2xl border border-rose-500/20 p-5 flex items-center gap-4 shadow-lg">
        <div class="w-12 h-12 rounded-xl bg-rose-500/30 flex items-center justify-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-rose-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p class="text-rose-300 text-xs">Overdue</p>
          <p class="text-3xl font-extrabold text-white">{{ overdueBooks }}</p>
        </div>
      </div>
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
           class="group bg-white/5 hover:bg-emerald-600/30 border border-white/10 hover:border-emerald-400/40
                  rounded-2xl p-5 flex flex-col items-center gap-3 text-center
                  transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/20 cursor-pointer">
          <div class="w-12 h-12 rounded-xl bg-emerald-500/20 group-hover:bg-emerald-500/40 flex items-center justify-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <p class="text-white text-sm font-semibold">My Activity</p>
            <p class="text-white/40 text-xs mt-0.5">History & fines</p>
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
        <div class="w-8 h-8 border-3 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
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
                [class.bg-rose-500/5]="item.status === 'Overdue'">
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
              <td class="px-6 py-4 text-sm" [class.text-rose-400]="item.status === 'Overdue'" [class.text-white/50]="item.status !== 'Overdue'">
                {{ item.dueDate | date:'mediumDate' }}
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                      [ngClass]="{
                        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30': item.status === 'Active',
                        'bg-rose-500/20 text-rose-400 border border-rose-500/30': item.status === 'Overdue',
                        'bg-blue-500/20 text-blue-400 border border-blue-500/30': item.status === 'Returned',
                        'bg-gray-500/20 text-gray-400 border border-gray-500/30': item.status === 'Revoked'
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
                <span *ngIf="item.fine > 0" class="text-rose-400 font-bold text-sm">₹ {{ item.fine }}</span>
                <span *ngIf="!item.fine || item.fine === 0" class="text-emerald-400 font-semibold text-sm">₹ 0</span>
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

  username = '';
  totalBooks = 0;
  availableBooks = 0;
  activeBooks = 0;
  overdueBooks = 0;
  recentActivity: any[] = [];
  loadingActivity = true;

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
        this.totalBooks = books.length;
        this.availableBooks = books.filter(b => (b.availableQuantity ?? 0) > 0).length;
        this.cdr.markForCheck();
      },
      error: () => {}
    });

    this.userService.getMyActivity().subscribe({
      next: (activity: any[]) => {
        this.activeBooks = activity.filter(a => a.status === 'Active').length;
        this.overdueBooks = activity.filter(a => a.status === 'Overdue').length;
        this.recentActivity = activity.slice(0, 5);
        this.loadingActivity = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loadingActivity = false;
        this.cdr.markForCheck();
      }
    });
  }
}
