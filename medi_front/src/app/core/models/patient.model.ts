export interface Patient {
  id: number;
  nom: string;
  prenom: string;
  dateNaissance: Date;
  sexe: string;
  contact: string;
  allergies?: string;
  antecedents?: string;
  groupeSanguin?: string;
}

export interface PatientRequest {
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: string;
  contact: string;
  allergies?: string;
  antecedents?: string;
  groupeSanguin?: string;
}
