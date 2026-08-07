export interface Specialite {
  id: number;
  nom: string;
}

export interface SpecialiteRequest {
  nom: string;
}

export interface Medecin {
  id: number;
  nom: string;
  prenom: string;
  specialite: Specialite | null;
}

export interface MedecinRequest {
  nom: string;
  prenom: string;
  specialiteId: number;
}
