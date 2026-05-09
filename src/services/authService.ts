import api from './api';
import axios from 'axios';

export interface LoginCredentials {
  codigo_gmi: string;
  respuesta_seguridad: string;
}

export interface StaffLoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  role: string;
}

export interface SecurityQuestionResponse {
  codigo_gmi: string;
  pregunta: string;
}

export interface AuthError {
  message: string;
  status: number;
}

const handleAuthError = (err: unknown): never => {
  if (axios.isAxiosError(err)) {
    const message =
      err.response?.data?.detail ||
      err.response?.data?.message ||
      'Error en la autenticación.';
    const status = err.response?.status ?? 500;
    throw { message, status } as AuthError;
  }
  throw { message: 'Error de conexión con el servidor.', status: 0 } as AuthError;
};

const saveTokens = (data: LoginResponse) => {
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  localStorage.setItem('role', data.role);
};

export const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/api/v1/auth/login', credentials);
    saveTokens(response.data);
    return response.data;
  } catch (err) {
    return handleAuthError(err);
  }
};

export const loginStaff = async (
  credentials: StaffLoginCredentials
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/api/v1/auth/login/staff', credentials);
    saveTokens(response.data);
    return response.data;
  } catch (err) {
    return handleAuthError(err);
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    // Intentamos cerrar sesión en el backend si hay token
    if (isAuthenticated()) {
      await api.post('/api/v1/auth/logout');
    }
  } catch (err) {
    console.error('Error logging out from server:', err);
  } finally {
    // Siempre limpiamos el storage local
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('role');
  }
};

export const getSecurityQuestion = async (
  codigoGmi: string
): Promise<SecurityQuestionResponse> => {
  try {
    const response = await api.get<SecurityQuestionResponse>(`/api/v1/auth/security-question/${codigoGmi}`);
    return response.data;
  } catch (err) {
    return handleAuthError(err);
  }
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem('access_token');
};

export const getRole = (): string | null => {
  return localStorage.getItem('role');
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('access_token');
};
