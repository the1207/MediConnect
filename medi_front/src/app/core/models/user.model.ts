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
  userId: number;
  fullName: string;
  username: string;
  roles: string[];
  medecinId: number | null;
}

export interface UserRoleReponse {
  id: number;
  fullName: string;
  username: string;
  createDate: string;
  enable: boolean;
  roles: string;
  publicId: string;
}

export interface UserCreateRequest {
  fullName: string;
  username: string;
  password: string;
  roles: string;
  enable: boolean;
  medecinId?: number;
}

export interface HistoryEntry {
  id: number;
  fullName: string;
  name: string;
  dateHistory: string;
}
