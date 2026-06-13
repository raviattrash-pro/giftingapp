import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader, ShieldAlert, Sparkles, Check, Link2, Info } from 'lucide-react';
import { useAiStore } from '../store/aiStore';
import { useGiftStore } from '../store/giftStore';
import { useUiStore } from '../store/uiStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

const GiftDetectivePage = () => {
  const navigate = useNavigate();
  const { runGiftDetective, detectiveResults, isLoading } = useAiStore();
  const { catalog, addToCart } = useGiftStore();
  const { addToast } = useUiStore();

  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');

  const handleScan = async (e) => {
    e.preventDefault();
    if (!linkedinUrl && !twitterUrl) {
      addToast('Please enter at least one public profile link.', 'warning');
      return;
    }
    await runGiftDetective([linkedinUrl, twitterUrl]);
    addToast('Social analysis complete.', 'success');
  };

  const handleQuickAdd = (giftId) => {
    const gift = catalog.find(g => g.id === giftId);
    if (gift) {
      addToCart(gift, 1);
      addToast(`Added ${gift.name} to cart.`, 'success');
    }
  };

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
          AI Gift Detective
        </h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
          Scan public corporate profiles to diagnose precise client preferences.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '24px' }}>
        
        {/* Profile url inputs */}
        <Card hoverable={false}>
          <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-title)', marginBottom: '16px' }}>Public Profile Scraper</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Input professional profile URLs. Our detective reads corporate updates, public publications, and interests.
          </p>

          <form onSubmit={handleScan} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="LinkedIn Corporate Profile URL"
              icon={Link2}
              placeholder="https://linkedin.com/in/client-username"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
            />

            <Input
              label="Twitter / X Public Profile URL"
              icon={Link2}
              placeholder="https://x.com/client-username"
              value={twitterUrl}
              onChange={(e) => setTwitterUrl(e.target.value)}
            />

            <Button type="submit" loading={isLoading} variant="primary" icon={Search} style={{ width: '100%', marginTop: '8px' }}>
              Run Profile Diagnosis
            </Button>
          </form>
        </Card>

        {/* Scan Results Panel */}
        <Card hoverable={false} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '320px' }}>
          {isLoading ? (
            <div className="flex-center" style={{ flexDirection: 'column', gap: '16px' }}>
              <div style={{ position: 'relative' }}>
                <div 
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    border: '2px solid rgba(247, 37, 133, 0.2)',
                    borderTopColor: 'var(--color-secondary)',
                    animation: 'float-slow 2s infinite ease-in-out'
                  }}
                  className="glow-pink-pulse"
                />
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Analyzing public sentiment indices & publication logs...</p>
            </div>
          ) : detectiveResults ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Interests checklist */}
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Extracted Passions & Affiliations
                </h4>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {detectiveResults.scannedProfile.interests.map((int) => (
                    <Badge key={int} variant="premium">{int}</Badge>
                  ))}
                </div>
              </div>

              {/* Detected brand registries */}
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Aesthetic Brands Aligned
                </h4>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {detectiveResults.scannedProfile.detectedBrands.map((b) => (
                    <Badge key={b} variant="primary">{b}</Badge>
                  ))}
                </div>
              </div>

              {/* Insights bullet list */}
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Concierge Recommendations Insight
                </h4>
                <ul style={{ paddingLeft: '20px', fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {detectiveResults.curatedInsights.map((ins, idx) => (
                    <li key={idx}>{ins}</li>
                  ))}
                </ul>
              </div>

              {/* Curated Recommendations list */}
              <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                  Diagnosed Curations
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {detectiveResults.recommendedGifts.map((rec) => {
                    const catalogItem = catalog.find(c => c.id === rec.id);
                    return (
                      <div 
                        key={rec.id}
                        style={{
                          padding: '12px',
                          borderRadius: 'var(--radius-md)',
                          background: 'rgba(255, 255, 255, 0.01)',
                          border: '1px solid var(--glass-border)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{rec.name}</span>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-primary)' }}>₹{rec.price}</span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Badge variant="success">{rec.confidence}% Match</Badge>
                          {catalogItem && (
                            <Button onClick={() => handleQuickAdd(rec.id)} size="sm" variant="glass">
                              Select
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              <Info size={32} style={{ marginBottom: '12px', color: 'var(--text-muted)' }} />
              <p style={{ fontSize: '0.85rem' }}>Diagnose public professional profiles to build gift matrices.</p>
            </div>
          )}
        </Card>

      </div>

    </div>
  );
};

export default GiftDetectivePage;
