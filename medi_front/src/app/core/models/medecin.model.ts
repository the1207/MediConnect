export interface Specialite {
  id: number;
  nom: string;
}
export interface Medecin {
  id: number;
  nom: string;
  prenom: string;
  specialite: Specialite | null;
}
