import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestService } from '../../../core/services/request.service';

@Component({
  standalone: true,
  imports: [CommonModule],
 template: `
<div class="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-8">

  <!-- Header -->
  <div class="flex justify-between items-center mb-8">
    <h2 class="text-3xl font-bold text-gray-800">
      📌 Pending Requests
    </h2>

    <span class="bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full text-sm font-semibold shadow">
      {{ requests.length }} Pending
    </span>
  </div>

  <!-- Empty State -->
  <div *ngIf="requests.length === 0"
       class="bg-white p-6 rounded-2xl shadow text-center text-gray-500">
    🎉 No pending requests right now!
  </div>

  <!-- Request Cards -->
  <div class="grid md:grid-cols-2 gap-6">

    <div *ngFor="let req of requests"
         class="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 border border-gray-100">

      <!-- Top Section -->
      <div class="flex items-center gap-4 mb-4">

        <!-- Avatar -->
        <div class="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow">
          {{ req.userName?.charAt(0) }}
        </div>

        <div>
          <h3 class="text-lg font-bold text-gray-800">
            {{ req.bookTitle }}
          </h3>
          <p class="text-gray-600 text-sm">
            Requested by <span class="font-semibold">{{ req.userName }}</span>
          </p>
        </div>

      </div>

      <!-- Date + Status -->
      <div class="flex justify-between items-center mb-4">
        <p class="text-sm text-gray-500">
          {{ req.requestDate | date:'medium' }}
        </p>

        <span class="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
          Pending
        </span>
      </div>

      <!-- Buttons -->
      <div class="flex gap-3">

        <button 
          (click)="approve(req.id)"
          class="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl transition transform hover:scale-105 shadow-md">
          ✔ Approve
        </button>

        <button 
          (click)="reject(req.id)"
          class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl transition transform hover:scale-105 shadow-md">
          ✖ Reject
        </button>

      </div>

    </div>

  </div>

</div>
`
})
export class PendingRequestsComponent implements OnInit {

  requests: any[] = [];

  constructor(private requestService: RequestService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.requestService.getPending()
      .subscribe(res => this.requests = res);
  }

 approve(id: number) {
  this.requestService.approve(id)
    .subscribe(() => {
      this.requests = this.requests.filter(r => r.id !== id);
    });
}

reject(id: number) {
  this.requestService.reject(id)
    .subscribe(() => {
      this.load(); // safest way
    });
}
}