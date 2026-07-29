export type TypeConstante = 'TEMPERATURE' | 'POIDS' | 'TENSION_ARTERIELLE';

export interface SeuilAlerte {
  id: number;
  typeConstante: TypeConstante;
  valeurMin: number;
  valeurMax: number;
}
