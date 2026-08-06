export interface Consultation {
  dateDebut: string;
  motif: string;
  actionsRequis: string;
  patientId: number;
  ordonnanceId?: number;
  medecinId: number;
}

export interface ConsultationRequest {
  motif: string;
  actionsRequis: string;
  medecinId: number;
  patientId: number;
  ordonnanceId?: number;
}
