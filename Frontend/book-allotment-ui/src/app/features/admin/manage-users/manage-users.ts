import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';

@Component({
  standalone: true,
  selector: 'app-manage-users',
  imports: [CommonModule, FormsModule],
  template: `
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-6">

    <!-- Toast -->
    <div *ngIf="toastMessage"
         class="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl
                backdrop-blur-md border text-sm font-bold transition-all"
         [ngClass]="toastSuccess
           ? 'bg-emerald-600/90 text-white border-emerald-400/30'
           : 'bg-rose-600/90 text-white border-rose-400/30'">
      {{ toastSuccess ? '✅' : '❌' }} {{ toastMessage }}
    </div>

    <!-- Header -->
    <div class="relative bg-gradient-to-r from-indigo-600/40 to-purple-600/40 backdrop-blur-md
                rounded-3xl border border-white/10 p-8 mb-8 overflow-hidden shadow-2xl">
      <div class="absolute -top-10 -right-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl"></div>
      <div class="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl"></div>
      <div class="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p class="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-1">Admin Panel</p>
          <h1 class="text-4xl font-extrabold text-white">User Management</h1>
          <p class="text-indigo-200/70 mt-1 text-sm">Add, edit and manage system users</p>
        </div>
        <div class="flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl px-5 py-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <div>
            <p class="text-white/40 text-xs">Total Users</p>
            <p class="text-white font-extrabold text-xl leading-none">{{ users.length }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add User Panel -->
    <div class="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 mb-8 shadow-xl">
      <div class="flex items-center gap-3 mb-5">
        <div class="w-9 h-9 rounded-xl bg-indigo-500/30 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <div>
          <h3 class="text-white font-bold">Add New User</h3>
          <p class="text-white/40 text-xs">New accounts are created with the User role by default</p>
        </div>
      </div>
      <form #addForm="ngForm">
        <div class="grid md:grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Full Name</label>
            <input type="text" name="name" required minlength="3"
                   [(ngModel)]="newUser.name" placeholder="e.g. John Doe"
                   class="w-full bg-white/10 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm
                          focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Email</label>
            <input type="email" name="email" required email
                   [(ngModel)]="newUser.email" placeholder="e.g. john@email.com"
                   class="w-full bg-white/10 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm
                          focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" />
          </div>
          <div class="flex items-end">
            <button type="button" (click)="addUser(addForm)" [disabled]="addForm.invalid"
                    class="w-full py-2.5 rounded-xl text-sm font-bold transition-all
                           bg-gradient-to-r from-indigo-500 to-purple-600 text-white
                           hover:from-indigo-400 hover:to-purple-500
                           shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40
                           disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add User
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Search + Table -->
    <div class="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-2xl">

      <!-- Toolbar -->
      <div class="px-6 py-4 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-white font-bold">All Users</h2>
          <p class="text-white/40 text-xs mt-0.5">{{ filteredUsers().length }} result{{ filteredUsers().length !== 1 ? 's' : '' }}</p>
        </div>
        <div class="relative w-full md:w-72">
          <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"
               fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" [(ngModel)]="searchTerm" placeholder="Search name or email..."
                 class="w-full bg-white/10 border border-white/10 text-white placeholder-white/30 rounded-xl
                        pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-white/10">
              <th class="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">User</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Email</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Role</th>
              <th class="px-6 py-4 text-center text-xs font-bold text-white/40 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">

            <tr *ngFor="let user of paginatedUsers()"
                class="hover:bg-white/5 transition-colors group"
                [class.bg-indigo-500/5]="isSelf(user.id)">

              <!-- User -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-lg"
                       [ngClass]="isSelf(user.id)
                         ? 'bg-gradient-to-br from-amber-500 to-orange-500'
                         : 'bg-gradient-to-br from-indigo-500 to-purple-600'">
                    {{ user.name?.charAt(0)?.toUpperCase() }}
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="font-semibold text-white text-sm">{{ user.name }}</span>
                    <span *ngIf="isSelf(user.id)"
                          class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold
                                 bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      👑 You
                    </span>
                  </div>
                </div>
              </td>

              <!-- Email -->
              <td class="px-6 py-4 text-sm text-white/60">{{ user.email }}</td>

              <!-- Role -->
              <td class="px-6 py-4">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                      [ngClass]="{
                        'bg-amber-500/15 text-amber-400 border-amber-500/25': user.role === 'Admin',
                        'bg-indigo-500/15 text-indigo-400 border-indigo-500/25': user.role === 'User'
                      }">
                  <span class="w-1.5 h-1.5 rounded-full"
                        [ngClass]="user.role === 'Admin' ? 'bg-amber-400' : 'bg-indigo-400'"></span>
                  {{ user.role }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4">
                <div class="flex items-center justify-center gap-2">

                  <!-- ── Own row: both buttons disabled ── -->
                  <ng-container *ngIf="isSelf(user.id)">
                    <div class="relative group/edit">
                      <button disabled
                              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold
                                     bg-white/5 text-white/20 border border-white/10 cursor-not-allowed">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <div class="absolute bottom-full left-0 mb-2 hidden group-hover/edit:block z-10
                                  bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/70
                                  whitespace-nowrap shadow-xl pointer-events-none">
                        Use the Profile page to edit your own account
                        <div class="absolute top-full left-4 border-4 border-transparent border-t-slate-800"></div>
                      </div>
                    </div>
                    <div class="relative group/del">
                      <button disabled
                              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold
                                     bg-white/5 text-white/20 border border-white/10 cursor-not-allowed">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                      <div class="absolute bottom-full right-0 mb-2 hidden group-hover/del:block z-10
                                  bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/70
                                  whitespace-nowrap shadow-xl pointer-events-none">
                        You cannot delete your own account
                        <div class="absolute top-full right-4 border-4 border-transparent border-t-slate-800"></div>
                      </div>
                    </div>
                  </ng-container>

                  <!-- ── Other users: normal Edit / Save / Cancel / Delete ── -->
                  <ng-container *ngIf="!isSelf(user.id)">
                    <ng-container *ngIf="editId !== user.id">
                      <button (click)="startEdit(user)"
                              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold
                                     bg-amber-500/15 text-amber-400 border border-amber-500/25
                                     hover:bg-amber-500/25 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button (click)="delete(user.id)"
                              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold
                                     bg-rose-500/15 text-rose-400 border border-rose-500/25
                                     hover:bg-rose-500/25 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </ng-container>
                    <ng-container *ngIf="editId === user.id">
                      <button (click)="saveEdit()"
                              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold
                                     bg-emerald-500/15 text-emerald-400 border border-emerald-500/25
                                     hover:bg-emerald-500/25 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Save
                      </button>
                      <button (click)="cancelEdit()"
                              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold
                                     bg-white/10 text-white/50 border border-white/10
                                     hover:bg-white/15 transition-all">
                        Cancel
                      </button>
                    </ng-container>
                  </ng-container>

                </div>
              </td>
            </tr>

            <!-- Empty -->
            <tr *ngIf="filteredUsers().length === 0">
              <td colspan="4" class="py-20 text-center">
                <div class="flex flex-col items-center gap-3">
                  <div class="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p class="text-white/30 font-semibold">No users found</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-white/10 flex items-center justify-between">
        <p class="text-xs text-white/30">
          Showing {{ (currentPage - 1) * pageSize + 1 }}–{{ Math.min(currentPage * pageSize, filteredUsers().length) }} of {{ filteredUsers().length }}
        </p>
        <div class="flex items-center gap-2">
          <button (click)="prevPage()" [disabled]="currentPage === 1"
                  class="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 text-white/60 border border-white/10
                         hover:bg-white/15 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            ← Prev
          </button>
          <span class="px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/25">
            {{ currentPage }} / {{ totalPages() }}
          </span>
          <button (click)="nextPage()" [disabled]="currentPage === totalPages()"
                  class="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 text-white/60 border border-white/10
                         hover:bg-white/15 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            Next →
          </button>
        </div>
      </div>
    </div>
  </div>
  `
})
export class ManageUsersComponent implements OnInit {
  users: any[] = [];
  searchTerm = '';
  newUser = { name: '', email: '' };   // role removed — always 'User'
  editId: number | null = null;
  editableUser: any = {};
  toastMessage = '';
  toastSuccess = true;
  currentPage = 1;
  pageSize = 5;
  Math = Math;

