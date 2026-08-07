import { Routes } from '@angular/router';

export const INFIRMIER_ROUTES: Routes = [
  { path: '', redirectTo: 'historique', pathMatch: 'full' },
  {
    path: 'historique',
    loadComponent: () => import('./patients-list/patients-list.component').then(m => m.PatientsListComponent)
  },
  {
    path: 'patient-create',
    loadComponent: () => import('./patient-create/patient-create.component').then(m => m.PatientCreateComponent)
  },
  {
    path: 'constantes/:patientId',
    loadComponent: () => import('./constante-saisie/constante-saisie.component').then(m => m.ConstanteSaisieComponent)
  },
  {
    path: 'choix-medecin/:patientId',
    loadComponent: () => import('./choix-medecin/choix-medecin.component').then(m => m.ChoixMedecinComponent)
  }
];
