import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';

@Component({
  standalone: true,
  selector: 'app-manage-users',
  imports: [CommonModule, FormsModule],
  template: `
  <div class="min-h-screen bg-gray-50 p-8">

    <!-- TOAST -->
    <div *ngIf="toastMessage"
         class="fixed top-5 right-5 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg animate-bounce z-50">
      {{ toastMessage }}
    </div>

    <!-- HEADER -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold text-gray-800">
        👥 User Management
      </h2>

      <div class="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg">
        Total Users: {{ users.length }}
      </div>
    </div>

    <!-- SEARCH -->
    <div class="mb-6">
      <input
        type="text"
        [(ngModel)]="searchTerm"
        placeholder="🔍 Search by name or email..."
        class="w-full md:w-1/3 border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none" />
    </div>

    <!-- ADD USER -->
    <div class="bg-white p-6 rounded-2xl shadow-xl mb-8 border">
      <h3 class="text-xl font-semibold mb-4 text-gray-700">
        ➕ Add New User
      </h3>

      <form #addForm="ngForm">
        <div class="grid md:grid-cols-3 gap-4">

          <input type="text"
            name="name"
            required
            minlength="3"
            [(ngModel)]="newUser.name"
            placeholder="Name"
            class="border p-3 rounded-lg" />

          <input type="email"
            name="email"
            required
            email
            [(ngModel)]="newUser.email"
            placeholder="Email"
            class="border p-3 rounded-lg" />

          <select name="role"
            [(ngModel)]="newUser.role"
            class="border p-3 rounded-lg">
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <button
          type="button"
          (click)="addUser(addForm)"
          [disabled]="addForm.invalid"
          class="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
          Add User
        </button>
      </form>
    </div>

    <!-- TABLE -->
    <div class="bg-white rounded-2xl shadow-xl overflow-hidden border">

      <table class="w-full text-left">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-4">Name</th>
            <th class="p-4">Email</th>
            <th class="p-4">Role</th>
            <th class="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr *ngFor="let user of paginatedUsers()"
              class="border-t hover:bg-gray-50">

            <td class="p-4">
              <ng-container *ngIf="editId !== user.id; else editName">
                {{ user.name }}
              </ng-container>

              <ng-template #editName>
                <input [(ngModel)]="editableUser.name"
                       class="border p-2 rounded w-full" />
              </ng-template>
            </td>

            <td class="p-4">
              <ng-container *ngIf="editId !== user.id; else editEmail">
                {{ user.email }}
              </ng-container>

              <ng-template #editEmail>
                <input [(ngModel)]="editableUser.email"
                       class="border p-2 rounded w-full" />
              </ng-template>
            </td>

            <td class="p-4">
              <ng-container *ngIf="editId !== user.id; else editRole">
                <span class="px-3 py-1 text-sm rounded-full"
                      [ngClass]="{
                        'bg-green-100 text-green-700': user.role === 'Admin',
                        'bg-blue-100 text-blue-700': user.role === 'User'
                      }">
                  {{ user.role }}
                </span>
              </ng-container>

              <ng-template #editRole>
                <select [(ngModel)]="editableUser.role"
                        class="border p-2 rounded w-full">
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </ng-template>
            </td>

            <td class="p-4 text-center">
              <ng-container *ngIf="editId !== user.id">
                <button (click)="startEdit(user)"
                  class="bg-yellow-500 text-white px-3 py-1 rounded mr-2">
                  Edit
                </button>
                <button (click)="delete(user.id)"
                  class="bg-red-600 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </ng-container>

              <ng-container *ngIf="editId === user.id">
                <button (click)="saveEdit()"
                  class="bg-green-600 text-white px-3 py-1 rounded mr-2">
                  Save
                </button>
                <button (click)="cancelEdit()"
                  class="bg-gray-500 text-white px-3 py-1 rounded">
                  Cancel
                </button>
              </ng-container>
            </td>

          </tr>
        </tbody>
      </table>

      <!-- PAGINATION -->
      <div class="flex justify-between items-center p-4 bg-gray-50">

        <button (click)="prevPage()"
          [disabled]="currentPage === 1"
          class="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
          Previous
        </button>

        <span>
          Page {{ currentPage }} of {{ totalPages() }}
        </span>

        <button (click)="nextPage()"
          [disabled]="currentPage === totalPages()"
          class="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
          Next
        </button>

      </div>

    </div>
  </div>
  `
})
export class ManageUsersComponent implements OnInit {

  users: any[] = [];
  searchTerm: string = '';

  newUser = { name: '', email: '', role: 'User' };

  editId: number | null = null;
  editableUser: any = {};

  toastMessage: string = '';

  currentPage = 1;
  pageSize = 5;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(res => {
      this.users = res;
    });
  }

  filteredUsers() {
    return this.users.filter(user =>
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  paginatedUsers() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers().slice(start, start + this.pageSize);
  }

  totalPages() {
    return Math.ceil(this.filteredUsers().length / this.pageSize) || 1;
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  showToast(message: string) {
    this.toastMessage = message;
    setTimeout(() => this.toastMessage = '', 2000);
  }

  addUser(formRef: any) {
    if (formRef.invalid) return;

    this.userService.addUser(this.newUser).subscribe(() => {
      this.newUser = { name: '', email: '', role: 'User' };
      this.loadUsers();
      this.showToast('User added successfully 🎉');
    });
  }

  startEdit(user: any) {
    this.editId = user.id;
    this.editableUser = { ...user };
  }

  saveEdit() {
    if (!this.editId) return;

    this.userService.updateUser(this.editId, this.editableUser)
      .subscribe(() => {
        this.editId = null;
        this.loadUsers();
        this.showToast('User updated successfully ✅');
      });
  }

  cancelEdit() {
    this.editId = null;
  }

  delete(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id)
        .subscribe(() => {
          this.loadUsers();
          this.showToast('User deleted successfully 🗑️');
        });
    }
  }
}