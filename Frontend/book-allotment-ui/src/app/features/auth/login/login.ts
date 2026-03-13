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

      <!-- Animated background blobs -->
      <div class="absolute top-0 left-0 w-full h-full">
        <div class="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style="animation-delay:1s"></div>
        <div class="absolute top-3/4 left-1/3 w-48 h-48 bg-pink-600/15 rounded-full blur-2xl animate-pulse" style="animation-delay:2s"></div>
      </div>

      <!-- Grid overlay -->
      <div class="absolute inset-0 opacity-5"
           style="background-image: linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px); background-size: 40px 40px;">
      </div>

      <!-- Content -->
      <div class="relative z-10 max-w-md text-center space-y-8">

        <!-- Logo -->
        <div class="flex items-center justify-center gap-3 mb-2">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600
                      flex items-center justify-center shadow-2xl shadow-indigo-500/40">
            <span class="text-2xl">📚</span>
          </div>
          <div class="text-left">
            <p class="text-white font-extrabold text-xl leading-none">Book</p>
            <p class="text-indigo-300 font-extrabold text-xl leading-none">Allotment</p>
          </div>
        </div>

        <div class="w-16 h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent mx-auto"></div>

        <div>
          <h2 class="text-4xl font-extrabold text-white leading-tight">
            Welcome back to your<br/>
            <span class="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Library Hub
            </span>
          </h2>
          <p class="text-white/50 mt-4 text-sm leading-relaxed">
            Manage books, track allotments, and simplify your entire library workflow in one place.
          </p>
        </div>

        <!-- Feature pills -->
        <div class="flex flex-wrap justify-center gap-2">
          <span *ngFor="let f of features"
                class="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 text-white/60 border border-white/10">
            {{ f }}
          </span>
        </div>

        <!-- Floating stats -->
        <div class="grid grid-cols-3 gap-3 mt-4">
          <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
            <p class="text-2xl font-extrabold text-white">500+</p>
            <p class="text-white/40 text-xs mt-1">Books</p>
          </div>
          <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
            <p class="text-2xl font-extrabold text-white">200+</p>
            <p class="text-white/40 text-xs mt-1">Users</p>
          </div>
          <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
            <p class="text-2xl font-extrabold text-white">99%</p>
            <p class="text-white/40 text-xs mt-1">Uptime</p>
          </div>
        </div>

      </div>
    </div>

    <!-- ====== RIGHT PANEL ====== -->
    <div class="flex-1 flex items-center justify-center p-6 relative">

      <!-- Subtle blob -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                  w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Form card -->
      <div class="relative w-full max-w-md">

        <!-- Card glow -->
        <div class="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-3xl blur"></div>

        <div class="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

          <!-- Header -->
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl
                        bg-gradient-to-br from-indigo-500/30 to-purple-600/30
                        border border-indigo-500/30 mb-4 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 class="text-2xl font-extrabold text-white">Sign In</h1>
            <p class="text-white/40 text-sm mt-1">Enter your credentials to continue</p>
          </div>

          <!-- Error Banner -->
          <div *ngIf="errorMsg"
               class="mb-5 flex items-center gap-3 px-4 py-3 rounded-xl
                      bg-rose-500/10 border border-rose-500/25 text-rose-400 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
            </svg>
            {{ errorMsg }}
          </div>

          <!-- Form -->
          <form [formGroup]="form" (ngSubmit)="login()" class="space-y-5">

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
                         : 'border-white/10 focus:ring-indigo-500/40 focus:border-indigo-500/50'" />
              </div>
              <p *ngIf="form.get('email')?.invalid && form.get('email')?.touched"
                 class="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01" />
                </svg>
                Please enter a valid email
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
                              focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 focus:bg-white/8" />
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
            <button type="submit" [disabled]="loading"
                    class="w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-200 mt-2
                           bg-gradient-to-r from-indigo-500 to-purple-600 text-white
                           hover:from-indigo-400 hover:to-purple-500
                           shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2.5">
              <svg *ngIf="loading" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <svg *ngIf="!loading" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              {{ loading ? 'Signing in...' : 'Sign In' }}
            </button>

          </form>

          <!-- Footer -->
          <div class="mt-6 pt-6 border-t border-white/5 text-center">
            <p class="text-white/40 text-sm">
              Don't have an account?
              <a routerLink="/register" class="text-indigo-400 hover:text-indigo-300 font-semibold ml-1 transition-colors">
                Create one →
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  </div>
  `
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  errorMsg = '';
  showPassword = false;

  features = ['Book Tracking', 'Smart Search', 'Fine Management', 'Role Access', 'Activity Logs'];

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  login() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.loading = true;
    this.errorMsg = '';

    this.auth.login(this.form.value).subscribe({
      next: (res: any) => {
        this.auth.saveToken(res.token);
        const role = this.auth.getRole();
        this.router.navigate([role === 'Admin' ? '/admin/dashboard' : '/user/dashboard']);
      },
      error: () => {
        this.loading = false;
        this.errorMsg = 'Invalid email or password. Please try again.';
      }
    });
  }
}
