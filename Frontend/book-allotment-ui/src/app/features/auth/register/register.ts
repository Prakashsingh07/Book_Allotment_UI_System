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
          Create an account and start exploring your library dashboard.
        </p>

        <div class="text-6xl">
          📚
        </div>

      </div>

  </div>


  <!-- RIGHT SIDE (REGISTER FORM) -->
  <div class="flex-1 flex items-center justify-center bg-gray-100">

    <form [formGroup]="form" (ngSubmit)="register()"
      class="w-[380px] bg-white rounded-3xl shadow-2xl p-10 space-y-6">

      <!-- Title -->
      <div class="text-center space-y-2">

        <div class="text-4xl">📝</div>

        <h2 class="text-2xl font-bold text-gray-800">
          Create Account
        </h2>

        <p class="text-gray-400 text-sm">
          Register to get started
        </p>

      </div>


      <!-- Name -->
      <div>
        <label class="text-sm text-gray-600">Full Name</label>
        <input
          formControlName="name"
          placeholder="Enter your name"
          class="mt-1 w-full px-4 py-3 border rounded-xl
                 focus:ring-2 focus:ring-indigo-400 focus:outline-none"/>
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


      <!-- Button -->
      <button
        class="w-full py-3 bg-indigo-600 hover:bg-indigo-700
               text-white rounded-xl font-semibold
               transition duration-300 shadow-md">

        Register

      </button>


      <!-- Login Link -->
      <div class="text-center text-sm text-gray-500">
        Already have an account?
        <a routerLink="/login"
           class="text-indigo-600 cursor-pointer hover:underline font-semibold">
          Login
        </a>
      </div>

    </form>

  </div>

</div>

  `
})
export class RegisterComponent {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: [''],
      email: [''],
      password: ['']
    });
  }

  register() {
    this.auth.register(this.form.value).subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

}
