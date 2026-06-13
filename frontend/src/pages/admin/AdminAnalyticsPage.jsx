import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useUiStore } from '../../store/uiStore';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, Layers, ShieldAlert, Award } from 'lucide-react';
import Card from '../../components/ui/Card';

const COLORS = ['#8a2be2', '#00f5d4', '#ff007f', '#ffb703', '#4ea8de', '#70e000', '#9b5de5'];

const AdminAnalyticsPage = () => {
  const { addToast } = useUiStore();
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/admin/analytics');
      setAnalytics(response.data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load demand analytics.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
        Analyzing sales history & catalog demand metrics...
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card hoverable={false} style={{ textAlign: 'center', padding: '48px' }}>
        <p style={{ color: 'var(--text-muted)' }}>No analytics data is currently available.</p>
      </Card>
    );
  }

  // Parse maps to Recharts arrays
  const occasionData = Object.entries(analytics.salesByOccasion || {}).map(([name, value]) => ({
    name,
    value: parseFloat(value || 0)
  }));

  const categoryData = Object.entries(analytics.salesByItemCategory || {}).map(([name, value]) => ({
    name,
    value: parseFloat(value || 0)
  }));

  // Custom tooltips
  const formatCurrency = (val) => `₹${parseFloat(val).toFixed(2)}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Title */}
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
          Demand & Inventory Analytics
        </h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
          Detailed intelligence reports on best-sellers, least requested curations, occasion popularity, and specific catalog categories.
        </p>
      </div>

      {/* Row 1: Top Demand & Low Demand */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="mobile-stack">
        
        {/* Top Demand */}
        <Card hoverable={false} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '50%', background: 'rgba(0, 245, 212, 0.1)', color: 'var(--color-success)' }}>
              <TrendingUp size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Top Demanded Products</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Catalog items with the highest sales counts</p>
            </div>
          </div>

          <div style={{ width: '100%', height: '280px', marginTop: '10px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.topDemand} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                <XAxis type="number" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} width={100} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                  labelStyle={{ color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 600 }}
                />
                <Bar dataKey="ordersCount" fill="var(--color-primary)" radius={[0, 4, 4, 0]}>
                  {analytics.topDemand.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Low Demand */}
        <Card hoverable={false} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '50%', background: 'rgba(255, 0, 127, 0.1)', color: 'var(--color-danger)' }}>
              <TrendingDown size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Underperforming Items</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Catalog curations requiring marketing attention</p>
            </div>
          </div>

          <div style={{ width: '100%', height: '280px', marginTop: '10px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.lowDemand} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                <XAxis type="number" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} width={100} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                  labelStyle={{ color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 600 }}
                />
                <Bar dataKey="ordersCount" fill="var(--color-secondary)" radius={[0, 4, 4, 0]}>
                  {analytics.lowDemand.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="rgba(255, 255, 255, 0.15)" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>

      {/* Row 2: Occasion Breakdown & Category Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="mobile-stack">
        
        {/* Sales by Occasion */}
        <Card hoverable={false} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '50%', background: 'rgba(138, 43, 226, 0.1)', color: 'var(--color-primary)' }}>
              <Calendar size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Revenue By Occasion</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Breakdown of gift purchases mapped to events</p>
            </div>
          </div>

          <div style={{ width: '100%', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={occasionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {occasionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Sales by Category */}
        <Card hoverable={false} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '50%', background: 'rgba(0, 245, 212, 0.1)', color: 'var(--color-accent)' }}>
              <Layers size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Revenue By Item Category</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Performance of softtoys, showpieces, wallhangings, and mugs</p>
            </div>
          </div>

          <div style={{ width: '100%', height: '280px', marginTop: '10px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ left: 10, right: 10, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>

    </div>
  );
};

export default AdminAnalyticsPage;
