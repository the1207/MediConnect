import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-medecin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav>
      <span>MediConnect — Dr. {{ auth.fullName() }}</span>
      <a routerLink="/medecin/mes-patients">Mes patients</a>
      <a routerLink="/medecin/disponibilites">Mes disponibilités</a>
      <button (click)="auth.logout()">Déconnexion</button>
    </nav>
    <main><router-outlet></router-outlet></main>
  `,
  styles: [`nav { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; padding: 16px; background: #ecfdf5; } button { border: none; padding: 10px 14px; border-radius: 8px; background: #16a34a; color: white; cursor: pointer; } main { padding: 24px; }`]
})
export class MedecinLayoutComponent {
  auth = inject(AuthService);
}
