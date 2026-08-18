import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { DisponibiliteService } from '../../../services/disponibilite.service';
import { AuthService } from '../../../services/auth.service';
import { Disponibilite } from '../../../models/mediconnect.models';
import { ActionButtonComponent } from '../../../shared/components/ui/action-button/action-button.component';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-disponibilite-medecin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ActionButtonComponent, FormFieldComponent],
  template: `
    <section class="page-header">
      <div>
        <h2>Disponibilités</h2>
      </div>
    </section>

    <section class="section-card form-card">
      <h3>Ajouter un créneau</h3>
      <form [formGroup]="form" (ngSubmit)="genererCreneaux()" class="form-grid">
        <app-form-field label="Date" [required]="true" [control]="form.get('date')">
          <input formControlName="date" type="date" />
        </app-form-field>

        <app-form-field label="De" [required]="true" [control]="form.get('heureDebut')">
          <input formControlName="heureDebut" type="time" />
        </app-form-field>

        <app-form-field label="À" [required]="true" [control]="form.get('heureFin')">
          <input formControlName="heureFin" type="time" />
        </app-form-field>

        <button type="submit" [disabled]="form.invalid || loading()">
          {{ loading() ? 'Ajout en cours...' : 'Ajouter la disponibilité' }}
        </button>
      </form>
      <div class="status-messages">
        <p class="erreur" *ngIf="erreur()">{{ erreur() }}</p>
        <p class="succes" *ngIf="succes()">{{ succes() }}</p>
      </div>
    </section>

    <section class="section-card list-card">
      <h3>Créneaux existants</h3>
      <div *ngIf="!creneaux().length" class="empty-state">Aucun créneau défini pour l’instant.</div>
      <div class="slot-list">
        <article *ngFor="let c of creneaux()" class="slot-card" [class.reserve]="!c.actif || c.reservation" [class.inactive]="!c.actif">
          <div>
            <strong>{{ c.dateCreneau | date:'dd/MM/yyyy' }}</strong>
            <p>{{ c.heureDebut }} → {{ c.heureFin }}</p>
            <p class="status-text">{{ c.actif === false ? 'Disponibilité désactivée' : (c.reservation ? 'Réservé' : 'Disponible') }}</p>
          </div>
          <div class="slot-actions">
            <button type="button" class="toggle-btn" [class.off]="c.actif === false" (click)="toggleActif(c)">
              {{ c.actif === false ? 'Activer' : 'Désactiver' }}
            </button>
            <app-action-button *ngIf="!c.reservation" variant="delete" ariaLabel="Supprimer" (action)="supprimer(c.id)"></app-action-button>
          </div>
        </article>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; padding: 20px; font-family: Inter, system-ui, sans-serif; color: #111827; }
    .page-header { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 16px; align-items: center; margin-bottom: 24px; }
    .page-header h2 { margin: 0; font-size: 1.8rem; }
    .page-header p { margin: 0; color: #64748b; }
    .refresh { padding: 10px 16px; border: none; border-radius: 12px; background: #2563eb; color: white; cursor: pointer; }
    .section-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px; margin-bottom: 24px; box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06); }
    .form-card h3, .list-card h3 { margin-top: 0; font-size: 1.2rem; }
    .form-grid { display: grid; gap: 16px; grid-template-columns: repeat(3, minmax(0, 1fr)); align-items: end; }
    .field-group { display: grid; gap: 8px; }
    label { font-weight: 600; color: #334155; }
    input { width: 100%; padding: 12px 14px; border: 1px solid #cbd5e1; border-radius: 12px; background: #f8fafc; }
    button[type="submit"] { grid-column: span 3; padding: 14px 18px; border: none; border-radius: 14px; background: #2563eb; color: white; cursor: pointer; }
    .status-messages { margin-top: 16px; }
    .erreur { color: #b91c1c; margin: 0; }
    .succes { color: #047857; margin: 0; }
    .slot-list { display: grid; gap: 14px; }
    .slot-card { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 18px 20px; border: 1px solid #e2e8f0; border-radius: 18px; background: #f8fafc; }
    .slot-card.reserve { opacity: 0.9; background: #f1f5f9; }
    .slot-card.inactive { border-color: #fca5a5; background: #fff7ed; }
    .slot-card strong { display: block; margin-bottom: 6px; }
    .slot-card p { margin: 0; color: #475569; }
    .status-text { margin-top: 6px !important; font-weight: 600; }
    .slot-actions { display: flex; align-items: center; gap: 12px; }
    .chip { padding: 8px 12px; border-radius: 999px; font-weight: 700; color: #0f172a; background: #dbeafe; }
    .chip.busy { background: #fed7aa; }
    .toggle-btn { padding: 10px 14px; border: none; border-radius: 12px; background: #f59e0b; color: #111827; cursor: pointer; font-weight: 600; }
    .toggle-btn.off { background: #dcfce7; color: #166534; }
    .delete { padding: 10px 14px; border: none; border-radius: 12px; background: #dc2626; color: white; cursor: pointer; }
    .empty-state { padding: 20px; text-align: center; border: 1px dashed #cbd5e1; border-radius: 16px; color: #64748b; }
    @media (max-width: 860px) { .form-grid { grid-template-columns: 1fr; } .slot-card { flex-direction: column; align-items: flex-start; } .slot-actions { width: 100%; justify-content: space-between; } }
  `]
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
    heureFin: ['10:00', Validators.required]
  });

  constructor() {
    this.charger();
  }

  charger() {
    if (!this.medecinId) return;
    this.disponibiliteService.getByMedecin(this.medecinId).subscribe(list => {
      const sorted = [...list].sort((a, b) => {
        const aDate = new Date(`${a.dateCreneau}T${a.heureDebut || '00:00'}`).getTime();
        const bDate = new Date(`${b.dateCreneau}T${b.heureDebut || '00:00'}`).getTime();
        return bDate - aDate;
      });
      this.creneaux.set(sorted);
    });
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
    this.erreur.set('');
    this.succes.set('');
    this.disponibiliteService.delete(id).subscribe({
      next: () => {
        this.succes.set('Disponibilité supprimée avec succès.');
        this.charger();
      },
      error: () => {
        this.erreur.set('Impossible de supprimer cette disponibilité.');
      }
    });
  }

  toggleActif(creneau: Disponibilite) {
    const nextState = creneau.actif === false;
    this.erreur.set('');
    this.succes.set('');
    this.disponibiliteService.toggleActif(creneau.id, nextState).subscribe({
      next: () => {
        this.succes.set(`Disponibilité ${nextState ? 'activée' : 'désactivée'} avec succès.`);
        this.charger();
      },
      error: () => {
        this.erreur.set('Impossible de modifier la disponibilité.');
      }
    });
  }

  private toHHmm(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
    const m = (totalMinutes % 60).toString().padStart(2, '0');
    return `${h}:${m}:00`;
  }
}
