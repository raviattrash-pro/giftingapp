import React, { useState } from 'react';
import { PlaySquare, Heart, MessageSquare, Plus, Check, Camera } from 'lucide-react';
import { useSocialStore } from '../store/socialStore';
import { useUiStore } from '../store/uiStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';

const GiftStoriesPage = () => {
  const { stories, addStory, likeStory } = useSocialStore();
  const { addToast } = useUiStore();

  const [isOpen, setIsOpen] = useState(false);
  const [newStory, setNewStory] = useState({
    senderName: '',
    recipientName: '',
    giftName: '',
    message: '',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600'
  });

  const handlePost = (e) => {
    e.preventDefault();
    if (!newStory.senderName || !newStory.recipientName || !newStory.giftName || !newStory.message) return;

    addStory(newStory);
    addToast('Gift Story shared with corporate board.', 'success');
    setIsOpen(false);
    setNewStory({
      senderName: '',
      recipientName: '',
      giftName: '',
      message: '',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600'
    });
  };

  const handleLike = (storyId) => {
    likeStory(storyId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Title */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '16px' }}>
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
            Gift Stories
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
            Review reaction photos and celebration logs of curations delivered globally.
          </p>
        </div>

        <Button onClick={() => setIsOpen(true)} variant="primary" icon={Plus}>
          Share Story
        </Button>
      </div>

      {/* Stories stream feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {stories.map((story) => (
          <Card key={story.id} hoverable={false} style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '0px', overflow: 'hidden' }}>
            
            {/* Story Image */}
            <div style={{ width: '100%', height: '400px', overflow: 'hidden', position: 'relative' }}>
              {(story.image?.includes('video/') || story.image?.match(/\.(mp4|webm)$/i)) ? (
                <video src={story.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted autoPlay loop playsInline />
              ) : (
                <img 
                  src={story.image} 
                  alt={story.giftName} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </div>

            {/* Story Details */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="flex-between">
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                    From: {story.senderName} • To: {story.recipientName}
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '2px', fontFamily: 'var(--font-title)' }}>
                    Curation: {story.giftName}
                  </h3>
                </div>
              </div>

              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.6 }}>
                "{story.message}"
              </p>

              {/* Interaction icons */}
              <div 
                style={{ 
                  display: 'flex', 
                  gap: '16px', 
                  alignItems: 'center', 
                  borderTop: '1px solid var(--glass-border)', 
                  paddingTop: '16px',
                  marginTop: '6px'
                }}
              >
                <button
                  onClick={() => handleLike(story.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-secondary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  <Heart size={18} fill="rgba(247, 37, 133, 0.15)" /> {story.likes} Likes
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <MessageSquare size={18} /> {story.comments} Comments
                </div>
              </div>
            </div>

          </Card>
        ))}
      </div>

      {/* Share Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Share Gift Story"
      >
        <form onSubmit={handlePost} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input
              label="Sender Name"
              placeholder="e.g. Alastair Vance"
              value={newStory.senderName}
              onChange={(e) => setNewStory({ ...newStory, senderName: e.target.value })}
              required
            />
            <Input
              label="Recipient Name"
              placeholder="e.g. Sophia Chen"
              value={newStory.recipientName}
              onChange={(e) => setNewStory({ ...newStory, recipientName: e.target.value })}
              required
            />
          </div>

          <Input
            label="Curated Gift Title"
            placeholder="e.g. Baccarat Crystal Champagne Flutes"
            value={newStory.giftName}
            onChange={(e) => setNewStory({ ...newStory, giftName: e.target.value })}
            required
          />

          <Input
            label="Reaction Photo URL (Optional)"
            icon={Camera}
            placeholder="https://images.unsplash.com/..."
            value={newStory.image}
            onChange={(e) => setNewStory({ ...newStory, image: e.target.value })}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Feedback Message
            </label>
            <textarea
              rows={3}
              placeholder="Describe their expression, comments, or reaction upon opening the package..."
              value={newStory.message}
              onChange={(e) => setNewStory({ ...newStory, message: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
                fontFamily: 'var(--font-body)',
                outline: 'none',
                resize: 'none'
              }}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'end', marginTop: '12px' }}>
            <Button onClick={() => setIsOpen(false)} variant="glass">Cancel</Button>
            <Button type="submit" variant="primary" icon={Check}>Post Story</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default GiftStoriesPage;
