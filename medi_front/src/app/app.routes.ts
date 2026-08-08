import { Routes } from '@angular/router';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./features/auth/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  {
    path: 'infirmier',
    loadComponent: () => import('./layouts/infirmier-layout/infirmier-layout.component').then(m => m.InfirmierLayoutComponent),
    canActivate: [roleGuard(['INFIRMIER', 'ADMIN'])],
    loadChildren: () => import('./features/infirmier/infirmier.routes').then(m => m.INFIRMIER_ROUTES)
  },
  {
    path: 'medecin',
    loadComponent: () => import('./layouts/medecin-layout/medecin-layout.component').then(m => m.MedecinLayoutComponent),
    canActivate: [roleGuard(['MEDECIN', 'ADMIN'])],
    loadChildren: () => import('./features/medecin/medecin.routes').then(m => m.MEDECIN_ROUTES)
  },
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [roleGuard(['ADMIN'])],
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  { path: '**', redirectTo: 'login' }
];
