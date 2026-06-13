import { create } from 'zustand';

const MOCK_STORIES = [
  {
    id: 'story_1',
    senderName: 'Alastair Vance',
    recipientName: 'Sophia Chen',
    giftName: 'Keychron Q1 Max Custom Keyboard',
    message: 'She loved the tactile feel and the custom red switches! Makes her development workstation shine.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600',
    likes: 8,
    comments: 2
  },
  {
    id: 'story_2',
    senderName: 'Eleanor Vance',
    recipientName: 'Marcus Sterling',
    giftName: 'Montblanc Meisterstück Rollerball Pen',
    message: 'Signed our master partnership agreement using this beauty today. Magnificent gift!',
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=600',
    likes: 12,
    comments: 1
  }
];

const MOCK_SANTA_GAMES = [
  {
    id: 'ss_1',
    name: 'Executive Leadership Secret Santa 2026',
    budgetLimit: 150,
    status: 'Matching Complete',
    myTarget: {
      name: 'Eleanor Vance',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
      interests: ['Fine dining', 'Niche perfumery'],
      allergies: ['Peanuts']
    },
    participants: ['Alastair Vance', 'Eleanor Vance', 'Marcus Sterling', 'Sophia Chen', 'David Kim']
  }
];

export const useSocialStore = create((set) => ({
  stories: MOCK_STORIES,
  santaGames: MOCK_SANTA_GAMES,

  addStory: (story) => set((state) => ({
    stories: [
      {
        id: `story_${Math.random().toString(36).substring(2, 9)}`,
        likes: 0,
        comments: 0,
        ...story
      },
      ...state.stories
    ]
  })),

  likeStory: (storyId) => set((state) => ({
    stories: state.stories.map((s) => s.id === storyId ? { ...s, likes: s.likes + 1 } : s)
  })),

  createSantaGame: (name, budgetLimit, participants) => {
    const newGame = {
      id: `ss_${Math.random().toString(36).substring(2, 9)}`,
      name,
      budgetLimit,
      status: 'Setup',
      myTarget: null,
      participants
    };
    set((state) => ({ santaGames: [...state.santaGames, newGame] }));
  },

  drawSecretSanta: (gameId) => set((state) => ({
    santaGames: state.santaGames.map((game) => {
      if (game.id === gameId) {
        // Mock matching
        return {
          ...game,
          status: 'Matching Complete',
          myTarget: {
            name: game.participants[Math.floor(Math.random() * game.participants.length)],
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
            interests: ['Technology', 'Gourmet Chocolate'],
            allergies: ['None']
          }
        };
      }
      return game;
    })
  }))
}));
