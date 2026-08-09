import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpecialiteService } from '../../../services/specialite.service';
import { Specialite } from '../../../models/mediconnect.models';

@Component({
  selector: 'app-create-specialite',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Spécialités</h2>
    <input [(ngModel)]="nom" placeholder="Nom de la spécialité" />
    <button (click)="creer()" [disabled]="!nom || loading()">
      {{ loading() ? 'Création...' : 'Créer' }}
    </button>

    <ul>
      <li *ngFor="let s of specialites()">{{ s.nom }}</li>
    </ul>
  `,
  styles: [`input { display: block; width: 100%; margin-bottom: 14px; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; } button { padding: 10px 16px; border: none; border-radius: 8px; background: #2563eb; color: white; cursor: pointer; }`]
})
export class CreateSpecialiteComponent {
  private specialiteService = inject(SpecialiteService);

  nom = '';
  loading = signal(false);
  specialites = signal<Specialite[]>([]);

  constructor() {
    this.charger();
  }

  charger() {
    this.specialiteService.getAll().subscribe(list => this.specialites.set(list));
  }

  creer() {
    if (!this.nom) return;
    this.loading.set(true);
    this.specialiteService.create(this.nom).subscribe({
      next: () => { this.nom = ''; this.loading.set(false); this.charger(); },
      error: () => this.loading.set(false)
    });
  }
}
