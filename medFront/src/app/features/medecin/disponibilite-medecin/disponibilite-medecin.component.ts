import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DisponibiliteService } from '../../../services/disponibilite.service';
import { AuthService } from '../../../services/auth.service';
import { Disponibilite } from '../../../models/mediconnect.models';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-disponibilite-medecin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>Mes disponibilités</h2>

    <form [formGroup]="form" (ngSubmit)="genererCreneaux()">
      <label>Date</label>
      <input formControlName="date" type="date" />
      <label>De</label>
      <input formControlName="heureDebut" type="time" />
      <label>À</label>
      <input formControlName="heureFin" type="time" />
      <button type="submit" [disabled]="form.invalid || loading()">
        {{ loading() ? 'Ajout en cours...' : 'Ajouter la disponibilité' }}
      </button>
      <p class="erreur" *ngIf="erreur()">{{ erreur() }}</p>
      <p class="succes" *ngIf="succes()">{{ succes() }}</p>
    </form>

    <h3>Créneaux existants</h3>
    <ul>
      <li *ngFor="let c of creneaux()" [class.reserve]="c.reservation">
        {{ c.dateCreneau }} — {{ c.heureDebut }} à {{ c.heureFin }}
        {{ c.reservation ? '(réservé)' : '(libre)' }}
        <button *ngIf="!c.reservation" (click)="supprimer(c.id)">Supprimer</button>
      </li>
    </ul>
  `,
  styles: [`.reserve { color: #999; } button { margin-left: 12px; padding: 6px 10px; border: none; border-radius: 8px; background: #dc2626; color: white; cursor: pointer; }`]
})
export class DisponibiliteMedecinComponent {
  private fb = inject(FormBuilder);
  private disponibiliteService = inject(DisponibiliteService);
  private auth = inject(AuthService);

  medecinId = this.auth.medecinId();
  loading = signal(false);
  erreur = signal('');
  succes = signal('');
  creneaux = signal<Disponibilite[]>([]);

  form = this.fb.group({
    date: ['', Validators.required],
    heureDebut: ['07:00', Validators.required],
    heureFin: ['10:00', Validators.required],
    capacity: [1, [Validators.required]]
  });

  constructor() {
    this.charger();
  }

  charger() {
    if (!this.medecinId) return;
    this.disponibiliteService.getByMedecin(this.medecinId).subscribe(list => this.creneaux.set(list));
  }

  genererCreneaux() {
    this.erreur.set('');
    this.succes.set('');

    if (!this.medecinId) {
      this.erreur.set('Identifiant médecin introuvable. Reconnectez-vous ou contactez l’administrateur.');
      return;
    }

    if (this.form.invalid) {
      this.erreur.set('Veuillez compléter tous les champs obligatoires.');
      return;
    }

    const { date, heureDebut, heureFin } = this.form.value;

    const [hD, mD] = heureDebut!.split(':').map(Number);
    const [hF, mF] = heureFin!.split(':').map(Number);
    const debutMinutes = hD * 60 + mD;
    const finMinutes = hF * 60 + mF;

    if (finMinutes <= debutMinutes) {
      this.erreur.set('L’heure de fin doit être après l’heure de début.');
      return;
    }

    this.loading.set(true);
    this.disponibiliteService.create({
      dateCreneau: date!,
      heureDebut: heureDebut!,
      heureFin: heureFin!,
      capacity: Number(this.form.value.capacity) || 1,
      medecinId: this.medecinId!
    }).pipe(catchError(() => of(null))).subscribe({
      next: (result) => {
        this.loading.set(false);
        if (!result) {
          this.erreur.set('Impossible d’ajouter la disponibilité.');
          return;
        }
        this.succes.set('Disponibilité ajoutée avec succès.');
        this.charger();
      },
      error: () => {
        this.loading.set(false);
        this.erreur.set('Erreur lors de l’ajout de la disponibilité.');
      }
    });
  }

  supprimer(id: number) {
    this.disponibiliteService.delete(id).subscribe(() => this.charger());
  }

  private toHHmm(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
    const m = (totalMinutes % 60).toString().padStart(2, '0');
    return `${h}:${m}:00`;
  }
}
