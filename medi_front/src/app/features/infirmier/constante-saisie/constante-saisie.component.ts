import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConstanteService } from '../../../services/constante.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-constante-saisie',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>Prise des constantes</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <label>Température (°C)</label>
      <input formControlName="temperature" type="number" step="0.1" [class.rouge]="tempHorsSeuil()" />

      <label>Poids (kg)</label>
      <input formControlName="poids" type="number" step="0.1" [class.rouge]="poidsHorsSeuil()" />

      <label>Tension artérielle (ex: 120/80)</label>
      <input formControlName="tensionArteriel" placeholder="120/80" [class.rouge]="tensionHorsSeuil()" />

      <label>Motif de la visite</label>
      <input formControlName="motifVisite" />

      <label>Priorité</label>
      <select formControlName="priorite">
        <option value="NORMALE">Normale</option>
        <option value="HAUTE">Haute</option>
        <option value="URGENTE">Urgente</option>
      </select>

      <p class="alerte" *ngIf="tempHorsSeuil() || poidsHorsSeuil() || tensionHorsSeuil()">
        ⚠ Valeur(s) hors seuil — le dossier sera marqué prioritaire par le serveur.
      </p>

      <button type="submit" [disabled]="form.invalid || loading()">
        {{ loading() ? 'Enregistrement...' : 'Enregistrer et choisir un médecin' }}
      </button>
    </form>
  `,
  styles: [`.rouge { border: 2px solid red; background: #ffe5e5; } .alerte { color: red; font-weight: bold; } input, select { display: block; width: 100%; margin-bottom: 12px; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; } button { padding: 12px 18px; border: none; border-radius: 8px; background: #2563eb; color: white; cursor: pointer; }`]
})
export class ConstanteSaisieComponent {
  private fb = inject(FormBuilder);
  private constanteService = inject(ConstanteService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);

  patientId = Number(this.route.snapshot.paramMap.get('patientId'));
  loading = signal(false);

  private SEUIL_TEMP = { min: 36.0, max: 38.0 };
  private SEUIL_POIDS = { min: 40.0, max: 150.0 };

  form = this.fb.group({
    temperature: [37, Validators.required],
    poids: [60, Validators.required],
    tensionArteriel: ['120/80', Validators.required],
    motifVisite: [''],
    priorite: ['NORMALE']
  });

  tempHorsSeuil = computed(() => {
    const v = this.form.get('temperature')?.value;
    return v != null && (v < this.SEUIL_TEMP.min || v > this.SEUIL_TEMP.max);
  });

  poidsHorsSeuil = computed(() => {
    const v = this.form.get('poids')?.value;
    return v != null && (v < this.SEUIL_POIDS.min || v > this.SEUIL_POIDS.max);
  });

  tensionHorsSeuil = computed(() => {
    const v = this.form.get('tensionArteriel')?.value ?? '';
    const parts = v.split('/');
    if (parts.length !== 2) return false;
    const sys = Number(parts[0]);
    const dia = Number(parts[1]);
    return isNaN(sys) || isNaN(dia) || sys < 90 || sys > 140 || dia < 60 || dia > 90;
  });

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    const payload = {
      ...this.form.value,
      patientId: this.patientId,
      infirmiereId: this.auth.currentUserId()
    } as any;

    this.constanteService.create(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/infirmier/choix-medecin', this.patientId]);
      },
      error: () => this.loading.set(false)
    });
  }
}
