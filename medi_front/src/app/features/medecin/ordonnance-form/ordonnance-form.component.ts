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
      <div formArrayName="medicaments">
        <div *ngFor="let m of medicaments.controls; let i = index" [formGroupName]="i">
          <input formControlName="nom" placeholder="Nom du médicament" />
          <input formControlName="posologie" placeholder="Posologie" />
          <input formControlName="dureeTraitement" type="number" placeholder="Durée (jours)" />
          <button type="button" (click)="retirerMedicament(i)">Retirer</button>
        </div>
      </div>
      <button type="button" (click)="ajouterMedicament()">+ Ajouter un médicament</button>

      <div class="actions">
        <button type="submit" [disabled]="loading()">
          {{ loading() ? 'Enregistrement...' : 'Enregistrer l\'ordonnance' }}
        </button>
        <button type="button" (click)="terminerSansOrdonnance()">Terminer sans ordonnance</button>
      </div>
    </form>

    <button *ngIf="ordonnanceId()" (click)="imprimer()">Imprimer l'ordonnance</button>
    <button *ngIf="ordonnanceId()" (click)="terminer()">Terminer la consultation</button>
  `,
  styles: [`input, textarea { display: block; width: 100%; margin-bottom: 12px; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; } button { margin: 6px 0; padding: 10px 14px; border: none; border-radius: 8px; color: white; cursor: pointer; } .actions { display: flex; gap: 12px; flex-wrap: wrap; }`]
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
  private motifConsultation = '';
  private actionsConsultation = '';

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
    this.medicaments.push(this.fb.group({
      nom: ['', Validators.required],
      posologie: ['', Validators.required],
      dureeTraitement: [7, Validators.required]
    }));
  }

  retirerMedicament(i: number) {
    this.medicaments.removeAt(i);
  }

  submit() {
    if (!this.medecinId) return;
    this.loading.set(true);
    this.ordonnanceService.create({
      commentaire: this.form.value.commentaire ?? '',
      patientId: this.patientId,
      medecinId: this.medecinId,
      medicaments: this.medicaments.value
    }).subscribe({
      next: (ord) => {
        this.ordonnanceId.set(ord.id);
        this.consultationService.update(this.consultationId, {
          motif: this.motifConsultation,
          actionsRequis: this.actionsConsultation,
          ordonnanceId: ord.id
        }).subscribe(() => this.loading.set(false));
      },
      error: () => this.loading.set(false)
    });
  }

  terminerSansOrdonnance() {
    this.router.navigate(['/medecin/mes-patients']);
  }

  terminer() {
    this.router.navigate(['/medecin/mes-patients']);
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
