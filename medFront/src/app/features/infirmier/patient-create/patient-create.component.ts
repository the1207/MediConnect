import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService } from '../../../services/patient.service';

@Component({
  selector: 'app-patient-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>Nouvelle fiche patient</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <input formControlName="nom" placeholder="Nom" />
      <input formControlName="prenom" placeholder="Prénom" />
      <input formControlName="dateNaissance" type="date" />
      <select formControlName="sexe">
        <option value="M">M</option>
        <option value="F">F</option>
      </select>
      <input formControlName="contact" placeholder="Contact" />
      <textarea formControlName="allergies" placeholder="Allergies"></textarea>
      <textarea formControlName="antecedents" placeholder="Antécédents"></textarea>
      <input formControlName="groupeSanguin" placeholder="Groupe sanguin" />

      <p class="erreur" *ngIf="erreur()">{{ erreur() }}</p>

      <button type="submit" [disabled]="form.invalid || loading()">
        {{ loading() ? 'Création...' : 'Créer la fiche et continuer' }}
      </button>
    </form>
  `,
  styles: [`.erreur { color: red; } input, select, textarea { display: block; width: 100%; margin-bottom: 12px; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; } button { padding: 12px 18px; border: none; border-radius: 8px; background: #2563eb; color: white; cursor: pointer; }`]
})
export class PatientCreateComponent {
  private fb = inject(FormBuilder);
  private patientService = inject(PatientService);
  private router = inject(Router);

  loading = signal(false);
  erreur = signal('');

  form = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    dateNaissance: ['', Validators.required],
    sexe: ['M', Validators.required],
    contact: ['', Validators.required],
    allergies: [''],
    antecedents: [''],
    groupeSanguin: ['']
  });

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.patientService.create(this.form.value as any).subscribe({
      next: (patient) => {
        this.loading.set(false);
        // After creating a patient, go to doctor selection to allow booking a rendez-vous
        this.router.navigate(['/infirmier/choix-medecin', patient.id]);
      },
      error: () => { this.loading.set(false); this.erreur.set('Erreur lors de la création du patient.'); }
    });
  }
}
