import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';
export const USE_MOCKS = false; // Cambiar a false para usar el backend real

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Inyectar automáticamente gestante_id si el usuario es de staff y hay un paciente seleccionado
    const role = localStorage.getItem('role');
    const selectedGestante = localStorage.getItem('selected_gestante_gmi');
    if ((role === 'clinico' || role === 'admin') && selectedGestante) {
      config.params = {
        ...config.params,
        gestante_id: selectedGestante,
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores 401 y refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y no hemos intentado reintentar
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Llamada directa usando axios sin interceptores para evitar loops
        const response = await axios.post(
          `${API_BASE_URL}/api/v1/auth/refresh-token`,
          {
            refresh_token: refreshToken,
          }
        );

        const {
          access_token,
          refresh_token: new_refresh_token,
          role,
        } = response.data;

        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', new_refresh_token);
        localStorage.setItem('role', role);

        // Reintentar la petición original con el nuevo token
        originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Si el refresh token falla, limpiamos y redirigimos
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('role');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
