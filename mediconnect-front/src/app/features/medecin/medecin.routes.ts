import { Routes } from '@angular/router';

export const MEDECIN_ROUTES: Routes = [
  { path: '', redirectTo: 'mes-patients', pathMatch: 'full' },
  {
    path: 'disponibilites',
    loadComponent: () => import('./disponibilite-medecin/disponibilite-medecin.component').then(m => m.DisponibiliteMedecinComponent)
  },
  {
    path: 'mes-patients',
    loadComponent: () => import('./mes-patients/mes-patients.component').then(m => m.MesPatientsComponent)
  },
  {
    path: 'patient/:id',
    loadComponent: () => import('./patient-detail-medecin/patient-detail-medecin.component').then(m => m.PatientDetailMedecinComponent)
  },
  {
    path: 'consultation/:patientId',
    loadComponent: () => import('./consultation-form/consultation-form.component').then(m => m.ConsultationFormComponent)
  },
  {
    path: 'ordonnance/:consultationId',
    loadComponent: () => import('./ordonnance-form/ordonnance-form.component').then(m => m.OrdonnanceFormComponent)
  }
];
