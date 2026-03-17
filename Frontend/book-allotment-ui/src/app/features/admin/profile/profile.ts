import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 flex items-center justify-center p-6">

    <div class="w-full max-w-md">

      <div class="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

        <!-- Header -->
        <div class="relative bg-gradient-to-r from-amber-600/50 to-orange-600/50 px-8 py-8 text-center overflow-hidden">
          <div class="absolute -top-8 -right-8 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl"></div>
          <div class="absolute -bottom-8 -left-8 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl"></div>
          <div class="relative">
            <!-- Avatar from name -->
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl
                        bg-gradient-to-br from-amber-500 to-orange-500
                        border border-white/20 mb-4 shadow-xl text-3xl font-extrabold text-white">
              {{ initials }}
            </div>
            <h1 class="text-2xl font-extrabold text-white">Admin Profile</h1>
            <p class="text-amber-200/70 text-sm mt-1">Update your admin account details</p>
            <span class="inline-block mt-3 px-3 py-0.5 rounded-full text-xs font-bold
                         bg-amber-500/20 text-amber-300 border border-amber-500/30 tracking-wider uppercase">
              Administrator
            </span>
          </div>
        </div>

        <!-- Loading skeleton -->
        <div *ngIf="loadingProfile" class="px-8 py-10 flex flex-col gap-4">
          <div class="h-4 bg-white/5 rounded-lg animate-pulse w-1/3"></div>
          <div class="h-12 bg-white/5 rounded-xl animate-pulse"></div>
          <div class="h-4 bg-white/5 rounded-lg animate-pulse w-1/3 mt-2"></div>
          <div class="h-12 bg-white/5 rounded-xl animate-pulse"></div>
          <div class="h-4 bg-white/5 rounded-lg animate-pulse w-1/3 mt-2"></div>
          <div class="h-12 bg-white/5 rounded-xl animate-pulse"></div>
          <div class="h-12 bg-white/5 rounded-xl animate-pulse mt-2"></div>
        </div>

        <!-- Form -->
        <div *ngIf="!loadingProfile" class="px-8 py-8">
          <form [formGroup]="profileForm" (ngSubmit)="updateProfile()" class="space-y-5">

            <!-- Name -->
            <div>
              <label class="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Full Name</label>
              <div class="relative">
                <div class="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input type="text" formControlName="name" placeholder="Enter your full name"
                       class="w-full bg-white/5 border text-white placeholder-white/20 rounded-xl pl-10 pr-4 py-3 text-sm
                              transition-all duration-200 focus:outline-none focus:ring-2"
                       [ngClass]="profileForm.get('name')?.invalid && profileForm.get('name')?.touched
                         ? 'border-rose-500/50 focus:ring-rose-500/30'
                         : 'border-white/10 focus:ring-amber-500/40 focus:border-amber-500/50'" />
              </div>
              <p *ngIf="profileForm.get('name')?.invalid && profileForm.get('name')?.touched"
                 class="mt-1.5 text-xs text-rose-400">Name is required.</p>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Email Address</label>
              <div class="relative">
                <div class="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input type="email" formControlName="email" placeholder="Enter your email address"
                       class="w-full bg-white/5 border text-white placeholder-white/20 rounded-xl pl-10 pr-4 py-3 text-sm
                              transition-all duration-200 focus:outline-none focus:ring-2"
                       [ngClass]="profileForm.get('email')?.invalid && profileForm.get('email')?.touched
                         ? 'border-rose-500/50 focus:ring-rose-500/30'
                         : 'border-white/10 focus:ring-amber-500/40 focus:border-amber-500/50'" />
              </div>
              <div *ngIf="profileForm.get('email')?.touched && profileForm.get('email')?.errors as errors"
                   class="mt-1.5 text-xs text-rose-400">
                <span *ngIf="errors['required']">Email is required.</span>
                <span *ngIf="errors['email']">Please enter a valid email address.</span>
              </div>
            </div>

            <!-- New Password -->
            <div>
              <label class="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">
                New Password <span class="text-white/25 font-normal normal-case">(Optional)</span>
              </label>
              <div class="relative">
                <div class="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input [type]="showPassword ? 'text' : 'password'"
                       formControlName="newPassword"
                       placeholder="Leave blank to keep current password"
                       class="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-xl
                              pl-10 pr-11 py-3 text-sm transition-all duration-200
                              focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/50" />
                <button type="button" (click)="showPassword = !showPassword"
                        class="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  <svg *ngIf="!showPassword" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg *ngIf="showPassword" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Submit -->
            <button type="submit" [disabled]="profileForm.invalid || saving"
                    class="w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2"
                    [ngClass]="profileForm.valid && !saving
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40'
                      : 'bg-white/5 text-white/25 cursor-not-allowed border border-white/10'">
              <svg *ngIf="!saving" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <svg *ngIf="saving" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              {{ saving ? 'Saving...' : 'Update Profile' }}
            </button>

          </form>

          <!-- Success -->
          <div *ngIf="message && !errorMessage"
               class="mt-5 flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ message }}
          </div>

          <!-- Error -->
          <div *ngIf="errorMessage"
               class="mt-5 flex items-center gap-3 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
            </svg>
            {{ errorMessage }}
          </div>

        </div>
      </div>
    </div>
  </div>
  `
})
export class AdminProfileComponent implements OnInit {

  profileForm!: FormGroup;
  message = '';
  errorMessage = '';
  saving = false;
  loadingProfile = true;
  showPassword = false;
  initials = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name:        ['', [Validators.required]],
      email:       ['', [Validators.required, Validators.email]],
      newPassword: ['']
    });

    // Load current admin profile from backend and pre-fill form
    this.userService.getAdminProfile().subscribe({
      next: (profile) => {
        this.profileForm.patchValue({
          name:  profile.name,
          email: profile.email
        });
        this.initials = profile.name?.charAt(0).toUpperCase() || 'A';
        this.loadingProfile = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loadingProfile = false;
        this.errorMessage = 'Failed to load profile. Please refresh the page.';
        this.cdr.markForCheck();
      }
    });
  }

  updateProfile(): void {
    if (this.profileForm.invalid || this.saving) return;

    this.message = '';
    this.errorMessage = '';
    this.saving = true;
    this.cdr.markForCheck();

    this.userService.updateAdminProfile(this.profileForm.value).subscribe({
      next: () => {
        this.message = 'Profile updated successfully ✅';
        this.saving = false;
        // Update avatar initials to reflect new name
        this.initials = this.profileForm.get('name')?.value?.charAt(0).toUpperCase() || 'A';
        this.profileForm.get('newPassword')?.reset();
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Failed to update profile. Please try again.';
        this.saving = false;
        this.cdr.markForCheck();
      }
    });
  }
}
