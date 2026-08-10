import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  template: `
    <div class="wrap">
      <h2>Accès refusé</h2>
      <p>Vous n'avez pas les droits pour accéder à cette page.</p>
      <button (click)="auth.logout()">Retour à la connexion</button>
    </div>
  `,
  styles: [`.wrap { text-align: center; margin: 80px auto; padding: 24px; max-width: 420px; background: #fff; border-radius: 12px; box-shadow: 0 12px 24px rgba(0,0,0,.08); } button { margin-top: 18px; padding: 10px 16px; border: none; border-radius: 8px; background: #2563eb; color: white; cursor: pointer; }`]
})
export class UnauthorizedComponent {
  auth = inject(AuthService);
}
