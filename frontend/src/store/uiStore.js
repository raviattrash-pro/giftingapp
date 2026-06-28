import { create } from 'zustand';
import api from '../services/api';

const getInitialTheme = () => {
  const override = localStorage.getItem('theme_override');
  if (override) return override;
  const hour = new Date().getHours();
  // 6 AM (6) to 6 PM (18) is light theme, else dark theme
  return (hour >= 6 && hour < 18) ? 'light' : 'dark';
};

const getInitialDesignStyle = () => {
  return localStorage.getItem('design_style') || 'normal';
};

const defaultNavCategories = [
  { label: "Father's Day", category: 'Home & Living', visible: false },
  { label: 'Birthday', category: 'Traditional Gifts', visible: true },
  { label: 'Occasions', category: 'All', visible: true },
  { label: 'Anniversary', category: 'Fragrance', visible: true },
  { label: 'Flowers', category: 'Fragrance', visible: true },
  { label: 'Cakes', category: 'Self Care', visible: true },
  { label: 'Personalised', category: 'Stationery', visible: true },
  { label: 'Plants', category: 'Home & Living', visible: true },
  { label: 'Balloon n Services', category: 'Traditional Gifts', visible: true },
  { label: 'Chocolates', category: 'Self Care', visible: true },
  { label: 'LUXE', category: 'Fine Wine & Spirits', visible: true },
  { label: 'Hampers', category: 'Self Care', visible: true }
];

const getStoredNavCategories = () => {
  try {
    const stored = localStorage.getItem('nav_categories');
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return defaultNavCategories;
};

export const useUiStore = create((set, get) => ({
  sidebarExpanded: true,
  activeTab: 'dashboard',
  theme: getInitialTheme(),
  designStyle: getInitialDesignStyle(),
  deferredPrompt: null,
  isInstallable: false,
  toasts: [],
  navCategories: getStoredNavCategories(),

  toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
  setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  setTheme: (theme) => {
    console.log('[useUiStore] setTheme called with:', theme);
    localStorage.setItem('theme_override', theme);
    set({ theme });
  },

  setDesignStyle: (style) => {
    localStorage.setItem('design_style', style);
    set({ designStyle: style });
  },

  setDeferredPrompt: (prompt) => set({ deferredPrompt: prompt }),
  setIsInstallable: (installable) => set({ isInstallable: installable }),

  addToast: (message, type = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, type, duration };
    set((state) => ({ toasts: [...state.toasts, newToast] }));
    
    setTimeout(() => {
      get().removeToast(id);
    }, duration);
    
    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  fetchNavCategories: async () => {
    try {
      const response = await api.get('/config/NAV_CATEGORIES');
      if (response.data && response.data.value) {
        const parsed = JSON.parse(response.data.value);
        set({ navCategories: parsed });
        localStorage.setItem('nav_categories', response.data.value);
      }
    } catch (err) {
      console.log('Failed to fetch nav categories, using defaults', err);
    }
  },

  toggleNavCategory: async (label) => {
    const state = get();
    const updated = state.navCategories.map(c => 
      c.label === label ? { ...c, visible: !c.visible } : c
    );
    
    // Optimistic update
    set({ navCategories: updated });
    localStorage.setItem('nav_categories', JSON.stringify(updated));

    try {
      await api.put('/admin/app-config/NAV_CATEGORIES', { value: JSON.stringify(updated) });
    } catch (err) {
      console.error('Failed to save nav categories to server', err);
      // Optional: rollback on failure
    }
  },

  updateNavCategories: async (newCategories) => {
    set({ navCategories: newCategories });
    localStorage.setItem('nav_categories', JSON.stringify(newCategories));

    try {
      await api.put('/admin/app-config/NAV_CATEGORIES', { value: JSON.stringify(newCategories) });
      get().addToast('Navigation settings saved successfully.', 'success');
      return true;
    } catch (err) {
      console.error('Failed to save nav categories to server', err);
      get().addToast('Failed to save navigation settings.', 'error');
      return false;
    }
  },

  checkoutConfig: {
    wrappingCharge: 37,
    deliveryTiers: [
      { min: 0, max: 1, price: 0 },
      { min: 1, max: 3, price: 49 },
      { min: 3, max: 6, price: 79 },
      { min: 6, max: 15, price: 99 },
    ],
    overagePrice: 150 // Price for distance > 15km
  },

  fetchCheckoutConfig: async () => {
    try {
      // NOTE: Using /api/config instead of /admin/app-config so normal users can fetch it
      const response = await api.get('/config/CHECKOUT_FEES');
      if (response.data && response.data.value) {
        set({ checkoutConfig: JSON.parse(response.data.value) });
      }
    } catch (err) {
      console.log('Failed to fetch checkout config, using defaults', err);
    }
  },

  updateCheckoutConfig: async (newConfig) => {
    set({ checkoutConfig: newConfig });
    try {
      // Save it using the generic endpoint
      await api.post('/config/CHECKOUT_FEES', { value: JSON.stringify(newConfig) });
      get().addToast('Checkout config saved successfully.', 'success');
      return true;
    } catch (err) {
      console.error('Failed to save checkout config to server', err);
      get().addToast('Failed to save checkout config.', 'error');
      return false;
    }
  },
}));
