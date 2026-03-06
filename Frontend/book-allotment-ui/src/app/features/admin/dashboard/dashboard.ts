import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { Chart } from 'chart.js/auto';
import { interval, Subscription } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="min-h-screen bg-gray-100 p-8">

    <!-- Header -->
    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 
                text-white p-8 rounded-2xl shadow-lg mb-8">
      <h1 class="text-3xl font-bold">Admin Dashboard</h1>
      <p class="mt-2 text-indigo-100">
        Welcome Admin 👋 Live system overview.
      </p>
      <p class="text-sm mt-2 text-indigo-200">
        Auto refresh every 30 seconds 🔄
      </p>
    </div>

    <!-- FILTER -->
    <form [formGroup]="filterForm"
          (ngSubmit)="applyFilters()"
          class="bg-white p-6 rounded-2xl shadow-md mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">

      <div>
        <label class="block text-sm font-medium mb-1">From Date</label>
        <input type="date"
               formControlName="fromDate"
               class="w-full border rounded-lg p-2" />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">To Date</label>
        <input type="date"
               formControlName="toDate"
               class="w-full border rounded-lg p-2" />
      </div>

      <div class="flex items-end gap-4">
        <button type="submit"
                class="bg-indigo-600 text-white px-6 py-2 rounded-lg">
          Apply
        </button>

        <button type="button"
                (click)="loadDashboard()"
                class="bg-gray-500 text-white px-6 py-2 rounded-lg">
          Refresh Now
        </button>
      </div>
    </form>

    <!-- LOADING -->
    <div *ngIf="loading" class="flex justify-center my-10">
      <div class="w-12 h-12 border-4 border-indigo-600 
                  border-t-transparent rounded-full animate-spin">
      </div>
    </div>

    <!-- CONTENT -->
    <div *ngIf="!loading">

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

        <div class="bg-white p-6 rounded-2xl shadow-md">
          <h2>Total Users</h2>
          <p class="text-3xl font-bold text-indigo-600 mt-2">
            {{ dashboard?.totalUsers }}
          </p>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-md">
          <h2>Total Books</h2>
          <p class="text-3xl font-bold text-purple-600 mt-2">
            {{ dashboard?.totalBooks }}
          </p>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-md">
          <h2>Pending</h2>
          <p class="text-3xl font-bold text-orange-500 mt-2">
            {{ dashboard?.pendingCount }}
          </p>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-md">
          <h2>Overdue</h2>
          <p class="text-3xl font-bold text-red-600 mt-2">
            {{ dashboard?.overdueCount }}
          </p>
        </div>

      </div>

      <div class="bg-white p-6 rounded-2xl shadow-md">
        <h2 class="text-xl font-semibold mb-4">
          System Statistics
        </h2>
        <canvas id="dashboardChart"></canvas>
      </div>

    </div>

  </div>
  `
})
export class AdminDashboardComponent implements OnInit, OnDestroy {

  filterForm!: FormGroup;
  dashboard: any;
  loading = true;
  chart: any;

  autoRefreshSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: ['']
    });

    this.loadDashboard();

    // 🔄 Auto refresh every 30 seconds
    this.autoRefreshSub = interval(30000).subscribe(() => {
      this.loadDashboard();
    });
  }

  loadDashboard() {
    this.loading = true;

    this.adminService.getDashboard(this.filterForm.value)
      .subscribe({
        next: (res) => {
          this.dashboard = res;
          this.loading = false;
          this.createChart();
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  applyFilters() {
    this.loadDashboard();
  }

  createChart() {

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('dashboardChart', {
      type: 'bar',
      data: {
        labels: ['Users', 'Books', 'Pending', 'Overdue'],
        datasets: [{
          data: [
            this.dashboard?.totalUsers,
            this.dashboard?.totalBooks,
            this.dashboard?.pendingCount,
            this.dashboard?.overdueCount
          ],
          backgroundColor: [
            '#6366F1',
            '#8B5CF6',
            '#F59E0B',
            '#EF4444'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  // 🧹 Prevent memory leak
  ngOnDestroy(): void {
    if (this.autoRefreshSub) {
      this.autoRefreshSub.unsubscribe();
    }
  }
}