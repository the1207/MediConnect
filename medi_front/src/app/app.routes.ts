import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { infirmiereGuard } from './core/guards/infirmiere.guard';
import { medecinGuard } from './core/guards/medecin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'utilisateurs', pathMatch: 'full' },
      { path: 'utilisateurs', loadComponent: () => import('./pages/admin/users-list/users-list.component').then(m => m.UsersListComponent) },
      { path: 'utilisateurs/nouveau', loadComponent: () => import('./pages/admin/create-user/create-user.component').then(m => m.CreateUserComponent) },
      { path: 'historique', loadComponent: () => import('./pages/admin/history/history.component').then(m => m.HistoryComponent) }
    ]
  },
  {
    path: 'infirmiere',
    canActivate: [infirmiereGuard],
    loadComponent: () => import('./pages/infirmiere/infirmiere-layout/infirmiere-layout.component').then(m => m.InfirmiereLayoutComponent),
    children: [
      { path: '', redirectTo: 'recherche', pathMatch: 'full' },
      {
        path: 'recherche',
        loadComponent: () => import('./pages/infirmiere/recherche-patient/recherche-patient.component').then(m => m.RecherchePatientComponent)
      },
      {
        path: 'nouveau-patient',
        loadComponent: () => import('./pages/infirmiere/nouveau-patient/nouveau-patient.component').then(m => m.NouveauPatientComponent)
      },
      {
        path: 'constantes/:patientId',
        loadComponent: () => import('./pages/infirmiere/prise-constantes/prise-constantes.component').then(m => m.PriseConstantesComponent)
      },
      {
        path: 'rendez-vous/:patientId',
        loadComponent: () => import('./pages/infirmiere/prendre-rendezvous/prendre-rendezvous.component').then(m => m.PrendreRendezvousComponent)
      },
      {
        path: 'file-attente',
        loadComponent: () => import('./pages/infirmiere/file-attente/file-attente.component').then(m => m.FileAttenteComponent)
      }
    ]
  },
  {
    path: 'medecin',
    canActivate: [medecinGuard],
    loadComponent: () => import('./pages/medecin/medecin-layout/medecin-layout.component').then(m => m.MedecinLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/medecin/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'patients',
        loadComponent: () => import('./pages/medecin/liste-patients/liste-patients.component').then(m => m.ListePatientsComponent)
      },
      {
        path: 'file-attente',
        loadComponent: () => import('./pages/medecin/file-attente-medecin/file-attente-medecin.component').then(m => m.FileAttenteMedecinComponent)
      },
      {
        path: 'demandes-rendezvous',
        loadComponent: () => import('./pages/medecin/demandes-rendezvous/demandes-rendezvous.component').then(m => m.DemandesRendezvousComponent)
      },
      {
        path: 'consultation/:patientId',
        loadComponent: () => import('./pages/medecin/consultation/consultation.component').then(m => m.ConsultationComponent)
      },
      {
        path: 'historique/:patientId',
        loadComponent: () => import('./pages/medecin/historique/historique.component').then(m => m.HistoriqueComponent)
      },
      {
        path: 'prescription/:patientId',
        loadComponent: () => import('./pages/medecin/prescription/prescription.component').then(m => m.PrescriptionComponent)
      },
      {
        path: 'ordonnance/:ordonnanceId',
        loadComponent: () => import('./pages/medecin/ordonnance-detail/ordonnance-detail.component').then(m => m.OrdonnanceDetailComponent)
      },
      {
        path: 'ordonnances',
        loadComponent: () => import('./pages/medecin/ordonnances-list/ordonnances-list.component').then(m => m.OrdonnancesListComponent)
      }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
