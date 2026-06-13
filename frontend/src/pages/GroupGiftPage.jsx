import React, { useState } from 'react';
import { UsersRound, Plus, DollarSign, MessageSquare, Check, Sparkles } from 'lucide-react';
import { useGroupGiftStore } from '../store/groupGiftStore';
import { useUiStore } from '../store/uiStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Avatar from '../components/ui/Avatar';

const GroupGiftPage = () => {
  const { groupGifts, contributeToGroupGift, createGroupGift } = useGroupGiftStore();
  const { addToast } = useUiStore();

  const [activeCampaignId, setActiveCampaignId] = useState(null);
  const [isContributeOpen, setIsContributeOpen] = useState(false);
  const [contributor, setContributor] = useState({ name: 'Alexander Sterling', amount: 50, comment: '' });

  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    recipientName: '',
    title: '',
    occasion: '',
    giftName: '',
    giftPrice: 500
  });

  const handleOpenContribute = (campaignId) => {
    setActiveCampaignId(campaignId);
    setIsContributeOpen(true);
  };

  const handleContributeSubmit = (e) => {
    e.preventDefault();
    if (!contributor.name || !contributor.amount) return;

    contributeToGroupGift(activeCampaignId, contributor);
    addToast(`Successfully contributed ₹${contributor.amount} to the pool!`, 'success');
    setIsContributeOpen(false);
    setContributor({ name: 'Alexander Sterling', amount: 50, comment: '' });
  };

  const handleCreateCampaign = (e) => {
    e.preventDefault();
    if (!newCampaign.recipientName || !newCampaign.title || !newCampaign.giftName) return;

    createGroupGift(newCampaign);
    addToast('Group gifting campaign launched successfully.', 'success');
    setIsNewCampaignOpen(false);
    setNewCampaign({ recipientName: '', title: '', occasion: '', giftName: '', giftPrice: 500 });
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
            Co-op Gifting Pools
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
            Crowdsource funds with your coworkers to purchase elite tier curations.
          </p>
        </div>

        <Button onClick={() => setIsNewCampaignOpen(true)} variant="primary" icon={Plus}>
          Launch Pool
        </Button>
      </div>

      {/* Campaigns list */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {groupGifts.map((gg) => {
          const fundingPct = Math.min(100, Math.round((gg.amountGathered / gg.giftPrice) * 100));
          return (
            <Card key={gg.id} hoverable={false} style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '24px' }}>
              {/* Left Column: Pool Progress & Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Avatar src={gg.recipientAvatar} name={gg.recipientName} size="lg" />
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{gg.title}</h3>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Target: {gg.recipientName} • {gg.occasion}
                    </span>
                  </div>
                </div>

                <div 
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.01)',
                    border: '1px solid var(--glass-border)'
                  }}
                >
                  <div className="flex-between" style={{ fontSize: '0.82rem', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Curated Gift: <strong>{gg.giftName}</strong></span>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>₹{gg.giftPrice}</span>
                  </div>

                  {/* Progress bar */}
                  <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                    <div 
                      style={{ 
                        width: `${fundingPct}%`, 
                        height: '100%', 
                        background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)' 
                      }} 
                    />
                  </div>

                  <div className="flex-between" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <span>₹{gg.amountGathered} collected</span>
                    <span>{fundingPct}% funded • {gg.daysLeft} days remaining</span>
                  </div>
                </div>

                <div>
                  <Button onClick={() => handleOpenContribute(gg.id)} variant="primary" icon={DollarSign}>
                    Contribute Funds
                  </Button>
                </div>
              </div>

              {/* Right Column: Contributions list feed */}
              <div style={{ borderLeft: '1px solid var(--glass-border)', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ fontSize: '0.95rem', fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MessageSquare size={16} /> Contributor Board
                </h4>

                <div 
                  style={{ 
                    maxHeight: '220px', 
                    overflowY: 'auto', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '12px' 
                  }}
                  className="custom-scrollbar"
                >
                  {gg.contributions.length === 0 ? (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>
                      No contributions yet. Be the first!
                    </p>
                  ) : (
                    gg.contributions.map((c) => (
                      <div 
                        key={c.id}
                        style={{
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(255,255,255,0.01)',
                          border: '1px solid rgba(255,255,255,0.02)',
                          fontSize: '0.8rem'
                        }}
                      >
                        <div className="flex-between" style={{ marginBottom: '4px' }}>
                          <strong style={{ color: 'var(--text-primary)' }}>{c.name}</strong>
                          <span style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>+₹{c.amount}</span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                          "{c.comment}"
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </Card>
          );
        })}
      </div>

      {/* Contribute Modal */}
      <Modal
        isOpen={isContributeOpen}
        onClose={() => setIsContributeOpen(false)}
        title="Contribute Gifting Funds"
      >
        <form onSubmit={handleContributeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Your Full Name"
            placeholder="Alexander Sterling"
            value={contributor.name}
            onChange={(e) => setContributor({ ...contributor, name: e.target.value })}
            required
          />

          <Input
            label="Contribution Allocation (₹)"
            type="number"
            value={contributor.amount}
            onChange={(e) => setContributor({ ...contributor, amount: e.target.value })}
            required
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Note / Comments (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Leave a congratulatory note for the recipient card..."
              value={contributor.comment}
              onChange={(e) => setContributor({ ...contributor, comment: e.target.value })}
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
            <Button onClick={() => setIsContributeOpen(false)} variant="glass">Cancel</Button>
            <Button type="submit" variant="primary" icon={Check}>Submit Contribution</Button>
          </div>
        </form>
      </Modal>

      {/* Launch Pool Modal */}
      <Modal
        isOpen={isNewCampaignOpen}
        onClose={() => setIsNewCampaignOpen(false)}
        title="Launch Group Gifting Campaign"
      >
        <form onSubmit={handleCreateCampaign} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Pool Campaign Title"
            placeholder="e.g. Sophia Chen VP Promotion"
            value={newCampaign.title}
            onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input
              label="Recipient Name"
              placeholder="Sophia Chen"
              value={newCampaign.recipientName}
              onChange={(e) => setNewCampaign({ ...newCampaign, recipientName: e.target.value })}
              required
            />
            <Input
              label="Gifting Occasion"
              placeholder="Promotion celebration dinner"
              value={newCampaign.occasion}
              onChange={(e) => setNewCampaign({ ...newCampaign, occasion: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '16px' }}>
            <Input
              label="Staged Gift Item Name"
              placeholder="e.g. Rimowa Cabin Suitcase"
              value={newCampaign.giftName}
              onChange={(e) => setNewCampaign({ ...newCampaign, giftName: e.target.value })}
              required
            />
            <Input
              label="Target Price (₹)"
              type="number"
              value={newCampaign.giftPrice}
              onChange={(e) => setNewCampaign({ ...newCampaign, giftPrice: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'end', marginTop: '12px' }}>
            <Button onClick={() => setIsNewCampaignOpen(false)} variant="glass">Cancel</Button>
            <Button type="submit" variant="primary" icon={Sparkles}>Launch Campaign</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default GroupGiftPage;
