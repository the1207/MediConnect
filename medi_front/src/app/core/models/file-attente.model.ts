export interface FileAttente {
  id: number;
  patientId: number;
  patientNom: string;
  patientPrenom: string;
  motifVisite: string;
  priorite: 'NORMALE' | 'HAUTE' | 'URGENTE';
  statut: 'EN_ATTENTE' | 'EN_CONSULTATION' | 'TERMINEE';
  heureArrivee: string;
  alertes: boolean;
  temperature?: number;
  poids?: number;
  tensionArteriel?: string;
  infirmiereNom?: string;
}

export interface FileAttenteRequest {
  patientId: number;
  motifVisite: string;
  priorite: 'NORMALE' | 'HAUTE' | 'URGENTE';
  constanteId?: number;
}
