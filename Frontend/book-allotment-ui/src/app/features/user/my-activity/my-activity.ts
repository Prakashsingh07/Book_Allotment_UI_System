import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { RequestService } from '../../../core/services/request.service';
import { interval, Subscription } from 'rxjs';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-6">

    <div class="mb-8">
      <h1 class="text-4xl font-extrabold text-white tracking-tight">My Activity 📚</h1>
      <p class="text-indigo-300 text-sm mt-2">Track your borrowed books, due dates and fines</p>
    </div>

    <div *ngIf="loading" class="flex flex-col items-center justify-center py-24 gap-4">
      <div class="w-14 h-14 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-indigo-300 text-sm">Loading your activity...</p>
    </div>

    <ng-container *ngIf="!loading">

      <!-- Stats Row -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-gradient-to-br from-indigo-600/30 to-indigo-700/30 backdrop-blur-sm rounded-2xl border border-indigo-500/20 p-5 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-indigo-500/30 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <p class="text-xs text-indigo-300">Total</p>
            <p class="text-3xl font-extrabold text-white">{{ activity.length }}</p>
          </div>
        </div>
        <div class="bg-gradient-to-br from-emerald-600/30 to-emerald-700/30 backdrop-blur-sm rounded-2xl border border-emerald-500/20 p-5 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-xs text-emerald-300">Active</p>
            <p class="text-3xl font-extrabold text-white">{{ countByStatus('Active') }}</p>
          </div>
        </div>
        <div class="bg-gradient-to-br from-rose-600/30 to-rose-700/30 backdrop-blur-sm rounded-2xl border border-rose-500/20 p-5 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-rose-500/30 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-rose-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-xs text-rose-300">Overdue</p>
            <p class="text-3xl font-extrabold text-white">{{ countByStatus('Overdue') }}</p>
          </div>
        </div>
        <div class="bg-gradient-to-br from-amber-600/30 to-amber-700/30 backdrop-blur-sm rounded-2xl border border-amber-500/20 p-5 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-amber-500/30 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-amber-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-xs text-amber-300">Total Fine</p>
            <p class="text-3xl font-extrabold text-white">₹{{ totalFine() }}</p>
          </div>
        </div>
      </div>

      <!-- Table Card -->
      <div class="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div class="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 class="text-white font-bold">Transaction History</h2>
            <p class="text-white/40 text-xs mt-0.5">All your book borrowing records</p>
          </div>
          <div class="flex items-center gap-3">
            <div *ngIf="hasOverdue()" class="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 rounded-full px-3 py-1">
              <span class="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
              <span class="text-rose-400 text-xs font-semibold">Fine updating live</span>
            </div>
            <div class="text-xs text-white/30 font-medium">{{ activity.length }} record{{ activity.length !== 1 ? 's' : '' }}</div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-white/10">
                <th class="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Book</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Allot Date</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Due Date</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Return Date</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Fine</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr *ngFor="let item of activity"
                  class="hover:bg-white/5 transition-colors duration-150"
                  [class.bg-rose-500/5]="getLiveStatus(item) === 'Overdue' && !item.finePaid">

                <!-- Book -->
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="relative w-10 h-12 flex-shrink-0 rounded-lg overflow-hidden">
                      <div class="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600"></div>
                      <img *ngIf="item.imageUrl" [src]="item.imageUrl" class="absolute inset-0 w-full h-full object-cover" alt="cover">
                      <div *ngIf="!item.imageUrl" class="absolute inset-0 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    </div>
                    <span class="font-semibold text-white text-sm">{{ item.bookTitle }}</span>
                  </div>
                </td>

                <!-- Allot Date -->
                <td class="px-6 py-4 text-sm text-white/50">{{ item.allotDate | date:'mediumDate' }}</td>

                <!-- Due Date -->
                <td class="px-6 py-4 text-sm font-medium">
                  <ng-container *ngIf="item.dueDate; else noDue">
                    <span [class.text-rose-400]="getLiveStatus(item) === 'Overdue' && !item.finePaid"
                          [class.text-white]="getLiveStatus(item) !== 'Overdue' || item.finePaid">
                      {{ item.dueDate | date:'mediumDate' }}
                    </span>
                    <span *ngIf="getLiveStatus(item) === 'Overdue' && !item.finePaid"
                          class="ml-1.5 text-xs bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded-full border border-rose-500/20">
                      {{ daysOverdue(item) }}d late
                    </span>
                  </ng-container>
                  <ng-template #noDue><span class="italic text-white/25">—</span></ng-template>
                </td>

                <!-- Return Date -->
                <td class="px-6 py-4 text-sm">
                  <span *ngIf="item.returnDate" class="text-white/60">{{ item.returnDate | date:'mediumDate' }}</span>
                  <span *ngIf="!item.returnDate" class="italic text-white/25">—</span>
                </td>

                <!-- Status -->
                <td class="px-6 py-4">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                        [ngClass]="{
                          'bg-emerald-500/15 text-emerald-400 border-emerald-500/25': getLiveStatus(item) === 'Active',
                          'bg-rose-500/15 text-rose-400 border-rose-500/25':         getLiveStatus(item) === 'Overdue' && !item.finePaid,
                          'bg-amber-500/15 text-amber-400 border-amber-500/25':      getLiveStatus(item) === 'Overdue' && item.finePaid,
                          'bg-blue-500/15 text-blue-400 border-blue-500/25':         getLiveStatus(item) === 'Returned',
                          'bg-gray-500/15 text-gray-400 border-gray-500/25':         getLiveStatus(item) === 'Revoked'
                        }">
                    <span class="w-1.5 h-1.5 rounded-full"
                          [ngClass]="{
                            'bg-emerald-400': getLiveStatus(item) === 'Active',
                            'bg-rose-400':    getLiveStatus(item) === 'Overdue' && !item.finePaid,
                            'bg-amber-400':   getLiveStatus(item) === 'Overdue' && item.finePaid,
                            'bg-blue-400':    getLiveStatus(item) === 'Returned',
                            'bg-gray-400':    getLiveStatus(item) === 'Revoked'
                          }"></span>
                    {{ getLiveStatus(item) === 'Overdue' && item.finePaid ? 'Fine Paid' : getLiveStatus(item) }}
                  </span>
                </td>

                <!-- Fine -->
                <td class="px-6 py-4">
                  <ng-container *ngIf="getLiveFine(item) > 0; else noFine">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                          [ngClass]="item.finePaid
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 line-through opacity-60'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/25'">
                      ₹ {{ getLiveFine(item) }}
                      <span *ngIf="getLiveStatus(item) === 'Overdue' && !item.finePaid"
                            class="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                      <span *ngIf="item.finePaid" class="text-xs">✓</span>
                    </span>
                  </ng-container>
                  <ng-template #noFine>
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">₹ 0</span>
                  </ng-template>
                </td>

                <!-- Action: Pay Fine button -->
                <td class="px-6 py-4">
                  <!-- Overdue & unpaid → show Pay Fine button -->
                  <button *ngIf="getLiveStatus(item) === 'Overdue' && !item.finePaid"
                          (click)="openPayModal(item)"
                          class="px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200
                                 bg-gradient-to-r from-rose-500 to-orange-500 text-white
                                 hover:from-rose-400 hover:to-orange-400
                                 shadow-md shadow-rose-500/20 hover:shadow-rose-500/40
                                 flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Pay Fine
                  </button>

                  <!-- Fine already paid -->
                  <span *ngIf="item.finePaid"
                        class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold
                               bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Paid
                  </span>

                  <!-- No action needed -->
                  <span *ngIf="getLiveStatus(item) !== 'Overdue' && !item.finePaid"
                        class="text-white/20 text-xs italic">—</span>
                </td>

              </tr>

              <tr *ngIf="activity.length === 0">
                <td colspan="7" class="py-24 text-center">
                  <div class="flex flex-col items-center gap-4">
                    <div class="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <p class="text-white/30 font-semibold">No activity yet</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div *ngIf="activity.length > 0" class="px-6 py-3 border-t border-white/5 flex items-center justify-between text-xs text-white/25">
          <span>Fine is charged at ₹{{ finePerDay }}/day after the due date.</span>
          <span *ngIf="hasOverdue()" class="text-rose-400/60">Updates every minute</span>
        </div>
      </div>

    </ng-container>
  </div>

  <!-- ═══════════════════════════════════════════════════
       PAYMENT MODAL
  ════════════════════════════════════════════════════ -->
  <div *ngIf="payModal.open"
       class="fixed inset-0 z-50 flex items-center justify-center p-4"
       (click)="closePayModal()">

    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

    <!-- Modal card -->
    <div class="relative w-full max-w-md bg-slate-900/95 backdrop-blur-xl border border-white/10
                rounded-3xl shadow-2xl overflow-hidden"
         (click)="$event.stopPropagation()">

      <!-- ── Step 1: Confirm ── -->
      <ng-container *ngIf="payModal.step === 'confirm'">
        <!-- Header -->
        <div class="bg-gradient-to-r from-rose-600/40 to-orange-600/40 px-8 py-6 relative overflow-hidden">
          <div class="absolute -top-6 -right-6 w-24 h-24 bg-rose-500/20 rounded-full blur-2xl"></div>
          <div class="relative flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h2 class="text-white font-extrabold text-lg">Pay Overdue Fine</h2>
              <p class="text-rose-200/60 text-sm">{{ payModal.bookTitle }}</p>
            </div>
          </div>
        </div>

        <div class="px-8 py-6 space-y-5">

          <!-- Fine breakdown -->
          <div class="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-5 space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-white/50">Days overdue</span>
              <span class="text-white font-bold">{{ payModal.daysLate }} day{{ payModal.daysLate !== 1 ? 's' : '' }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-white/50">Fine rate</span>
              <span class="text-white font-bold">₹{{ finePerDay }} / day</span>
            </div>
            <div class="border-t border-rose-500/20 pt-3 flex justify-between">
              <span class="text-rose-300 font-bold">Total Amount Due</span>
              <span class="text-2xl font-extrabold text-rose-400">₹ {{ payModal.amount }}</span>
            </div>
          </div>

          <!-- Payment method selector -->
          <div>
            <p class="text-xs font-bold text-white/50 uppercase tracking-wider mb-3">Payment Method</p>
            <div class="grid grid-cols-3 gap-3">
              <button *ngFor="let m of paymentMethods"
                      (click)="payModal.method = m.id; cdr.markForCheck()"
                      class="flex flex-col items-center gap-2 py-3 px-2 rounded-2xl border transition-all duration-150 text-xs font-semibold"
                      [ngClass]="payModal.method === m.id
                        ? 'bg-indigo-500/20 border-indigo-400/50 text-indigo-300'
                        : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/70'">
                <span class="text-2xl">{{ m.icon }}</span>
                <span>{{ m.label }}</span>
              </button>
            </div>
          </div>

          <!-- Confirm pay button -->
          <button (click)="confirmPayment()"
                  [disabled]="!payModal.method"
                  class="w-full py-4 rounded-2xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2"
                  [ngClass]="payModal.method
                    ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white hover:from-rose-400 hover:to-orange-400 shadow-lg shadow-rose-500/25'
                    : 'bg-white/5 text-white/25 cursor-not-allowed border border-white/10'">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Confirm Payment of ₹{{ payModal.amount }}
          </button>

          <button (click)="closePayModal()" class="w-full py-2.5 text-sm text-white/40 hover:text-white/60 transition-colors">
            Cancel
          </button>
        </div>
      </ng-container>

      <!-- ── Step 2: Processing ── -->
      <ng-container *ngIf="payModal.step === 'processing'">
        <div class="px-8 py-16 flex flex-col items-center gap-5 text-center">
          <div class="w-16 h-16 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          <h2 class="text-white font-extrabold text-xl">Processing Payment...</h2>
          <p class="text-white/40 text-sm">Please wait while we process your payment of ₹{{ payModal.amount }}</p>
        </div>
      </ng-container>

      <!-- ── Step 3: Success ── -->
      <ng-container *ngIf="payModal.step === 'success'">
        <div class="px-8 py-10 flex flex-col items-center gap-5 text-center">
          <!-- Success ring -->
          <div class="relative">
            <div class="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400/50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="absolute inset-0 rounded-full bg-emerald-400/10 animate-ping"></div>
          </div>
          <h2 class="text-white font-extrabold text-2xl">Payment Successful!</h2>
          <p class="text-white/50 text-sm">Your fine of <span class="text-emerald-400 font-bold">₹{{ payModal.amount }}</span> has been paid successfully.</p>

          <div class="w-full bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-left space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-white/40">Book</span>
              <span class="text-white font-semibold">{{ payModal.bookTitle }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-white/40">Amount Paid</span>
              <span class="text-emerald-400 font-bold">₹{{ payModal.amount }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-white/40">Method</span>
              <span class="text-white font-semibold">{{ getMethodLabel(payModal.method) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-white/40">Time</span>
              <span class="text-white font-semibold">{{ payModal.paidAt | date:'medium' }}</span>
            </div>
          </div>

          <button (click)="closePayModal()"
                  class="w-full py-3.5 rounded-2xl text-sm font-bold
                         bg-gradient-to-r from-emerald-500 to-teal-500 text-white
                         hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg shadow-emerald-500/25">
            Done
          </button>
        </div>
      </ng-container>

      <!-- ── Step 4: Error ── -->
      <ng-container *ngIf="payModal.step === 'error'">
        <div class="px-8 py-10 flex flex-col items-center gap-5 text-center">
          <div class="w-20 h-20 rounded-full bg-rose-500/20 border-2 border-rose-400/50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 class="text-white font-extrabold text-xl">Payment Failed</h2>
          <p class="text-rose-400 text-sm">{{ payModal.errorMsg }}</p>
          <div class="flex gap-3 w-full">
            <button (click)="payModal.step = 'confirm'; cdr.markForCheck()"
                    class="flex-1 py-3 rounded-2xl text-sm font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 transition-all">
              Try Again
            </button>
            <button (click)="closePayModal()"
                    class="flex-1 py-3 rounded-2xl text-sm font-bold bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 transition-all">
              Cancel
            </button>
          </div>
        </div>
      </ng-container>

    </div>
  </div>
  `
})
export class MyActivityComponent implements OnInit, OnDestroy {

  activity:  any[] = [];
  loading    = true;
  finePerDay = 5;
  nowMs      = Date.now();

  paymentMethods = [
    { id: 'upi',   icon: '📱', label: 'UPI'    },
    { id: 'card',  icon: '💳', label: 'Card'   },
    { id: 'net',   icon: '🏦', label: 'Net Banking' }
  ];

  payModal = {
    open:      false,
    step:      'confirm' as 'confirm' | 'processing' | 'success' | 'error',
    allotmentId: 0,
    bookTitle:   '',
    amount:      0,
    daysLate:    0,
    method:      '',
    paidAt:      new Date(),
    errorMsg:    ''
  };

  private tickSub?: Subscription;

  constructor(
    private userService: UserService,
    private requestService: RequestService,
    public  cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    this.tickSub?.unsubscribe();
  }

  load(): void {
    this.userService.getMyActivity().subscribe({
      next: (res) => {
        this.activity = res;
        const sample = res.find((a: any) => a.finePerDay != null);
        if (sample) this.finePerDay = sample.finePerDay;
        this.loading = false;
        this.cdr.markForCheck();
        if (this.hasOverdue()) this.startTicker();
      },
      error: () => { this.loading = false; this.cdr.markForCheck(); }
    });
  }

  private startTicker(): void {
    this.tickSub = interval(60_000).subscribe(() => {
      this.nowMs = Date.now();
      this.cdr.markForCheck();
    });
  }

  private parseDueMs(dateStr: string | null | undefined): number {
    if (!dateStr) return 0;
    const s  = dateStr.endsWith('Z') ? dateStr : dateStr + 'Z';
    const ms = new Date(s).getTime();
    return ms > 946684800000 ? ms : 0;
  }

  getLiveStatus(item: any): string {
    if (item.status === 'Returned' || item.status === 'Revoked') return item.status;
    const dueMs = this.parseDueMs(item.dueDate);
    if (!dueMs) return 'Active';
    return this.nowMs > dueMs ? 'Overdue' : 'Active';
  }

  daysOverdue(item: any): number {
    const dueMs = this.parseDueMs(item.dueDate);
    if (!dueMs) return 0;
    const diff = this.nowMs - dueMs;
    return diff > 0 ? Math.floor(diff / 86_400_000) : 0;
  }

  getLiveFine(item: any): number {
    if (item.status === 'Returned') return item.fine || 0;
    if (item.status === 'Revoked')  return 0;
    const dueMs  = this.parseDueMs(item.dueDate);
    if (!dueMs)  return 0;
    const diffMs = this.nowMs - dueMs;
    if (diffMs <= 0) return 0;
    return Math.floor(diffMs / 86_400_000) * this.finePerDay;
  }

  hasOverdue(): boolean {
    return this.activity.some(a => this.getLiveStatus(a) === 'Overdue' && !a.finePaid);
  }

  countByStatus(status: string): number {
    return this.activity.filter(a => this.getLiveStatus(a) === status).length;
  }

  totalFine(): number {
    return this.activity.reduce((sum, a) => sum + (a.finePaid ? 0 : this.getLiveFine(a)), 0);
  }

  // ── Payment modal ─────────────────────────────────────────────────

  openPayModal(item: any): void {
    const fine     = this.getLiveFine(item);
    const daysLate = this.daysOverdue(item);
    this.payModal = {
      open:        true,
      step:        'confirm',
      allotmentId: item.id,
      bookTitle:   item.bookTitle,
      amount:      fine,
      daysLate,
      method:      '',
      paidAt:      new Date(),
      errorMsg:    ''
    };
    this.cdr.markForCheck();
  }

  closePayModal(): void {
    if (this.payModal.step === 'processing') return; // don't close during processing
    this.payModal.open = false;
    this.cdr.markForCheck();
  }

  confirmPayment(): void {
    if (!this.payModal.method) return;

    this.payModal.step = 'processing';
    this.cdr.markForCheck();

    this.requestService.payFine(this.payModal.allotmentId).subscribe({
      next: (res: any) => {
        this.payModal.step   = 'success';
        this.payModal.paidAt = new Date(res.paidAt || Date.now());

        // Mark fine as paid locally so the table updates immediately
        const item = this.activity.find(a => a.id === this.payModal.allotmentId);
        if (item) item.finePaid = true;

        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.payModal.step     = 'error';
        this.payModal.errorMsg = err?.error?.message || 'Payment could not be processed.';
        this.cdr.markForCheck();
      }
    });
  }

  getMethodLabel(id: string): string {
    return this.paymentMethods.find(m => m.id === id)?.label || id;
  }
}
