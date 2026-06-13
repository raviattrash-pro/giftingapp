import { create } from 'zustand';

const MOCK_GROUP_GIFTS = [
  {
    id: 'gg_1',
    recipientName: 'Sophia Chen',
    recipientAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256',
    title: 'Sophia Chen Promotion Gift Pool',
    occasion: 'Promotion to Engineering Lead',
    giftName: 'Rimowa Essential Sleeve Cabin Suitcase',
    giftPrice: 890,
    amountGathered: 650,
    daysLeft: 7,
    contributions: [
      { id: 'c_1', name: 'Alastair Vance', amount: 250, comment: 'Well deserved Sophia! Super excited for your leadership.' },
      { id: 'c_2', name: 'Eleanor Vance', amount: 200, comment: 'Congratulations on this milestone!' },
      { id: 'c_3', name: 'Marcus Sterling', amount: 200, comment: 'Keep coding and traveling in style!' }
    ]
  }
];

export const useGroupGiftStore = create((set, get) => ({
  groupGifts: MOCK_GROUP_GIFTS,
  isLoading: false,
  error: null,

  createGroupGift: (details) => {
    const newId = `gg_${Math.random().toString(36).substring(2, 9)}`;
    const newCampaign = {
      id: newId,
      amountGathered: 0,
      contributions: [],
      daysLeft: 14,
      ...details
    };
    set((state) => ({ groupGifts: [...state.groupGifts, newCampaign] }));
    return newCampaign;
  },

  contributeToGroupGift: (groupGiftId, contributor) => {
    set((state) => ({
      groupGifts: state.groupGifts.map((gg) => {
        if (gg.id === groupGiftId) {
          const newContrib = {
            id: `c_${Math.random().toString(36).substring(2, 9)}`,
            name: contributor.name,
            amount: Number(contributor.amount),
            comment: contributor.comment || ''
          };
          return {
            ...gg,
            amountGathered: gg.amountGathered + newContrib.amount,
            contributions: [...gg.contributions, newContrib]
          };
        }
        return gg;
      })
    }));
  }
}));
