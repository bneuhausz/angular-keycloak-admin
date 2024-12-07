import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from './shared/guards/auth.guard';

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
    canActivate: [isAuthenticatedGuard()],
    loadComponent: () => import('./user-management/user-management.component'),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
