import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, ArrowLeft, Save, Sparkles } from 'lucide-react';
import { useRecipientStore } from '../store/recipientStore';
import { useUiStore } from '../store/uiStore';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';

const AddRecipientPage = () => {
  const navigate = useNavigate();
  const createRecipient = useRecipientStore((state) => state.createRecipient);
  const addToast = useUiStore((state) => state.addToast);

  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    avatar: '',
    brandsText: '',
    colorsText: '',
    clothingSize: 'M',
    allergiesText: 'None',
    interestsText: '',
    notes: '',
    occasionTitle: '',
    occasionDate: '',
    occasionType: 'Birthday'
  });

  const [errors, setErrors] = useState({});

  const handleSave = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Client full name is required';
    if (!formData.relationship) newErrors.relationship = 'Connection title is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addToast('Please satisfy required fields.', 'warning');
      return;
    }

    // Process lists from text inputs
    const brands = formData.brandsText ? formData.brandsText.split(',').map((x) => x.trim()) : [];
    const colors = formData.colorsText ? formData.colorsText.split(',').map((x) => x.trim()) : [];
    const allergies = formData.allergiesText ? formData.allergiesText.split(',').map((x) => x.trim()) : [];
    const interests = formData.interestsText ? formData.interestsText.split(',').map((x) => x.trim()) : [];

    let upcomingOccasion = null;
    if (formData.occasionTitle && formData.occasionDate) {
      const diffTime = new Date(formData.occasionDate) - new Date();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      upcomingOccasion = {
        title: formData.occasionTitle,
        date: formData.occasionDate,
        daysLeft: diffDays >= 0 ? diffDays : 0,
        type: formData.occasionType
      };
    }

    const payload = {
      name: formData.name,
      relationship: formData.relationship,
      avatar: formData.avatar || undefined,
      preferences: {
        brands,
        colors,
        clothingSize: formData.clothingSize,
        allergies,
        interests,
        notes: formData.notes
      },
      upcomingOccasion
    };

    try {
      await createRecipient(payload);
      addToast('Client profile added to vault successfully.', 'success');
      navigate('/recipients');
    } catch (err) {
      addToast('Error saving profile.', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Back button */}
      <div>
        <Button onClick={() => navigate('/recipients')} variant="ghost" icon={ArrowLeft}>
          Back to Vault
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '24px' }}>
        
        {/* Left Card: Core client details */}
        <Card hoverable={false}>
          <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-title)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={20} className="text-gradient-purple" /> Client Registration
          </h3>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Input
                label="Full Client Name"
                placeholder="e.g. William Sterling"
                value={formData.name}
                onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setErrors({ ...errors, name: '' }); }}
                error={errors.name}
                required
              />
              <Input
                label="Connection Title"
                placeholder="e.g. Joint Venture Partner, VP Operations"
                value={formData.relationship}
                onChange={(e) => { setFormData({ ...formData, relationship: e.target.value }); setErrors({ ...errors, relationship: '' }); }}
                error={errors.relationship}
                required
              />
            </div>

            <Input
              label="Avatar Image URL (Optional)"
              placeholder="https://images.unsplash.com/..."
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
            />

            <h4 style={{ fontSize: '0.95rem', color: '#ffffff', fontFamily: 'var(--font-title)', borderTop: '1px solid var(--glass-border)', paddingTop: '16px', marginTop: '8px' }}>
              Personal Preferences & Vault Data
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Input
                label="Premium Brands (Comma separated)"
                placeholder="e.g. Apple, Hermes, Rolex"
                value={formData.brandsText}
                onChange={(e) => setFormData({ ...formData, brandsText: e.target.value })}
              />
              <Input
                label="Color Palette (Comma separated)"
                placeholder="e.g. Navy Blue, Sage Green, Champagne"
                value={formData.colorsText}
                onChange={(e) => setFormData({ ...formData, colorsText: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Select
                label="Clothing Size"
                value={formData.clothingSize}
                onChange={(e) => setFormData({ ...formData, clothingSize: e.target.value })}
                options={[
                  { value: 'XS', label: 'XS (Extra Small)' },
                  { value: 'S', label: 'S (Small)' },
                  { value: 'M', label: 'M (Medium)' },
                  { value: 'L', label: 'L (Large)' },
                  { value: 'XL', label: 'XL (Extra Large)' },
                  { value: 'XXL', label: 'XXL (Double Extra Large)' }
                ]}
              />
              <Input
                label="Allergies Checklist (Comma separated)"
                placeholder="e.g. Peanuts, Gluten-free, Seafood"
                value={formData.allergiesText}
                onChange={(e) => setFormData({ ...formData, allergiesText: e.target.value })}
              />
            </div>

            <Input
              label="Interests & Passions (Comma separated)"
              placeholder="e.g. Vinyl Records, Coffee Roasting, Yachting"
              value={formData.interestsText}
              onChange={(e) => setFormData({ ...formData, interestsText: e.target.value })}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                Private Concierge Notes
              </label>
              <textarea
                rows={3}
                placeholder="Describe nuances in their character, gifting habits, or wrapping preferences..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-md)',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  fontFamily: 'var(--font-body)',
                  outline: 'none',
                  backdropFilter: 'blur(8px)',
                  resize: 'none'
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border-focus)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'end', marginTop: '12px' }}>
              <Button type="submit" variant="primary" icon={Save}>
                Save Profile
              </Button>
            </div>
          </form>
        </Card>

        {/* Right Card: Optional initial milestone */}
        <Card hoverable={false}>
          <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-title)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} className="text-gradient-purple" /> Initial Gifting Target
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Optionally schedule their very first gifting event. If specified, GiftConcierge will configure a dedicated countdown reminder.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="Milestone Event Title"
              placeholder="e.g. Birthday Celebration, Promotion Dinner"
              value={formData.occasionTitle}
              onChange={(e) => setFormData({ ...formData, occasionTitle: e.target.value })}
            />

            <Input
              label="Milestone Event Date"
              type="date"
              value={formData.occasionDate}
              onChange={(e) => setFormData({ ...formData, occasionDate: e.target.value })}
            />

            <Select
              label="Occasion Category"
              value={formData.occasionType}
              onChange={(e) => setFormData({ ...formData, occasionType: e.target.value })}
              options={[
                { value: 'Birthday', label: 'Birthday' },
                { value: 'Anniversary', label: 'Anniversary' },
                { value: 'Promotion', label: 'Promotion' },
                { value: 'Holiday', label: 'Holiday' },
                { value: 'Other', label: 'Other Custom Event' }
              ]}
            />
          </div>
        </Card>

      </div>

    </div>
  );
};

export default AddRecipientPage;
