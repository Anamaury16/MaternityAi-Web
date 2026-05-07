import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export interface LoginCredentials {
  codigo_gmi: string;
  respuesta_seguridad: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  role: string;
}

export interface AuthError {
  message: string;
  status: number;
}

export const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/api/v1/auth/login`,
      credentials
    );

    const data = response.data;

    // Guardar tokens en localStorage
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    localStorage.setItem('role', data.role);

    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Credenciales incorrectas. Por favor, verifica tus datos.';
      const status = err.response?.status ?? 500;
      throw { message, status } as AuthError;
    }
    throw { message: 'Error de conexión con el servidor.', status: 0 } as AuthError;
  }
};

export const logoutUser = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('role');
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem('access_token');
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('access_token');
};
