export type AppRole = 'ADMIN' | 'MEDECIN' | 'INFIRMIER';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthenticationResponse {
  id: string;
  userId: number;
  fullName: string;
  username: string;
  medecinId?: number | null;
  roles: string[];
  token: string;
}
