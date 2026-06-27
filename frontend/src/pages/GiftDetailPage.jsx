import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Heart, Check, HelpCircle, Star, PenTool, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGiftStore } from '../store/giftStore';
import { useRecipientStore } from '../store/recipientStore';
import { useUiStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import api from '../services/api';

const GiftDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentGift, fetchGiftById, addToCart } = useGiftStore();
  const { recipients } = useRecipientStore();
  const { addToast } = useUiStore();
  const { isAuthenticated } = useAuthStore();

  const [selectedRecipientId, setSelectedRecipientId] = useState('');
  const [giftNote, setGiftNote] = useState('');
  const [wrappingStyle, setWrappingStyle] = useState('');
  const [wrappingOptions, setWrappingOptions] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);

  useEffect(() => {
    const fetchWrappingOptions = async () => {
      try {
        const { data } = await api.get('/config/WRAPPING_OPTIONS');
        if (data && data.value) {
          const parsed = JSON.parse(data.value);
          const formattedOptions = parsed.map(opt => ({
            value: opt.label,
            label: opt.price > 0 ? `${opt.label} (+ ₹${opt.price})` : opt.label
          }));
          setWrappingOptions(formattedOptions);
          if (formattedOptions.length > 0) {
            setWrappingStyle(formattedOptions[0].value);
          }
        }
      } catch (err) {
        // Fallback options
        const fallback = [
          { value: 'Classic Parchment Paper & Wax Seal', label: 'Classic Parchment Paper & Wax Seal' },
          { value: 'Premium Silk Furoshiki Wrap', label: 'Premium Silk Furoshiki Wrap (+ ₹1,200)' },
          { value: 'Midnight Blue Velvet Box', label: 'Midnight Blue Velvet Box (+ ₹800)' }
        ];
        setWrappingOptions(fallback);
        setWrappingStyle(fallback[0].value);
      }
    };
    fetchWrappingOptions();
  }, []);

  useEffect(() => {
    fetchGiftById(id);
  }, [id, fetchGiftById]);

  useEffect(() => {
    if (!currentGift) return;
    setCurrentImageIndex(0);
  }, [currentGift]);

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const allImages = [currentGift.image, ...(currentGift.additionalImages || [])];
    if (touchStart - touchEnd > 50) {
      setCurrentImageIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1));
    } else if (touchEnd - touchStart > 50) {
      setCurrentImageIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1));
    }
    setTouchStart(null);
  };

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Card 
            hoverable={false} 
            style={{ padding: '0px', overflow: 'hidden', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0a0a0a', minHeight: '300px' }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {(allImages[currentImageIndex]?.includes('video/') || allImages[currentImageIndex]?.match(/\.(mp4|webm)$/i)) ? (
              <video 
                src={allImages[currentImageIndex]} 
                autoPlay 
                loop 
                muted 
                playsInline
                style={{ width: '100%', maxHeight: '480px', objectFit: 'contain' }}
              />
            ) : (
              <img 
                src={allImages[currentImageIndex]} 
                alt={currentGift.name} 
                style={{ width: '100%', maxHeight: '480px', objectFit: 'cover', transition: 'opacity 0.3s ease-in-out' }}
              />
            )}
            
            {allImages.length > 1 && (
              <>
                <button 
                  onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
                >
                  <ChevronRight size={20} />
                </button>
                <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, color: 'white', backdropFilter: 'blur(4px)' }}>
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              </>
            )}
          </Card>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="mobile-scroll-row" style={{ display: 'flex', gap: '8px', paddingBottom: '4px' }}>
              {allImages.map((src, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setCurrentImageIndex(idx)}
                  style={{
                    minWidth: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer',
                    border: `2px solid ${idx === currentImageIndex ? 'var(--color-primary)' : 'transparent'}`,
                    opacity: idx === currentImageIndex ? 1 : 0.6,
                    transition: 'var(--transition-fast)'
                  }}
                >
                  {(src?.includes('video/') || src?.match(/\.(mp4|webm)$/i)) ? (
                    <video src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="thumb" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

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
              <PenTool size={16} className="text-gradient-purple" /> Gift Wrapping & Details
            </h3>



            {/* Custom Wrapping Selection */}
            <Select
              label="Wrapping Style"
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
