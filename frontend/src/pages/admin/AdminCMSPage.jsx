import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Save } from 'lucide-react';
import api from '../../services/api';
import { useUiStore } from '../../store/uiStore';

const AdminCMSPage = () => {
  const [content, setContent] = useState({
    contact_us: '',
    delivery_terms: '',
    faqs: '',
    refund_policy: ''
  });
  
  const { 
    addToast, 
    checkoutConfig, 
    fetchCheckoutConfig, 
    updateCheckoutConfig 
  } = useUiStore();

  const [localConfig, setLocalConfig] = useState(checkoutConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchContent(), fetchCheckoutConfig()]);
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (checkoutConfig) {
      setLocalConfig(checkoutConfig);
    }
  }, [checkoutConfig]);

  const fetchContent = async () => {
    try {
      const res = await api.get('/content');
      setContent({
        contact_us: res.data.contact_us || '',
        delivery_terms: res.data.delivery_terms || '',
        faqs: res.data.faqs || '',
        refund_policy: res.data.refund_policy || ''
      });
    } catch (err) {
      addToast('Failed to load content', 'error');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/admin/content', content);
      addToast('Content updated successfully', 'success');
    } catch (err) {
      addToast('Failed to save content', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setSavingConfig(true);
    await updateCheckoutConfig(localConfig);
    setSavingConfig(false);
  };

  const handleTierChange = (index, field, value) => {
    const newTiers = [...localConfig.deliveryTiers];
    newTiers[index][field] = Number(value);
    setLocalConfig({ ...localConfig, deliveryTiers: newTiers });
  };

  const handleChange = (key, value) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '2rem', margin: 0 }}>Content Management</h1>
      </div>

      <Card>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Contact Us</label>
            <textarea 
              value={content.contact_us}
              onChange={(e) => handleChange('contact_us', e.target.value)}
              style={{ width: '100%', minHeight: '100px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              placeholder="Enter Contact Us information..."
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Delivery Terms</label>
            <textarea 
              value={content.delivery_terms}
              onChange={(e) => handleChange('delivery_terms', e.target.value)}
              style={{ width: '100%', minHeight: '100px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              placeholder="Enter Delivery Terms..."
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>FAQs</label>
            <textarea 
              value={content.faqs}
              onChange={(e) => handleChange('faqs', e.target.value)}
              style={{ width: '100%', minHeight: '150px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              placeholder="Enter FAQs..."
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Refund Policy</label>
            <textarea 
              value={content.refund_policy}
              onChange={(e) => handleChange('refund_policy', e.target.value)}
              style={{ width: '100%', minHeight: '100px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              placeholder="Enter Refund Policy..."
            />
          </div>

          <Button type="submit" variant="primary" loading={saving} icon={Save}>
            Save Content
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AdminCMSPage;
