import { create } from 'zustand';
import api from '../services/api';

const MOCK_OCCASIONS = [
  {
    id: 'occ_1',
    recipientId: 3,
    recipientName: 'Sophia Chen',
    title: 'Promotion Celebration',
    date: '2026-06-12',
    type: 'Promotion',
    urgency: 'high',
    budget: 150,
    status: 'Planned'
  },
  {
    id: 'occ_2',
    recipientId: 1,
    recipientName: 'Eleanor Vance',
    title: 'Company Anniversary',
    date: '2026-06-18',
    type: 'Anniversary',
    urgency: 'high',
    budget: 400,
    status: 'Planned'
  },
  {
    id: 'occ_3',
    recipientId: 4,
    recipientName: 'Alastair Vance',
    title: 'Board Retrospective',
    date: '2026-06-25',
    type: 'Corporate Meeting',
    urgency: 'medium',
    budget: 300,
    status: 'Planned'
  },
  {
    id: 'occ_4',
    recipientId: 2,
    recipientName: 'Marcus Sterling',
    title: 'Birthday Celebration',
    date: '2026-07-05',
    type: 'Birthday',
    urgency: 'medium',
    budget: 500,
    status: 'Planned'
  },
  {
    id: 'occ_5',
    recipientId: 1,
    recipientName: 'Eleanor Vance',
    title: 'Christmas Corporate Gala',
    date: '2026-12-24',
    type: 'Holiday',
    urgency: 'low',
    budget: 500,
    status: 'Draft'
  }
];

const mapBackendToFrontend = (backendOccasion) => {
  if (!backendOccasion) return null;
  return {
    id: backendOccasion.id,
    recipientId: backendOccasion.recipientId,
    recipientName: backendOccasion.recipientName,
    title: backendOccasion.customName || backendOccasion.type || 'Event',
    date: backendOccasion.eventDate,
    type: backendOccasion.type,
    urgency: backendOccasion.daysUntil !== undefined
      ? (backendOccasion.daysUntil <= 7 ? 'high' : backendOccasion.daysUntil <= 30 ? 'medium' : 'low')
      : 'medium',
    budget: backendOccasion.autoGiftBudget || 0,
    status: backendOccasion.autoGiftEnabled ? 'Auto-Gift Enabled' : 'Planned',
    isRecurring: backendOccasion.isRecurring || false,
    recurrencePattern: backendOccasion.recurrencePattern || 'NONE',
    notes: backendOccasion.notes || '',
    autoGiftEnabled: backendOccasion.autoGiftEnabled || false,
    autoGiftBudget: backendOccasion.autoGiftBudget || 0
  };
};

const mapFrontendToBackend = (frontendOccasion) => {
  if (!frontendOccasion) return null;
  return {
    recipientId: Number(frontendOccasion.recipientId) || null,
    type: frontendOccasion.type || 'Birthday',
    customName: frontendOccasion.title || '',
    eventDate: frontendOccasion.date || null,
    isRecurring: frontendOccasion.isRecurring || false,
    recurrencePattern: frontendOccasion.recurrencePattern || 'NONE',
    notes: frontendOccasion.notes || '',
    autoGiftEnabled: frontendOccasion.autoGiftEnabled || false,
    autoGiftBudget: Number(frontendOccasion.budget) || 0
  };
};

export const useOccasionStore = create((set, get) => ({
  occasions: MOCK_OCCASIONS,
  isLoading: false,
  error: null,

  fetchOccasions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/occasions');
      const mapped = response.data.map(mapBackendToFrontend);
      set({ occasions: mapped, isLoading: false });
    } catch (err) {
      console.warn('API call failed, serving static mock occasions.');
      set({ occasions: MOCK_OCCASIONS, isLoading: false });
    }
  },

  addOccasion: async (occasionData) => {
    set({ isLoading: true });
    try {
      const payload = mapFrontendToBackend(occasionData);
      const response = await api.post('/occasions', payload);
      const mapped = mapBackendToFrontend(response.data);
      set((state) => ({
        occasions: [...state.occasions, mapped],
        isLoading: false
      }));
      return mapped;
    } catch (err) {
      console.warn('API call failed, adding occasion to local state.');
      const newOccasion = {
        id: `occ_${Math.random().toString(36).substring(2, 9)}`,
        status: 'Planned',
        ...occasionData
      };
      set((state) => ({
        occasions: [...state.occasions, newOccasion],
        isLoading: false
      }));
      return newOccasion;
    }
  },

  updateOccasion: async (id, updatedData) => {
    set({ isLoading: true });
    try {
      const payload = mapFrontendToBackend(updatedData);
      const response = await api.put(`/occasions/${id}`, payload);
      const mapped = mapBackendToFrontend(response.data);
      set((state) => ({
        occasions: state.occasions.map((o) => (o.id === id ? mapped : o)),
        isLoading: false
      }));
    } catch (err) {
      console.warn('API call failed, updating occasion locally.');
      set((state) => ({
        occasions: state.occasions.map((o) => (o.id === id ? { ...o, ...updatedData } : o)),
        isLoading: false
      }));
    }
  },

  deleteOccasion: async (id) => {
    set({ isLoading: true });
    try {
      await api.delete(`/occasions/${id}`);
      set((state) => ({
        occasions: state.occasions.filter((o) => o.id !== id),
        isLoading: false
      }));
    } catch (err) {
      console.warn('API call failed, deleting occasion locally.');
      set((state) => ({
        occasions: state.occasions.filter((o) => o.id !== id),
        isLoading: false
      }));
    }
  }
}));
