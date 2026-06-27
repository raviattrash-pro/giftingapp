import React from 'react';
import Card from '../components/ui/Card';

const TermsConditionsPage = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <Card hoverable={false}>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-title)', marginBottom: '24px', color: 'var(--color-primary)' }}>
          Terms & Conditions
        </h1>
        
        <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p>Last Updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '8px' }}>1. Agreement to Terms</h2>
            <p>By accessing or using our services, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to these terms, please do not use our services.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '8px' }}>2. Use of Services</h2>
            <p>You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to use our services:</p>
            <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
              <li>In any way that violates any applicable national or international law or regulation.</li>
              <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way.</li>
              <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail," "chain letter," "spam," or any other similar solicitation.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '8px' }}>3. User Accounts</h2>
            <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '8px' }}>4. Limitation of Liability</h2>
            <p>In no event shall Corporate Gifting, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
          </section>
        </div>
      </Card>
    </div>
  );
};

export default TermsConditionsPage;
