import React, { useState, useEffect } from 'react';

const isVideo = (url) => {
  if (!url) return false;
  return url.includes('video/mp4') || url.endsWith('.mp4');
};

const MediaCarousel = ({ mediaUrls, altText }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (mediaUrls.length <= 1) return;
    
    // Auto cycle every 4 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mediaUrls.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [mediaUrls.length]);

  if (!mediaUrls || mediaUrls.length === 0) {
    return <div style={{ width: '100%', height: '100%', background: '#eee' }} />;
  }

  const currentMedia = mediaUrls[currentIndex];

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {isVideo(currentMedia) ? (
        <video 
          src={currentMedia} 
          autoPlay 
          muted 
          loop 
          playsInline 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      ) : (
        <img 
          src={currentMedia} 
          alt={altText || 'Product Media'} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      )}
      
      {mediaUrls.length > 1 && (
        <div style={{ 
          position: 'absolute', 
          bottom: '8px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          display: 'flex', 
          gap: '4px' 
        }}>
          {mediaUrls.map((_, idx) => (
            <div 
              key={idx}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: currentIndex === idx ? 'var(--brand-rose-gold, #ff6b6b)' : 'rgba(255,255,255,0.5)',
                transition: 'background 0.3s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaCarousel;
