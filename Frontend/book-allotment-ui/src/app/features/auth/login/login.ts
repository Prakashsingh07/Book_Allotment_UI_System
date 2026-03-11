import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `

<div class="min-h-screen flex">

  <!-- LEFT SIDE (Brand Section) -->
  <div class="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 
              items-center justify-center text-white p-12">

      <div class="max-w-md text-center space-y-6">

        <h1 class="text-4xl font-bold">
          Book Allotment System
        </h1>

        <p class="text-lg opacity-90">
          Manage books, track allotments and simplify your library workflow.
        </p>

        <div class="text-6xl">
          📚
        </div>

      </div>

  </div>


  <!-- RIGHT SIDE (LOGIN FORM) -->
  <div class="flex-1 flex items-center justify-center bg-gray-100">

    <form [formGroup]="form" (ngSubmit)="login()"
      class="w-[380px] bg-white rounded-3xl shadow-2xl p-10 space-y-6">

      <!-- Title -->
      <div class="text-center space-y-2">

        <div class="text-4xl">🔐</div>

        <h2 class="text-2xl font-bold text-gray-800">
          Welcome Back
        </h2>

        <p class="text-gray-400 text-sm">
          Login to continue
        </p>

      </div>


      <!-- Email -->
      <div>
        <label class="text-sm text-gray-600">Email</label>
        <input
          formControlName="email"
          placeholder="Enter your email"
          class="mt-1 w-full px-4 py-3 border rounded-xl
                 focus:ring-2 focus:ring-indigo-400 focus:outline-none"/>
      </div>


      <!-- Password -->
      <div>
        <label class="text-sm text-gray-600">Password</label>
        <input
          type="password"
          formControlName="password"
          placeholder="Enter password"
          class="mt-1 w-full px-4 py-3 border rounded-xl
                 focus:ring-2 focus:ring-indigo-400 focus:outline-none"/>
      </div>


      <!-- Remember -->
      <div class="flex justify-between text-sm text-gray-500">
        <label class="flex items-center space-x-2">
          <input type="checkbox">
          <span>Remember me</span>
        </label>

        <span class="cursor-pointer text-indigo-500 hover:underline">
          Forgot password?
        </span>
      </div>


      <!-- Button -->
      <button
        class="w-full py-3 bg-indigo-600 hover:bg-indigo-700
               text-white rounded-xl font-semibold
               transition duration-300 shadow-md">

        Sign In

      </button>


      <!-- Register Link -->
      <div class="text-center text-sm text-gray-500">
        Don’t have an account?
        <a routerLink="/register"
           class="text-indigo-600 cursor-pointer hover:underline font-semibold">
          Register
        </a>
      </div>

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

}