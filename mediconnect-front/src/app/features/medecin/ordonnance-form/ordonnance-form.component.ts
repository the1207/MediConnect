import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdonnanceService } from '../../../services/ordonnance.service';
import { ConsultationService } from '../../../services/consultation.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-ordonnance-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>Prescription (facultative)</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <label>Commentaire</label>
      <textarea formControlName="commentaire"></textarea>

      <h3>Médicaments</h3>
      <div formArrayName="medicaments" class="medicaments-list">
        <div *ngFor="let m of medicaments.controls; let i = index" [formGroupName]="i" class="medicament-row">
          <div class="fields">
            <input formControlName="nom" placeholder="Nom du médicament" />
            <input formControlName="posologie" placeholder="Posologie" />
            <input formControlName="dureeTraitement" type="number" min="1" placeholder="Durée (jours)" />
          </div>
          <button type="button" class="remove-button" (click)="retirerMedicament(i)">Retirer</button>
        </div>
      </div>
      <button type="button" class="secondary" (click)="ajouterMedicament()">+ Ajouter un médicament</button>

      <div class="actions">
        <button type="submit" [disabled]="loading()">
          {{ submitLabel() }}
        </button>
        <button type="button" class="secondary" (click)="terminerSansOrdonnance()">Terminer sans ordonnance</button>
      </div>
      <p class="notification" [class.success]="notificationSuccess()" [class.error]="!notificationSuccess()" *ngIf="notification()">{{ notification() }}</p>
    </form>

    <div *ngIf="ordonnanceId()" class="saved-actions">
      <button type="button" [disabled]="ordonnanceStatut() === 'VALIDEE' || loading()" (click)="validerOrdonnance()">
        {{ ordonnanceActionLabel() }}
      </button>
      <button type="button" class="secondary" (click)="imprimer()">Imprimer l'ordonnance</button>
      <button type="button" class="secondary" (click)="terminer()">Terminer la consultation</button>
  `,
  styles: [`
    :host {
      display: block;
      padding: 20px;
      color: #111827;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    h2 {
      margin-bottom: 16px;
      font-size: 1.75rem;
      color: #111827;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #334155;
    }

    textarea,
    input {
      display: block;
      width: 100%;
      margin-bottom: 12px;
      padding: 12px 14px;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      background: #f8fafc;
      color: #111827;
      font-size: 0.97rem;
    }

    textarea {
      min-height: 120px;
      resize: vertical;
    }

    .prescription-note {
      margin-bottom: 16px;
      padding: 14px 16px;
      border-radius: 14px;
      background: #eef2ff;
      border: 1px solid #c7d2fe;
      color: #3730a3;
    }

    .medicaments-list {
      display: grid;
      gap: 14px;
      margin-bottom: 16px;
    }

    .medicament-row {
      display: grid;
      gap: 12px;
      padding: 16px;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      background: #ffffff;
    }

    .fields {
      display: grid;
      gap: 12px;
    }

    button {
      margin: 6px 0;
      padding: 10px 14px;
      border: none;
      border-radius: 10px;
      color: white;
      cursor: pointer;
      background: #2563eb;
    }

    button.secondary {
      background: #e5e7eb;
      color: #111827;
    }

    .remove-button {
      width: fit-content;
      padding: 10px 14px;
      background: #dc2626;
      color: white;
      border-radius: 10px;
    }

    .actions,
    .saved-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 16px;
    }

    .notification {
      margin-top: 14px;
      font-weight: 600;
    }

    .notification.success {
      color: #047857;
    }

    .notification.error {
      color: #b91c1c;
    }
  `]
})
export class OrdonnanceFormComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ordonnanceService = inject(OrdonnanceService);
  private consultationService = inject(ConsultationService);
  private auth = inject(AuthService);

  consultationId = Number(this.route.snapshot.paramMap.get('consultationId'));
  patientId = Number(this.route.snapshot.queryParamMap.get('patientId'));
  medecinId = this.auth.medecinId();

  loading = signal(false);
  ordonnanceId = signal<number | null>(null);
  ordonnanceStatut = signal<string | null>(null);
  notification = signal('');
  notificationType = signal<'success' | 'error' | ''>('');
  private motifConsultation = '';
  private actionsConsultation = '';

  notificationSuccess() {
    return this.notificationType() === 'success';
  }

  notificationError() {
    return this.notificationType() === 'error';
  }

  form = this.fb.group({
    commentaire: [''],
    medicaments: this.fb.array([])
  });

  get medicaments(): FormArray {
    return this.form.get('medicaments') as FormArray;
  }

  constructor() {
    this.consultationService.get(this.consultationId).subscribe(c => {
      this.motifConsultation = c.motif;
      this.actionsConsultation = c.actionsRequis ?? '';
    });
  }

  ajouterMedicament() {
    this.notification.set('');
    this.notificationType.set('');
    this.medicaments.push(this.fb.group({
      nom: ['', Validators.required],
      posologie: ['', Validators.required],
      dureeTraitement: [7, [Validators.required, Validators.min(1)]]
    }));
  }

  retirerMedicament(i: number) {
    this.medicaments.removeAt(i);
  }

  submit() {
    if (!this.medecinId) return;
    if (this.medicaments.length > 0 && this.form.invalid) {
      this.notification.set('Veuillez remplir tous les champs des médicaments ou retirer les lignes vides.');
      return;
    }

    this.loading.set(true);
    this.notification.set('');
    this.notificationType.set('');
    this.ordonnanceService.create({
      commentaire: this.form.value.commentaire ?? '',
      patientId: this.patientId,
      medecinId: this.medecinId,
      medicaments: this.medicaments.value
    }).subscribe({
      next: (ord) => {
        this.ordonnanceId.set(ord.id);
        this.ordonnanceStatut.set(ord.statut ?? 'REDIGEE');
        this.consultationService.update(this.consultationId, {
          motif: this.motifConsultation,
          actionsRequis: this.actionsConsultation,
          ordonnanceId: ord.id
        }).subscribe(() => {
          this.loading.set(false);
          this.notificationType.set('success');
          this.notification.set('Ordonnance enregistrée avec succès. Vous pouvez maintenant la valider ou l’imprimer.');
        });
      },
      error: (err) => {
        this.loading.set(false);
        this.notificationType.set('error');
        this.notification.set(err?.error?.message || 'Erreur lors de l’enregistrement de l’ordonnance.');
      }
    });
  }

  validerOrdonnance() {
    const id = this.ordonnanceId();
    if (!id) return;
    this.loading.set(true);
    this.notification.set('');
    this.notificationType.set('');
    this.ordonnanceService.valider(id).subscribe({
      next: (ord) => {
        this.ordonnanceStatut.set(ord.statut ?? 'VALIDEE');
        this.loading.set(false);
        this.notificationType.set('success');
        this.notification.set('Ordonnance validée avec succès.');
      },
      error: (err) => {
        this.loading.set(false);
        this.notificationType.set('error');
        this.notification.set(err?.error?.message || 'Erreur lors de la validation de l’ordonnance.');
      }
    });
  }

  terminerSansOrdonnance() {
    this.router.navigate(['/medecin/mes-patients']);
  }

  terminer() {
    this.router.navigate(['/medecin/mes-patients']);
  }

  submitLabel() {
    return this.loading() ? 'Enregistrement...' : 'Enregistrer l’ordonnance';
  }

  ordonnanceActionLabel() {
    return this.ordonnanceStatut() === 'VALIDEE'
      ? 'Ordonnance validée'
      : 'Valider l’ordonnance';
  }

  imprimer() {
    const id = this.ordonnanceId();
    if (!id) return;
    this.ordonnanceService.imprimer(id).subscribe(texte => {
      const w = window.open('', '_blank');
      if (w) {
        w.document.write(`<pre>${texte}</pre>`);
        w.document.close();
        w.print();
      }
    });
  }
}
