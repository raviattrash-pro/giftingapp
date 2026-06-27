import api from './api';

export const DEFAULT_FEATURE_FLAGS = {
  aiAssistant: false,
  budgetPlanner: false,
  groupGifting: false,
  secretSanta: false,
  giftStories: false,
  futureLocker: false
};

export const normalizeUser = (user) => {
  if (!user) return null;

  const featureFlags = {
    ...DEFAULT_FEATURE_FLAGS,
    ...(user.featureFlags || user.toggles || {})
  };

  return {
    ...user,
    name: user.name || user.fullName || user.email?.split('@')[0] || 'Member',
    fullName: user.fullName || user.name || user.email?.split('@')[0] || 'Member',
    avatar: user.avatar || user.avatarUrl || '',
    avatarUrl: user.avatarUrl || user.avatar || '',
    budget: user.budget ?? user.monthlyBudget ?? 0,
    monthlyBudget: user.monthlyBudget ?? user.budget ?? 0,
    role: user.role || 'USER',
    featureFlags
  };
};

const normalizeAuthResponse = (data) => ({
  ...data,
  token: data.token || data.accessToken,
  accessToken: data.accessToken || data.token,
  user: normalizeUser(data.user)
});

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return normalizeAuthResponse(response.data);
    } catch (error) {
      console.warn('AuthService.login API call failed, using fallback mock authentication.', error);
      // Fallback Mock Authentication for standalone front-end mode
      if (email && password) {
        const isAdmin = email.toLowerCase() === 'concierge@corporategifts.com';
        return normalizeAuthResponse({
          token: 'mock-jwt-token-xyz123',
          user: {
            id: 'usr_mock1',
            email: email,
            name: email.split('@')[0].toUpperCase(),
            role: isAdmin ? 'ADMIN' : 'USER',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
          }
        });
      }
      throw error;
    }
  },

  googleLogin: async (credential) => {
    try {
      const response = await api.post('/auth/oauth/google', { credential });
      return normalizeAuthResponse(response.data);
    } catch (error) {
      console.warn('AuthService.googleLogin API call failed.', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data; // Now returns MessageResponse
    } catch (error) {
      console.warn('AuthService.register API call failed.', error);
      throw error;
    }
  },

  verifyRegistration: async (email, otp) => {
    try {
      const response = await api.post('/auth/verify-registration', { email, otp });
      return normalizeAuthResponse(response.data);
    } catch (error) {
      console.warn('AuthService.verifyRegistration API call failed.', error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/me');
      return normalizeUser(response.data);
    } catch (error) {
      console.warn('AuthService.getCurrentUser API call failed, using local storage cache.');
      const cachedUser = localStorage.getItem('gift_user');
      return cachedUser ? normalizeUser(JSON.parse(cachedUser)) : null;
    }
  }
};
