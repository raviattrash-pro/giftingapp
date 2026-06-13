import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, ArrowRight, Sparkles, Gift } from 'lucide-react';
import { useAiStore } from '../store/aiStore';
import { useGiftStore } from '../store/giftStore';
import { useUiStore } from '../store/uiStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const GiftGPTPage = () => {
  const { chatMessages, sendChatMessage, clearChat, isLoading } = useAiStore();
  const { addToCart, catalog } = useGiftStore();
  const { addToast } = useUiStore();
  
  const [inputText, setInputText] = useState('');
  const chatBottomRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const msg = inputText;
    setInputText('');
    await sendChatMessage(msg);
  };

  const handleSuggestion = async (prompt) => {
    await sendChatMessage(prompt);
  };

  const handleQuickAdd = (giftName) => {
    const gift = catalog.find(g => giftName.toLowerCase().includes(g.name.toLowerCase()) || g.name.toLowerCase().includes(giftName.toLowerCase()));
    if (gift) {
      addToCart(gift, 1);
      addToast(`Added ${gift.name} to cart.`, 'success');
    } else {
      addToast('Product details mapped locally. Click Browse to checkout.', 'info');
    }
  };

  const suggestions = [
    'What should I gift Sophia Chen for her promotion?',
    'Curate a prestige gift for Eleanor Vance under ₹30,000',
    'Suggest a travel tech accessory for Marcus Sterling',
    'What is a thoughtful, relaxing self-care gift?'
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '8.5fr 3.5fr', gap: '24px', height: 'calc(100vh - 120px)' }}>
      
      {/* Chat core layout */}
      <Card hoverable={false} style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0px' }}>
        
        {/* Chat Header */}
        <div 
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--glass-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.01)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bot size={20} style={{ color: 'var(--color-primary)' }} />
            <div>
              <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-title)', fontWeight: 600 }}>GiftGPT Private Advisor</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Advanced generative gifting intelligence</p>
            </div>
          </div>
          
          <button
            onClick={() => { clearChat(); addToast('Chat thread cleared.', 'info'); }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.78rem'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-danger)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <Trash2 size={14} /> Clear chat
          </button>
        </div>

        {/* Chat bubble screen area */}
        <div 
          style={{
            flex: 1,
            padding: '24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
          className="custom-scrollbar"
        >
          {chatMessages.map((msg) => {
            const isAI = msg.role === 'assistant';
            return (
              <div 
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: isAI ? 'flex-start' : 'flex-end',
                  gap: '12px',
                  maxWidth: '85%',
                  alignSelf: isAI ? 'flex-start' : 'flex-end'
                }}
              >
                {isAI && (
                  <div 
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--glass-bg-accent)',
                      border: '1px solid rgba(157, 78, 221, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Bot size={16} style={{ color: 'var(--color-primary)' }} />
                  </div>
                )}

                <div 
                  style={{
                    background: isAI ? 'rgba(255, 255, 255, 0.02)' : 'var(--color-primary)',
                    border: isAI ? '1px solid var(--glass-border)' : '1px solid rgba(157, 78, 221, 0.3)',
                    color: isAI ? 'var(--text-primary)' : '#ffffff',
                    padding: '14px 18px',
                    borderRadius: isAI ? '0 var(--radius-md) var(--radius-md) var(--radius-md)' : 'var(--radius-md) 0 var(--radius-md) var(--radius-md)',
                    fontSize: '0.92rem',
                    lineHeight: 1.6,
                    boxShadow: isAI ? 'none' : 'var(--shadow-glow-purple)'
                  }}
                >
                  <div style={{ whiteSpace: 'pre-line' }}>{msg.content}</div>
                  
                  {/* Parse recommendations inside AI replies if containing specific product matches */}
                  {isAI && (msg.content.includes('Baccarat') || msg.content.includes('Montblanc') || msg.content.includes('Keychron')) && (
                    <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {msg.content.includes('Baccarat') && (
                        <Button onClick={() => handleQuickAdd('Baccarat')} size="sm" variant="glass" icon={Gift}>
                          Add Champagne Flutes
                        </Button>
                      )}
                      {msg.content.includes('Montblanc') && (
                        <Button onClick={() => handleQuickAdd('Montblanc')} size="sm" variant="glass" icon={Gift}>
                          Add Montblanc Pen
                        </Button>
                      )}
                      {msg.content.includes('Keychron') && (
                        <Button onClick={() => handleQuickAdd('Keychron')} size="sm" variant="glass" icon={Gift}>
                          Add Keychron Keyboard
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start' }}>
              <div 
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--glass-bg-accent)',
                  border: '1px solid rgba(157, 78, 221, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Bot size={16} style={{ color: 'var(--color-primary)' }} />
              </div>
              <div 
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--glass-border)',
                  padding: '14px 18px',
                  borderRadius: '0 var(--radius-md) var(--radius-md) var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  minWidth: '70px'
                }}
              >
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Text Form footer */}
        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--glass-border)', background: 'rgba(7, 11, 19, 0.2)' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              placeholder="Ask GiftGPT..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 18px',
                color: 'var(--text-primary)',
                fontSize: '0.92rem',
                outline: 'none',
                transition: 'var(--transition-normal)'
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border-focus)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
            />
            <Button type="submit" disabled={isLoading} variant="primary" icon={Send} style={{ padding: '14px 20px' }}>
              Send
            </Button>
          </form>
        </div>

      </Card>

      {/* Sidebar tips & suggested queries */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Prompt triggers */}
        <Card hoverable={false}>
          <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-title)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} className="text-gradient-purple" /> Suggested Prompts
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {suggestions.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestion(p)}
                style={{
                  background: 'rgba(255, 255, 255, 0.01)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  color: 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)',
                  lineHeight: 1.4
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.borderColor = 'rgba(157, 78, 221, 0.4)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.borderColor = 'var(--glass-border)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.01)';
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </Card>

        {/* AI Capabilities info */}
        <Card hoverable={false} style={{ background: 'var(--glass-bg-accent)', border: '1px solid rgba(157, 78, 221, 0.2)' }}>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Generative Features</h4>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            GiftGPT leverages the Relationship Vault preferences to match luxury products, wraps custom handwritten cards, and optimizes department budgets automatically.
          </p>
        </Card>

      </div>

    </div>
  );
};

export default GiftGPTPage;
