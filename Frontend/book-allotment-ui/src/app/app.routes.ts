import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';

import { AdminDashboardComponent } from './features/admin/dashboard/dashboard';
import { ManageUsersComponent } from './features/admin/manage-users/manage-users';
import { ManageBooksComponent } from './features/admin/manage-books/manage-books';
import { LogsComponent } from './features/admin/logs/logs';

import { UserDashboardComponent } from './features/user/dashboard/dashboard';
import { MyBooksComponent } from './features/user/my-books/my-books';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // ADMIN ROUTES
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Admin' }
  },
  {
    path: 'admin/users',
    component: ManageUsersComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Admin' }
  },
  {
    path: 'admin/books',
    component: ManageBooksComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Admin' }
  },
  {
    path: 'admin/logs',
    component: LogsComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Admin' }
  },
  {
    path: 'admin/pending-requests',
    loadComponent: () =>
      import('./features/admin/pending-requests/pending-requests')
        .then(m => m.PendingRequestsComponent),
    canActivate: [authGuard, roleGuard],
    data: { role: 'Admin' }
  },

  // USER ROUTES
  {
    path: 'user/dashboard',
    component: UserDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'User' }
  },
  {
    path: 'user/my-activity',
    loadComponent: () =>
      import('./features/user/my-activity/my-activity')
        .then(m => m.MyActivityComponent),
    canActivate: [authGuard, roleGuard],
    data: { role: 'User' }
  },
  {
    path: 'user/profile',
    loadComponent: () =>
      import('./features/user/Profile/profile')
        .then(m => m.ProfileComponent),
    canActivate: [authGuard, roleGuard],
    data: { role: 'User' }
  },
  {
    path: 'user/my-books',
    component: MyBooksComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'User' }
  },
  {
    path: 'user/available-books',
    loadComponent: () =>
      import('./features/user/available-books/available-books')
        .then(m => m.AvailableBooksComponent),
    canActivate: [authGuard, roleGuard],
    data: { role: 'User' }
  }
];
