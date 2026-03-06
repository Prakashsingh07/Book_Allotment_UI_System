import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="min-h-screen bg-gray-100 p-8">

    <h1 class="text-3xl font-bold mb-6">
      My Activity 📚
    </h1>

    <!-- Loading -->
    <div *ngIf="loading" class="text-center text-gray-500">
      Loading activity...
    </div>

    <!-- Table -->
    <div *ngIf="!loading"
         class="bg-white rounded-2xl shadow-md overflow-x-auto">

      <table class="min-w-full divide-y divide-gray-200">

        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-semibold">Book</th>
            <th class="px-6 py-3 text-left text-sm font-semibold">Allot Date</th>
            <th class="px-6 py-3 text-left text-sm font-semibold">Due Date</th>
            <th class="px-6 py-3 text-left text-sm font-semibold">Return Date</th>
            <th class="px-6 py-3 text-left text-sm font-semibold">Status</th>
            <th class="px-6 py-3 text-left text-sm font-semibold">Fine (₹)</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200">

          <tr *ngFor="let item of activity">

            <td class="px-6 py-4">
              {{ item.bookTitle }}
            </td>

            <td class="px-6 py-4">
              {{ item.allotDate | date:'mediumDate' }}
            </td>

            <td class="px-6 py-4">
              {{ item.dueDate | date:'mediumDate' }}
            </td>

            <td class="px-6 py-4">
              {{ item.returnDate ? (item.returnDate | date:'mediumDate') : '-' }}
            </td>

            <td class="px-6 py-4">
              <span
                [ngClass]="{
                  'text-green-600 font-semibold': item.status === 'Active',
                  'text-red-600 font-semibold': item.status === 'Overdue',
                  'text-blue-600 font-semibold': item.status === 'Returned'
                }">
                {{ item.status }}
              </span>
            </td>

            <td class="px-6 py-4 font-semibold">
              ₹ {{ item.fine }}
            </td>

          </tr>

          <!-- No Data -->
          <tr *ngIf="activity.length === 0">
            <td colspan="6"
                class="text-center text-gray-500 py-6">
              No activity found.
            </td>
          </tr>

        </tbody>

      </table>

    </div>

  </div>
  `
})
export class MyActivityComponent implements OnInit {

  activity: any[] = [];
  loading = true;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getMyActivity()
      .subscribe({
        next: (res) => {
          this.activity = res;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }
}