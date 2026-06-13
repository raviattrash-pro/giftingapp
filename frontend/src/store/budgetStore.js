import { create } from 'zustand';

const MOCK_TRANSACTIONS = [
  { id: 't_1', recipientName: 'Eleanor Vance', giftName: 'Baccarat Crystal Champagne Flutes', cost: 350, date: '2025-06-18', category: 'Home & Living', relationship: 'Executive Client' },
  { id: 't_2', recipientName: 'Marcus Sterling', giftName: 'Montblanc Meisterstück Rollerball', cost: 480, date: '2025-07-05', category: 'Stationery', relationship: 'Strategic Partner' },
  { id: 't_3', recipientName: 'Sophia Chen', giftName: 'Aesop Aromatique Hand Care Trio', cost: 120, date: '2025-09-10', category: 'Self Care', relationship: 'Lead Developer' },
  { id: 't_4', recipientName: 'Eleanor Vance', giftName: 'Jo Malone Velvet Rose Cologne', cost: 180, date: '2025-12-20', category: 'Fragrance', relationship: 'Executive Client' }
];

const MOCK_MONTHLY_ANALYTICS = [
  { month: 'Jan', budget: 500, spent: 0 },
  { month: 'Feb', budget: 500, spent: 150 },
  { month: 'Mar', budget: 500, spent: 250 },
  { month: 'Apr', budget: 800, spent: 400 },
  { month: 'May', budget: 800, spent: 0 },
  { month: 'Jun', budget: 1200, spent: 350 },
  { month: 'Jul', budget: 1000, spent: 480 },
  { month: 'Aug', budget: 500, spent: 0 },
  { month: 'Sep', budget: 500, spent: 120 },
  { month: 'Oct', budget: 500, spent: 0 },
  { month: 'Nov', budget: 800, spent: 0 },
  { month: 'Dec', budget: 1500, spent: 180 }
];

const MOCK_CATEGORY_ANALYTICS = [
  { name: 'Home & Living', value: 350, fill: '#9d4edd' },
  { name: 'Stationery', value: 480, fill: '#f72585' },
  { name: 'Fragrance', value: 180, fill: '#4cc9f0' },
  { name: 'Self Care', value: 120, fill: '#00f5d4' }
];

export const useBudgetStore = create((set, get) => ({
  annualBudget: 8000,
  spent: 1130,
  transactions: MOCK_TRANSACTIONS,
  monthlyAnalytics: MOCK_MONTHLY_ANALYTICS,
  categoryAnalytics: MOCK_CATEGORY_ANALYTICS,

  setAnnualBudget: (amount) => set({ annualBudget: amount }),
  
  addTransaction: (transaction) => {
    set((state) => {
      const newTx = {
        id: `t_${Math.random().toString(36).substring(2, 9)}`,
        date: new Date().toISOString().split('T')[0],
        ...transaction
      };
      
      const newTransactions = [...state.transactions, newTx];
      const newSpent = state.spent + transaction.cost;

      // Update category analytics
      const updatedCategoryAnalytics = [...state.categoryAnalytics];
      const categoryIndex = updatedCategoryAnalytics.findIndex(c => c.name === transaction.category);
      if (categoryIndex > -1) {
        updatedCategoryAnalytics[categoryIndex].value += transaction.cost;
      } else {
        const colors = ['#9d4edd', '#f72585', '#4cc9f0', '#00f5d4', '#fee440'];
        const randomColor = colors[updatedCategoryAnalytics.length % colors.length];
        updatedCategoryAnalytics.push({
          name: transaction.category,
          value: transaction.cost,
          fill: randomColor
        });
      }

      // Update current month analytics
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = monthNames[new Date().getMonth()];
      const updatedMonthlyAnalytics = state.monthlyAnalytics.map(item => {
        if (item.month === currentMonth) {
          return { ...item, spent: item.spent + transaction.cost };
        }
        return item;
      });

      return {
        transactions: newTransactions,
        spent: newSpent,
        categoryAnalytics: updatedCategoryAnalytics,
        monthlyAnalytics: updatedMonthlyAnalytics
      };
    });
  }
}));
