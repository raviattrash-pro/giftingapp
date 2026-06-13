import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useUiStore } from '../../store/uiStore';
import api from '../../services/api';

const AdminFlowersPage = () => {
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFlower, setEditingFlower] = useState(null);
  const { addToast } = useUiStore();

  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    isEnabled: true
  });

  const fetchFlowers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/flowers');
      setFlowers(data);
    } catch (err) {
      addToast('Failed to fetch flowers', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlowers();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingFlower) {
        await api.put(`/flowers/${editingFlower.id}`, formData);
        addToast('Flower updated successfully', 'success');
      } else {
        await api.post('/flowers', formData);
        addToast('Flower added successfully', 'success');
      }
      setEditingFlower(null);
      setFormData({ name: '', imageUrl: '', isEnabled: true });
      fetchFlowers();
    } catch (err) {
      addToast('Failed to save flower', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this flower?')) return;
    try {
      await api.delete(`/flowers/${id}`);
      addToast('Flower deleted', 'success');
      fetchFlowers();
    } catch (err) {
      addToast('Failed to delete flower', 'error');
    }
  };

  const handleEdit = (f) => {
    setEditingFlower(f);
    setFormData({ name: f.name, imageUrl: f.imageUrl, isEnabled: f.isEnabled });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-title)', color: 'var(--brand-rose-gold)', margin: '0 0 8px' }}>
          Manage Fav Flowers
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Configure the "Pick Their Fav Flowers" section shown on the home page.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        <Card>
          <h3 style={{ marginBottom: '16px' }}>{editingFlower ? 'Edit Flower' : 'Add New Flower'}</h3>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.88rem' }}>Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="glass-input"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.88rem' }}>Image URL</label>
              <input 
                type="text" 
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                required
                className="glass-input"
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="checkbox" 
                checked={formData.isEnabled}
                onChange={(e) => setFormData({...formData, isEnabled: e.target.checked})}
              />
              <label style={{ fontSize: '0.88rem' }}>Visible to users</label>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button type="submit" variant="primary" style={{ flex: 1 }}>{editingFlower ? 'Update' : 'Add'}</Button>
              {editingFlower && (
                <Button type="button" variant="ghost" onClick={() => { setEditingFlower(null); setFormData({name:'',imageUrl:'',isEnabled:true}); }}>Cancel</Button>
              )}
            </div>
          </form>
        </Card>

        <Card>
          <h3 style={{ marginBottom: '16px' }}>Current Flowers</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {flowers.map(f => (
                <div key={f.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={f.imageUrl} alt={f.name} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{f.name}</h4>
                      <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', color: f.isEnabled ? 'var(--color-success)' : 'var(--color-danger)' }}>
                        {f.isEnabled ? <CheckCircle size={12}/> : <XCircle size={12}/>}
                        {f.isEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEdit(f)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)' }}><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(f.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger)' }}><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
              {flowers.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No flowers configured.</p>}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminFlowersPage;
