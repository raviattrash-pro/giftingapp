import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trash2, Edit, Check, Calendar, Gift, Info, ShieldAlert, ArrowLeft, Plus } from 'lucide-react';
import { useRecipientStore } from '../store/recipientStore';
import { useOccasionStore } from '../store/occasionStore';
import { useUiStore } from '../store/uiStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

const RecipientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentRecipient, fetchRecipientById, deleteRecipient, updateRecipient } = useRecipientStore();
  const { addOccasion } = useOccasionStore();
  const { addToast } = useUiStore();

  const [isAddOccasionOpen, setIsAddOccasionOpen] = useState(false);
  const [newOccasion, setNewOccasion] = useState({
    title: '',
    date: '',
    type: 'Birthday',
    budget: 200,
    urgency: 'medium'
  });

  useEffect(() => {
    fetchRecipientById(id);
  }, [id, fetchRecipientById]);

  if (!currentRecipient) {
    return (
      <div className="flex-center" style={{ minHeight: '300px', flexDirection: 'column', gap: '16px' }}>
        <p>Loading premium client profile...</p>
      </div>
    );
  }

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${currentRecipient.name} from the vault?`)) {
      await deleteRecipient(currentRecipient.id);
      addToast('Profile removed from Relationship Vault.', 'info');
      navigate('/recipients');
    }
  };

  const handleCreateOccasion = async (e) => {
    e.preventDefault();
    if (!newOccasion.title || !newOccasion.date) {
      addToast('Please enter occasion details.', 'warning');
      return;
    }
    
    await addOccasion({
      recipientId: currentRecipient.id,
      recipientName: currentRecipient.name,
      ...newOccasion
    });
    
    // Update upcomingOccasion in current recipient locally
    const diffDays = Math.ceil((new Date(newOccasion.date) - new Date()) / (1000 * 60 * 60 * 24));
    await updateRecipient(currentRecipient.id, {
      upcomingOccasion: {
        title: newOccasion.title,
        date: newOccasion.date,
        daysLeft: diffDays >= 0 ? diffDays : 0
      }
    });

    addToast('Gifting event added to recipient timeline.', 'success');
    setIsAddOccasionOpen(false);
    setNewOccasion({ title: '', date: '', type: 'Birthday', budget: 200, urgency: 'medium' });
  };

  const healthColor = currentRecipient.relationshipScore >= 85 
    ? 'var(--color-success)' 
    : currentRecipient.relationshipScore >= 70 
      ? 'var(--color-warning)' 
      : 'var(--color-danger)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Back button and main controls */}
      <div className="flex-between">
        <Button onClick={() => navigate('/recipients')} variant="ghost" icon={ArrowLeft}>
          Back to Vault
        </Button>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button onClick={handleDelete} variant="danger" icon={Trash2}>
            Delete Profile
          </Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '4.5fr 7.5fr', gap: '24px' }}>
        
        {/* LEFT COLUMN: Profile info, dial, vault specs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Main User Card */}
          <Card hoverable={false} style={{ textAlign: 'center', padding: '32px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <Avatar 
                src={currentRecipient.avatar} 
                name={currentRecipient.name} 
                size="xl" 
                relationshipScore={currentRecipient.relationshipScore} 
              />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '4px' }}>{currentRecipient.name}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>{currentRecipient.relationship}</p>

            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${healthColor}33`,
                borderRadius: 'var(--radius-full)'
              }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: healthColor }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>
                Relationship Score: {currentRecipient.relationshipScore}%
              </span>
            </div>
          </Card>

          {/* Preferences vault card */}
          <Card hoverable={false}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-title)' }}>
              <Gift size={18} className="text-gradient-purple" /> Preferences Vault
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Brand list */}
              <div>
                <span style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Premium Brands
                </span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {currentRecipient.preferences?.brands?.map((brand) => (
                    <Badge key={brand} variant="primary">{brand}</Badge>
                  )) || <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>None set</span>}
                </div>
              </div>

              {/* Color preference */}
              <div>
                <span style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Color Palette
                </span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {currentRecipient.preferences?.colors?.map((color) => (
                    <Badge key={color} variant="info">{color}</Badge>
                  )) || <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>None set</span>}
                </div>
              </div>

              {/* Clothing sizes */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Clothing Size
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                    {currentRecipient.preferences?.clothingSize || 'Not specified'}
                  </span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Allergies Checklist
                  </span>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {currentRecipient.preferences?.allergies?.map((alg) => (
                      <Badge key={alg} variant="danger">{alg}</Badge>
                    )) || <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>None</span>}
                  </div>
                </div>
              </div>

              {/* Interests */}
              <div>
                <span style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Interests & Affiliations
                </span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {currentRecipient.preferences?.interests?.map((interest) => (
                    <Badge key={interest} variant="premium">{interest}</Badge>
                  )) || <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>None set</span>}
                </div>
              </div>

              {/* Concierge private notes */}
              <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
                <span style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Private Concierge Notes
                </span>
                <p style={{ fontSize: '0.82rem', fontStyle: 'italic', lineHeight: 1.5 }}>
                  "{currentRecipient.preferences?.notes || 'No notes added for this recipient yet.'}"
                </p>
              </div>

            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: Milestone calendar & past delivery log */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Milestone scheduling card */}
          <Card hoverable={false}>
            <div className="flex-between" style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-title)' }}>
                <Calendar size={18} style={{ color: 'var(--color-accent)' }} /> Milestone Timeline
              </h3>
              <Button onClick={() => setIsAddOccasionOpen(true)} size="sm" variant="glass" icon={Plus}>
                Schedule Event
              </Button>
            </div>

            {currentRecipient.upcomingOccasion ? (
              <div 
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--glass-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Active Gifting Target
                  </span>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '2px' }}>
                    {currentRecipient.upcomingOccasion.title}
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-accent)' }}>
                    Scheduled: {currentRecipient.upcomingOccasion.date}
                  </span>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <Badge variant="warning">
                    {currentRecipient.upcomingOccasion.daysLeft} days remaining
                  </Badge>
                </div>
              </div>
            ) : (
              <div 
                style={{
                  padding: '32px',
                  textAlign: 'center',
                  border: '1px dashed var(--glass-border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem'
                }}
              >
                No upcoming milestones scheduled.
              </div>
            )}
          </Card>

          {/* Past delivery history card */}
          <Card hoverable={false}>
            <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-title)', marginBottom: '20px' }}>
              <Gift size={18} style={{ color: 'var(--color-secondary)' }} /> Past Curation Deliveries
            </h3>

            {currentRecipient.giftHistory?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {currentRecipient.giftHistory.map((item) => (
                  <div 
                    key={item.id}
                    style={{
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.01)',
                      border: '1px solid var(--glass-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.name}</h4>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Delivered on {item.date}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-secondary)' }}>
                        ₹{item.cost}
                      </span>
                      <Badge variant="success">Delivered</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div 
                style={{
                  padding: '32px',
                  textAlign: 'center',
                  border: '1px dashed var(--glass-border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem'
                }}
              >
                No past deliveries recorded in vault.
              </div>
            )}
          </Card>

        </div>

      </div>

      {/* Schedule Occasion Modal */}
      <Modal
        isOpen={isAddOccasionOpen}
        onClose={() => setIsAddOccasionOpen(false)}
        title={`Schedule Event for ${currentRecipient.name}`}
      >
        <form onSubmit={handleCreateOccasion} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Event Milestone Title"
            placeholder="e.g. Wedding Anniversary, Holiday Dinner"
            value={newOccasion.title}
            onChange={(e) => setNewOccasion({ ...newOccasion, title: e.target.value })}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input
              label="Milestone Date"
              type="date"
              value={newOccasion.date}
              onChange={(e) => setNewOccasion({ ...newOccasion, date: e.target.value })}
              required
            />

            <Select
              label="Occasion Category"
              value={newOccasion.type}
              onChange={(e) => setNewOccasion({ ...newOccasion, type: e.target.value })}
              options={[
                { value: 'Birthday', label: 'Birthday' },
                { value: 'Anniversary', label: 'Anniversary' },
                { value: 'Promotion', label: 'Promotion' },
                { value: 'Holiday', label: 'Holiday' },
                { value: 'Retirement', label: 'Retirement' },
                { value: 'Other', label: 'Custom Occasion' }
              ]}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input
              label="Gifting Target Budget (₹)"
              type="number"
              value={newOccasion.budget}
              onChange={(e) => setNewOccasion({ ...newOccasion, budget: e.target.value })}
            />

            <Select
              label="Urgency Status"
              value={newOccasion.urgency}
              onChange={(e) => setNewOccasion({ ...newOccasion, urgency: e.target.value })}
              options={[
                { value: 'high', label: 'Critical' },
                { value: 'medium', label: 'Moderate' },
                { value: 'low', label: 'Scheduled' }
              ]}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'end', marginTop: '12px' }}>
            <Button onClick={() => setIsAddOccasionOpen(false)} variant="glass">
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={Check}>
              Schedule Milestone
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default RecipientDetailPage;
