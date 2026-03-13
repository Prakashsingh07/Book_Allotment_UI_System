import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
  <div class="min-h-screen flex bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 overflow-hidden">

    <!-- ====== LEFT PANEL ====== -->
    <div class="hidden lg:flex w-1/2 relative items-center justify-center p-12 overflow-hidden">

      <!-- Animated blobs -->
      <div class="absolute top-0 left-0 w-full h-full">
        <div class="absolute top-1/3 left-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-1/3 right-1/4 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style="animation-delay:1.2s"></div>
        <div class="absolute top-2/3 left-1/2 w-48 h-48 bg-pink-600/15 rounded-full blur-2xl animate-pulse" style="animation-delay:2.4s"></div>
      </div>

      <!-- Grid overlay -->
      <div class="absolute inset-0 opacity-5"
           style="background-image: linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px); background-size: 40px 40px;">
      </div>

      <!-- Content -->
      <div class="relative z-10 max-w-md text-center space-y-8">

        <!-- Logo -->
        <div class="flex items-center justify-center gap-3">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600
                      flex items-center justify-center shadow-2xl shadow-indigo-500/40">
            <span class="text-2xl">📚</span>
          </div>
          <div class="text-left">
            <p class="text-white font-extrabold text-xl leading-none">Book</p>
            <p class="text-indigo-300 font-extrabold text-xl leading-none">Allotment</p>
          </div>
        </div>

        <div class="w-16 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto"></div>

        <div>
          <h2 class="text-4xl font-extrabold text-white leading-tight">
            Join your<br/>
            <span class="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Library Community
            </span>
          </h2>
          <p class="text-white/50 mt-4 text-sm leading-relaxed">
            Create an account and start browsing, requesting and tracking books — all from one smart dashboard.
          </p>
        </div>

        <!-- Steps -->
        <div class="space-y-3 text-left">
          <div *ngFor="let step of steps; let i = index"
               class="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
            <div class="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-extrabold flex-shrink-0"
                 [ngClass]="stepColors[i]">
              {{ i + 1 }}
            </div>
            <p class="text-white/60 text-sm">{{ step }}</p>
          </div>
        </div>

      </div>
    </div>

    <!-- ====== RIGHT PANEL ====== -->
    <div class="flex-1 flex items-center justify-center p-6 relative">

      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                  w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Form card -->
      <div class="relative w-full max-w-md">

        <!-- Card glow -->
        <div class="absolute -inset-0.5 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-3xl blur"></div>

        <div class="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

          <!-- Success banner -->
          <div *ngIf="successMsg"
               class="mb-5 flex items-center gap-3 px-4 py-3 rounded-xl
                      bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ successMsg }}
          </div>

          <!-- Error banner -->
          <div *ngIf="errorMsg"
               class="mb-5 flex items-center gap-3 px-4 py-3 rounded-xl
                      bg-rose-500/10 border border-rose-500/25 text-rose-400 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
            </svg>
            {{ errorMsg }}
          </div>

          <!-- Header -->
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl
                        bg-gradient-to-br from-purple-500/30 to-pink-600/30
                        border border-purple-500/30 mb-4 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 class="text-2xl font-extrabold text-white">Create Account</h1>
            <p class="text-white/40 text-sm mt-1">Fill in your details to get started</p>
          </div>

          <!-- Form -->
          <form [formGroup]="form" (ngSubmit)="register()" class="space-y-5">

            <!-- Name -->
            <div>
              <label class="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Full Name</label>
              <div class="relative">
                <div class="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input formControlName="name" type="text" placeholder="John Doe"
                       class="w-full bg-white/5 border text-white placeholder-white/20 rounded-xl
                              pl-10 pr-4 py-3 text-sm transition-all duration-200
                              focus:outline-none focus:ring-2 focus:bg-white/8"
                       [ngClass]="form.get('name')?.invalid && form.get('name')?.touched
                         ? 'border-rose-500/50 focus:ring-rose-500/30'
                         : 'border-white/10 focus:ring-purple-500/40 focus:border-purple-500/50'" />
              </div>
              <p *ngIf="form.get('name')?.invalid && form.get('name')?.touched"
                 class="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01" />
                </svg>
                Name must be at least 3 characters
              </p>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Email Address</label>
              <div class="relative">
                <div class="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input formControlName="email" type="email" placeholder="you@example.com"
                       class="w-full bg-white/5 border text-white placeholder-white/20 rounded-xl
                              pl-10 pr-4 py-3 text-sm transition-all duration-200
                              focus:outline-none focus:ring-2 focus:bg-white/8"
                       [ngClass]="form.get('email')?.invalid && form.get('email')?.touched
                         ? 'border-rose-500/50 focus:ring-rose-500/30'
                         : 'border-white/10 focus:ring-purple-500/40 focus:border-purple-500/50'" />
              </div>
              <p *ngIf="form.get('email')?.invalid && form.get('email')?.touched"
                 class="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01" />
                </svg>
                Please enter a valid email address
              </p>
            </div>

            <!-- Password -->
            <div>
              <label class="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Password</label>
              <div class="relative">
                <div class="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input formControlName="password" [type]="showPassword ? 'text' : 'password'" placeholder="Enter your password"
                       class="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-xl
                              pl-10 pr-12 py-3 text-sm transition-all duration-200
                              focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/50 focus:bg-white/8" />
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

              <!-- Password strength meter (cosmetic only) -->
              <div *ngIf="form.get('password')?.value" class="mt-2">
                <div class="flex gap-1">
                  <div *ngFor="let s of [1,2,3,4]"
                       class="flex-1 h-1 rounded-full transition-all duration-300"
                       [ngClass]="passwordStrength >= s ? strengthColor : 'bg-white/10'"></div>
                </div>
                <p class="text-xs mt-1" [ngClass]="strengthTextColor">{{ strengthLabel }}</p>
              </div>
            </div>

            <!-- Submit -->
            <button type="submit" [disabled]="loading"
                    class="w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-200 mt-2
                           bg-gradient-to-r from-purple-500 to-pink-600 text-white
                           hover:from-purple-400 hover:to-pink-500
                           shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2.5">
              <svg *ngIf="loading" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <svg *ngIf="!loading" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              {{ loading ? 'Creating account...' : 'Create Account' }}
            </button>

          </form>

          <!-- Footer -->
          <div class="mt-6 pt-6 border-t border-white/5 text-center">
            <p class="text-white/40 text-sm">
              Already have an account?
              <a routerLink="/login" class="text-purple-400 hover:text-purple-300 font-semibold ml-1 transition-colors">
                Sign in →
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  </div>
  `
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  errorMsg = '';
  successMsg = '';
  showPassword = false;

  steps = [
    'Create your free account in seconds',
    'Browse hundreds of available books',
    'Request and track your allotments'
  ];
  stepColors = ['bg-indigo-500/20 text-indigo-400', 'bg-purple-500/20 text-purple-400', 'bg-pink-500/20 text-pink-400'];

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  get passwordStrength(): number {
    const p = this.form.get('password')?.value || '';
    let score = 0;
    if (p.length >= 4) score++;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p) || /[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  }

  get strengthColor(): string {
    const colors = ['bg-rose-500', 'bg-amber-500', 'bg-yellow-400', 'bg-emerald-500'];
    return colors[this.passwordStrength - 1] || 'bg-rose-500';
  }

  get strengthTextColor(): string {
    const colors = ['text-rose-400', 'text-amber-400', 'text-yellow-400', 'text-emerald-400'];
    return colors[this.passwordStrength - 1] || 'text-rose-400';
  }

  get strengthLabel(): string {
    const labels = ['Weak', 'Fair', 'Good', 'Strong'];
    return labels[this.passwordStrength - 1] || 'Weak';
  }

  register() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    this.auth.register(this.form.value).subscribe({
      next: () => {
        this.successMsg = 'Account created! Redirecting to login...';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: () => {
        this.loading = false;
        this.errorMsg = 'Registration failed. This email may already be in use.';
      }
    });
  }
}
