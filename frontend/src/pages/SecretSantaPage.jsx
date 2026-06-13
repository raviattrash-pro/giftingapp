import React, { useState } from 'react';
import { Gamepad2, Plus, Sparkles, User, AlertCircle, Check, Users } from 'lucide-react';
import { useSocialStore } from '../store/socialStore';
import { useUiStore } from '../store/uiStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';

const SecretSantaPage = () => {
  const { santaGames, createSantaGame, drawSecretSanta } = useSocialStore();
  const { addToast } = useUiStore();

  const [gameName, setGameName] = useState('');
  const [budgetLimit, setBudgetLimit] = useState(150);
  const [participantInput, setParticipantInput] = useState('');
  const [participants, setParticipants] = useState(['Alexander Sterling', 'Sophia Chen', 'David Kim', 'Eleanor Vance']);

  const handleAddParticipant = (e) => {
    e.preventDefault();
    if (!participantInput.trim()) return;
    if (participants.includes(participantInput.trim())) {
      addToast('Participant already added.', 'warning');
      return;
    }
    setParticipants([...participants, participantInput.trim()]);
    setParticipantInput('');
  };

  const handleRemoveParticipant = (name) => {
    setParticipants(participants.filter(p => p !== name));
  };

  const handleCreateGame = (e) => {
    e.preventDefault();
    if (!gameName) return;
    if (participants.length < 3) {
      addToast('You need at least 3 participants to organize Secret Santa.', 'warning');
      return;
    }

    createSantaGame(gameName, budgetLimit, participants);
    addToast('Secret Santa event created successfully!', 'success');
    setGameName('');
    setBudgetLimit(150);
    setParticipants(['Alexander Sterling', 'Sophia Chen', 'David Kim', 'Eleanor Vance']);
  };

  const handleDraw = (gameId) => {
    drawSecretSanta(gameId);
    addToast('Secret Santa matches generated!', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Title */}
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
          Secret Santa Coordinator
        </h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
          Manage collaborative department exchange games and draw matching assignments anonymously.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '24px' }}>
        
        {/* Creator panel */}
        <Card hoverable={false}>
          <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-title)', marginBottom: '16px' }}>Configure Game</h3>

          <form onSubmit={handleCreateGame} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="Group / Game Name"
              placeholder="e.g. Sterling Holdings Christmas 2026"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              required
            />

            <Input
              label="Individual Budget Limit (₹)"
              type="number"
              value={budgetLimit}
              onChange={(e) => setBudgetLimit(Number(e.target.value))}
              required
            />

            {/* Add participants list */}
            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                Add Game Participants
              </label>
              
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  <Input
                    icon={User}
                    placeholder="Participant full name..."
                    value={participantInput}
                    onChange={(e) => setParticipantInput(e.target.value)}
                    style={{ marginBottom: 0 }}
                  />
                </div>
                <Button onClick={handleAddParticipant} variant="glass" icon={Plus}>
                  Add
                </Button>
              </div>

              {/* Roster list */}
              <div 
                style={{ 
                  maxHeight: '160px', 
                  overflowY: 'auto', 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '8px',
                  padding: '8px',
                  background: 'rgba(255, 255, 255, 0.01)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-sm)'
                }}
                className="custom-scrollbar"
              >
                {participants.length === 0 ? (
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>No participants listed.</span>
                ) : (
                  participants.map((name) => (
                    <Badge 
                      key={name} 
                      variant="primary"
                      onClick={() => handleRemoveParticipant(name)}
                      style={{ cursor: 'pointer' }}
                    >
                      {name} ×
                    </Badge>
                  ))
                )}
              </div>
            </div>

            <Button type="submit" variant="primary" icon={Gamepad2} style={{ width: '100%', marginTop: '12px' }}>
              Save Santa Event
            </Button>
          </form>
        </Card>

        {/* Active games matched summaries list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {santaGames.map((game) => (
            <Card key={game.id} hoverable={false} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="flex-between">
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>{game.name}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Individual Budget Limit: <strong>₹{game.budgetLimit}</strong>
                  </span>
                </div>
                <Badge variant={game.status === 'Setup' ? 'warning' : 'success'}>
                  {game.status}
                </Badge>
              </div>

              {/* Draw buttons or details */}
              {game.status === 'Setup' ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <Button onClick={() => handleDraw(game.id)} variant="secondary" icon={Sparkles}>
                    Calculate Matches
                  </Button>
                </div>
              ) : game.myTarget ? (
                <div 
                  style={{ 
                    padding: '16px', 
                    borderRadius: 'var(--radius-md)', 
                    background: 'rgba(157, 78, 221, 0.05)',
                    border: '1px solid rgba(157, 78, 221, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Avatar src={game.myTarget.avatar} name={game.myTarget.name} size="sm" />
                    <div>
                      <span style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                        Your Target Match Assignment
                      </span>
                      <strong style={{ fontSize: '0.95rem', color: '#ffffff' }}>{game.myTarget.name}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '8px' }}>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)' }}>Interests</span>
                      <span>{game.myTarget.interests.join(', ')}</span>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)' }}>Allergies</span>
                      <span>{game.myTarget.allergies}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '16px 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Matches drawn. Log in to check your target assignment!
                </div>
              )}

              {/* Participants summary */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                <Users size={14} />
                <span>Roster ({game.participants.length}): {game.participants.join(', ')}</span>
              </div>
            </Card>
          ))}
        </div>

      </div>

    </div>
  );
};

export default SecretSantaPage;
