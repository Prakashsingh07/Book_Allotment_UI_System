import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
//import {Dashboard} from '../../admin/dashboard/dashboard'

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
<div class="min-h-screen flex flex-col">

    <!-- NAVBAR -->
 

    <!-- Gradient Background Section -->
    <div class="flex-1 flex items-center justify-center
                bg-gradient-to-br from-purple-800 via-red-600 to-indigo-800">

      <!-- Glass Login Card -->
      <form [formGroup]="form" (ngSubmit)="login()"
        class="w-[380px] p-10 rounded-3xl
               bg-white/10 backdrop-blur-xl
               border border-white/20
               shadow-[0_30px_80px_rgba(0,0,0,0.4)]
               text-white space-y-6">

        <!-- Avatar -->
        <div class="flex justify-center">
          <div class="w-24 h-24 rounded-full 
                      bg-white/20 flex items-center justify-center">
            <span class="text-3xl">👤</span>
          </div>
        </div>

        <!-- Email -->
        <div class="flex items-center space-x-3">
          <span>✉</span>
          <input
            formControlName="email"
            placeholder="Email ID"
            class="w-full bg-transparent border-b border-white/60
                   focus:outline-none focus:border-white
                   placeholder-white/70 py-2"/>
        </div>

        <!-- Password -->
        <div class="flex items-center space-x-3">
          <span>🔒</span>
          <input
            type="password"
            formControlName="password"
            placeholder="Password"
            class="w-full bg-transparent border-b border-white/60
                   focus:outline-none focus:border-white
                   placeholder-white/70 py-2"/>
        </div>

        <!-- Remember / Forgot -->
        <div class="flex justify-between items-center text-sm text-white/80">
          <label class="flex items-center space-x-2">
            <input type="checkbox" class="accent-red-500"/>
            <span>Remember me</span>
          </label>
          <span class="hover:underline cursor-pointer">
            Forgot Password?
          </span>
        </div>

        <!-- Button -->
        <button
          class="w-full py-3 rounded-full
                 bg-gradient-to-r from-red-500 to-blue-500
                 hover:opacity-90
                 font-semibold tracking-widest
                 transition duration-300">

          LOGIN
        </button>

      </form>

    </div>

  </div>
  `
})
export class LoginComponent {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  login() {
    this.auth.login(this.form.value).subscribe((res:any) => {
  this.auth.saveToken(res.token);
  const role = this.auth.getRole();

      if (role === 'Admin') {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.router.navigate(['/user/dashboard']);
      }
    });
  }

//   login() {
//   console.log("Login clicked");

//   this.auth.login(this.form.value).subscribe((res:any) => {

//     console.log("Response received:", res);

//     this.auth.saveToken(res.token);

//     const role = this.auth.getRole();
//     console.log("Extracted role:", role);

//     if (role === 'Admin') {
//       this.router.navigate(['/admin/dashboard']);
//     } else {
//       this.router.navigate(['/user/dashboard']);
//     }

//   }, error => {
//     console.error("Login error:", error);
//   });
// }
}
