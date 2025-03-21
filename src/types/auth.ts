export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  bio?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  avatar?: File;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  password: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  bio?: string;
  avatar?: File;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  refreshToken?: string;
  user?: User;
  message?: string;
}
