import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useUiStore } from '../store/uiStore';
import { useGiftStore } from '../store/giftStore';
import { Lock, Shield, ToggleLeft, ToggleRight, KeyRound, CreditCard, Upload, Presentation } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import api from '../services/api';

const SettingsPage = () => {
  const { user, updateProfile, changePassword, checkAuth } = useAuthStore();
  const { addToast } = useUiStore();
  const { fetchPaymentSettings, updatePaymentSettings, fetchCatalog } = useGiftStore();

  // Local state for passwords
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Local state for admin payment settings
  const [upiId, setUpiId] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [qrFileName, setQrFileName] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [demoModeEnabled, setDemoModeEnabled] = useState(false);
  const [demoModeLoading, setDemoModeLoading] = useState(false);

  // Retrieve current feature flags
  const flags = user?.featureFlags || user?.toggles || {
    aiAssistant: false,
    budgetPlanner: false,
    groupGifting: false,
    secretSanta: false,
    giftStories: false,
    futureLocker: false
  };

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchPaymentSettings().then((settings) => {
        if (settings) {
          setUpiId(settings.upiId || '');
          setQrCodeUrl(settings.qrCodeUrl || '');
        }
      });
    }
  }, [user, fetchPaymentSettings]);

  const handleToggleFlag = async (flagKey) => {
    const updatedFlags = {
      ...flags,
      [flagKey]: !flags[flagKey]
    };

    try {
      await updateProfile({ featureFlags: updatedFlags });
      addToast(`Feature "${getFlagLabel(flagKey)}" updated.`, 'success');
    } catch (error) {
      addToast('Failed to update feature toggles.', 'error');
    }
  };

  const getFlagLabel = (key) => {
    switch (key) {
      case 'aiAssistant': return 'AI Assistant Tools';
      case 'budgetPlanner': return 'Budget Planner';
      case 'groupGifting': return 'Group Gifting Pools';
      case 'secretSanta': return 'Secret Santa Coordinator';
      case 'giftStories': return 'Gift Stories Showcase';
      case 'futureLocker': return 'Future Locker';
      default: return key;
    }
  };

  const getFlagDesc = (key) => {
    switch (key) {
      case 'aiAssistant': return 'Enable GiftGPT Advisor, AI Gift Detective, and finder quizzes.';
      case 'budgetPlanner': return 'Manage corporate budgets, department allocations, and cost analysis.';
      case 'groupGifting': return 'Enable collective pools to fund luxury items with colleagues.';
      case 'secretSanta': return 'Organize automated, premium gift exchanges within teams.';
      case 'giftStories': return 'Share video, text, and photo feedback stories of received gifts.';
      case 'futureLocker': return 'Securely reserve and pre-order luxury collection pieces for upcoming milestones.';
      default: return '';
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!oldPassword) errors.oldPassword = 'Old password is required';
    if (!newPassword) errors.newPassword = 'New password is required';
    if (newPassword && newPassword.length < 6) errors.newPassword = 'Password must be at least 6 characters';
    if (newPassword !== confirmPassword) errors.confirmPassword = 'Passwords do not match';

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setPasswordErrors({});
    setPasswordLoading(true);

    try {
      const res = await changePassword({ oldPassword, newPassword });
      if (res?.success) {
        addToast('Your security credentials have been updated.', 'success');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        addToast('Password update failed. Please check your credentials.', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Password update failed.', 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleQrUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setQrFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrCodeUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePaymentSettings = async (e) => {
    e.preventDefault();
    setPaymentLoading(true);
    try {
      await updatePaymentSettings({ upiId, qrCodeUrl });
      addToast('Payment gateway configuration saved successfully.', 'success');
    } catch (err) {
      addToast('Failed to save payment settings.', 'error');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleToggleDemoMode = async () => {
    const nextValue = !demoModeEnabled;
    setDemoModeLoading(true);
    try {
      const response = await api.post('/admin/demo-mode', { enabled: nextValue });
      setDemoModeEnabled(nextValue);
      addToast(response.data?.message || 'Investor demo mode updated.', 'success');
      if (nextValue) {
        await Promise.all([checkAuth(), fetchCatalog()]);
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update investor demo mode.', 'error');
    } finally {
      setDemoModeLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      
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
          Portal Settings & Customization
        </h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
          Configure premium feature toggles, security keys, and personalized system modules.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        
        {/* Feature Toggles Panel */}
        <Card hoverable={false} style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
            <Shield size={20} color="var(--color-primary)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Feature Toggles</h3>
          </div>
          
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Toggle custom application capabilities. Disabled features will be hidden dynamically from your navigation sidebar.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {Object.keys(flags).map((flagKey) => {
              const active = flags[flagKey];
              return (
                <div 
                  key={flagKey} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.01)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '80%' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {getFlagLabel(flagKey)}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {getFlagDesc(flagKey)}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleToggleFlag(flagKey)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: active ? 'var(--color-secondary)' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'color 0.2s'
                    }}
                  >
                    {active ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                  </button>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Change Password / Security Panel */}
        <Card hoverable={false} style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
            <KeyRound size={20} color="var(--color-secondary)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Security Settings</h3>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Keep your access credentials safe. Update your portal password regularly.
          </p>

          <form onSubmit={handleChangePasswordSubmit}>
            <Input
              label="Current Portal Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={oldPassword}
              onChange={(e) => { setOldPassword(e.target.value); setPasswordErrors({ ...passwordErrors, oldPassword: '' }); }}
              error={passwordErrors.oldPassword}
            />

            <Input
              label="New Secure Password"
              type="password"
              icon={Lock}
              placeholder="Min 6 characters"
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); setPasswordErrors({ ...passwordErrors, newPassword: '' }); }}
              error={passwordErrors.newPassword}
            />

            <Input
              label="Confirm New Password"
              type="password"
              icon={Lock}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setPasswordErrors({ ...passwordErrors, confirmPassword: '' }); }}
              error={passwordErrors.confirmPassword}
            />

            <Button
              type="submit"
              loading={passwordLoading}
              variant="primary"
              style={{ width: '100%', marginTop: '12px' }}
            >
              Update Passwords & Keys
            </Button>
          </form>
        </Card>

        {/* Admin Payment Settings Section */}
        {user?.role === 'ADMIN' && (
          <Card hoverable={false} style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
              <Presentation size={20} color="var(--color-success)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Investor Demo Mode</h3>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Prepare the portal with all modules active, premium user defaults, and stocked demo catalog data.
            </p>

            <button
              type="button"
              onClick={handleToggleDemoMode}
              disabled={demoModeLoading}
              style={{
                width: '100%',
                border: '1px solid',
                borderColor: demoModeEnabled ? 'rgba(0, 245, 212, 0.3)' : 'var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                background: demoModeEnabled ? 'rgba(0, 245, 212, 0.08)' : 'var(--bg-tertiary)',
                color: demoModeEnabled ? 'var(--color-success)' : 'var(--text-primary)',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: demoModeLoading ? 'not-allowed' : 'pointer',
                fontWeight: 700
              }}
            >
              <span>{demoModeLoading ? 'Updating Demo Mode...' : demoModeEnabled ? 'Demo Mode Enabled' : 'Enable Investor Demo'}</span>
              {demoModeEnabled ? <ToggleRight size={34} /> : <ToggleLeft size={34} />}
            </button>
          </Card>
        )}


      </div>

    </div>
  );
};

export default SettingsPage;
