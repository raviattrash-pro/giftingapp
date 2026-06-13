import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, UserCheck, Heart, Sparkles } from 'lucide-react';
import { useRecipientStore } from '../store/recipientStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import EmptyState from '../components/ui/EmptyState';

const RecipientsPage = () => {
  const navigate = useNavigate();
  const { recipients, fetchRecipients, isLoading } = useRecipientStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterHealth, setFilterHealth] = useState('all'); // all, high, mid, low

  useEffect(() => {
    fetchRecipients();
  }, [fetchRecipients]);

  const filteredRecipients = recipients.filter((rec) => {
    const matchesSearch = rec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rec.relationship.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterHealth === 'all') return matchesSearch;
    if (filterHealth === 'high') return matchesSearch && rec.relationshipScore >= 85;
    if (filterHealth === 'mid') return matchesSearch && rec.relationshipScore >= 70 && rec.relationshipScore < 85;
    if (filterHealth === 'low') return matchesSearch && rec.relationshipScore < 70;
    
    return matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Title Header */}
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
            Relationship Vault
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
            Monitor premium client preferences, clothes sizes, brand alignments, and milestone calendars.
          </p>
        </div>
        <Button onClick={() => navigate('/recipients/add')} variant="primary" icon={Plus}>
          Add VIP Profile
        </Button>
      </div>

      {/* Filters Area */}
      <Card hoverable={false} style={{ padding: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <Input
              icon={Search}
              placeholder="Search by name, title, or connection..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginBottom: 0 }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'high', 'mid', 'low'].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterHealth(filter)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: filterHealth === filter 
                    ? 'linear-gradient(135deg, rgba(157, 78, 221, 0.15) 0%, rgba(247, 37, 133, 0.05) 100%)' 
                    : 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid',
                  borderColor: filterHealth === filter ? 'rgba(157, 78, 221, 0.3)' : 'var(--glass-border)',
                  color: filterHealth === filter ? '#ffffff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  transition: 'var(--transition-fast)'
                }}
              >
                {filter === 'all' ? 'All Contacts' : `${filter} health`}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Roster Grid */}
      {filteredRecipients.length === 0 ? (
        <EmptyState 
          icon={UserCheck}
          title="No VIP profiles match your filters"
          description="Create a new client profile or adjust your search to find them."
          actionText="Add New Profile"
          onAction={() => navigate('/recipients/add')}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {filteredRecipients.map((rec) => (
            <Card 
              key={rec.id} 
              hoverable={true} 
              onClick={() => navigate(`/recipients/${rec.id}`)}
              style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px' }}
            >
              {/* Header profile info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Avatar src={rec.avatar} name={rec.name} size="lg" relationshipScore={rec.relationshipScore} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {rec.name}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {rec.relationship}
                  </p>
                </div>
              </div>

              {/* Progress health meter */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div className="flex-between" style={{ fontSize: '0.72rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Relationship Quality</span>
                  <span 
                    style={{ 
                      fontWeight: 600, 
                      color: rec.relationshipScore >= 85 ? 'var(--color-success)' : rec.relationshipScore >= 70 ? 'var(--color-warning)' : 'var(--color-danger)'
                    }}
                  >
                    {rec.relationshipScore}%
                  </span>
                </div>
                <div style={{ height: '5px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${rec.relationshipScore}%`, 
                      height: '100%', 
                      background: rec.relationshipScore >= 85 ? 'var(--color-success)' : rec.relationshipScore >= 70 ? 'var(--color-warning)' : 'var(--color-danger)'
                    }} 
                  />
                </div>
              </div>

              {/* Upcoming Occasion Preview */}
              {rec.upcomingOccasion ? (
                <div 
                  style={{
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.01)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.78rem'
                  }}
                >
                  <div className="flex-between" style={{ marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Next Occasion:</span>
                    <Badge variant={rec.upcomingOccasion.daysLeft <= 10 ? 'danger' : 'info'}>
                      {rec.upcomingOccasion.daysLeft}d left
                    </Badge>
                  </div>
                  <div style={{ fontWeight: 500, color: '#ffffff' }}>
                    {rec.upcomingOccasion.title}
                  </div>
                </div>
              ) : (
                <div 
                  style={{
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.01)',
                    border: '1px dashed var(--glass-border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.78rem',
                    textAlign: 'center',
                    color: 'var(--text-muted)'
                  }}
                >
                  No scheduled occasions.
                </div>
              )}

              {/* Preferences Tag Overview */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {rec.preferences?.brands?.slice(0, 2).map((b) => (
                  <Badge key={b} variant="primary">{b}</Badge>
                ))}
                {rec.preferences?.interests?.slice(0, 1).map((i) => (
                  <Badge key={i} variant="premium">{i}</Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipientsPage;
