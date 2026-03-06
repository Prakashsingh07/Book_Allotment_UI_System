import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="min-h-screen bg-gray-100 p-8">

    <h1 class="text-3xl font-bold mb-6">
      Update Profile 👤
    </h1>

    <form [formGroup]="profileForm"
          (ngSubmit)="updateProfile()"
          class="bg-white p-8 rounded-2xl shadow-md max-w-lg">

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Name</label>
        <input type="text"
               formControlName="name"
               class="w-full border rounded-lg p-2">
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Email</label>
        <input type="email"
               formControlName="email"
               class="w-full border rounded-lg p-2">
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium mb-1">
          New Password (Optional)
        </label>
        <input type="password"
               formControlName="newPassword"
               class="w-full border rounded-lg p-2">
      </div>

      <button type="submit"
              class="bg-indigo-600 text-white px-6 py-2 rounded-lg">
        Update Profile
      </button>

    </form>

    <!-- Success Message -->
    <div *ngIf="message"
         class="mt-4 bg-green-100 text-green-700 p-3 rounded-lg">
      {{ message }}
    </div>

  </div>
  `
})
export class ProfileComponent implements OnInit {

  profileForm!: FormGroup;
  message = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: [''],
      email: [''],
      newPassword: ['']
    });
  }

  updateProfile() {
    this.userService.updateProfile(this.profileForm.value)
      .subscribe({
        next: (res: any) => {
          this.message = 'Profile updated successfully ✅';
          this.profileForm.get('newPassword')?.reset();
        }
      });
  }
}