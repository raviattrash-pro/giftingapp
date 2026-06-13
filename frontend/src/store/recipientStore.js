import { create } from 'zustand';
import api from '../services/api';

const MOCK_RECIPIENTS = [
  {
    id: 1,
    name: 'Eleanor Vance',
    relationship: 'Executive Client',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
    relationshipScore: 94,
    preferences: {
      brands: ['Chanel', 'Jo Malone', 'Diptique'],
      colors: ['Lavender', 'Champagne Gold', 'Emerald'],
      clothingSize: 'S',
      allergies: ['Peanuts', 'Gluten-sensitive'],
      interests: ['Fine dining', 'Niche perfumery', 'Jazz vinyls'],
      notes: 'Prefers subtle, elegant scents. Prefers hand-written notes over digital templates.'
    },
    upcomingOccasion: {
      title: 'Company Anniversary',
      date: '2026-06-18',
      daysLeft: 13
    },
    giftHistory: [
      { id: 'g_h1', name: 'Jo Malone Velvet Rose Cologne', date: '2025-12-20', status: 'Delivered', cost: 180 },
      { id: 'g_h2', name: 'Baccarat Crystal Champagne Flutes', date: '2025-06-18', status: 'Delivered', cost: 350 }
    ]
  },
  {
    id: 2,
    name: 'Marcus Sterling',
    relationship: 'Strategic Partner',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    relationshipScore: 82,
    preferences: {
      brands: ['Montblanc', 'Sony', 'Rimowa'],
      colors: ['Midnight Blue', 'Charcoal', 'Platinum'],
      clothingSize: 'XL',
      allergies: ['None'],
      interests: ['Executive productivity', 'Single-malt whiskey', 'Aviation history'],
      notes: 'Likes functional high-end tech items. Enjoys travel accessories.'
    },
    upcomingOccasion: {
      title: 'Birthday Celebration',
      date: '2026-07-05',
      daysLeft: 30
    },
    giftHistory: [
      { id: 'g_h3', name: 'Montblanc Meisterstück Rollerball', date: '2025-07-05', status: 'Delivered', cost: 480 }
    ]
  },
  {
    id: 3,
    name: 'Sophia Chen',
    relationship: 'Lead Developer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256',
    relationshipScore: 78,
    preferences: {
      brands: ['Keychron', 'Patagonia', 'Aesop'],
      colors: ['Sage Green', 'Warm Terracotta', 'Sand'],
      clothingSize: 'M',
      allergies: ['Dairy'],
      interests: ['Mechanical keyboards', 'Specialty coffee', 'Bouldering'],
      notes: 'Prefers minimalist design and practical utility. Big fan of high-quality coffee beans.'
    },
    upcomingOccasion: {
      title: 'Promotion Celebration',
      date: '2026-06-12',
      daysLeft: 7
    },
    giftHistory: [
      { id: 'g_h4', name: 'Aesop Aromatique Hand Care Trio', date: '2025-09-10', status: 'Delivered', cost: 120 }
    ]
  },
  {
    id: 4,
    name: 'Alastair Vance',
    relationship: 'Founder / Board Member',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
    relationshipScore: 88,
    preferences: {
      brands: ['Hermes', 'Apple', 'B&O'],
      colors: ['Hermes Orange', 'Slate Grey', 'Matte Black'],
      clothingSize: 'L',
      allergies: ['Seafood'],
      interests: ['Golfing', 'Acoustic design', 'Modern art'],
      notes: 'Appreciates limited editions or high-end sound tech.'
    },
    upcomingOccasion: {
      title: 'Board Retrospective',
      date: '2026-06-25',
      daysLeft: 20
    },
    giftHistory: []
  }
];

export const useRecipientStore = create((set, get) => ({
  recipients: MOCK_RECIPIENTS,
  currentRecipient: null,
  isLoading: false,
  error: null,

  fetchRecipients: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/recipients');
      set({ recipients: response.data, isLoading: false });
    } catch (err) {
      console.warn('API call failed, serving static mock recipients.');
      set({ recipients: MOCK_RECIPIENTS, isLoading: false });
    }
  },

  fetchRecipientById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/recipients/${id}`);
      set({ currentRecipient: response.data, isLoading: false });
    } catch (err) {
      console.warn(`API call failed for recipient ${id}, searching mock cache.`);
      const found = get().recipients.find((r) => r.id === id) || MOCK_RECIPIENTS[0];
      set({ currentRecipient: found, isLoading: false });
    }
  },

  createRecipient: async (recipientData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/recipients', recipientData);
      set((state) => ({
        recipients: [...state.recipients, response.data],
        isLoading: false,
      }));
      return response.data;
    } catch (err) {
      console.warn('API call failed, adding recipient to local state.');
      const newRecipient = {
        id: Math.floor(Math.random() * 1000000),
        relationshipScore: 80,
        giftHistory: [],
        upcomingOccasion: recipientData.upcomingOccasion || { title: 'General Celebration', date: '2026-12-25', daysLeft: 200 },
        ...recipientData,
      };
      set((state) => ({
        recipients: [...state.recipients, newRecipient],
        isLoading: false,
      }));
      return newRecipient;
    }
  },

  updateRecipient: async (id, recipientData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/recipients/${id}`, recipientData);
      set((state) => ({
        recipients: state.recipients.map((r) => (r.id === id ? response.data : r)),
        isLoading: false,
      }));
      return response.data;
    } catch (err) {
      console.warn('API call failed, updating recipient in local state.');
      set((state) => {
        const updated = state.recipients.map((r) => {
          if (r.id === id) {
            return { ...r, ...recipientData };
          }
          return r;
        });
        const current = id === state.currentRecipient?.id 
          ? { ...state.currentRecipient, ...recipientData }
          : state.currentRecipient;
        return { recipients: updated, currentRecipient: current, isLoading: false };
      });
    }
  },

  deleteRecipient: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/recipients/${id}`);
      set((state) => ({
        recipients: state.recipients.filter((r) => r.id !== id),
        isLoading: false,
      }));
    } catch (err) {
      console.warn('API call failed, deleting recipient from local state.');
      set((state) => ({
        recipients: state.recipients.filter((r) => r.id !== id),
        isLoading: false,
      }));
    }
  },
}));
