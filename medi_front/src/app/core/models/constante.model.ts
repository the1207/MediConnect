export interface Constante {
  id: number;
  temperature: number;
  poids: number;
  tensionArteriel: string;
  alerte: boolean;
  alerteTemperature: boolean;
  alertePoids: boolean;
  alerteTension: boolean;
  date: string;
  patientId: number;
  patientNom: string;
  patientPrenom: string;
  medecinId: number;
  infirmiereId: number;
  infirmiereNom: string;
  motifVisite?: string;
  priorite?: 'NORMALE' | 'HAUTE' | 'URGENTE';
}

export interface ConstanteRequest {
  temperature: number;
  poids: number;
  tensionArteriel: string;
  patientId: number;
  medecinId?: number;
  infirmiereId: number;
  motifVisite?: string;
  priorite?: 'NORMALE' | 'HAUTE' | 'URGENTE';
}
