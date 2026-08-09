import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SpecialiteService } from '../../../services/specialite.service';
import { MedecinService } from '../../../services/medecin.service';
import { DisponibiliteService } from '../../../services/disponibilite.service';
import { Specialite, Disponibilite } from '../../../models/mediconnect.models';

@Component({
  selector: 'app-choix-medecin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Choisir un médecin disponible</h2>

    <label>Spécialité</label>
    <select (change)="onSpecialiteChange($event)">
      <option value="">-- choisir --</option>
      <option *ngFor="let s of specialites()" [value]="s.id">{{ s.nom }}</option>
    </select>

    <div *ngIf="medecins().length">
      <label>Médecin</label>
      <select (change)="onMedecinChange($event)">
        <option value="">-- choisir --</option>
        <option *ngFor="let m of medecins()" [value]="m.id">Dr. {{ m.nom }} {{ m.prenom }}</option>
      </select>
    </div>

    <p *ngIf="medecinChoisi() && !creneauxLibres().length">Aucun créneau libre pour ce médecin actuellement.</p>

    <div *ngIf="creneauxLibres().length">
      <h3>Créneaux libres</h3>
      <ul>
        <li *ngFor="let c of creneauxLibres()">
          {{ c.dateCreneau }} — {{ c.heureDebut }} à {{ c.heureFin }}
          <button (click)="reserver(c)">Réserver ce créneau</button>
        </li>
      </ul>
    </div>

    <p class="erreur" *ngIf="erreur()">{{ erreur() }}</p>
    <p class="succes" *ngIf="succes()">Rendez-vous créé avec succès.</p>
  `,
  styles: [`.erreur { color: red; } .succes { color: green; } select, button { display: block; margin: 12px 0; } button { padding: 8px 12px; border: none; border-radius: 8px; background: #2563eb; color: white; cursor: pointer; }`]
})
export class ChoixMedecinComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private specialiteService = inject(SpecialiteService);
  private medecinService = inject(MedecinService);
  private disponibiliteService = inject(DisponibiliteService);

  patientId = Number(this.route.snapshot.paramMap.get('patientId'));

  specialites = signal<Specialite[]>([]);
  medecins = signal<any[]>([]);
  creneauxLibres = signal<Disponibilite[]>([]);
  medecinChoisi = signal<number | null>(null);
  erreur = signal('');
  succes = signal(false);

  constructor() {
    this.specialiteService.getAll().subscribe(list => this.specialites.set(list));
  }

  onSpecialiteChange(event: Event) {
    const id = Number((event.target as HTMLSelectElement).value);
    this.medecins.set([]);
    this.creneauxLibres.set([]);
    this.medecinChoisi.set(null);
    if (!id) return;
    this.medecinService.getBySpecialite(id).subscribe(list => this.medecins.set(list));
  }

  onMedecinChange(event: Event) {
    const id = Number((event.target as HTMLSelectElement).value);
    this.medecinChoisi.set(id || null);
    this.creneauxLibres.set([]);
    if (!id) return;
    this.disponibiliteService.getByMedecin(id).subscribe(list =>
      this.creneauxLibres.set(list.filter(c => !c.reservation))
    );
  }

  reserver(creneau: Disponibilite) {
    const medecinId = this.medecinChoisi();
    if (!medecinId) return;

    this.medecinService.ajouterRendezVous({
      date: creneau.dateCreneau,
      heure: creneau.heureDebut,
      motif: 'Consultation',
      patientId: this.patientId,
      medecinId,
      disponibiliteId: creneau.id
    }).subscribe({
      next: () => {
        this.succes.set(true);
        setTimeout(() => this.router.navigate(['/infirmier/patient-create']), 1500);
      },
      error: () => this.erreur.set('Ce créneau vient peut-être d\'être réservé, réessayez.')
    });
  }
}