  currentAdminId: number = 0;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const idClaim =
          payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
          payload['nameid'] ||
          payload['sub'] ||
          payload['id'];
        this.currentAdminId = Number(idClaim) || 0;
      } catch { this.currentAdminId = 0; }
    }
    this.loadUsers();
  }

  isSelf(userId: number): boolean {
    return this.currentAdminId > 0 && userId === this.currentAdminId;
  }

  loadUsers() {
    this.userService.getUsers().subscribe(res => this.users = res);
  }

  filteredUsers() {
    return this.users.filter(u =>
      u.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  paginatedUsers() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers().slice(start, start + this.pageSize);
  }

  totalPages() { return Math.ceil(this.filteredUsers().length / this.pageSize) || 1; }
  nextPage()   { if (this.currentPage < this.totalPages()) this.currentPage++; }
  prevPage()   { if (this.currentPage > 1) this.currentPage--; }

  showToast(message: string, success = true) {
    this.toastMessage = message;
    this.toastSuccess = success;
    setTimeout(() => this.toastMessage = '', 3000);
  }

  addUser(formRef: any) {
    if (formRef.invalid) return;
    // Always create as User — role is not selectable
    const payload = { ...this.newUser, role: 'User' };
    this.userService.addUser(payload).subscribe({
      next: () => {
        this.newUser = { name: '', email: '' };
        this.loadUsers();
        this.showToast('User added successfully!');
      },
      error: () => this.showToast('Failed to add user.', false)
    });
  }

  startEdit(user: any) { this.editId = user.id; this.editableUser = { ...user }; }
  cancelEdit()          { this.editId = null; }

  saveEdit() {
    if (!this.editId) return;
    this.userService.updateUser(this.editId, this.editableUser).subscribe({
      next: () => { this.editId = null; this.loadUsers(); this.showToast('User updated successfully!'); },
      error: () => this.showToast('Failed to update user.', false)
    });
  }

  delete(id: number) {
    if (this.isSelf(id)) {
      this.showToast('You cannot delete your own account.', false);
      return;
    }
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => { this.loadUsers(); this.showToast('User deleted.'); },
        error: (err) => this.showToast(err?.error?.message || 'Failed to delete user.', false)
      });
    }
  }
}
