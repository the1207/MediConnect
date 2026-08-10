import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MedecinService } from '../../../services/medecin.service';
import { SpecialiteService } from '../../../services/specialite.service';
import { AdminUserService } from '../../../services/admin-user.service';
import { Specialite } from '../../../models/mediconnect.models';

@Component({
  selector: 'app-create-medecin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>Créer un médecin</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <input formControlName="nom" placeholder="Nom" />
      <input formControlName="prenom" placeholder="Prénom" />
      <select formControlName="specialiteId">
        <option value="">-- spécialité --</option>
        <option *ngFor="let s of specialites()" [value]="s.id">{{ s.nom }}</option>
      </select>
        <input formControlName="username" placeholder="Identifiant du compte utilisateur" />
      <input formControlName="password" type="password" placeholder="Mot de passe du compte utilisateur" />
      <button type="submit" [disabled]="form.invalid || loading()">
        {{ loading() ? 'Création...' : 'Créer le médecin et le compte utilisateur' }}
      </button>
      <p class="erreur" *ngIf="erreur()">{{ erreur() }}</p>
    </form>

    <h3>Médecins existants</h3>
    <ul>
      <li *ngFor="let m of medecins()">Dr. {{ m.nom }} {{ m.prenom }} — {{ m.specialite?.nom }}</li>
    </ul>

    <p class="hint">Ce formulaire crée un médecin et son compte utilisateur MEDÉCIN en même temps.</p>
  `,
  styles: [`input, select { display: block; width: 100%; margin-bottom: 12px; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; } button { padding: 12px 18px; border: none; border-radius: 8px; background: #2563eb; color: white; cursor: pointer; } .hint { margin-top: 16px; color: #475569; }`]
})
export class CreateMedecinComponent {
  private fb = inject(FormBuilder);
  private medecinService = inject(MedecinService);
  private specialiteService = inject(SpecialiteService);
  private adminUserService = inject(AdminUserService);

  loading = signal(false);
  erreur = signal('');
  specialites = signal<Specialite[]>([]);
  medecins = signal<any[]>([]);

  form = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    specialiteId: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor() {
    this.specialiteService.getAll().subscribe(list => this.specialites.set(list));
    this.charger();
  }

  charger() {
    this.medecinService.getAll().subscribe(list => this.medecins.set(list));
  }

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.erreur.set('');

    const nom = this.form.value.nom!;
    const prenom = this.form.value.prenom!;
    const specialiteId = Number(this.form.value.specialiteId);
    const username = this.form.value.username!;
    const password = this.form.value.password!;

    this.medecinService.create({ nom, prenom, specialiteId }).subscribe({
      next: (medecin) => {
        if (!medecin || medecin.id == null) {
          this.loading.set(false);
          this.erreur.set('Impossible de créer le médecin.');
          return;
        }

        this.adminUserService.createUser({
          fullName: `${nom} ${prenom}`,
          username,
          password,
          roles: 'MEDECIN',
          enable: true,
          medecinId: medecin.id
        }).subscribe({
          next: () => {
            this.loading.set(false);
            this.form.reset();
            this.charger();
          },
          error: () => {
            this.medecinService.delete(medecin.id).subscribe({
              next: () => {
                this.loading.set(false);
                this.erreur.set('Le compte utilisateur n\'a pas pu être créé. Le médecin a été supprimé.');
              },
              error: () => {
                this.loading.set(false);
                this.erreur.set('Erreur critique lors de la création. Contactez l\'administrateur.');
              }
            });
          }
        });
      },
      error: () => {
        this.loading.set(false);
        this.erreur.set('Erreur lors de la création du médecin.');
      }
    });
  }
}
