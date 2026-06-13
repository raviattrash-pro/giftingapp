import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useUiStore } from '../../store/uiStore';
import api from '../../services/api';

const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const { addToast } = useUiStore();

  const [formData, setFormData] = useState({
    code: '',
    discountAmount: '',
    isEnabled: true
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/coupons');
      setCoupons(data);
    } catch (err) {
      addToast('Failed to fetch coupons', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        code: formData.code,
        discountAmount: parseFloat(formData.discountAmount),
        isEnabled: formData.isEnabled
      };
      if (editingCoupon) {
        await api.put(`/coupons/${editingCoupon.id}`, payload);
        addToast('Coupon updated successfully', 'success');
      } else {
        await api.post('/coupons', payload);
        addToast('Coupon added successfully', 'success');
      }
      setEditingCoupon(null);
      setFormData({ code: '', discountAmount: '', isEnabled: true });
      fetchCoupons();
    } catch (err) {
      addToast('Failed to save coupon', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await api.delete(`/coupons/${id}`);
      addToast('Coupon deleted', 'success');
      fetchCoupons();
    } catch (err) {
      addToast('Failed to delete coupon', 'error');
    }
  };

  const handleEdit = (c) => {
    setEditingCoupon(c);
    setFormData({ code: c.code, discountAmount: c.discountAmount, isEnabled: c.isEnabled });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-title)', color: 'var(--brand-rose-gold)', margin: '0 0 8px' }}>
          Manage Coupons
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Create and manage discount codes.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        <Card>
          <h3 style={{ marginBottom: '16px' }}>{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</h3>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.88rem' }}>Coupon Code</label>
              <input 
                type="text" 
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                required
                className="glass-input"
                placeholder="e.g. WELCOME10"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.88rem' }}>Discount Amount (₹)</label>
              <input 
                type="number" 
                value={formData.discountAmount}
                onChange={(e) => setFormData({...formData, discountAmount: e.target.value})}
                required
                min="1"
                className="glass-input"
                placeholder="10-30"
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="checkbox" 
                checked={formData.isEnabled}
                onChange={(e) => setFormData({...formData, isEnabled: e.target.checked})}
              />
              <label style={{ fontSize: '0.88rem' }}>Enabled</label>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button type="submit" variant="primary" style={{ flex: 1 }}>{editingCoupon ? 'Update' : 'Create'}</Button>
              {editingCoupon && (
                <Button type="button" variant="ghost" onClick={() => { setEditingCoupon(null); setFormData({code:'',discountAmount:'',isEnabled:true}); }}>Cancel</Button>
              )}
            </div>
          </form>
        </Card>

        <Card>
          <h3 style={{ marginBottom: '16px' }}>Current Coupons</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {coupons.map(c => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--brand-rose-gold)' }}>{c.code}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Discount: ₹{c.discountAmount}</span>
                    <span style={{ marginLeft: '12px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px', color: c.isEnabled ? 'var(--color-success)' : 'var(--color-danger)' }}>
                      {c.isEnabled ? <CheckCircle size={12}/> : <XCircle size={12}/>}
                      {c.isEnabled ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEdit(c)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)' }}><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger)' }}><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
              {coupons.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No coupons created yet.</p>}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminCouponsPage;
