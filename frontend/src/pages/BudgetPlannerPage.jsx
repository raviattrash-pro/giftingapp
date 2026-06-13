import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { IndianRupee, BarChart3, TrendingUp, Info, HelpCircle, Save } from 'lucide-react';
import { useBudgetStore } from '../store/budgetStore';
import { useUiStore } from '../store/uiStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div 
        style={{
          background: 'rgba(12, 18, 32, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--glass-border)',
          padding: '12px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-glass)'
        }}
      >
        <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>
          {payload[0].payload.month || payload[0].payload.name}
        </p>
        {payload.map((entry, idx) => (
          <p key={idx} style={{ margin: 0, fontSize: '0.75rem', color: entry.color }}>
            {entry.name}: ₹{entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const BudgetPlannerPage = () => {
  const { annualBudget, spent, transactions, monthlyAnalytics, categoryAnalytics, setAnnualBudget } = useBudgetStore();
  const { addToast } = useUiStore();

  const [inputBudget, setInputBudget] = useState(annualBudget);

  const handleSaveBudget = (e) => {
    e.preventDefault();
    setAnnualBudget(Number(inputBudget));
    addToast('Allocated annual budget updated successfully.', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Title */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 
            style={{ 
              fontFamily: 'var(--font-title)', 
              fontWeight: 800, 
              fontSize: '2rem',
              background: 'var(--text-gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '6px'
            }}
          >
            Budget & Analytics
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
            Plan corporate gifting spending, review category breakdowns, and audit transactions.
          </p>
        </div>
      </div>

      {/* Allocated adjustments row */}
      <div style={{ display: 'grid', gridTemplateColumns: '8fr 4fr', gap: '24px' }}>
        
        {/* KPI Panel */}
        <Card hoverable={false} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Allocated Gifting Funds
            </span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-title)', color: 'var(--color-primary)' }}>
              ₹{annualBudget.toLocaleString()}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Strategic company limit
            </p>
          </div>

          <div>
            <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Remaining Funds
            </span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-title)', color: 'var(--color-accent)' }}>
              ₹{(annualBudget - spent).toLocaleString()}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {Math.round(((annualBudget - spent) / annualBudget) * 100)}% available
            </p>
          </div>
        </Card>

        {/* Change allocation form */}
        <Card hoverable={false}>
          <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-title)', marginBottom: '14px' }}>Update Allocation</h3>
          <form onSubmit={handleSaveBudget} style={{ display: 'flex', gap: '10px', alignItems: 'end' }}>
            <div style={{ flex: 1 }}>
              <Input
                type="number"
                value={inputBudget}
                onChange={(e) => setInputBudget(e.target.value)}
                style={{ marginBottom: 0 }}
              />
            </div>
            <Button type="submit" variant="primary" icon={Save}>
              Save
            </Button>
          </form>
        </Card>

      </div>

      {/* Recharts graphs */}
      <div style={{ display: 'grid', gridTemplateColumns: '7.2fr 4.8fr', gap: '24px' }}>
        
        {/* Monthly burn rate chart */}
        <Card hoverable={false}>
          <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-title)', marginBottom: '20px' }}>Monthly Allocations</h3>
          
          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyAnalytics}>
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="budget" name="Allocated Budget" fill="rgba(157, 78, 221, 0.45)" stroke="var(--color-primary)" strokeWidth={1} radius={[4, 4, 0, 0]} />
                <Bar dataKey="spent" name="Spent Amount" fill="rgba(247, 37, 133, 0.45)" stroke="var(--color-secondary)" strokeWidth={1} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category distribution Pie chart */}
        <Card hoverable={false}>
          <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-title)', marginBottom: '20px' }}>Curation Categories</h3>
          
          <div style={{ width: '100%', height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryAnalytics}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryAnalytics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} style={{ filter: `drop-shadow(0 0 4px ${entry.fill}55)` }} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>

      {/* Transaction Log list */}
      <Card hoverable={false}>
        <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-title)', marginBottom: '20px' }}>Transaction Ledger</h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
                <th style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, paddingBottom: '12px' }}>Date</th>
                <th style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, paddingBottom: '12px' }}>Recipient</th>
                <th style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, paddingBottom: '12px' }}>Curated Gift</th>
                <th style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, paddingBottom: '12px' }}>Category</th>
                <th style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, paddingBottom: '12px' }}>Connection Type</th>
                <th style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, paddingBottom: '12px', textAlign: 'right' }}>Spent</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                  <td style={{ fontSize: '0.82rem', padding: '14px 0', color: 'var(--text-secondary)' }}>{tx.date}</td>
                  <td style={{ fontSize: '0.82rem', padding: '14px 0', fontWeight: 500 }}>{tx.recipientName}</td>
                  <td style={{ fontSize: '0.82rem', padding: '14px 0', color: 'var(--text-secondary)' }}>{tx.giftName}</td>
                  <td style={{ fontSize: '0.75rem', padding: '14px 0' }}>
                    <Badge variant="info">{tx.category}</Badge>
                  </td>
                  <td style={{ fontSize: '0.78rem', padding: '14px 0', color: 'var(--text-muted)' }}>{tx.relationship}</td>
                  <td style={{ fontSize: '0.85rem', padding: '14px 0', textAlign: 'right', fontWeight: 600, color: 'var(--color-secondary)' }}>
                    ₹{tx.cost}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
};

export default BudgetPlannerPage;
