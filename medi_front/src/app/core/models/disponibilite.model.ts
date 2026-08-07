export interface Disponibilite {
  id: number;
  dateCreneau: string;
  heureDebut: string;
  heureFin: string;
  medecinId: number;
  reservation: boolean;
}

export interface DisponibiliteRequest {
  dateCreneau: string;
  heureDebut: string;
  heureFin: string;
  medecinId: number;
}
