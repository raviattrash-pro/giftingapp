import { create } from 'zustand';
import { authService, normalizeUser } from '../services/authService';
import api from '../services/api';

const getInitialUser = () => {
  try {
    const user = localStorage.getItem('gift_user');
    if (user) {
      return normalizeUser(JSON.parse(user));
    }
    return null;
  } catch {
    return null;
  }
};

export const useAuthStore = create((set, get) => ({
  user: getInitialUser(),
  token: localStorage.getItem('gift_token') || null,
  isAuthenticated: !!localStorage.getItem('gift_token'),
  isLoading: false,
  error: null,
  users: [],

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('gift_token', data.token);
      localStorage.setItem('gift_user', JSON.stringify(data.user));
      set({
        token: data.token,
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Invalid email or password',
        isLoading: false,
      });
      throw err;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.register(userData);
      localStorage.setItem('gift_token', data.token);
      localStorage.setItem('gift_user', JSON.stringify(data.user));
      set({
        token: data.token,
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Registration failed',
        isLoading: false,
      });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('gift_token');
    localStorage.removeItem('gift_user');
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      error: null,
      users: []
    });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('gift_token');
    if (!token) {
      set({ isAuthenticated: false, user: null, token: null });
      return;
    }
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        set({ user, isAuthenticated: true });
        localStorage.setItem('gift_user', JSON.stringify(user));
      } else {
        set({ isAuthenticated: false, user: null, token: null });
      }
    } catch {
      set({ isAuthenticated: false, user: null, token: null });
    }
  },

  updateProfile: async (updatedFields) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put('/users/me', updatedFields);
      const updatedUser = normalizeUser(response.data);
      set({ user: updatedUser, isLoading: false });
      localStorage.setItem('gift_user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (err) {
      set({ isLoading: false, error: err.response?.data?.message || 'Failed to update profile' });
      throw err;
    }
  },

  changePassword: async (passwords) => {
    set({ isLoading: true, error: null });
    try {
      await api.put('/users/change-password', passwords);
      set({ isLoading: false });
      return { success: true };
    } catch (err) {
      set({ isLoading: false, error: err.response?.data?.message || 'Failed to change password' });
      throw err;
    }
  },

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/admin/users');
      set({ users: (response.data || []).map(normalizeUser), isLoading: false });
    } catch (err) {
      console.error('API call failed fetching users:', err);
      set({ users: [], isLoading: false, error: 'Failed to retrieve users.' });
    }
  },

  updateUserByAdmin: async (id, updatedFields) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/admin/users/${id}`, updatedFields);
      const updated = normalizeUser(response.data);
      set((state) => ({
        users: state.users.map((u) => u.id === id ? updated : u),
        isLoading: false
      }));
      // If we are updating ourselves, sync local user state
      const currentUser = get().user;
      if (currentUser && currentUser.id === id) {
        set({ user: updated });
        localStorage.setItem('gift_user', JSON.stringify(updated));
      }
      return updated;
    } catch (err) {
      set({ isLoading: false, error: err.response?.data?.message || 'Failed to update user' });
      throw err;
    }
  },

  deleteUserByAdmin: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/admin/users/${id}`);
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
        isLoading: false
      }));
    } catch (err) {
      set({ isLoading: false, error: err.response?.data?.message || 'Failed to delete user' });
      throw err;
    }
  }
}));
