import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useUiStore } from '../../store/uiStore';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Image } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

const defaultSlides = [
    {
      title: 'Birthday Joy, Gift-Wrapped',
      subtitle: 'Curated bloom, gourmet cakes & handcrafted keepsakes for thoughtful celebrations.',
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=1200',
      tag: 'CELEBRATE TODAY'
    },
    {
      title: "Father's Day Specials",
      subtitle: 'Got it from Dad? Get it for Dad! Elegant hampers and personalized layouts to make him smile.',
      image: '/fathers_day_banner.png',
      tag: 'GIFTS FOR HEROES'
    },
    {
      title: 'Blooming Wrapped Arrangements',
      subtitle: 'Premium roses, orchids and mixed flower arrays freshly compiled by our floral artists.',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1200',
      tag: 'EXQUISITE BLOOMS'
    }
  ];

const AdminHeroCarouselPage = () => {
  const { addToast } = useUiStore();
  const [slides, setSlides] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    tag: ''
  });

  const fetchSlides = async () => {
    try {
      const { data } = await api.get('/config/HERO_CAROUSEL');
      if (data && data.value) {
        setSlides(JSON.parse(data.value));
      } else {
        setSlides(defaultSlides);
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setSlides(defaultSlides);
      } else {
        addToast('Failed to fetch carousel slides', 'error');
        setSlides(defaultSlides);
      }
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleSave = async (updatedSlides) => {
    try {
      await api.post('/config/HERO_CAROUSEL', { value: JSON.stringify(updatedSlides) });
      setSlides(updatedSlides);
      addToast('Carousel slides saved successfully', 'success');
    } catch (err) {
      addToast('Failed to save carousel slides', 'error');
    }
  };

  const openModal = (index = null) => {
    if (index !== null) {
      setEditingIndex(index);
      setFormData(slides[index]);
    } else {
      setEditingIndex(null);
      setFormData({ title: '', subtitle: '', image: '', tag: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let updatedSlides = [...slides];
    if (editingIndex !== null) {
      updatedSlides[editingIndex] = formData;
    } else {
      updatedSlides.push(formData);
    }
    handleSave(updatedSlides);
    setIsModalOpen(false);
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this slide?')) {
      const updatedSlides = slides.filter((_, i) => i !== index);
      handleSave(updatedSlides);
    }
  };

  const moveSlide = (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === slides.length - 1)) return;
    const updatedSlides = [...slides];
    const temp = updatedSlides[index];
    updatedSlides[index] = updatedSlides[index + direction];
    updatedSlides[index + direction] = temp;
    handleSave(updatedSlides);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>Hero Carousel</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage the hero banner slides on the home page.</p>
        </div>
        <Button onClick={() => openModal()} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} />
          Add Slide
        </Button>
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        {slides.map((slide, index) => (
          <Card key={index} style={{ display: 'flex', gap: '20px', padding: '20px', alignItems: 'center' }}>
            <div style={{ width: '200px', height: '120px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, backgroundColor: 'var(--bg-secondary)', position: 'relative' }}>
              {slide.image ? (
                <img src={slide.image} alt={slide.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  <Image size={32} />
                </div>
              )}
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '4px' }}>{slide.tag}</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>{slide.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>{slide.subtitle}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button variant="outline" size="sm" onClick={() => moveSlide(index, -1)} disabled={index === 0} style={{ padding: '8px' }}>
                  <ArrowUp size={16} />
                </Button>
                <Button variant="outline" size="sm" onClick={() => moveSlide(index, 1)} disabled={index === slides.length - 1} style={{ padding: '8px' }}>
                  <ArrowDown size={16} />
                </Button>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button variant="outline" size="sm" onClick={() => openModal(index)} style={{ padding: '8px', color: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}>
                  <Edit2 size={16} />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(index)} style={{ padding: '8px', color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {slides.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No slides configured. Add a new slide to get started!
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingIndex !== null ? 'Edit Slide' : 'Add Slide'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input 
            label="Tag / Label (e.g. CELEBRATE TODAY)" 
            value={formData.tag} 
            onChange={(e) => setFormData({...formData, tag: e.target.value})} 
            required 
          />
          <Input 
            label="Title" 
            value={formData.title} 
            onChange={(e) => setFormData({...formData, title: e.target.value})} 
            required 
          />
          <Input 
            label="Subtitle / Description" 
            value={formData.subtitle} 
            onChange={(e) => setFormData({...formData, subtitle: e.target.value})} 
            required 
          />
          <Input 
            label="Image URL or Path" 
            value={formData.image} 
            onChange={(e) => setFormData({...formData, image: e.target.value})} 
            required 
            placeholder="https://... or /image.png"
          />
          
          {formData.image && (
            <div style={{ marginTop: '8px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>Image Preview:</label>
              <div style={{ width: '100%', height: '120px', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)' }}>
                <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Slide</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminHeroCarouselPage;
