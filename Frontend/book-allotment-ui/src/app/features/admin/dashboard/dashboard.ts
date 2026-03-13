import { Component, OnInit, OnDestroy, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { Chart, registerables } from 'chart.js';
import { interval, Subscription } from 'rxjs';

Chart.register(...registerables);

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-6">

    <!-- Header -->
    <div class="relative bg-gradient-to-r from-indigo-600/40 to-purple-600/40 backdrop-blur-md
                rounded-3xl border border-white/10 p-8 mb-8 overflow-hidden shadow-2xl">
      <div class="absolute -top-10 -right-10 w-56 h-56 bg-indigo-500/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-10 -left-10 w-56 h-56 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div class="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p class="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-1">Admin Panel</p>
          <h1 class="text-4xl font-extrabold text-white">Dashboard</h1>
          <p class="text-indigo-200/70 mt-1 text-sm">Live system overview · Auto-refreshes every 30s</p>
        </div>
        <div class="flex items-center gap-4">
          <!-- Countdown ring -->
          <div class="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5">
            <div class="relative w-8 h-8">
              <svg class="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="12" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="3"/>
                <circle cx="16" cy="16" r="12" fill="none" stroke="#818cf8" stroke-width="3"
                        stroke-dasharray="75.4"
                        [attr.stroke-dashoffset]="75.4 - (75.4 * countdown / 30)"
                        style="transition: stroke-dashoffset 1s linear"/>
              </svg>
              <span class="absolute inset-0 flex items-center justify-center text-xs font-bold text-indigo-300">
                {{ countdown }}
              </span>
            </div>
            <div>
              <p class="text-white/40 text-xs leading-none">Next refresh</p>
              <p class="text-white/70 text-xs font-semibold">in {{ countdown }}s</p>
            </div>
          </div>
          <div class="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5">
            <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span class="text-emerald-400 text-xs font-semibold">Live</span>
          </div>
          <button (click)="manualRefresh()"
                  [disabled]="loading"
                  class="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold
                         bg-white/10 border border-white/10 text-white/70
                         hover:bg-white/15 hover:text-white transition-all
                         disabled:opacity-40 disabled:cursor-not-allowed">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" [class.animate-spin]="loading"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>
    </div>

    <!-- Date Filter -->
    <form [formGroup]="filterForm" (ngSubmit)="applyFilters()"
          class="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 mb-8 shadow-xl">
      <p class="text-white/40 text-xs font-bold uppercase tracking-wider mb-4">📅 Filter by Date Range</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-xs font-semibold text-white/50 mb-1.5">From Date</label>
          <input type="date" formControlName="fromDate"
                 class="w-full bg-white/10 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm
                        focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-white/50 mb-1.5">To Date</label>
          <input type="date" formControlName="toDate"
                 class="w-full bg-white/10 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm
                        focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        </div>
        <div class="flex items-end gap-3">
          <button type="submit"
                  class="flex-1 py-2.5 rounded-xl text-sm font-bold
                         bg-gradient-to-r from-indigo-500 to-purple-600 text-white
                         hover:from-indigo-400 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/20">
            Apply Filter
          </button>
          <button type="button" (click)="clearFilter()"
                  class="px-4 py-2.5 rounded-xl text-sm font-bold
                         bg-white/10 text-white/60 border border-white/10
                         hover:bg-white/15 hover:text-white transition-all">
            Clear
          </button>
        </div>
      </div>
    </form>

    <!-- Skeleton loader (first load only) -->
    <div *ngIf="loading && !dashboard" class="space-y-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div *ngFor="let i of [1,2,3,4]"
             class="h-24 bg-white/5 rounded-2xl border border-white/10 animate-pulse"></div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="h-72 bg-white/5 rounded-3xl border border-white/10 animate-pulse"></div>
        <div class="h-72 bg-white/5 rounded-3xl border border-white/10 animate-pulse"></div>
      </div>
    </div>

    <!-- Content (shown after first load; updates in place) -->
    <div *ngIf="dashboard">

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

        <!-- Users -->
        <div class="relative bg-gradient-to-br from-indigo-600/30 to-indigo-700/30 backdrop-blur-sm
                    rounded-2xl border border-indigo-500/20 p-5 overflow-hidden shadow-lg group
                    hover:border-indigo-400/40 hover:-translate-y-0.5 transition-all duration-200">
          <div class="absolute -bottom-4 -right-4 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl"></div>
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-500/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <p class="text-xs text-indigo-300 font-medium mb-1">Total Users</p>
          <p class="text-3xl font-extrabold text-white">{{ dashboard.totalUsers }}</p>
        </div>

        <!-- Books -->
        <div class="relative bg-gradient-to-br from-purple-600/30 to-purple-700/30 backdrop-blur-sm
                    rounded-2xl border border-purple-500/20 p-5 overflow-hidden shadow-lg
                    hover:border-purple-400/40 hover:-translate-y-0.5 transition-all duration-200">
          <div class="absolute -bottom-4 -right-4 w-20 h-20 bg-purple-500/10 rounded-full blur-xl"></div>
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-xl bg-purple-500/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <p class="text-xs text-purple-300 font-medium mb-1">Total Books</p>
          <p class="text-3xl font-extrabold text-white">{{ dashboard.totalBooks }}</p>
        </div>

        <!-- Pending -->
        <div class="relative bg-gradient-to-br from-amber-600/30 to-amber-700/30 backdrop-blur-sm
                    rounded-2xl border border-amber-500/20 p-5 overflow-hidden shadow-lg
                    hover:border-amber-400/40 hover:-translate-y-0.5 transition-all duration-200">
          <div class="absolute -bottom-4 -right-4 w-20 h-20 bg-amber-500/10 rounded-full blur-xl"></div>
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-xl bg-amber-500/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-amber-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <span *ngIf="dashboard.pendingCount > 0"
                  class="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Action needed
            </span>
          </div>
          <p class="text-xs text-amber-300 font-medium mb-1">Pending Requests</p>
          <p class="text-3xl font-extrabold text-white">{{ dashboard.pendingCount }}</p>
        </div>

        <!-- Overdue -->
        <div class="relative bg-gradient-to-br from-rose-600/30 to-rose-700/30 backdrop-blur-sm
                    rounded-2xl border border-rose-500/20 p-5 overflow-hidden shadow-lg
                    hover:border-rose-400/40 hover:-translate-y-0.5 transition-all duration-200">
          <div class="absolute -bottom-4 -right-4 w-20 h-20 bg-rose-500/10 rounded-full blur-xl"></div>
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-xl bg-rose-500/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-rose-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span *ngIf="dashboard.overdueCount > 0"
                  class="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Overdue
            </span>
          </div>
          <p class="text-xs text-rose-300 font-medium mb-1">Overdue Books</p>
          <p class="text-3xl font-extrabold text-white">{{ dashboard.overdueCount }}</p>
        </div>

      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        <!-- Doughnut: Book Status Breakdown -->
        <div class="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 shadow-2xl">
          <div class="mb-5">
            <h2 class="text-white font-bold text-base">Book Status Breakdown</h2>
            <p class="text-white/40 text-xs mt-0.5">Available vs. issued vs. overdue</p>
          </div>
          <div class="flex items-center gap-6">
            <div class="relative w-44 h-44 flex-shrink-0">
              <canvas id="doughnutChart"></canvas>
              <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p class="text-2xl font-extrabold text-white">{{ dashboard.totalBooks }}</p>
                <p class="text-white/40 text-xs">Total</p>
              </div>
            </div>
            <div class="flex flex-col gap-3 flex-1">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-indigo-400"></div>
                  <span class="text-white/60 text-sm">Available</span>
                </div>
                <span class="text-white font-bold text-sm">{{ availableBooks }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-amber-400"></div>
                  <span class="text-white/60 text-sm">Issued</span>
                </div>
                <span class="text-white font-bold text-sm">{{ issuedBooks }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-rose-400"></div>
                  <span class="text-white/60 text-sm">Overdue</span>
                </div>
                <span class="text-white font-bold text-sm">{{ dashboard.overdueCount }}</span>
              </div>
              <div class="mt-2 pt-3 border-t border-white/10">
                <div class="flex justify-between text-xs text-white/40 mb-1">
                  <span>Utilisation rate</span>
                  <span>{{ utilisationRate }}%</span>
                </div>
                <div class="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                       [style.width.%]="utilisationRate"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bar: Users vs Books vs Pending vs Overdue (separate Y axis per group) -->
        <div class="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 shadow-2xl">
          <div class="mb-5">
            <h2 class="text-white font-bold text-base">System Overview</h2>
            <p class="text-white/40 text-xs mt-0.5">Key metrics at a glance</p>
          </div>
          <canvas id="barChart" style="max-height:220px"></canvas>
        </div>

      </div>

      <!-- Health Row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

        <!-- User Activity -->
        <div class="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 shadow-xl">
          <h3 class="text-white/70 text-sm font-bold mb-4">System Health</h3>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-xs mb-1.5">
                <span class="text-white/50">Users registered</span>
                <span class="text-white font-semibold">{{ dashboard.totalUsers }}</span>
              </div>
              <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full"
                     [style.width.%]="100"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-xs mb-1.5">
                <span class="text-white/50">Books in system</span>
                <span class="text-white font-semibold">{{ dashboard.totalBooks }}</span>
              </div>
              <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
                     [style.width.%]="100"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-xs mb-1.5">
                <span class="text-white/50">Pending / Total users</span>
                <span class="text-amber-400 font-semibold">{{ pendingRate }}%</span>
              </div>
              <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-700"
                     [style.width.%]="pendingRate"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-xs mb-1.5">
                <span class="text-white/50">Overdue / Issued books</span>
                <span class="text-rose-400 font-semibold">{{ overdueRate }}%</span>
              </div>
              <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full transition-all duration-700"
                     [style.width.%]="overdueRate"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Status cards -->
        <div class="md:col-span-2 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 shadow-xl">
          <h3 class="text-white/70 text-sm font-bold mb-4">Snapshot</h3>
          <div class="grid grid-cols-2 gap-4">

            <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 flex flex-col gap-1">
              <p class="text-indigo-300 text-xs font-semibold uppercase tracking-wider">Books Available</p>
              <p class="text-3xl font-extrabold text-white">{{ availableBooks }}</p>
              <p class="text-white/30 text-xs">Ready to be issued</p>
            </div>

            <div class="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4 flex flex-col gap-1">
              <p class="text-purple-300 text-xs font-semibold uppercase tracking-wider">Currently Issued</p>
              <p class="text-3xl font-extrabold text-white">{{ issuedBooks }}</p>
              <p class="text-white/30 text-xs">With users right now</p>
            </div>

            <div class="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex flex-col gap-1">
              <p class="text-amber-300 text-xs font-semibold uppercase tracking-wider">Awaiting Approval</p>
              <p class="text-3xl font-extrabold text-white">{{ dashboard.pendingCount }}</p>
              <p class="text-white/30 text-xs">Requests to review</p>
            </div>

            <div class="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex flex-col gap-1">
              <p class="text-rose-300 text-xs font-semibold uppercase tracking-wider">Overdue Returns</p>
              <p class="text-3xl font-extrabold text-white">{{ dashboard.overdueCount }}</p>
              <p class="text-white/30 text-xs">Past their due date</p>
            </div>

          </div>
        </div>

      </div>

    </div>
  </div>
  `
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  filterForm!: FormGroup;
  dashboard: any = null;
  loading = false;
  countdown = 30;

  private barChart: Chart | null = null;
  private doughnutChart: Chart | null = null;
  private timerSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private zone: NgZone
  ) {}

  get availableBooks(): number {
    if (!this.dashboard) return 0;
    return Math.max(0, this.dashboard.totalBooks - this.issuedBooks);
  }

  get issuedBooks(): number {
    if (!this.dashboard) return 0;
    return (this.dashboard.overdueCount || 0) + Math.max(0, (this.dashboard.totalBooks || 0) - (this.dashboard.totalBooks || 0) + (this.dashboard.pendingCount || 0));
  }

  get utilisationRate(): number {
    if (!this.dashboard?.totalBooks) return 0;
    return Math.min(100, Math.round(((this.dashboard.totalBooks - this.availableBooks) / this.dashboard.totalBooks) * 100));
  }

  get pendingRate(): number {
    if (!this.dashboard?.totalUsers) return 0;
    return Math.min(100, Math.round((this.dashboard.pendingCount / this.dashboard.totalUsers) * 100));
  }

  get overdueRate(): number {
    const issued = this.issuedBooks;
    if (!issued) return 0;
    return Math.min(100, Math.round((this.dashboard.overdueCount / issued) * 100));
  }

  ngOnInit(): void {
    this.filterForm = this.fb.group({ fromDate: [''], toDate: [''] });
    this.loadDashboard();

    // Countdown + auto-refresh every 30s
    this.timerSub = interval(1000).subscribe(() => {
      this.zone.run(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          this.countdown = 30;
          this.loadDashboard();
        }
      });
    });
  }

  loadDashboard() {
    this.loading = true;
    this.adminService.getDashboard(this.filterForm.value).subscribe({
      next: (res) => {
        this.dashboard = res;
        this.loading = false;
        // Defer chart creation until canvas is in DOM
        setTimeout(() => this.updateCharts(), 50);
      },
      error: () => { this.loading = false; }
    });
  }

  applyFilters() { this.countdown = 30; this.loadDashboard(); }

  manualRefresh() { this.countdown = 30; this.loadDashboard(); }

  clearFilter() {
    this.filterForm.reset({ fromDate: '', toDate: '' });
    this.loadDashboard();
  }

  updateCharts() {
    this.updateDoughnut();
    this.updateBar();
  }

  updateDoughnut() {
    const available = this.availableBooks;
    const issued = Math.max(0, this.issuedBooks - (this.dashboard?.overdueCount || 0));
    const overdue = this.dashboard?.overdueCount || 0;
    const data = [available, issued, overdue];

    if (this.doughnutChart) {
      // Update data in place — no flicker, much faster
      this.doughnutChart.data.datasets[0].data = data;
      this.doughnutChart.update('active');
      return;
    }

    const canvas = document.getElementById('doughnutChart') as HTMLCanvasElement;
    if (!canvas) return;

    this.doughnutChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Available', 'Issued', 'Overdue'],
        datasets: [{
          data,
          backgroundColor: ['rgba(99,102,241,0.8)', 'rgba(245,158,11,0.8)', 'rgba(239,68,68,0.8)'],
          borderColor: ['rgba(99,102,241,1)', 'rgba(245,158,11,1)', 'rgba(239,68,68,1)'],
          borderWidth: 2,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15,15,30,0.9)',
            titleColor: '#fff',
            bodyColor: 'rgba(255,255,255,0.6)',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 12
          }
        },
        animation: { duration: 600, easing: 'easeInOutQuart' }
      }
    });
  }

  updateBar() {
    const data = [
      this.dashboard?.totalUsers || 0,
      this.dashboard?.totalBooks || 0,
      this.dashboard?.pendingCount || 0,
      this.dashboard?.overdueCount || 0
    ];

    if (this.barChart) {
      // Update data in place
      this.barChart.data.datasets[0].data = data;
      this.barChart.update('active');
      return;
    }

    const canvas = document.getElementById('barChart') as HTMLCanvasElement;
    if (!canvas) return;

    this.barChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Users', 'Books', 'Pending', 'Overdue'],
        datasets: [{
          label: 'Count',
          data,
          backgroundColor: [
            'rgba(99,102,241,0.7)',
            'rgba(139,92,246,0.7)',
            'rgba(245,158,11,0.7)',
            'rgba(239,68,68,0.7)'
          ],
          borderColor: [
            'rgba(99,102,241,1)',
            'rgba(139,92,246,1)',
            'rgba(245,158,11,1)',
            'rgba(239,68,68,1)'
          ],
          borderWidth: 2,
          borderRadius: 10,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15,15,30,0.9)',
            titleColor: '#fff',
            bodyColor: 'rgba(255,255,255,0.6)',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 12
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 12 } },
            border: { color: 'rgba(255,255,255,0.05)' }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: {
              color: 'rgba(255,255,255,0.5)',
              font: { size: 11 },
              stepSize: 1,
              precision: 0
            },
            border: { color: 'rgba(255,255,255,0.05)' },
            beginAtZero: true
          }
        },
        animation: { duration: 500, easing: 'easeInOutQuart' }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timerSub) this.timerSub.unsubscribe();
    if (this.barChart) this.barChart.destroy();
    if (this.doughnutChart) this.doughnutChart.destroy();
  }
}
