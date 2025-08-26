import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  locale?: string;
  roles?: string[]; // ✅ always an array of strings
  landing_page?: string;
  last_logged_in_at?: string;
  companies?: any[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, company_name: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: true,

      login: async (email: string, password: string) => {
        try {
          const response = await axios.post('/api/auth/login', { email, password });
          const { token, user } = response.data;

          // ✅ ensure roles is always an array
          const normalizedUser = {
            ...user,
            roles: Array.isArray(user.roles) ? user.roles : [user.roles || '']
          };

          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          set({
            user: normalizedUser,
            token,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error: any) {
          throw new Error(error.response?.data?.message || 'Login failed');
        }
      },

      register: async (name: string, email: string, password: string, company_name: string) => {
        try {
          const response = await axios.post('/api/auth/register', {
            name,
            email,
            password,
            company_name,
          });
          const { token, user } = response.data;

          const normalizedUser = {
            ...user,
            roles: Array.isArray(user.roles) ? user.roles : [user.roles || '']
          };

          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          set({
            user: normalizedUser,
            token,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error: any) {
          throw new Error(error.response?.data?.message || 'Registration failed');
        }
      },

      logout: () => {
        delete axios.defaults.headers.common['Authorization'];
        axios.post('/api/auth/logout').catch(() => {});
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
        });
      },

      checkAuth: async () => {
        try {
          const { token } = get();

          if (!token) {
            set({ loading: false });
            return;
          }

          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.get('/api/auth/me');
          const { user } = response.data;

          const normalizedUser = {
            ...user,
            roles: Array.isArray(user.roles) ? user.roles : [user.roles || '']
          };

          set({
            user: normalizedUser,
            isAuthenticated: true,
            loading: false,
          });
        } catch {
          delete axios.defaults.headers.common['Authorization'];
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
          });
        }
      },

      updateProfile: async (data: Partial<User>) => {
        try {
          const response = await axios.put('/api/auth/profile', data);
          const { user } = response.data;

          const normalizedUser = {
            ...user,
            roles: Array.isArray(user.roles) ? user.roles : [user.roles || '']
          };

          set({ user: normalizedUser });
        } catch (error: any) {
          throw new Error(error.response?.data?.message || 'Profile update failed');
        }
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        try {
          await axios.put('/api/auth/password', {
            current_password: currentPassword,
            new_password: newPassword,
          });
        } catch (error: any) {
          throw new Error(error.response?.data?.message || 'Password change failed');
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ✅ initialize auth check on app start
const initializeAuth = async () => {
  try {
    await Promise.race([
      useAuthStore.getState().checkAuth(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Auth check timeout')), 3000)
      ),
    ]);
  } catch (error) {
    console.warn('Auth initialization failed or timed out:', error);
    useAuthStore.setState({ loading: false });
  }
};

initializeAuth();
