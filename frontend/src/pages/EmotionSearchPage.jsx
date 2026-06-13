import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Search, Sparkles, Smile, MessageSquare, Coffee, PartyPopper } from 'lucide-react';
import { useGiftStore } from '../store/giftStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const EmotionSearchPage = () => {
  const navigate = useNavigate();
  const { catalog, fetchCatalog } = useGiftStore();
  const [selectedEmotion, setSelectedEmotion] = useState('celebration');

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  const emotions = [
    { id: 'celebration', label: 'Celebrate Achievement', desc: 'Raise a glass to promotions and major company milestones.', icon: PartyPopper, color: '#f72585' },
    { id: 'gratitude', label: 'Express Gratitude', desc: 'Say thank you to clients and mentors who elevate your work.', icon: Heart, color: '#9d4edd' },
    { id: 'relaxing', label: 'Offer Relaxation', desc: 'Provide a soothing, botanical sensory retreat from intense deadlines.', icon: Coffee, color: '#00f5d4' },
    { id: 'apologetic', label: 'Send Apologies', desc: 'Mend relations with thoughtful, premium restoration statements.', icon: MessageSquare, color: '#fee440' },
    { id: 'inspiring', label: 'Inspire Creativity', desc: 'Spark productivity and modern tech creations.', icon: Sparkles, color: '#4cc9f0' }
  ];

  // Filter gifts by active emotion tag
  const filteredGifts = catalog.filter((gift) => gift.tags?.includes(selectedEmotion));

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
          Emotional Shopping Curation
        </h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
          Align your corporate relationships with precise sentiments and sensory curation.
        </p>
      </div>

      {/* Sentiment Selector Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', flexWrap: 'wrap' }}>
        {emotions.map((em) => {
          const Icon = em.icon;
          const isActive = selectedEmotion === em.id;

          return (
            <Card
              key={em.id}
              onClick={() => setSelectedEmotion(em.id)}
              hoverable={true}
              style={{
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                background: isActive ? `${em.color}15` : 'var(--glass-bg)',
                borderColor: isActive ? em.color : 'var(--glass-border)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--glass-border)',
                  color: em.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon size={20} />
              </div>
              
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{em.label}</h4>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{em.desc}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Emotion specific products */}
      <div>
        <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-title)', marginBottom: '20px' }}>
          Curated for {emotions.find(e => e.id === selectedEmotion)?.label}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {filteredGifts.map((gift) => (
            <Card
              key={gift.id}
              hoverable={true}
              onClick={() => navigate(`/gifts/${gift.id}`)}
              style={{ display: 'flex', gap: '16px', padding: '16px', alignItems: 'center' }}
            >
              <img
                src={gift.image}
                alt={gift.name}
                style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {gift.name}
                </h4>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-primary)', display: 'block', margin: '4px 0' }}>
                  ₹{gift.price}
                </span>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {gift.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
};

export default EmotionSearchPage;
