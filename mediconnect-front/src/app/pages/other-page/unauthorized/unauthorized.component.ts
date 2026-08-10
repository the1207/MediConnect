import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
      <div class="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg text-center">
        <h1 class="text-4xl font-bold mb-4 text-slate-900 dark:text-white">401</h1>
        <p class="text-base text-slate-600 dark:text-slate-300 mb-6">
          Vous n'êtes pas autorisé à accéder à cette page.
        </p>
        <a routerLink="/signin" class="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700">
          Retour à la connexion
        </a>
      </div>
    </div>
  `,
  styles: []
})
export class UnauthorizedComponent {}
