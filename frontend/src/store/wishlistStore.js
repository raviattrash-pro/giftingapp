import { create } from 'zustand';

const MOCK_WISHLISTS = [
  {
    id: 'wl_1',
    title: 'Executive Client Lounges',
    description: 'Curated premium items for our corporate suite environments.',
    isPublic: true,
    shareableLink: 'https://giftconcierge.app/wishlists/wl_1',
    items: [
      { id: 'gift_1', name: 'Baccarat Masséna Crystal Champagne Flutes (Set of 2)', price: 380, image: 'https://images.unsplash.com/photo-1574926053821-79c5e338a933?auto=format&fit=crop&q=80&w=600' },
      { id: 'gift_7', name: 'Dom Pérignon Vintage 2013 Millésimé Champagne', price: 320, image: 'https://images.unsplash.com/photo-1594487523522-f18c6730894b?auto=format&fit=crop&q=80&w=600' }
    ]
  },
  {
    id: 'wl_2',
    title: 'Developer Rewards & Milestones',
    description: 'High-quality technical accessories and wellness items.',
    isPublic: false,
    shareableLink: 'https://giftconcierge.app/wishlists/wl_2',
    items: [
      { id: 'gift_8', name: 'Keychron Q1 Max Custom Mechanical Keyboard', price: 230, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600' },
      { id: 'gift_4', name: 'Aesop Resurrection Aromatique Hand Care Trio', price: 130, image: 'https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&q=80&w=600' }
    ]
  }
];

export const useWishlistStore = create((set, get) => ({
  wishlists: MOCK_WISHLISTS,
  isLoading: false,
  error: null,

  createWishlist: (title, description = '', isPublic = false) => {
    const newId = `wl_${Math.random().toString(36).substring(2, 9)}`;
    const newWishlist = {
      id: newId,
      title,
      description,
      isPublic,
      shareableLink: `https://giftconcierge.app/wishlists/${newId}`,
      items: []
    };
    set((state) => ({ wishlists: [...state.wishlists, newWishlist] }));
    return newWishlist;
  },

  addToWishlist: (wishlistId, gift) => {
    set((state) => ({
      wishlists: state.wishlists.map((wl) => {
        if (wl.id === wishlistId) {
          const exists = wl.items.some(item => item.id === gift.id);
          if (exists) return wl;
          return { ...wl, items: [...wl.items, gift] };
        }
        return wl;
      })
    }));
  },

  removeFromWishlist: (wishlistId, giftId) => {
    set((state) => ({
      wishlists: state.wishlists.map((wl) => {
        if (wl.id === wishlistId) {
          return { ...wl, items: wl.items.filter(item => item.id !== giftId) };
        }
        return wl;
      })
    }));
  },

  toggleWishlistVisibility: (wishlistId) => {
    set((state) => ({
      wishlists: state.wishlists.map((wl) => {
        if (wl.id === wishlistId) {
          return { ...wl, isPublic: !wl.isPublic };
        }
        return wl;
      })
    }));
  }
}));
