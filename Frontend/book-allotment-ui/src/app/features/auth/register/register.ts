import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
 <div class="min-h-screen flex items-center justify-center
              bg-gradient-to-br from-purple-800 via-red-600 to-indigo-800">

    <form [formGroup]="form" (ngSubmit)="register()"
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

      <h2 class="text-center text-2xl font-semibold tracking-wide">
        Register
      </h2>

      <!-- Name -->
      <div class="flex items-center space-x-3">
        <span>👤</span>
        <input
          formControlName="name"
          placeholder="Name"
          class="w-full bg-transparent border-b border-white/60
                 focus:outline-none focus:border-white
                 placeholder-white/70 py-2"/>
      </div>

      <!-- Email -->
      <div class="flex items-center space-x-3">
        <span>✉</span>
        <input
          formControlName="email"
          placeholder="Email"
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

      <!-- Button -->
      <button
        class="w-full py-3 rounded-full
               bg-gradient-to-r from-red-500 to-blue-500
               hover:opacity-90
               font-semibold tracking-widest
               transition duration-300">

        REGISTER
      </button>

    </form>

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