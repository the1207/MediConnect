import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  { path: '', redirectTo: 'specialites', pathMatch: 'full' },
  {
    path: 'specialites',
    loadComponent: () => import('./create-specialite/create-specialite.component').then(m => m.CreateSpecialiteComponent)
  },
  {
    path: 'medecins',
    loadComponent: () => import('./create-medecin/create-medecin.component').then(m => m.CreateMedecinComponent)
  },
  {
    path: 'utilisateurs',
    loadComponent: () => import('./users-list/users-list.component').then(m => m.UsersListComponent)
  },
  {
    path: 'utilisateurs/nouveau',
    loadComponent: () => import('./create-user/create-user.component').then(m => m.CreateUserComponent)
  },
  {
    path: 'historique',
    loadComponent: () => import('./history/history.component').then(m => m.HistoryComponent)
  }
];
