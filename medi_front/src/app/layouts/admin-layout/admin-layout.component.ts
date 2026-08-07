import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav>
      <span>MediConnect — Admin : {{ auth.fullName() }}</span>
      <a routerLink="/admin/specialites">Spécialités</a>
      <a routerLink="/admin/medecins">Médecins</a>
      <a routerLink="/admin/utilisateurs">Utilisateurs</a>
      <a routerLink="/admin/historique">Historique</a>
      <button (click)="auth.logout()">Déconnexion</button>
    </nav>
    <main><router-outlet></router-outlet></main>
  `,
  styles: [`nav { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; padding: 16px; background: #fef3c7; } button { border: none; padding: 10px 14px; border-radius: 8px; background: #ea580c; color: white; cursor: pointer; } main { padding: 24px; }`]
})
export class AdminLayoutComponent {
  auth = inject(AuthService);
}
