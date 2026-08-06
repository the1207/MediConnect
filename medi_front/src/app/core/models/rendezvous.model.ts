export interface RendezVousRequest {
  date: string;
  heure: string;
  statut?: string;
  motif: string;
  patientId: number;
  medecinId: number;
  disponibiliteId: number;
}

export interface RendezVous {
  date: string;
  heure: string;
  statut: string;
  motif: string;
  disponibiliteId: number;
  patientId: number;
  medecinId: number;
}
