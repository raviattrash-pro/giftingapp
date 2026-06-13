import React from 'react';
import { Mail, Phone, MapPin, Truck, HelpCircle, ShieldCheck } from 'lucide-react';
import Card from '../components/ui/Card';

const CustomerServicePage = () => {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2.4rem', color: 'var(--brand-rose-gold)', margin: '0 0 16px 0' }}>Customer Service</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>We're here to help make your gifting experience perfect.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ background: 'var(--brand-rose-gold)', color: 'white', padding: '12px', borderRadius: '50%' }}>
              <Phone size={24} />
            </div>
            <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Contact Us</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            <strong>Phone:</strong> +91 98765 43210<br />
            <strong>Email:</strong> support@louvionhampers.com<br />
            <strong>Hours:</strong> Mon-Sun, 9:00 AM - 9:00 PM
          </p>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ background: 'var(--brand-rose-gold)', color: 'white', padding: '12px', borderRadius: '50%' }}>
              <Truck size={24} />
            </div>
            <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Delivery Terms</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            We partner with <strong>Porter</strong> and <strong>Rapido</strong> for seamless delivery.<br />
            - Standard Delivery: 2-3 Hours<br />
            - Free Delivery: Before 8 AM & After 7 PM IST<br />
            - Peak Surcharge: ₹75 applies during day hours.
          </p>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ background: 'var(--brand-rose-gold)', color: 'white', padding: '12px', borderRadius: '50%' }}>
              <HelpCircle size={24} />
            </div>
            <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>FAQs</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            <div>
              <strong>Q: How do I track my order?</strong>
              <div>A: Visit the "Order History" page and find real-time status updates via Porter/Rapido tracking IDs.</div>
            </div>
            <div>
              <strong>Q: Can I change the delivery address?</strong>
              <div>A: Address can only be modified before the "PAID" status. Please contact support immediately.</div>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ background: 'var(--brand-rose-gold)', color: 'white', padding: '12px', borderRadius: '50%' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Refund Policy</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Perishable items (flowers, cakes) cannot be refunded once dispatched. For non-perishable hampers, we offer a 24-hour return window if items are damaged during transit.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default CustomerServicePage;
