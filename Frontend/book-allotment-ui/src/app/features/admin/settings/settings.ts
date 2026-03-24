import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-6">

    <!-- Page Header -->
    <div class="relative bg-gradient-to-r from-indigo-600/40 to-purple-600/40 backdrop-blur-md
                rounded-3xl border border-white/10 p-8 mb-8 overflow-hidden shadow-2xl">
      <div class="absolute -top-10 -right-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div class="relative">
        <p class="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-1">Admin Panel</p>
        <h1 class="text-3xl font-extrabold text-white">Library Settings ⚙️</h1>
        <p class="text-indigo-200/60 text-sm mt-1">Configure issue period and fine rate. Changes apply to all new allotments immediately.</p>
      </div>
    </div>

    <div class="max-w-2xl mx-auto space-y-6">

      <!-- Loading skeleton -->
      <div *ngIf="loading" class="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 space-y-6">
        <div class="h-5 bg-white/5 rounded-lg animate-pulse w-1/3"></div>
        <div class="h-14 bg-white/5 rounded-2xl animate-pulse"></div>
        <div class="h-5 bg-white/5 rounded-lg animate-pulse w-1/3"></div>
        <div class="h-14 bg-white/5 rounded-2xl animate-pulse"></div>
        <div class="h-12 bg-white/5 rounded-2xl animate-pulse"></div>
      </div>

      <!-- Settings Card -->
      <div *ngIf="!loading" class="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-2xl">

        <!-- Card header -->
        <div class="px-8 py-5 border-b border-white/10 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h2 class="text-white font-bold">Allotment Rules</h2>
            <p class="text-white/40 text-xs">Applied to all new book issues</p>
          </div>
        </div>

        <!-- Form -->
        <div class="px-8 py-8">
          <form [formGroup]="settingsForm" (ngSubmit)="save()" class="space-y-6">

            <!-- Issue Days -->
            <div>
              <label class="block text-xs font-bold text-white/50 uppercase tracking-wider mb-3">
                📅 Issue Period (Days)
              </label>
              <div class="flex items-center gap-4">
                <!-- Decrement -->
                <button type="button" (click)="decrement('issueDays')"
                        class="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 text-white text-xl font-bold
                               hover:bg-indigo-500/30 hover:border-indigo-400/40 transition-all flex items-center justify-center">
                  −
                </button>
                <!-- Input -->
                <div class="flex-1 relative">
                  <input type="number" formControlName="issueDays" min="1" max="365"
                         class="w-full bg-white/5 border text-white text-center text-2xl font-extrabold rounded-2xl px-4 py-3
                                focus:outline-none focus:ring-2 transition-all"
                         [ngClass]="settingsForm.get('issueDays')?.invalid && settingsForm.get('issueDays')?.touched
                           ? 'border-rose-500/50 focus:ring-rose-500/30'
                           : 'border-white/10 focus:ring-indigo-500/40 focus:border-indigo-500/50'" />
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-sm font-medium">days</span>
                </div>
                <!-- Increment -->
                <button type="button" (click)="increment('issueDays')"
                        class="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 text-white text-xl font-bold
                               hover:bg-indigo-500/30 hover:border-indigo-400/40 transition-all flex items-center justify-center">
                  +
                </button>
              </div>
              <p *ngIf="settingsForm.get('issueDays')?.invalid && settingsForm.get('issueDays')?.touched"
                 class="mt-2 text-xs text-rose-400">Issue period must be between 1 and 365 days.</p>
              <!-- Info bar -->
              <div class="mt-3 flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-4 py-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-indigo-300 text-xs">
                  Books issued today will be due on
                  <span class="font-bold text-indigo-200">{{ dueDatePreview }}</span>
                </p>
              </div>
            </div>

            <!-- Divider -->
            <div class="border-t border-white/10"></div>

            <!-- Fine Per Day -->
            <div>
              <label class="block text-xs font-bold text-white/50 uppercase tracking-wider mb-3">
                💰 Fine Per Overdue Day (₹)
              </label>
              <div class="flex items-center gap-4">
                <!-- Decrement -->
                <button type="button" (click)="decrement('finePerDay')"
                        class="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 text-white text-xl font-bold
                               hover:bg-rose-500/30 hover:border-rose-400/40 transition-all flex items-center justify-center">
                  −
                </button>
                <!-- Input -->
                <div class="flex-1 relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-lg font-bold">₹</span>
                  <input type="number" formControlName="finePerDay" min="0" max="10000"
                         class="w-full bg-white/5 border text-white text-center text-2xl font-extrabold rounded-2xl pl-8 pr-4 py-3
                                focus:outline-none focus:ring-2 transition-all"
                         [ngClass]="settingsForm.get('finePerDay')?.invalid && settingsForm.get('finePerDay')?.touched
                           ? 'border-rose-500/50 focus:ring-rose-500/30'
                           : 'border-white/10 focus:ring-rose-500/40 focus:border-rose-500/50'" />
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-sm font-medium">/day</span>
                </div>
                <!-- Increment -->
                <button type="button" (click)="increment('finePerDay')"
                        class="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 text-white text-xl font-bold
                               hover:bg-rose-500/30 hover:border-rose-400/40 transition-all flex items-center justify-center">
                  +
                </button>
              </div>
              <p *ngIf="settingsForm.get('finePerDay')?.invalid && settingsForm.get('finePerDay')?.touched"
                 class="mt-2 text-xs text-rose-400">Fine must be between ₹0 and ₹10,000.</p>
              <!-- Fine example -->
              <div class="mt-3 flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-rose-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-rose-300 text-xs">
                  A book returned 3 days late will incur a fine of
                  <span class="font-bold text-rose-200">₹ {{ fineExample }}</span>
                </p>
              </div>
            </div>

            <!-- Submit -->
            <button type="submit" [disabled]="settingsForm.invalid || saving"
                    class="w-full py-4 rounded-2xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2"
                    [ngClass]="settingsForm.valid && !saving
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-400 hover:to-purple-500 shadow-lg shadow-indigo-500/25'
                      : 'bg-white/5 text-white/25 cursor-not-allowed border border-white/10'">
              <svg *ngIf="!saving" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <svg *ngIf="saving" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              {{ saving ? 'Saving...' : 'Save Settings' }}
            </button>

          </form>

          <!-- Success -->
          <div *ngIf="successMsg"
               class="mt-5 flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ successMsg }}
          </div>

          <!-- Error -->
          <div *ngIf="errorMsg"
               class="mt-5 flex items-center gap-3 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
            </svg>
            {{ errorMsg }}
          </div>
        </div>
      </div>

      <!-- Info card -->
      <div class="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 shadow-xl">
        <h3 class="text-white/70 text-sm font-bold mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          How it works
        </h3>
        <div class="space-y-3 text-sm text-white/40 leading-relaxed">
          <p>📅 When a book is issued, the due date is automatically set to <strong class="text-white/60">Allotment Date + Issue Period</strong>.</p>
          <p>⏰ If the book is not returned by the due date, a fine of <strong class="text-white/60">₹{{ currentFinePerDay }}/day</strong> accumulates every day.</p>
          <p>✅ Changes to these settings apply to <strong class="text-white/60">new allotments only</strong> — existing due dates are not affected.</p>
          <p>💾 Settings are saved to the server configuration file and persist across restarts.</p>
        </div>
      </div>

    </div>
  </div>
  `
})
export class AdminSettingsComponent implements OnInit {

  settingsForm!: FormGroup;
  loading = true;
  saving = false;
  successMsg = '';
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {}

  get dueDatePreview(): string {
    const days = this.settingsForm?.get('issueDays')?.value || 2;
    const d = new Date();
    d.setDate(d.getDate() + Number(days));
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  get fineExample(): number {
    return (this.settingsForm?.get('finePerDay')?.value || 0) * 3;
  }

  get currentFinePerDay(): number {
    return this.settingsForm?.get('finePerDay')?.value || 0;
  }

  ngOnInit(): void {
    this.settingsForm = this.fb.group({
      issueDays:  [2, [Validators.required, Validators.min(1), Validators.max(365)]],
      finePerDay: [5, [Validators.required, Validators.min(0), Validators.max(10000)]]
    });

    this.adminService.getSettings().subscribe({
      next: (s) => {
        this.settingsForm.patchValue({ issueDays: s.issueDays, finePerDay: s.finePerDay });
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.errorMsg = 'Failed to load settings.';
        this.cdr.markForCheck();
      }
    });
  }

  increment(field: string): void {
    const ctrl = this.settingsForm.get(field);
    if (ctrl) { ctrl.setValue(Number(ctrl.value) + 1); this.cdr.markForCheck(); }
  }

  decrement(field: string): void {
    const ctrl = this.settingsForm.get(field);
    if (ctrl && Number(ctrl.value) > 0) { ctrl.setValue(Number(ctrl.value) - 1); this.cdr.markForCheck(); }
  }

  save(): void {
    if (this.settingsForm.invalid || this.saving) return;
    this.saving = true;
    this.successMsg = '';
    this.errorMsg = '';
    this.cdr.markForCheck();

    this.adminService.updateSettings(this.settingsForm.value).subscribe({
      next: () => {
        this.successMsg = `Settings saved! Books will now be issued for ${this.settingsForm.value.issueDays} day(s) with a fine of ₹${this.settingsForm.value.finePerDay}/day.`;
        this.saving = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Failed to save settings.';
        this.saving = false;
        this.cdr.markForCheck();
      }
    });
  }
}
