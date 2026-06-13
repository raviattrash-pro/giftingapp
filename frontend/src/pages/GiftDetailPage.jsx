import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Heart, Check, HelpCircle, Star, PenTool } from 'lucide-react';
import { useGiftStore } from '../store/giftStore';
import { useRecipientStore } from '../store/recipientStore';
import { useUiStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';

const GiftDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentGift, fetchGiftById, addToCart } = useGiftStore();
  const { recipients } = useRecipientStore();
  const { addToast } = useUiStore();
  const { isAuthenticated } = useAuthStore();

  const [selectedRecipientId, setSelectedRecipientId] = useState('');
  const [giftNote, setGiftNote] = useState('');
  const [wrappingStyle, setWrappingStyle] = useState('Parment Paper & Wax Seal');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchGiftById(id);
  }, [id, fetchGiftById]);

  useEffect(() => {
    if (!currentGift) return;
    const images = [currentGift.image];
    if (currentGift.additionalImages && currentGift.additionalImages.length > 0) {
      images.push(...currentGift.additionalImages);
    }
    
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % images.length);
      }, 3000); // 3 seconds auto-cycle
      return () => clearInterval(interval);
    }
  }, [currentGift]);

  if (!currentGift) {
    return (
      <div className="flex-center" style={{ minHeight: '300px' }}>
        <p>Loading curated item details...</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (currentGift.stock <= 0) {
      addToast(`${currentGift.name} is currently out of stock.`, 'warning');
      return;
    }
    addToCart(currentGift, 1, selectedRecipientId || null);
    addToast(`${currentGift.name} successfully staged in shopping cart.`, 'success');
    navigate('/checkout');
  };

  const recipientOptions = recipients.map((r) => ({
    value: r.id,
    label: `${r.name} (${r.relationship})`
  }));

  const wrappingOptions = [
    { value: 'Parment Paper & Wax Seal', label: 'Classic Parchment Paper & Wax Seal' },
    { value: 'Premium Silk Furoshiki Wrap', label: 'Premium Silk Furoshiki Wrap (+ ₹1,200)' },
    { value: 'Velvet Ribbon Giftbox', label: 'Midnight Blue Velvet Box (+ ₹800)' }
  ];

  const allImages = currentGift ? [currentGift.image, ...(currentGift.additionalImages || [])] : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Back button */}
      <div>
        <Button onClick={() => navigate('/gifts')} variant="ghost" icon={ArrowLeft}>
          Curations Gallery
        </Button>
      </div>

      {/* Main product setup grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '6fr 6fr', gap: '32px' }}>
        
        {/* Left Column: Product Image Carousel */}
        <Card hoverable={false} style={{ padding: '0px', overflow: 'hidden', position: 'relative' }}>
          <img 
            src={allImages[currentImageIndex]} 
            alt={currentGift.name} 
            style={{ width: '100%', maxHeight: '480px', objectFit: 'cover', transition: 'opacity 0.5s ease-in-out' }}
          />
          {allImages.length > 1 && (
            <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
              {allImages.map((_, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setCurrentImageIndex(idx)}
                  style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: idx === currentImageIndex ? 'var(--brand-rose-gold)' : 'rgba(255,255,255,0.6)',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    transition: 'background 0.3s'
                  }}
                />
              ))}
            </div>
          )}
        </Card>

        {/* Right Column: Descriptions & Setup options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
              {currentGift.category}
            </span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: 'var(--font-title)', marginBottom: '8px', lineHeight: 1.3 }}>
              {currentGift.name}
            </h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-warning)' }}>
                <Star size={16} fill="currentColor" />
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{currentGift.rating}</span>
              </div>
              <Badge variant={currentGift.availability === 'Out of Stock' ? 'danger' : currentGift.availability === 'Low Stock' ? 'warning' : 'success'}>
                {currentGift.availability}
              </Badge>
            </div>

            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-secondary)', fontFamily: 'var(--font-title)', marginBottom: '16px' }}>
              ₹{currentGift.price}
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {currentGift.description}
            </p>
          </div>

          {/* Allocation settings form */}
          <Card hoverable={false} style={{ background: 'rgba(255, 255, 255, 0.02)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PenTool size={16} className="text-gradient-purple" /> Concierge Wrapping & Setup
            </h3>

            {/* Select Recipient */}
            <Select
              label="Intended Recipient (Optional)"
              value={selectedRecipientId}
              onChange={(e) => setSelectedRecipientId(e.target.value)}
              options={recipientOptions}
              placeholder="Assign to client..."
            />

            {/* Custom Wrapping Selection */}
            <Select
              label="Signature Wrap Type"
              value={wrappingStyle}
              onChange={(e) => setWrappingStyle(e.target.value)}
              options={wrappingOptions}
              placeholder="Select custom wrapping..."
            />

            {/* Gift Card text area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                Handwritten Note Card Text (Included)
              </label>
              <textarea
                rows={3}
                placeholder="Draft note details here... our concierge will write this by hand with a fountain pen."
                value={giftNote}
                onChange={(e) => setGiftNote(e.target.value)}
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

            {/* Cart Trigger */}
            <Button onClick={handleAddToCart} variant="primary" icon={ShoppingBag} disabled={currentGift.stock <= 0} style={{ marginTop: '10px' }}>
              {currentGift.stock <= 0 ? 'Out of Stock' : 'Stage for Delivery'}
            </Button>
          </Card>
        </div>

      </div>

    </div>
  );
};

export default GiftDetailPage;
