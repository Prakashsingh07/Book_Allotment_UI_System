import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';

function passwordChangeValidator(form: AbstractControl): ValidationErrors | null {
  const current = form.get('currentPassword')?.value;
  const next    = form.get('newPassword')?.value;
  if (next && !current) return { currentPasswordRequired: true };
  return null;
}

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <div class="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

        <!-- Header with avatar -->
        <div class="relative bg-gradient-to-r from-indigo-600/60 to-purple-600/60 px-8 py-8 text-center overflow-hidden">
          <div class="absolute -top-8 -right-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
          <div class="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
          <div class="relative">

            <!-- Avatar with upload overlay -->
            <div class="relative inline-block mb-4">
              <!-- Hidden file input -->
              <input #fileInput type="file" accept="image/*" class="hidden" (change)="onFileSelected($event)" />

              <!-- Avatar circle -->
              <div class="w-24 h-24 rounded-2xl border-2 border-white/20 shadow-xl overflow-hidden cursor-pointer"
                   (click)="fileInput.click()"
                   title="Click to change photo">
                <!-- Uploaded photo -->
                <img *ngIf="avatarUrl" [src]="avatarUrl" alt="Profile photo"
                     class="w-full h-full object-cover" />
                <!-- Default avatar (initials) -->
                <div *ngIf="!avatarUrl"
                     class="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600
                            flex items-center justify-center text-3xl font-extrabold text-white">
                  {{ initials }}
                </div>
              </div>

              <!-- Camera overlay button -->
              <button type="button" (click)="fileInput.click()"
                      class="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-indigo-500 border-2 border-slate-900
                             flex items-center justify-center shadow-lg
                             hover:bg-indigo-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>

            <h1 class="text-2xl font-extrabold text-white">Update Profile</h1>
            <p class="text-indigo-200/70 text-sm mt-1">Keep your information up to date</p>
            <p class="text-indigo-200/40 text-xs mt-1">Click the photo to change it</p>
          </div>
        </div>

        <!-- Form -->
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
                       class="w-full bg-white/5 border text-white placeholder-white/20 rounded-xl pl-10 pr-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:bg-white/8"
                       [ngClass]="profileForm.get('name')?.invalid && profileForm.get('name')?.touched
                         ? 'border-rose-500/50 focus:ring-rose-500/30' : 'border-white/10 focus:ring-indigo-500/40 focus:border-indigo-500/50'" />
              </div>
              <p *ngIf="profileForm.get('name')?.invalid && profileForm.get('name')?.touched" class="mt-1.5 text-xs text-rose-400">Name is required.</p>
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
                       class="w-full bg-white/5 border text-white placeholder-white/20 rounded-xl pl-10 pr-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:bg-white/8"
                       [ngClass]="profileForm.get('email')?.invalid && profileForm.get('email')?.touched
                         ? 'border-rose-500/50 focus:ring-rose-500/30' : 'border-white/10 focus:ring-indigo-500/40 focus:border-indigo-500/50'" />
              </div>
              <div *ngIf="profileForm.get('email')?.touched && profileForm.get('email')?.errors as errors" class="mt-1.5 text-xs text-rose-400">
                <span *ngIf="errors['required']">Email is required.</span>
                <span *ngIf="errors['email']">Please enter a valid email address.</span>
              </div>
            </div>

            <!-- Divider -->
            <div class="flex items-center gap-3 py-1">
              <div class="flex-1 h-px bg-white/10"></div>
              <span class="text-white/25 text-xs font-semibold uppercase tracking-wider">Change Password</span>
              <div class="flex-1 h-px bg-white/10"></div>
            </div>
            <p class="text-white/30 text-xs -mt-2">Leave both fields blank to keep your current password.</p>

            <!-- Current Password -->
            <div>
              <label class="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">
                Current Password <span class="text-white/25 font-normal normal-case">(Required to change password)</span>
              </label>
              <div class="relative">
                <div class="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input [type]="showCurrent ? 'text' : 'password'" formControlName="currentPassword"
                       placeholder="Enter your current password"
                       class="w-full bg-white/5 border text-white placeholder-white/20 rounded-xl pl-10 pr-11 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:bg-white/8"
                       [ngClass]="profileForm.errors?.['currentPasswordRequired'] && profileForm.get('currentPassword')?.touched
                         ? 'border-rose-500/50 focus:ring-rose-500/30' : 'border-white/10 focus:ring-indigo-500/40 focus:border-indigo-500/50'" />
                <button type="button" (click)="showCurrent = !showCurrent"
                        class="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  <svg *ngIf="!showCurrent" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  <svg *ngIf="showCurrent" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                </button>
              </div>
              <p *ngIf="profileForm.errors?.['currentPasswordRequired'] && profileForm.get('currentPassword')?.touched"
                 class="mt-1.5 text-xs text-rose-400">Current password is required to set a new password.</p>
            </div>

            <!-- New Password -->
            <div>
              <label class="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">New Password</label>
              <div class="relative">
                <div class="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </div>
                <input [type]="showNew ? 'text' : 'password'" formControlName="newPassword"
                       placeholder="Enter new password (min. 6 characters)"
                       class="w-full bg-white/5 border text-white placeholder-white/20 rounded-xl pl-10 pr-11 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:bg-white/8"
                       [ngClass]="profileForm.get('newPassword')?.invalid && profileForm.get('newPassword')?.touched
                         ? 'border-rose-500/50 focus:ring-rose-500/30' : 'border-white/10 focus:ring-indigo-500/40 focus:border-indigo-500/50'" />
                <button type="button" (click)="showNew = !showNew"
                        class="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  <svg *ngIf="!showNew" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  <svg *ngIf="showNew" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                </button>
              </div>
              <div *ngIf="profileForm.get('newPassword')?.invalid && profileForm.get('newPassword')?.touched" class="mt-1.5 text-xs text-rose-400">
                <span *ngIf="profileForm.get('newPassword')?.errors?.['minlength']">New password must be at least 6 characters.</span>
              </div>
            </div>

            <!-- Submit -->
            <button type="submit" [disabled]="profileForm.invalid || saving"
                    class="w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2"
                    [ngClass]="profileForm.valid && !saving
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-400 hover:to-purple-500 shadow-lg shadow-indigo-500/25'
                      : 'bg-white/5 text-white/25 cursor-not-allowed border border-white/10'">
              <svg *ngIf="!saving" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              <svg *ngIf="saving" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
              {{ saving ? 'Saving...' : 'Update Profile' }}
            </button>

          </form>

          <!-- Remove photo button -->
          <button *ngIf="avatarUrl" type="button" (click)="removePhoto()"
                  class="mt-3 w-full py-2.5 rounded-xl text-xs font-bold text-white/30
                         border border-white/10 hover:bg-rose-500/10 hover:text-rose-400
                         hover:border-rose-500/30 transition-all">
            Remove Photo
          </button>

          <!-- Success -->
          <div *ngIf="message && !errorMessage"
               class="mt-5 flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {{ message }}
          </div>

          <!-- Error -->
          <div *ngIf="errorMessage"
               class="mt-5 flex items-center gap-3 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" /></svg>
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
  message      = '';
  errorMessage = '';
  saving       = false;
  showCurrent  = false;
  showNew      = false;
  initials     = '';
  avatarUrl    = '';   // base64 data URL or empty

  private readonly AVATAR_KEY = 'user_profile_avatar';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name:            ['', [Validators.required]],
      email:           ['', [Validators.required, Validators.email]],
      currentPassword: [''],
      newPassword:     ['', [Validators.minLength(6)]]
    }, { validators: passwordChangeValidator });

    // Pre-fill from token
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const name  = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']           || '';
        const email = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']   || '';
        this.profileForm.patchValue({ name, email });
        this.initials = name.charAt(0).toUpperCase() || 'U';
      }
    } catch {}

    // Load saved avatar from localStorage
    this.avatarUrl = localStorage.getItem(this.AVATAR_KEY) || '';
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Max 2 MB guard
    if (file.size > 2 * 1024 * 1024) {
      this.errorMessage = 'Image must be smaller than 2 MB.';
      this.cdr.markForCheck();
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.avatarUrl = reader.result as string;
      localStorage.setItem(this.AVATAR_KEY, this.avatarUrl);
      this.message      = 'Profile photo updated!';
      this.errorMessage = '';
      this.cdr.markForCheck();
      setTimeout(() => { this.message = ''; this.cdr.markForCheck(); }, 3000);
    };
    reader.readAsDataURL(file);
  }

  removePhoto(): void {
    this.avatarUrl = '';
    localStorage.removeItem(this.AVATAR_KEY);
    this.cdr.markForCheck();
  }

  updateProfile(): void {
    if (this.profileForm.invalid || this.saving) return;
    this.message = '';
    this.errorMessage = '';
    this.saving = true;
    this.cdr.markForCheck();

    this.userService.updateProfile(this.profileForm.value).subscribe({
      next: () => {
        this.message = 'Profile updated successfully ✅';
        this.saving  = false;
        this.initials = this.profileForm.get('name')?.value?.charAt(0).toUpperCase() || 'U';
        this.profileForm.patchValue({ currentPassword: '', newPassword: '' });
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to update profile. Please try again.';
        this.saving = false;
        this.cdr.markForCheck();
      }
    });
  }
}
