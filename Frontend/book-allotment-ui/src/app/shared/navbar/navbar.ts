import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BookService } from '../../core/services/book.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
  <nav class="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-lg">

    <!-- Logo -->
    <div class="text-xl font-bold cursor-pointer hover:text-indigo-400 transition"
         routerLink="/">
      📚 Book Allotment
    </div>

    <!-- Right Side -->
    <div class="space-x-6 flex items-center">

      <!-- If NOT Logged In -->
      <ng-container *ngIf="!isLoggedIn(); else loggedInBlock">
        <a routerLink="/login" class="hover:text-indigo-400 transition">Login</a>
        <a routerLink="/register" class="hover:text-indigo-400 transition">Register</a>
      </ng-container>

      <!-- If Logged In -->
      <ng-template #loggedInBlock>

        <!-- ================= ADMIN ================= -->
        <ng-container *ngIf="role() === 'Admin'">
          <a routerLink="/admin/dashboard" class="hover:text-indigo-400 transition">Dashboard</a>
          <a routerLink="/admin/users" class="hover:text-indigo-400 transition">Users</a>
          <a routerLink="/admin/books" class="hover:text-indigo-400 transition">Books</a>
          <a routerLink="/admin/logs" class="hover:text-indigo-400 transition">Logs</a>
          <a routerLink="/admin/pending-requests" class="hover:text-indigo-400 transition">
            Pending Requests
          </a>
        </ng-container>

        <!-- ================= USER ================= -->
        <ng-container *ngIf="role() === 'User'">

        <a routerLink="/user/dashboard"
     class="hover:text-indigo-400 transition">
    Dashboard
  </a>

  <a routerLink="/user/my-books"
     class="hover:text-indigo-400 transition">
    My Books
  </a>
  
  <a 
   routerLink="/user/my-activity"
   class="px-4 py-2 hover:text-indigo-600">
   My Activity
</a>
<a routerLink="/user/profile"
   class="px-4 py-2 hover:text-indigo-600">
   My Profile
</a>
        </ng-container>

        <!-- Logout -->
        <button (click)="logout()"
          class="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition">
          Logout
        </button>

      </ng-template>

    </div>
  </nav>
  `
})
export class NavbarComponent implements OnInit {

  private auth = inject(AuthService);
  private router = inject(Router);
  private bookService = inject(BookService);

  availableCount: number = 0;

  ngOnInit(): void {
    if (this.role() === 'User') {
      this.loadAvailableCount();
    }
  }

  loadAvailableCount() {
    this.bookService.getAvailableCount()
      .subscribe({
        next: (count) => this.availableCount = count,
        error: (err) => console.error('Failed to load count', err)
      });
  }

  isLoggedIn() {
    return this.auth.isLoggedIn();
  }

  role() {
    return this.auth.getRole();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
