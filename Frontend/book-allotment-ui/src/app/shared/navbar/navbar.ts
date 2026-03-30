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
    .nav-link { position: relative; }
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -2px; left: 50%;
      transform: translateX(-50%);
      width: 0; height: 2px;
      background: linear-gradient(90deg, #818cf8, #a78bfa);
      border-radius: 9999px;
      transition: width 0.25s ease;
    }
    .nav-link:hover::after, .nav-link.active-link::after { width: 70%; }
    .active-link { color: #a5b4fc !important; }
    .nav-backdrop { pointer-events: none; }
    /* Mobile drawer slide-in animation */
    .drawer-enter { animation: slideDown 0.2s ease; }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    /* Bottom nav active state */
    .tab-active { color: #a5b4fc !important; }
    .tab-active svg { filter: drop-shadow(0 0 5px rgba(165,180,252,0.5)); }
  `],
  template: `
  <!-- ═══════════════════════════════════════════════════
       TOP NAVBAR — sticky, visible on all screen sizes
  ════════════════════════════════════════════════════════ -->
  <nav class="sticky top-0 z-50 w-full">

    <div class="nav-backdrop absolute inset-0 bg-slate-900/80 backdrop-blur-xl border-b transition-all duration-200"
         [ngClass]="scrolled ? 'border-white/10 shadow-2xl shadow-black/30' : 'border-white/5'">
    </div>

    <div class="relative px-4 md:px-6 flex items-center justify-between h-16 max-w-screen-2xl mx-auto">

      <!-- LOGO -->
      <a routerLink="/" class="flex items-center gap-2.5 group flex-shrink-0">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600
                    flex items-center justify-center shadow-lg shadow-indigo-500/30
                    group-hover:shadow-indigo-500/50 group-hover:scale-105 transition-all duration-200">
          <span class="text-lg">📚</span>
        </div>
        <span class="font-extrabold text-white text-base tracking-tight group-hover:text-indigo-300 transition-colors duration-200">
          Book<span class="text-indigo-400">Allotment</span>
        </span>
      </a>

      <!-- ── DESKTOP LINKS (md and up) ──────────────────────────────── -->
      <div class="hidden md:flex items-center gap-1">

        <!-- Guest -->
        <ng-container *ngIf="!loggedIn">
          <a routerLink="/login" routerLinkActive="active-link"
             class="nav-link px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors">
            Login
          </a>
          <a routerLink="/register"
             class="ml-2 px-4 py-2 rounded-xl text-sm font-semibold
                    bg-gradient-to-r from-indigo-500 to-purple-600 text-white
                    hover:from-indigo-400 hover:to-purple-500 shadow-md shadow-indigo-500/20 transition-all">
            Register
          </a>
        </ng-container>

        <!-- Admin desktop -->
        <ng-container *ngIf="loggedIn && userRole === 'Admin'">
          <span class="mr-3 px-2.5 py-0.5 rounded-full text-xs font-bold
                       bg-amber-500/15 text-amber-400 border border-amber-500/25 tracking-wider uppercase">
            Admin
          </span>
          <ng-container *ngFor="let l of adminDesktopLinks">
            <a [routerLink]="l.path" routerLinkActive="active-link"
               class="nav-link px-3 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="l.d"/>
              </svg>
              {{ l.label }}
            </a>
          </ng-container>
          <a routerLink="/admin/profile" routerLinkActive="active-link"
             class="nav-link ml-1 flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium
                    text-white/70 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10">
            <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500
                        flex items-center justify-center text-xs font-bold text-white shadow-sm">
              {{ username.charAt(0).toUpperCase() }}
            </div>
            <span>Profile</span>
          </a>
        </ng-container>

        <!-- User desktop -->
        <ng-container *ngIf="loggedIn && userRole === 'User'">
          <span class="mr-3 px-2.5 py-0.5 rounded-full text-xs font-bold
                       bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 tracking-wider uppercase">
            User
          </span>
          <ng-container *ngFor="let l of userDesktopLinks">
            <a [routerLink]="l.path" routerLinkActive="active-link"
               class="nav-link px-3 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="l.d"/>
              </svg>
              {{ l.label }}
              <span *ngIf="l.badge && availableCount > 0"
                    class="ml-0.5 px-1.5 py-0.5 rounded-full text-xs font-bold leading-none bg-indigo-500 text-white">
                {{ availableCount }}
              </span>
            </a>
          </ng-container>
          <a routerLink="/user/profile" routerLinkActive="active-link"
             class="nav-link ml-1 flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium
                    text-white/70 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10">
            <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600
                        flex items-center justify-center text-xs font-bold text-white shadow-sm">
              {{ username.charAt(0).toUpperCase() }}
            </div>
            <span>Profile</span>
          </a>
        </ng-container>

        <!-- Logout (desktop) -->
        <ng-container *ngIf="loggedIn">
          <div class="w-px h-6 bg-white/10 mx-2"></div>
          <button (click)="logout()"
                  class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold
                         text-rose-400 hover:text-white hover:bg-rose-500/20
                         border border-transparent hover:border-rose-500/30 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Logout
          </button>
        </ng-container>

      </div>

      <!-- ── MOBILE RIGHT: avatar + hamburger ──────────────────────── -->
      <div class="flex md:hidden items-center gap-3">

        <!-- Avatar chip (logged in) -->
        <a *ngIf="loggedIn"
           [routerLink]="userRole === 'Admin' ? '/admin/profile' : '/user/profile'"
           class="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-sm"
           [ngClass]="userRole === 'Admin'
             ? 'bg-gradient-to-br from-amber-500 to-orange-500'
             : 'bg-gradient-to-br from-indigo-500 to-purple-600'">
          {{ username.charAt(0).toUpperCase() }}
        </a>

        <!-- Hamburger / X -->
        <button (click)="mobileOpen = !mobileOpen; cdr.markForCheck()"
                aria-label="Toggle navigation menu"
                class="flex flex-col items-center justify-center w-10 h-10 rounded-xl
                       bg-white/10 border border-white/10 hover:bg-white/15 transition-all px-2.5 gap-1.5">
          <span class="block w-5 h-0.5 bg-white rounded-full transition-all duration-200 origin-center"
                [class.rotate-45]="mobileOpen" [class.translate-y-2]="mobileOpen"></span>
          <span class="block w-5 h-0.5 bg-white rounded-full transition-all duration-200"
                [class.opacity-0]="mobileOpen"></span>
          <span class="block w-5 h-0.5 bg-white rounded-full transition-all duration-200 origin-center"
                [class.-rotate-45]="mobileOpen" [class.-translate-y-2]="mobileOpen"></span>
        </button>
      </div>

    </div><!-- /inner -->

    <!-- ── MOBILE DRAWER ──────────────────────────────────────────── -->
    <div *ngIf="mobileOpen"
         class="drawer-enter md:hidden absolute top-16 left-0 right-0 z-40
                bg-slate-900/98 backdrop-blur-xl border-b border-white/10
                shadow-2xl shadow-black/50 max-h-[80vh] overflow-y-auto">
      <div class="px-4 py-4 space-y-1">

        <!-- Guest drawer -->
        <ng-container *ngIf="!loggedIn">
          <a routerLink="/login"    (click)="closeMobile()" class="mobile-item">Login</a>
          <a routerLink="/register" (click)="closeMobile()"
             class="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold
                    bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            Register
          </a>
        </ng-container>

        <!-- Admin drawer -->
        <ng-container *ngIf="loggedIn && userRole === 'Admin'">
          <p class="px-4 pt-2 pb-1 text-xs font-bold text-amber-400/60 uppercase tracking-widest">Admin Panel</p>
          <a *ngFor="let l of adminDrawerLinks"
             [routerLink]="l.path" routerLinkActive="!text-white/70 text-indigo-300 bg-white/10"
             (click)="closeMobile()"
             class="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium text-white/70
                    hover:text-white hover:bg-white/10 transition-all active:scale-95">
            <span class="text-xl w-7 text-center">{{ l.icon }}</span>
            {{ l.label }}
          </a>
        </ng-container>

        <!-- User drawer -->
        <ng-container *ngIf="loggedIn && userRole === 'User'">
          <p class="px-4 pt-2 pb-1 text-xs font-bold text-indigo-400/60 uppercase tracking-widest">My Library</p>
          <a *ngFor="let l of userDrawerLinks"
             [routerLink]="l.path" routerLinkActive="!text-white/70 text-indigo-300 bg-white/10"
             (click)="closeMobile()"
             class="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium text-white/70
                    hover:text-white hover:bg-white/10 transition-all active:scale-95">
            <span class="text-xl w-7 text-center">{{ l.icon }}</span>
            {{ l.label }}
            <span *ngIf="l.badge && availableCount > 0"
                  class="ml-auto px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-500 text-white">
              {{ availableCount }}
            </span>
          </a>
        </ng-container>

        <!-- Logout drawer -->
        <ng-container *ngIf="loggedIn">
          <div class="border-t border-white/10 my-3"></div>
          <button (click)="logout()"
                  class="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold
                         text-rose-400 hover:bg-rose-500/10 transition-all active:scale-95">
            <span class="text-xl w-7 text-center">🚪</span>
            Logout
          </button>
        </ng-container>

      </div>
    </div><!-- /drawer -->

  </nav>

  <!-- ═══════════════════════════════════════════════════
       MOBILE BOTTOM TAB BAR
       Only shown when logged in on small screens.
       Provides thumb-reachable navigation — feels like a native app.
  ════════════════════════════════════════════════════════ -->
  <nav *ngIf="loggedIn"
       class="md:hidden fixed bottom-0 left-0 right-0 z-40
              bg-slate-900/95 backdrop-blur-xl border-t border-white/10
              shadow-2xl shadow-black/50 bottom-nav">
    <div class="flex items-stretch justify-around h-16 px-1">

      <!-- Admin bottom tabs -->
      <ng-container *ngIf="userRole === 'Admin'">
        <a *ngFor="let t of adminTabs"
           [routerLink]="t.path" routerLinkActive="tab-active"
           class="flex flex-col items-center justify-center gap-1 flex-1 text-white/40
                  hover:text-white/70 transition-all active:scale-95 rounded-xl mx-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="t.d"/>
          </svg>
          <span class="text-xs font-medium leading-none">{{ t.label }}</span>
        </a>
      </ng-container>

      <!-- User bottom tabs -->
      <ng-container *ngIf="userRole === 'User'">
        <a *ngFor="let t of userTabs"
           [routerLink]="t.path" routerLinkActive="tab-active"
           class="relative flex flex-col items-center justify-center gap-1 flex-1 text-white/40
                  hover:text-white/70 transition-all active:scale-95 rounded-xl mx-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="t.d"/>
          </svg>
          <span class="text-xs font-medium leading-none">{{ t.label }}</span>
          <!-- Badge for Browse tab -->
          <span *ngIf="t.badge && availableCount > 0"
                class="absolute top-0.5 right-1.5 min-w-4 h-4 px-1 rounded-full
                       bg-indigo-500 text-white text-xs font-bold flex items-center justify-center leading-none">
            {{ availableCount > 9 ? '9+' : availableCount }}
          </span>
        </a>
      </ng-container>

    </div>
  </nav>

  <!-- Spacer so bottom-nav doesn't cover page content on mobile -->
  <div *ngIf="loggedIn" class="md:hidden h-16 bottom-nav flex-shrink-0"></div>
  `
})
export class NavbarComponent implements OnInit {

  private auth        = inject(AuthService);
  private router      = inject(Router);
  private bookService = inject(BookService);
  private zone        = inject(NgZone);
  readonly cdr        = inject(ChangeDetectorRef);

  loggedIn       = false;
  userRole: string | null = null;
  username       = '';
  scrolled       = false;
  availableCount = 0;
  mobileOpen     = false;

  // ── SVG path constants ──────────────────────────────────────────────
  private readonly P = {
    home:    'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    users:   'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    books:   'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    logs:    'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    bell:    'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
    settings:'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z',
    bookmark:'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z',
    activity:'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    profile: 'M5.121 17.804A9 9 0 1118.88 6.196M15 11a3 3 0 11-6 0 3 3 0 016 0z'
  };

  // ── Admin link definitions ─────────────────────────────────────────
  get adminDesktopLinks() {
    return [
      { path: '/admin/dashboard',        label: 'Dashboard', d: this.P.home     },
      { path: '/admin/users',            label: 'Users',     d: this.P.users    },
      { path: '/admin/books',            label: 'Books',     d: this.P.books    },
      { path: '/admin/logs',             label: 'Logs',      d: this.P.logs     },
      { path: '/admin/pending-requests', label: 'Requests',  d: this.P.bell     },
      { path: '/admin/settings',         label: 'Settings',  d: this.P.settings }
    ];
  }

  adminDrawerLinks = [
    { path: '/admin/dashboard',        icon: '🏠', label: 'Dashboard' },
    { path: '/admin/users',            icon: '👥', label: 'Users'     },
    { path: '/admin/books',            icon: '📚', label: 'Books'     },
    { path: '/admin/logs',             icon: '📋', label: 'Logs'      },
    { path: '/admin/pending-requests', icon: '🔔', label: 'Requests'  },
    { path: '/admin/settings',         icon: '⚙️',  label: 'Settings'  },
    { path: '/admin/profile',          icon: '👤', label: 'Profile'   }
  ];

  adminTabs = [
    { path: '/admin/dashboard',        label: 'Home',     d: this.P.home  },
    { path: '/admin/users',            label: 'Users',    d: this.P.users },
    { path: '/admin/books',            label: 'Books',    d: this.P.books },
    { path: '/admin/pending-requests', label: 'Requests', d: this.P.bell  },
    { path: '/admin/settings',         label: 'Settings', d: this.P.settings }
  ];

  // ── User link definitions ──────────────────────────────────────────
  get userDesktopLinks() {
    return [
      { path: '/user/dashboard',       label: 'Dashboard', d: this.P.home,     badge: false },
      { path: '/user/available-books', label: 'Browse',    d: this.P.books,    badge: true  },
      { path: '/user/my-books',        label: 'My Books',  d: this.P.bookmark, badge: false },
      { path: '/user/my-activity',     label: 'Activity',  d: this.P.activity, badge: false }
    ];
  }

  userDrawerLinks = [
    { path: '/user/dashboard',       icon: '🏠', label: 'Dashboard', badge: false },
    { path: '/user/available-books', icon: '📖', label: 'Browse',    badge: true  },
    { path: '/user/my-books',        icon: '🔖', label: 'My Books',  badge: false },
    { path: '/user/my-activity',     icon: '📊', label: 'Activity',  badge: false },
    { path: '/user/profile',         icon: '👤', label: 'Profile',   badge: false }
  ];

  userTabs = [
    { path: '/user/dashboard',       label: 'Home',     d: this.P.home,     badge: false },
    { path: '/user/available-books', label: 'Browse',   d: this.P.books,    badge: true  },
    { path: '/user/my-books',        label: 'My Books', d: this.P.bookmark, badge: false },
    { path: '/user/my-activity',     label: 'Activity', d: this.P.activity, badge: false },
    { path: '/user/profile',         label: 'Profile',  d: this.P.profile,  badge: false }
  ];

  ngOnInit(): void {
    this.syncAuthState();

    // Close mobile menu + re-sync on every navigation
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.mobileOpen = false;
        this.syncAuthState();
        this.cdr.markForCheck();
      });

    // Scroll listener outside Angular zone for performance
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', () => {
        const next = window.scrollY > 10;
        if (next !== this.scrolled) {
          this.zone.run(() => { this.scrolled = next; this.cdr.markForCheck(); });
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
          const p = JSON.parse(atob(token.split('.')[1]));
          this.username = p['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'U';
        } catch { this.username = 'U'; }
      }
      if (this.userRole === 'User' && this.availableCount === 0) this.loadAvailableCount();
    }
  }

  loadAvailableCount(): void {
    this.bookService.getAvailableCount().subscribe({
      next: c => { this.availableCount = c; this.cdr.markForCheck(); },
      error: () => {}
    });
  }

  closeMobile(): void { this.mobileOpen = false; this.cdr.markForCheck(); }

  logout(): void {
    this.mobileOpen = false;
    this.auth.logout();
    this.loggedIn = false; this.userRole = null; this.username = '';
    this.cdr.markForCheck();
    this.router.navigate(['/login']);
  }
}
