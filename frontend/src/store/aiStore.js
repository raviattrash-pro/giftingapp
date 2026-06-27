import { create } from 'zustand';
import api from '../services/api';

export const useAiStore = create((set, get) => ({
  chatMessages: [
    {
      id: 'msg_welcome',
      role: 'assistant',
      content: 'Welcome to your premium Louvion Hampers concierge. I am GiftGPT, your private AI advisor. Tell me about your recipient, their preferences, or the occasion, and I will curate the perfect luxury gift.'
    }
  ],
  isLoading: false,
  suggestions: [],
  quizResults: null,
  detectiveResults: null,

  sendChatMessage: async (messageText) => {
    const userMessage = {
      id: `msg_u_${Math.random().toString(36).substring(2, 9)}`,
      role: 'user',
      content: messageText
    };

    set((state) => ({
      chatMessages: [...state.chatMessages, userMessage],
      isLoading: true
    }));

    try {
      const response = await api.post('/ai/chat', { message: messageText });
      const assistantMessage = {
        id: `msg_a_${Math.random().toString(36).substring(2, 9)}`,
        role: 'assistant',
        content: response.data.reply
      };
      set((state) => ({
        chatMessages: [...state.chatMessages, assistantMessage],
        isLoading: false
      }));
    } catch (err) {
      console.warn('API chat call failed, generating simulated intelligent assistant response.');
      
      setTimeout(() => {
        let reply = '';
        const lowerText = messageText.toLowerCase();

        if (lowerText.includes('eleanor') || lowerText.includes('anniversary')) {
          reply = `Based on Eleanor Vance's high relationship score (94%) and style preferences (Chanel, Jo Malone, Diptique), I strongly suggest the **Baccarat Masséna Crystal Champagne Flutes** ($380) or **Jo Malone Velvet Rose & Oud Cologne** ($220). Eleanor values subtle, elegant scents and personal touches, so I recommend adding a custom hand-written note on parchment paper.`;
        } else if (lowerText.includes('tech') || lowerText.includes('developer') || lowerText.includes('sophia')) {
          reply = `For a tech-centric individual like Sophia Chen, the **Keychron Q1 Max Custom Mechanical Keyboard** ($230) is an exceptional choice. It aligns with her interest in mechanical keyboards. Alternatively, you could gift her the **Aesop Resurrection Aromatique Hand Care Trio** ($130) to provide a premium desk wellness setup, matching her Sage Green aesthetic.`;
        } else if (lowerText.includes('marcus') || lowerText.includes('partner') || lowerText.includes('executive')) {
          reply = `For Marcus Sterling, who values functional executive items and productivity, I suggest the **Montblanc Meisterstück Rollerball Pen** ($490) or the **Rimowa Essential Sleeve Cabin Suitcase** ($890). Both gifts command respect, representing premium craftsmanship and elite professional utility.`;
        } else {
          reply = `I've analyzed our premium luxury catalog. Here are my top curations based on your request:
          
1. **Baccarat Masséna Crystal Champagne Flutes** ($380) - Ideal for prestigious celebrations and marking key milestones.
2. **Montblanc Meisterstück Gold-Coated Rollerball Pen** ($490) - Perfect for business executives and signing historic contracts.
3. **Bang & Olufsen Beosound Explore Speaker** ($250) - Great for high-profile adventurers who value pristine sound design.

Would you like me to add one of these to your shopping cart or customize the wrapping?`;
        }

        const assistantMessage = {
          id: `msg_a_${Math.random().toString(36).substring(2, 9)}`,
          role: 'assistant',
          content: reply
        };

        set((state) => ({
          chatMessages: [...state.chatMessages, assistantMessage],
          isLoading: false
        }));
      }, 1500);
    }
  },

  clearChat: () => set({
    chatMessages: [
      {
        id: 'msg_welcome',
        role: 'assistant',
        content: 'Welcome to your premium Louvion Hampers concierge. I am GiftGPT, your private AI advisor. Tell me about your recipient, their preferences, or the occasion, and I will curate the perfect luxury gift.'
      }
    ]
  }),

  runGiftQuiz: async (answers) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/ai/quiz', answers);
      set({ quizResults: response.data, isLoading: false });
    } catch (err) {
      console.warn('API quiz call failed, running custom client-side compatibility scoring.');
      
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Compute mock results based on answers
      const matchingScore = answers.budget >= 300 ? 98 : 88;
      const suggestions = answers.budget >= 300 
        ? [
            { gift: { id: 'gift_1', name: 'Baccarat Masséna Crystal Champagne Flutes', price: 380, image: 'https://images.unsplash.com/photo-1574926053821-79c5e338a933?auto=format&fit=crop&q=80&w=600' }, score: matchingScore },
            { gift: { id: 'gift_2', name: 'Montblanc Meisterstück Gold-Coated Rollerball Pen', price: 490, image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=600' }, score: matchingScore - 6 }
          ]
        : [
            { gift: { id: 'gift_3', name: 'Jo Malone London Velvet Rose & Oud Cologne Intense', price: 220, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600' }, score: matchingScore },
            { gift: { id: 'gift_4', name: 'Aesop Resurrection Aromatique Hand Care Trio', price: 130, image: 'https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&q=80&w=600' }, score: matchingScore - 8 }
          ];

      set({
        quizResults: {
          compatibilityScore: matchingScore,
          compatibilityLabel: 'Exquisite Match',
          reasoning: `This curation matches their desire for a ${answers.vibe || 'thoughtful'} gesture, keeping within the high standards of corporate gifting.`,
          suggestions
        },
        isLoading: false
      });
    }
  },

  runGiftDetective: async (socialUrls) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/ai/detective', { urls: socialUrls });
      set({ detectiveResults: response.data, isLoading: false });
    } catch (err) {
      console.warn('API Detective call failed, running simulated AI profile scanning.');
      
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      set({
        detectiveResults: {
          scannedProfile: {
            interests: ['Minimalist design', 'Acoustic engineering', 'Sustainable luxury', 'Travel accessories'],
            tone: 'Artistic, highly professional, refined taste',
            detectedBrands: ['Aesop', 'Rimowa', 'B&O', 'Herman Miller']
          },
          curatedInsights: [
            'Subject frequently retweets posts about vintage synthesizers and design awards.',
            'LinkedIn updates highlight extensive business travel between New York and London.',
            'Values eco-friendly packaging and artisanal brands.'
          ],
          recommendedGifts: [
            { id: 'gift_5', name: 'Rimowa Essential Sleeve Cabin Suitcase', price: 890, confidence: 95 },
            { id: 'gift_6', name: 'Bang & Olufsen Beosound Explore Speaker', price: 250, confidence: 89 },
            { id: 'gift_4', name: 'Aesop Resurrection Aromatique Hand Care Trio', price: 130, confidence: 84 }
          ]
        },
        isLoading: false
      });
    }
  }
}));
