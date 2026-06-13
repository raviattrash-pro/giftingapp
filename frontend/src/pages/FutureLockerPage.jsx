import React from 'react';
import Card from '../components/ui/Card';
import { ClipboardList } from 'lucide-react';

const FutureLockerPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '50%', 
          background: 'rgba(157, 78, 221, 0.1)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          color: 'var(--color-primary)' 
        }}>
          <ClipboardList size={40} />
        </div>
      </div>
      <h1 style={{ fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: '2rem', color: '#ffffff' }}>Future Locker Vault</h1>
      <p style={{ color: 'var(--text-secondary)' }}>
        Your secure locker is empty. Reserve luxury collection items for future occasions and schedule them for automatic concierge delivery.
      </p>
      <Card hoverable={false} style={{ padding: '32px', marginTop: '16px' }}>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          No future deliveries scheduled. Browse our Curated Collections and choose "Lock for Future" during checkout to place items in the locker.
        </p>
      </Card>
    </div>
  );
};

export default FutureLockerPage;
