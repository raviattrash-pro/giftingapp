import React, { useState } from 'react';
import { Heart, Plus, Share2, Globe, EyeOff, Trash2, ArrowRight } from 'lucide-react';
import { useWishlistStore } from '../store/wishlistStore';
import { useUiStore } from '../store/uiStore';
import { useGiftStore } from '../store/giftStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';

const WishlistPage = () => {
  const { wishlists, createWishlist, removeFromWishlist, toggleWishlistVisibility } = useWishlistStore();
  const { addToCart } = useGiftStore();
  const { addToast } = useUiStore();

  const [isNewOpen, setIsNewOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newTitle) return;
    createWishlist(newTitle, newDesc);
    addToast('Wishlist created successfully.', 'success');
    setIsNewOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  const handleShare = (link) => {
    navigator.clipboard.writeText(link);
    addToast('Shareable link copied to clipboard.', 'success');
  };

  const handleAddToCart = (item) => {
    addToCart(item, 1);
    addToast(`Staged ${item.name} in cart.`, 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
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
            Collaborative Wishlists
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
            Stage multiple items into dedicated registries for events and department rewards.
          </p>
        </div>
        
        <Button onClick={() => setIsNewOpen(true)} variant="primary" icon={Plus}>
          New Registry
        </Button>
      </div>

      {/* Wishlist listings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {wishlists.map((wl) => (
          <Card key={wl.id} hoverable={false} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header section with toggles */}
            <div className="flex-between" style={{ flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Heart size={20} className="text-gradient-purple" /> {wl.title}
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>{wl.description}</p>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() => { toggleWishlistVisibility(wl.id); addToast('Registry visibility status updated.', 'info'); }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px 12px',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {wl.isPublic ? (
                    <>
                      <Globe size={14} style={{ color: 'var(--color-success)' }} /> Public Sharing On
                    </>
                  ) : (
                    <>
                      <EyeOff size={14} style={{ color: 'var(--color-danger)' }} /> Private Mode
                    </>
                  )}
                </button>

                <Button 
                  onClick={() => handleShare(wl.shareableLink)} 
                  size="sm" 
                  variant="glass" 
                  icon={Share2}
                  disabled={!wl.isPublic}
                >
                  Share Link
                </Button>
              </div>
            </div>

            {/* List of items inside this wishlist */}
            {wl.items.length === 0 ? (
              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', padding: '24px 0' }}>
                No items staged in this wishlist. Browse catalog to populate.
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {wl.items.map((item) => (
                  <div 
                    key={item.id}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.01)',
                      border: '1px solid var(--glass-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <h4 style={{ fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.name}
                        </h4>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 600 }}>₹{item.price}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        onClick={() => handleAddToCart(item)}
                        style={{
                          background: 'rgba(157, 78, 221, 0.1)',
                          border: '1px solid rgba(157, 78, 221, 0.25)',
                          borderRadius: '4px',
                          color: 'var(--color-primary)',
                          cursor: 'pointer',
                          padding: '4px 8px',
                          fontSize: '0.72rem',
                          fontWeight: 600
                        }}
                      >
                        Order
                      </button>

                      <button
                        onClick={() => removeFromWishlist(wl.id, item.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-danger)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isNewOpen}
        onClose={() => setIsNewOpen(false)}
        title="Create Gifting Registry"
      >
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Registry Name / Title"
            placeholder="e.g. CEO Lounge Retrospective"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Registry Description
            </label>
            <textarea
              rows={3}
              placeholder="Provide context for items in this registry..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
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
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'end', marginTop: '12px' }}>
            <Button onClick={() => setIsNewOpen(false)} variant="glass">Cancel</Button>
            <Button type="submit" variant="primary">Create Registry</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default WishlistPage;
