export interface Specialite {
  id: number;
  nom: string;
}

export interface Medecin {
  id?: number;
  nom: string;
  prenom: string;
  specialite?: Specialite;
}

export interface Disponibilite {
  id: number;
  dateCreneau: string;
  heureDebut: string;
  heureFin: string;
  medecinId: number;
  reservation: boolean;
}

export interface Patient {
  id?: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: string;
  contact: string;
  allergies?: string;
  antecedents?: string;
  groupeSanguin?: string;
}

export interface Constante {
  id?: number;
  temperature: number;
  poids: number;
  tensionArteriel: string;
  alerte?: boolean;
  alerteTemperature?: boolean;
  alertePoids?: boolean;
  alerteTension?: boolean;
  date?: string;
  patientId: number;
  patientNom?: string;
  patientPrenom?: string;
  medecinId?: number | null;
  infirmiereId?: number | null;
  infirmiereNom?: string;
  motifVisite?: string;
  priorite?: 'NORMALE' | 'HAUTE' | 'URGENTE';
}

export type Statut = 'En_ATTENTE' | 'REFUSEE' | 'EN_COURS' | 'TERMINEE' | 'ANNULEE';

export interface RendezVous {
  id?: number;
  date: string;
  heure: string;
  statut?: Statut;
  motif: string;
  patientId: number;
  medecinId: number;
  disponibiliteId: number;
}

export interface Consultation {
  id?: number;
  dateDebut?: string;
  motif: string;
  actionsRequis?: string;
  medecinId: number;
  patientId: number;
  ordonnanceId?: number | null;
}

export interface Medicament {
  id?: number;
  nom: string;
  posologie: string;
  dureeTraitement: number;
  ordonnanceId?: number;
}

export interface Ordonnance {
  id?: number;
  dateCreation?: string;
  commentaire?: string;
  statut?: 'REDIGEE' | 'VALIDEE' | 'IMPRIMEE';
  patientId: number;
  medecinId: number;
  medicaments: { nom: string; posologie: string; dureeTraitement: number }[];
}

export interface UserRoleReponse {
  id: number;
  fullName: string;
  username: string;
  createDate: string;
  enable: boolean;
  roles: string;
  publicId: string;
}

export interface UserDTO {
  fullName: string;
  username: string;
  password?: string;
  roles: string;
  enable: boolean;
  publicId?: string;
  medecinId?: number | null;
}

export interface HistoryReponse {
  id: number;
  fullName: string;
  name: string;
  dateHistory: string;
}
