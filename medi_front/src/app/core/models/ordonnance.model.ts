export interface Medicament {
  id?: number;
  nom: string;
  posologie: string;
  dureeTraitement: number;
  ordonnanceId?: number;
}

export interface Ordonnance {
  id: number;
  dateCreation: string;
  commentaire: string;
  statut: 'REDIGEE' | 'VALIDEE' | 'IMPRIMEE';
  patientId: number;
  patientNom: string;
  patientPrenom: string;
  medecinId: number;
  medecinNom: string;
  medicaments: Medicament[];
}

export interface OrdonnanceRequest {
  patientId: number;
  medecinId: number;
  commentaire: string;
  statut?: 'REDIGEE' | 'VALIDEE' | 'IMPRIMEE';
  medicaments: Medicament[];
}
