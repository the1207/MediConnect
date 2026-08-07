export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthenticationResponse {
  token: string;
  id: string;        // UUID publicId
  userId: number;     // Long id numérique
  fullName: string;
  username: string;
  roles: string[];    // ex: ["ROLE_MEDECIN"]
  medecinId: number | null;
}

export type AppRole = 'ADMIN' | 'MEDECIN' | 'INFIRMIER';
