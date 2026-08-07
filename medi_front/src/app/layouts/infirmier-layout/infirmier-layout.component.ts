import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-infirmier-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav>
      <span>MediConnect — Infirmier(e) : {{ auth.fullName() }}</span>
      <a routerLink="/infirmier/historique">Historique des patients</a>
      <a routerLink="/infirmier/patient-create">Nouveau patient</a>
      <button (click)="auth.logout()">Déconnexion</button>
    </nav>
    <main><router-outlet></router-outlet></main>
  `,
  styles: [`nav { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; padding: 16px; background: #eff6ff; } button { border: none; padding: 10px 14px; border-radius: 8px; background: #2563eb; color: white; cursor: pointer; } main { padding: 24px; }`]
})
export class InfirmierLayoutComponent {
  auth = inject(AuthService);
}
