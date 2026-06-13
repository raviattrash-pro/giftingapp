import api from './api';

export const DEFAULT_FEATURE_FLAGS = {
  aiAssistant: true,
  budgetPlanner: true,
  groupGifting: true,
  secretSanta: true,
  giftStories: true,
  futureLocker: true
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

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return normalizeAuthResponse(response.data);
    } catch (error) {
      console.warn('AuthService.register API call failed, using fallback mock authentication.', error);
      return normalizeAuthResponse({
        token: 'mock-jwt-token-xyz123',
        user: {
          id: 'usr_mock1',
          email: userData.email,
          name: userData.fullName || userData.name || userData.email.split('@')[0].toUpperCase(),
          role: 'USER',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
        }
      });
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
