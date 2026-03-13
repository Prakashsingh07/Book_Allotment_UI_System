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

      <!-- Card glow -->
      <div class="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur pointer-events-none"></div>

      <div class="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

        <!-- Card Header -->
        <div class="relative bg-gradient-to-r from-indigo-600/60 to-purple-600/60 px-8 py-8 text-center overflow-hidden">
          <div class="absolute -top-8 -right-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
          <div class="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
          <div class="relative">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl
                        bg-white/10 border border-white/20 mb-4 shadow-xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M5.121 17.804A9 9 0 1118.88 6.196M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 class="text-2xl font-extrabold text-white">Update Profile</h1>
            <p class="text-indigo-200/70 text-sm mt-1">Keep your information up to date</p>
          </div>
        </div>

        <!-- Form Body -->
        <div class="px-8 py-8">
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
                              transition-all duration-200 focus:outline-none focus:ring-2 focus:bg-white/8"
                       [ngClass]="profileForm.get('name')?.invalid && profileForm.get('name')?.touched
                         ? 'border-rose-500/50 focus:ring-rose-500/30'
                         : 'border-white/10 focus:ring-indigo-500/40 focus:border-indigo-500/50'" />
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
                              transition-all duration-200 focus:outline-none focus:ring-2 focus:bg-white/8"
                       [ngClass]="profileForm.get('email')?.invalid && profileForm.get('email')?.touched
                         ? 'border-rose-500/50 focus:ring-rose-500/30'
                         : 'border-white/10 focus:ring-indigo-500/40 focus:border-indigo-500/50'" />
              </div>
              <div *ngIf="profileForm.get('email')?.touched && profileForm.get('email')?.errors as errors"
                   class="mt-1.5 text-xs text-rose-400">
                <span *ngIf="errors['required']">Email is required.</span>
                <span *ngIf="errors['email']">Please enter a valid email address.</span>
              </div>
            </div>

            <!-- Password -->
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
                <input type="password" formControlName="newPassword" placeholder="Leave blank to keep current password"
                       class="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-xl
                              pl-10 pr-4 py-3 text-sm transition-all duration-200
                              focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 focus:bg-white/8" />
              </div>
            </div>

            <!-- Submit -->
            <button type="submit" [disabled]="profileForm.invalid"
                    class="w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2"
                    [ngClass]="profileForm.valid
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-400 hover:to-purple-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40'
                      : 'bg-white/5 text-white/25 cursor-not-allowed border border-white/10'">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Update Profile
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
export class ProfileComponent implements OnInit {

  profileForm!: FormGroup;
  message = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['']
    });
  }

  updateProfile() {
    if (this.profileForm.invalid) return;
    this.message = '';
    this.errorMessage = '';

    this.userService.updateProfile(this.profileForm.value).subscribe({
      next: () => {
        this.message = 'Profile updated successfully ✅';
        this.profileForm.get('newPassword')?.reset();
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Failed to update profile. Please try again.';
        this.cdr.markForCheck();
      }
    });
  }
}
