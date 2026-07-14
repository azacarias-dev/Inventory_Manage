import { create } from 'zustand';
import { loginRequest, registerRequest } from '../../../shared/api/auth';
import { axiosAdmin } from '../../../shared/api/api';

// Inicializar cabecera de Authorization si ya hay un token guardado en localStorage
const initialToken = localStorage.getItem('authToken');
if (initialToken) {
  axiosAdmin.defaults.headers.common['Authorization'] = `Bearer ${initialToken}`;
}

export const useAuthStore = create((set) => ({
  token: initialToken,
  isLoggedIn: !!initialToken,
  user: null,
  loading: false,
  error: null,

  login: async (emailOrUsername, password) => {
    set({ loading: true, error: null });
    try {
      const data = await loginRequest(emailOrUsername, password);
      const { success, token, message, userDetails } = data;

      if (success && token) {
        localStorage.setItem('authToken', token);
        axiosAdmin.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        set({
          token,
          isLoggedIn: true,
          user: userDetails || null,
          loading: false,
          error: null,
        });
        return { success: true };
      } else {
        set({ loading: false, error: message || 'Error al iniciar sesión' });
        return { success: false, message: message || 'Error al iniciar sesión' };
      }
    } catch (err) {
      console.error('Error en login store:', err);
      const errMsg = err.response?.data?.message || 'No se pudo conectar al servidor de autenticación.';
      set({ loading: false, error: errMsg });
      return { success: false, message: errMsg };
    }
  },

  register: async (userName, email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await registerRequest(userName, email, password);
      set({ loading: false, error: null });
      return { success: true, message: data.message };
    } catch (err) {
      console.error('Error en register store:', err);
      const errMsg = err.response?.data?.message || 'Error al crear la cuenta. Verifica tus datos.';
      set({ loading: false, error: errMsg });
      return { success: false, message: errMsg };
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    delete axiosAdmin.defaults.headers.common['Authorization'];
    set({
      token: null,
      isLoggedIn: false,
      user: null,
      loading: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));
