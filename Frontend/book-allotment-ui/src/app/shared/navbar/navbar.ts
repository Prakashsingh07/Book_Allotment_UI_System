import { Component, OnInit, inject, NgZone, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BookService } from '../../core/services/book.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
  styles: [`
    .nav-link {
      position: relative;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #818cf8, #a78bfa);
      border-radius: 9999px;
      transition: width 0.25s ease;
    }
    .nav-link:hover::after,
    .nav-link.active-link::after {
      width: 70%;
    }
    .active-link {
      color: #a5b4fc !important;
    }
    /* CRITICAL: pointer-events none on the decorative backdrop div
       so it never intercepts clicks meant for nav links */
    .nav-backdrop {
      pointer-events: none;
    }
  `],
  template: `
  <nav class="sticky top-0 z-50 w-full">

    <!-- Backdrop — pointer-events:none so it never blocks link clicks -->
    <div class="nav-backdrop absolute inset-0 bg-slate-900/80 backdrop-blur-xl border-b transition-all duration-200"
         [ngClass]="scrolled ? 'border-white/10 shadow-2xl shadow-black/30' : 'border-white/5'">
    </div>

    <div class="relative px-6 py-0 flex items-center justify-between h-16 max-w-screen-2xl mx-auto">

      <!-- LOGO -->
      <a routerLink="/"
         class="flex items-center gap-2.5 group flex-shrink-0">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600
                    flex items-center justify-center shadow-lg shadow-indigo-500/30
                    group-hover:shadow-indigo-500/50 group-hover:scale-105 transition-all duration-200">
          <span class="text-lg">📚</span>
        </div>
        <span class="font-extrabold text-white text-base tracking-tight
                     group-hover:text-indigo-300 transition-colors duration-200">
          Book<span class="text-indigo-400">Allotment</span>
        </span>
      </a>

      <!-- NAV LINKS -->
      <div class="flex items-center gap-1">

        <!-- NOT LOGGED IN -->
        <ng-container *ngIf="!loggedIn; else loggedInBlock">
          <a routerLink="/login" routerLinkActive="active-link"
             class="nav-link px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-200">
            Login
          </a>
          <a routerLink="/register"
             class="ml-2 px-4 py-2 rounded-xl text-sm font-semibold
                    bg-gradient-to-r from-indigo-500 to-purple-600 text-white
                    hover:from-indigo-400 hover:to-purple-500
                    shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40
                    transition-all duration-200">
            Register
          </a>
        </ng-container>

        <ng-template #loggedInBlock>

          <!-- ADMIN -->
          <ng-container *ngIf="userRole === 'Admin'">
            <span class="mr-3 px-2.5 py-0.5 rounded-full text-xs font-bold
                         bg-amber-500/15 text-amber-400 border border-amber-500/25 tracking-wider uppercase">
              Admin
            </span>
            <a routerLink="/admin/dashboard" routerLinkActive="active-link"
               class="nav-link px-3 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </a>
            <a routerLink="/admin/users" routerLinkActive="active-link"
               class="nav-link px-3 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Users
            </a>
            <a routerLink="/admin/books" routerLinkActive="active-link"
               class="nav-link px-3 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Books
            </a>
            <a routerLink="/admin/logs" routerLinkActive="active-link"
               class="nav-link px-3 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Logs
            </a>
            <a routerLink="/admin/pending-requests" routerLinkActive="active-link"
               class="nav-link px-3 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Requests
            </a>
          </ng-container>

          <!-- USER -->
          <ng-container *ngIf="userRole === 'User'">
            <span class="mr-3 px-2.5 py-0.5 rounded-full text-xs font-bold
                         bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 tracking-wider uppercase">
              User
            </span>
            <a routerLink="/user/dashboard" routerLinkActive="active-link"
               class="nav-link px-3 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </a>
            <a routerLink="/user/available-books" routerLinkActive="active-link"
               class="nav-link px-3 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Browse
              <span *ngIf="availableCount > 0"
                    class="ml-0.5 px-1.5 py-0.5 rounded-full text-xs font-bold leading-none
                           bg-indigo-500 text-white shadow-sm shadow-indigo-500/40">
                {{ availableCount }}
              </span>
            </a>
            <a routerLink="/user/my-books" routerLinkActive="active-link"
               class="nav-link px-3 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              My Books
            </a>
            <a routerLink="/user/my-activity" routerLinkActive="active-link"
               class="nav-link px-3 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Activity
            </a>
            <a routerLink="/user/profile" routerLinkActive="active-link"
               class="nav-link ml-1 flex items-center gap-2 px-3 py-1.5 rounded-xl
                      text-sm font-medium text-white/70 hover:text-white
                      hover:bg-white/5 transition-all duration-200 border border-transparent
                      hover:border-white/10">
              <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600
                          flex items-center justify-center text-xs font-bold text-white shadow-sm">
                {{ username.charAt(0).toUpperCase() }}
              </div>
              <span>Profile</span>
            </a>
          </ng-container>

          <!-- Divider -->
          <div class="w-px h-6 bg-white/10 mx-2"></div>

          <!-- Logout -->
          <button (click)="logout()"
                  class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold
                         text-rose-400 hover:text-white hover:bg-rose-500/20
                         border border-transparent hover:border-rose-500/30
                         transition-all duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>

        </ng-template>
      </div>
    </div>
  </nav>
  `
})
export class NavbarComponent implements OnInit {

  private auth   = inject(AuthService);
  private router = inject(Router);
  private bookService = inject(BookService);
  private zone   = inject(NgZone);
  private cdr    = inject(ChangeDetectorRef);

  // ── Stored as plain properties so OnPush CD sees every update ──
  loggedIn   = false;
  userRole: string | null = null;
  username   = '';
  scrolled   = false;
  availableCount = 0;

  ngOnInit(): void {
    // Initialise state from token immediately
    this.syncAuthState();

    // Re-sync on every completed navigation so the navbar
    // always reflects the current auth state after route changes
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.syncAuthState();
        this.cdr.markForCheck();
      });

    // Scroll listener runs INSIDE zone so CD fires immediately
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', () => {
        const next = window.scrollY > 10;
        if (next !== this.scrolled) {
          this.zone.run(() => {
            this.scrolled = next;
            this.cdr.markForCheck();
          });
        }
      }, { passive: true });
    });
  }

  private syncAuthState(): void {
    this.loggedIn = this.auth.isLoggedIn();
    this.userRole = this.auth.getRole();

    if (this.loggedIn) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          this.username =
            payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'U';
        } catch { this.username = 'U'; }
      }
      if (this.userRole === 'User' && this.availableCount === 0) {
        this.loadAvailableCount();
      }
    }
  }

  loadAvailableCount(): void {
    this.bookService.getAvailableCount().subscribe({
      next: (count) => {
        this.availableCount = count;
        this.cdr.markForCheck();
      },
      error: () => {}
    });
  }

  logout(): void {
    this.auth.logout();
    this.loggedIn  = false;
    this.userRole  = null;
    this.username  = '';
    this.cdr.markForCheck();
    this.router.navigate(['/login']);
  }
}
