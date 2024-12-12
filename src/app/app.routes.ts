import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from './shared/guards/auth.guard';
import { canManageUsersGuard } from './shared/guards/can-manage-users.guard';

export const routes: Routes = [
  {
    path: 'unauthorized',
    loadComponent: () => import('./unauthorized/unauthorized.component'),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component'),
  },
  {
    path: 'user-management',
    canActivate: [isAuthenticatedGuard(), canManageUsersGuard()],
    loadComponent: () => import('./user-management/user-management.component'),
  },
  {
    path: 'role-management',
    canActivate: [isAuthenticatedGuard(), canManageUsersGuard()],
    loadComponent: () => import('./role-management/role-management.component'),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
