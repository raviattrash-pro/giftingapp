import { create } from 'zustand';
import api from '../services/api';
import PincodeDistanceLib from 'pincode-distance';

const PincodeDistance = PincodeDistanceLib.default || PincodeDistanceLib;
const pd = new PincodeDistance();

const FALLBACK_GIFT_IMAGE = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600';

const tagsToArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return String(value)
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
};

export const getAvailabilityFromStock = (stock) => {
  const numericStock = Number(stock ?? 0);
  if (numericStock <= 0) return 'Out of Stock';
  if (numericStock <= 5) return 'Low Stock';
  return 'In Stock';
};

export const normalizeGift = (gift) => {
  if (!gift) return gift;

  const stock = Number(gift.stock ?? 20);
  const image = gift.image || gift.imageUrl || FALLBACK_GIFT_IMAGE;
  const tags = tagsToArray(gift.tags || gift.emotionTags);

  return {
    ...gift,
    image,
    imageUrl: gift.imageUrl || image,
    tags,
    emotionTags: gift.emotionTags || tags.join(','),
    stock,
    availability: gift.availability || getAvailabilityFromStock(stock),
    price: Number(gift.price ?? 0),
    luxuryTax: Number(gift.luxuryTax ?? 8),
    courierHandling: Number(gift.courierHandling ?? 50)
  };
};

const toGiftPayload = (product) => {
  const tags = tagsToArray(product.tags || product.emotionTags);

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    subcategory: product.subcategory || '',
    price: Number(product.price),
    imageUrl: product.imageUrl || product.image,
    emotionTags: tags.join(','),
    isDigital: !!product.isDigital,
    isExperience: !!product.isExperience,
    rating: product.rating,
    reviewCount: product.reviewCount,
    stock: Number(product.stock ?? 0),
    luxuryTax: Number(product.luxuryTax ?? 8),
    courierHandling: Number(product.courierHandling ?? 50)
  };
};

