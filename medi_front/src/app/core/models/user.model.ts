export interface User {
  id: number;
  publicId: string;
  nom: string;
  username: string;
  enable: boolean;
  roles: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  id: string;
  fullName: string;
  username: string;
  roles: string[];
}
