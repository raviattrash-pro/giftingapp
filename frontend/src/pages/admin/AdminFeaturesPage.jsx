import React, { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useUiStore } from '../../store/uiStore';
import { Save, Power } from 'lucide-react';

const AdminFeaturesPage = () => {
  const { globalFeatures, updateGlobalFeatures, fetchGlobalFeatures } = useUiStore();
  const [localFeatures, setLocalFeatures] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchGlobalFeatures();
  }, [fetchGlobalFeatures]);

  useEffect(() => {
    setLocalFeatures(globalFeatures || {});
  }, [globalFeatures]);

  const toggleFeature = (key) => {
    setLocalFeatures((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    await updateGlobalFeatures(localFeatures);
    setSaving(false);
  };

  const featuresList = [
    { key: 'aiAssistant', label: 'AI Gift Advisor / Quiz', desc: 'Enable the AI Gift Advisor and Quiz workflows.' },
    { key: 'budgetPlanner', label: 'Budget Planner', desc: 'Enable the corporate budget planning tool.' },
    { key: 'groupGifting', label: 'Group Gifting / Wishlists', desc: 'Enable shared group gifting and wishlists.' },
    { key: 'secretSanta', label: 'Secret Santa', desc: 'Enable the Secret Santa automation module.' },
    { key: 'giftStories', label: 'Gift Stories', desc: 'Enable the social gift stories feed.' },
    { key: 'recipientVault', label: 'Recipient Vault', desc: 'Enable saving recipients to a vault.' },
    { key: 'futureLocker', label: 'Future Locker', desc: 'Enable locking gifts for future unlock dates.' },
    { key: 'freeDeliveryBanner', label: 'Free Delivery Banner', desc: 'Show the promotional FREE DELIVERY banner.' },
    { key: 'promotionalBanners', label: 'Promotional Banners', desc: 'Show hero carousels and large category banners on the home page.' },
    { key: 'razorpayPayment', label: 'Razorpay Gateway', desc: 'Enable automated Razorpay checkouts.' },
    { key: 'manualQrPayment', label: 'Manual QR Payments', desc: 'Enable the manual scan-and-pay UPI flow.' },
    { key: 'advancedDelivery', label: 'Advanced Delivery Options', desc: 'Show Porter/Rapido auto-booking and delivery scheduling UI at checkout.' },
    { key: 'deliveryLogistics', label: 'Delivery & Logistics Settings', desc: 'Enable delivery logistics configuration, courier partner selection, and shipping management.' },
    { key: 'deliveryTiers', label: 'Distance-Based Delivery Tiers (₹)', desc: 'Enable distance-based delivery pricing tiers for automatic delivery charge calculation.' },
    { key: 'navigationEvents', label: 'Navigation Events Management', desc: 'Enable navigation category tabs and event-based browsing on the catalog page.' },
    { key: 'wrappingStyles', label: 'Wrapping Style Management', desc: 'Enable gift wrapping options with customizable styles and pricing at checkout.' },
    { key: 'uiDesignMode', label: 'UI Design Mode', desc: 'Enforce UI design choices globally, preventing users from changing theme.' }
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>Global Features</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Toggle complex features ON or OFF to simplify the UI for all users.</p>
        </div>
        <Button onClick={handleSave} loading={saving} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Save size={18} />
          Save Changes
        </Button>
      </div>

      <Card style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {featuresList.map((feat) => {
            const isOn = localFeatures[feat.key] === true;
            return (
              <div key={feat.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--glass-border)' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>{feat.label}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>{feat.desc}</p>
                </div>
                <button
                  onClick={() => toggleFeature(feat.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '8px 16px', borderRadius: '30px', border: 'none',
                    fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                    background: isOn ? 'rgba(0, 200, 100, 0.1)' : 'rgba(200, 0, 0, 0.1)',
                    color: isOn ? '#00c864' : '#e53e3e'
                  }}
                >
                  <Power size={14} />
                  {isOn ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default AdminFeaturesPage;