export const useGiftStore = create((set, get) => ({
  catalog: [],
  currentGift: null,
  cart: [],
  isLoading: false,
  error: null,
  searchTerm: '',
  selectedCategory: 'All',

  addProduct: async (product) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/admin/gifts', toGiftPayload(product));
      const newProduct = normalizeGift(response.data);
      set((state) => ({
        catalog: [newProduct, ...state.catalog],
        isLoading: false
      }));
      return newProduct;
    } catch (err) {
      set({ isLoading: false, error: err.response?.data?.message || 'Failed to add product' });
      throw err;
    }
  },

  updateProduct: async (product) => {
    set({ isLoading: true });
    try {
      const response = await api.put(`/admin/gifts/${product.id}`, toGiftPayload(product));
      const updated = normalizeGift(response.data);
      set((state) => ({
        catalog: state.catalog.map((g) => g.id === product.id ? updated : g),
        isLoading: false
      }));
      return updated;
    } catch (err) {
      set({ isLoading: false, error: err.response?.data?.message || 'Failed to update product' });
      throw err;
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true });
    try {
      await api.delete(`/admin/gifts/${id}`);
      set((state) => ({
        catalog: state.catalog.filter((g) => g.id !== id),
        isLoading: false
      }));
    } catch (err) {
      set({ isLoading: false, error: err.response?.data?.message || 'Failed to delete product' });
      throw err;
    }
  },

  fetchCatalog: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/gifts');
      set({ catalog: (response.data || []).map(normalizeGift), isLoading: false });
    } catch (err) {
      console.error('API call failed fetching catalog:', err);
      set({ catalog: [], isLoading: false, error: 'Failed to retrieve catalog.' });
    }
  },

  fetchGiftById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/gifts/${id}`);
      set({ currentGift: normalizeGift(response.data), isLoading: false });
    } catch (err) {
      console.error(`API call failed for gift ${id}:`, err);
      set({ currentGift: null, isLoading: false, error: 'Gift not found.' });
      throw err;
    }
  },

  setSearchTerm: (term) => set({ searchTerm: term }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  // Cart actions
  addToCart: (gift, quantity = 1, recipientId = null, occasionId = null) => {
    const normalizedGift = normalizeGift(gift);
    if (normalizedGift.stock <= 0) {
      return;
    }

    set((state) => {
      const existingItemIndex = state.cart.findIndex(
        (item) => item.gift.id === normalizedGift.id && item.recipientId === recipientId
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex].quantity = Math.min(
          normalizedGift.stock,
          updatedCart[existingItemIndex].quantity + quantity
        );
        return { cart: updatedCart };
      } else {
        return {
          cart: [...state.cart, {
            gift: normalizedGift,
            quantity: Math.min(quantity, normalizedGift.stock),
            recipientId,
            occasionId,
            id: `cart_item_${Math.random().toString(36).substring(2, 9)}`
          }]
        };
      }
    });
  },

  removeFromCart: (cartItemId) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== cartItemId)
    }));
  },

  updateCartItemQuantity: (cartItemId, quantity) => {
    set((state) => ({
      cart: state.cart.map((item) => 
        item.id === cartItemId
          ? { ...item, quantity: Math.min(item.gift.stock || quantity, Math.max(1, quantity)) }
          : item
      )
    }));
  },

  clearCart: () => set({ cart: [] }),

  paymentSettings: null,

  fetchPaymentSettings: async () => {
    try {
      const response = await api.get('/orders/payment-settings');
      set({ paymentSettings: response.data });
      return response.data;
    } catch (err) {
      console.error('Failed to fetch payment settings:', err);
      return null;
    }
  },

  updatePaymentSettings: async (settings) => {
    try {
      const response = await api.put('/admin/payment-settings', settings);
      set({ paymentSettings: response.data });
      return response.data;
    } catch (err) {
      console.error('Failed to update payment settings:', err);
      throw err;
    }
  },

  fetchDeliveryQuote: async (addressDetails) => {
    try {
      // 1. First call the original backend endpoint so it logs/functions if needed
      let response;
      try {
        response = await api.get('/orders/delivery-quote', {
          params: {
            address: addressDetails.address,
            city: addressDetails.city,
            pincode: addressDetails.pincode,
            scheduledTime: addressDetails.scheduledTime,
            orderValue: addressDetails.orderValue
          }
        });
      } catch(e) {
        response = { data: {} };
      }
      
      let data = response.data || {};

      // 2. Fetch the admin store address directly from local config
      let storePin = 400001; 
      try {
        const localAddr = localStorage.getItem('admin_store_address');
        if (localAddr) {
          const m = localAddr.match(/\d{5,6}/);
          if (m) storePin = parseInt(m[0], 10);
        } else {
          // If not in localStorage, fallback to the API
          const confRes = await api.get('/config/STORE_ADDRESS');
          if (confRes.data && confRes.data.value) {
            const m = confRes.data.value.match(/\d{5,6}/);
            if (m) storePin = parseInt(m[0], 10);
          }
        }
      } catch (e) {
        console.log('Using fallback store pin');
      }

      // 3. Extract user pincode
      let userPin = 400001;
      if (addressDetails.pincode) {
        const pm = String(addressDetails.pincode).match(/\d{5,6}/);
        if (pm) userPin = parseInt(pm[0], 10);
      }

      // 4. Calculate Distance accurately using real lat/lng data
      let distanceKm = 1;
      try {
        const exactDistance = pd.getDistance(storePin.toString(), userPin.toString());
        // Multiply straight-line distance by 1.5 to approximate actual driving distance
        distanceKm = exactDistance > 0 ? Math.round(exactDistance * 1.5) : 1;
      } catch (err) {
        // Fallback to absolute difference if pincode not found in DB
        distanceKm = Math.abs(storePin - userPin);
        if (distanceKm === 0) distanceKm = 1;
      }
      
      if (distanceKm > 1500) distanceKm = 1500;

      const allowInstant = distanceKm <= 3;
      
      // Calculate charges locally to bypass old backend bug
      const hour = addressDetails.scheduledTime ? parseInt(addressDetails.scheduledTime.split(':')[0]) : 12;
      const surcharge = (hour >= 8 && hour < 19) ? 75 : 0;
      
      const porterTotal = 50 + distanceKm * 9 + surcharge;
      const rapidoTotal = 40 + distanceKm * 11 + surcharge;
      
      const isBulk = addressDetails.orderValue >= 2000;
      let userSharePct = 50, adminSharePct = 50;
      if (distanceKm <= 3) {
          if (isBulk) { adminSharePct = 100; userSharePct = 0; }
      } else {
          if (!isBulk) { adminSharePct = 0; userSharePct = 100; }
      }
      
      // Calculate standard courier charges using Zone-based pricing
      let delhiveryTotal = 45, blueDartTotal = 65, dtdcTotal = 40, indiaPostTotal = 35;
      if (distanceKm > 500) {
          // National
          delhiveryTotal = 85; blueDartTotal = 145; dtdcTotal = 75; indiaPostTotal = 65;
      } else if (distanceKm > 50) {
          // Regional
          delhiveryTotal = 65; blueDartTotal = 95; dtdcTotal = 55; indiaPostTotal = 45;
      }

      // Override with fixed logic
      data.allowInstant = allowInstant;
      data.distanceKm = distanceKm;
      data.porter = {
         userCharge: Math.round(porterTotal * (userSharePct/100)),
         adminCharge: Math.round(porterTotal * (adminSharePct/100))
      };
      data.rapido = {
         userCharge: Math.round(rapidoTotal * (userSharePct/100)),
         adminCharge: Math.round(rapidoTotal * (adminSharePct/100))
      };
      data.delhivery = {
         userCharge: Math.round(delhiveryTotal * (userSharePct/100)),
         adminCharge: Math.round(delhiveryTotal * (adminSharePct/100))
      };
      data.bluedart = {
         userCharge: Math.round(blueDartTotal * (userSharePct/100)),
         adminCharge: Math.round(blueDartTotal * (adminSharePct/100))
      };
      data.dtdc = {
         userCharge: Math.round(dtdcTotal * (userSharePct/100)),
         adminCharge: Math.round(dtdcTotal * (adminSharePct/100))
      };
      data.indiapost = {
         userCharge: Math.round(indiaPostTotal * (userSharePct/100)),
         adminCharge: Math.round(indiaPostTotal * (adminSharePct/100))
      };

      return data;
    } catch (err) {
      console.error('Failed to fetch delivery quote:', err);
      throw err;
    }
  },

  checkout: async (checkoutDetails) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/orders', {
        items: get().cart,
        ...checkoutDetails
      });
      set({ cart: [], isLoading: false });
      return response.data;
    } catch (err) {
      console.error('API checkout failed:', err);
      set({ isLoading: false });
      throw err;
    }
  }
}));
