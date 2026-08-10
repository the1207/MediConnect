import { Routes } from '@angular/router';
import { SignInComponent } from './pages/auth-pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/auth-pages/sign-up/sign-up.component';
import { UnauthorizedComponent } from './pages/other-page/unauthorized/unauthorized.component';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'signin',
    pathMatch: 'full'
  },
  {
    path: 'signin',
    component: SignInComponent,
    title: 'MediConnect - Sign In'
  },
  {
    path: 'signup',
    component: SignUpComponent,
    title: 'MediConnect - Sign Up'
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
    title: 'MediConnect - Unauthorized'
  },
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [roleGuard(['ADMIN', 'MEDECIN', 'INFIRMIER'])],
    children: [
      {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
      },
      {
        path: 'medecin',
        loadChildren: () => import('./features/medecin/medecin.routes').then(m => m.MEDECIN_ROUTES)
      },
      {
        path: 'infirmier',
        loadChildren: () => import('./features/infirmier/infirmier.routes').then(m => m.INFIRMIER_ROUTES)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'signin'
  }
];
