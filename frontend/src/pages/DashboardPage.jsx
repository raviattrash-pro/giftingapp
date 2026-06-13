import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Calendar, TrendingUp, Users, IndianRupee, Award, ArrowRight, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useRecipientStore } from '../store/recipientStore';
import { useOccasionStore } from '../store/occasionStore';
import { useBudgetStore } from '../store/budgetStore';
import { useUiStore } from '../store/uiStore';
import { useGiftStore } from '../store/giftStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div 
        style={{
          background: 'rgba(12, 18, 32, 0.9)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--glass-border)',
          padding: '12px',
          borderRadius: 'var(--radius-md)'
        }}
      >
        <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>
          {payload[0].payload.month}
        </p>
        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-primary)' }}>
          Allocated: ₹{payload[0].value}
        </p>
        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-secondary)' }}>
          Spent: ₹{payload[1].value}
        </p>
      </div>
    );
  }
  return null;
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const recipients = useRecipientStore((state) => state.recipients);
  const occasions = useOccasionStore((state) => state.occasions);
  const { catalog, fetchCatalog } = useGiftStore();
  const { annualBudget, spent, transactions, monthlyAnalytics } = useBudgetStore();
  const { setActiveTab } = useUiStore();

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  const handleAction = (tab, path) => {
    setActiveTab(tab);
    navigate(path);
  };

  // Urgent upcoming occasions
  const upcomingOccasions = occasions
    .map(o => {
      const diffTime = new Date(o.date) - new Date();
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { ...o, daysLeft: days };
    })
    .filter(o => o.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 3);

  // Sorting recipients by relationship health score
  const topRelationships = [...recipients]
    .sort((a, b) => b.relationshipScore - a.relationshipScore)
    .slice(0, 3);

  const lowStockGifts = catalog.filter(g => g.stock !== undefined && g.stock <= 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* Admin Stock Alerts */}
      {user?.role === 'ADMIN' && lowStockGifts.length > 0 && (
        <Card hoverable={false} style={{ border: '1px solid rgba(255, 0, 127, 0.3)', background: 'rgba(255, 0, 127, 0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', borderRadius: '50%', background: 'rgba(255, 0, 127, 0.1)', color: 'var(--color-danger)' }}>
              <ShieldAlert size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-danger)' }}>Inventory Alerts (Low Stock)</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                The following premium catalog items require restocking: {lowStockGifts.map(g => `${g.name} (${g.stock} left)`).join(', ')}.
              </p>
            </div>
          </div>
        </Card>
      )}
      
      {/* Welcome & Quick KPI Banner */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 
            style={{ 
              fontFamily: 'var(--font-title)', 
              fontWeight: 800, 
              fontSize: '2.2rem',
              background: 'var(--text-gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '6px'
            }}
          >
            Welcome, {user?.name || 'Administrator'}
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
            Your premium AI Concierge is running. {occasions.length} events scheduled in your relationship vault.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button onClick={() => handleAction('gpt', '/giftgpt')} variant="primary" icon={Award}>
            Ask GiftGPT
          </Button>
          <Button onClick={() => handleAction('recipients', '/recipients')} variant="glass" icon={Users}>
            Manage Vault
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="dashboard-grid">
        <Card hoverable={true} className="glass-card-hover" style={{ gridColumn: 'span 3' }}>
          <div className="flex-between" style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Allocated Budget</span>
            <IndianRupee size={18} style={{ color: 'var(--color-primary)' }} />
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: 'var(--font-title)' }}>
            ₹{annualBudget.toLocaleString()}
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Annual allocation strategy
          </p>
        </Card>

        <Card hoverable={true} className="glass-card-accent-pink" style={{ gridColumn: 'span 3' }}>
          <div className="flex-between" style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Disbursed</span>
            <TrendingUp size={18} style={{ color: 'var(--color-secondary)' }} />
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: 'var(--font-title)', color: 'var(--color-secondary)' }}>
            ₹{spent.toLocaleString()}
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            {Math.round((spent / annualBudget) * 100)}% budget consumed
          </p>
        </Card>

        <Card hoverable={true} className="glass-card-accent-cyan" style={{ gridColumn: 'span 3' }}>
          <div className="flex-between" style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Monitored Partners</span>
            <Users size={18} style={{ color: 'var(--color-accent)' }} />
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: 'var(--font-title)', color: 'var(--color-accent)' }}>
            {recipients.length}
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Active corporate contacts
          </p>
        </Card>

        <Card hoverable={true} style={{ gridColumn: 'span 3' }}>
          <div className="flex-between" style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Upcoming Occasions</span>
            <Calendar size={18} style={{ color: 'var(--color-success)' }} />
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: 'var(--font-title)', color: 'var(--color-success)' }}>
            {occasions.length}
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Next milestone in {upcomingOccasions[0]?.daysLeft || 0} days
          </p>
        </Card>
      </div>

      {/* Main Insights (Chart & Reminders) */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '24px', flexWrap: 'wrap' }}>
        
        {/* Budget Burn Rate Chart */}
        <Card hoverable={false} style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="flex-between" style={{ marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.25rem' }}>Budget Optimization</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Burn rate analysis of annual budget allocations</p>
            </div>
            <Button onClick={() => handleAction('budget', '/budget')} size="sm" variant="glass" icon={ArrowRight}>
              Planner
            </Button>
          </div>
          
          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyAnalytics}>
                <defs>
                  <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="budget" stroke="var(--color-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorBudget)" />
                <Area type="monotone" dataKey="spent" stroke="var(--color-secondary)" strokeWidth={2} fillOpacity={1} fill="url(#colorSpent)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Urgent Concierge Alerts */}
        <Card hoverable={false}>
          <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.25rem', marginBottom: '16px' }}>Milestone Alerts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {upcomingOccasions.map((occ) => {
              const rec = recipients.find(r => r.id === occ.recipientId);
              return (
                <div 
                  key={occ.id}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--glass-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Avatar src={rec?.avatar} name={occ.recipientName} size="sm" />
                    <div>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 600 }}>{occ.recipientName}</h4>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {occ.title} ({occ.type})
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'end', gap: '6px' }}>
                    <Badge variant={occ.daysLeft <= 7 ? 'danger' : 'warning'}>
                      {occ.daysLeft === 0 ? 'Today' : `${occ.daysLeft} days left`}
                    </Badge>
                    <button
                      onClick={() => handleAction('gpt', '/giftgpt')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-primary)',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px'
                      }}
                    >
                      Find Gift <ArrowRight size={10} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

      </div>

      {/* Relationship Health & Transaction Timelines */}
      <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '24px', flexWrap: 'wrap' }}>
        
        {/* Top Relationship Health */}
        <Card hoverable={false}>
          <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.25rem', marginBottom: '16px' }}>Key Relationships</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {topRelationships.map((rec) => (
              <div 
                key={rec.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.03)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Avatar src={rec.avatar} name={rec.name} size="sm" relationshipScore={rec.relationshipScore} />
                  <div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 600 }}>{rec.name}</h4>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{rec.relationship}</p>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-success)' }}>
                    Score: {rec.relationshipScore}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent purchases log */}
        <Card hoverable={false}>
          <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.25rem', marginBottom: '16px' }}>Recent Deliveries</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
                  <th style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, paddingBottom: '10px' }}>Recipient</th>
                  <th style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, paddingBottom: '10px' }}>Curated Gift</th>
                  <th style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, paddingBottom: '10px' }}>Category</th>
                  <th style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, paddingBottom: '10px', textAlign: 'right' }}>Disbursed</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 4).map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                    <td style={{ fontSize: '0.82rem', padding: '12px 0', fontWeight: 500 }}>{tx.recipientName}</td>
                    <td style={{ fontSize: '0.82rem', padding: '12px 0', color: 'var(--text-secondary)' }}>{tx.giftName}</td>
                    <td style={{ fontSize: '0.75rem', padding: '12px 0' }}>
                      <Badge variant="info">{tx.category}</Badge>
                    </td>
                    <td style={{ fontSize: '0.82rem', padding: '12px 0', textAlign: 'right', fontWeight: 600, color: 'var(--color-secondary)' }}>
                      ₹{tx.cost}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

    </div>
  );
};

export default DashboardPage;
