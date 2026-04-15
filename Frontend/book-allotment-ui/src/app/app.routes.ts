import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';



export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // ── Auth (no guard needed) ─────────────────────────────────────────
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register').then(m => m.RegisterComponent)
  },

  // ── Admin routes ───────────────────────────────────────────────────
  {
    path: 'admin/dashboard',
    loadComponent: () =>
      import('./features/admin/dashboard/dashboard').then(m => m.AdminDashboardComponent),
    canActivate: [authGuard, roleGuard], data: { role: 'Admin' }
  },
  {
    path: 'admin/users',
    loadComponent: () =>
      import('./features/admin/manage-users/manage-users').then(m => m.ManageUsersComponent),
    canActivate: [authGuard, roleGuard], data: { role: 'Admin' }
  },
  {
    path: 'admin/books',
    loadComponent: () =>
      import('./features/admin/manage-books/manage-books').then(m => m.ManageBooksComponent),
    canActivate: [authGuard, roleGuard], data: { role: 'Admin' }
  },
  {
    path: 'admin/logs',
    loadComponent: () =>
      import('./features/admin/logs/logs').then(m => m.LogsComponent),
    canActivate: [authGuard, roleGuard], data: { role: 'Admin' }
  },
  {
    path: 'admin/pending-requests',
    loadComponent: () =>
      import('./features/admin/pending-requests/pending-requests').then(m => m.PendingRequestsComponent),
    canActivate: [authGuard, roleGuard], data: { role: 'Admin' }
  },
  {
    path: 'admin/settings',
    loadComponent: () =>
      import('./features/admin/settings/settings').then(m => m.AdminSettingsComponent),
    canActivate: [authGuard, roleGuard], data: { role: 'Admin' }
  },
  {
    path: 'admin/profile',
    loadComponent: () =>
      import('./features/admin/profile/profile').then(m => m.AdminProfileComponent),
    canActivate: [authGuard, roleGuard], data: { role: 'Admin' }
  },

  // ── User routes ────────────────────────────────────────────────────
  {
    path: 'user/dashboard',
    loadComponent: () =>
      import('./features/user/dashboard/dashboard').then(m => m.UserDashboardComponent),
    canActivate: [authGuard, roleGuard], data: { role: 'User' }
  },
  {
    path: 'user/available-books',
    loadComponent: () =>
      import('./features/user/available-books/available-books').then(m => m.AvailableBooksComponent),
    canActivate: [authGuard, roleGuard], data: { role: 'User' }
  },
  {
    path: 'user/my-books',
    loadComponent: () =>
      import('./features/user/my-books/my-books').then(m => m.MyBooksComponent),
    canActivate: [authGuard, roleGuard], data: { role: 'User' }
  },
  {
    path: 'user/my-activity',
    loadComponent: () =>
      import('./features/user/my-activity/my-activity').then(m => m.MyActivityComponent),
    canActivate: [authGuard, roleGuard], data: { role: 'User' }
  },
  {
    path: 'user/profile',
    loadComponent: () =>
      import('./features/user/Profile/profile').then(m => m.ProfileComponent),
    canActivate: [authGuard, roleGuard], data: { role: 'User' }
  },

  // ── Catch-all — redirect unknown URLs to login ─────────────────────
  { path: '**', redirectTo: 'login' }
];
