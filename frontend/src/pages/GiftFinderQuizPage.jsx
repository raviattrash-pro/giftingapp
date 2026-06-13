import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Sparkles, Check, ArrowRight, ArrowLeft, RotateCcw, Heart } from 'lucide-react';
import { useAiStore } from '../store/aiStore';
import { useGiftStore } from '../store/giftStore';
import { useUiStore } from '../store/uiStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const GiftFinderQuizPage = () => {
  const { runGiftQuiz, quizResults, isLoading, resetQuiz } = useAiStore();
  const { addToCart } = useGiftStore();
  const { addToast } = useUiStore();

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    occasion: 'Celebration',
    vibe: 'Classic/Executive',
    budget: 300
  });

  const handleNext = () => setStep((s) => s + 1);
  const handlePrev = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    await runGiftQuiz(answers);
    setStep(4);
  };

  const handleRestart = () => {
    setStep(1);
    // Clear quiz results in store
    useAiStore.setState({ quizResults: null });
  };

  const handleAddQuizGift = (gift) => {
    addToCart(gift, 1);
    addToast(`Added ${gift.name} to cart.`, 'success');
  };

  const occasionOptions = ['Birthday', 'Anniversary', 'Promotion', 'Holiday', 'Celebration'];
  const vibeOptions = [
    { value: 'Modern/Tech', label: 'Tech & Gadgets', desc: 'Sleek items for productivity and smart setups.' },
    { value: 'Classic/Executive', label: 'Executive Luxury', desc: 'Prestigious crystalware and fine leather accessories.' },
    { value: 'Minimalist/Nature', label: 'Organic Utility', desc: 'Sustainable designs and clean home accents.' },
    { value: 'Pampered/Selfcare', label: 'Aromatic & Skin', desc: 'Subtle botanical oils and luxury bathing items.' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Title */}
      <div style={{ textAlign: 'center' }}>
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
          Gift Finder Matcher
        </h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
          Curate the ultimate gifting alignment with our algorithmic affinity scorer.
        </p>
      </div>

      {/* Progress line indicator */}
      {step < 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 8px' }}>
          <div className="flex-between" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Step {step} of 3</span>
            <span>{Math.round((step / 3) * 100)}% Complete</span>
          </div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.03)', borderRadius: '2px' }}>
            <motion.div 
              style={{ height: '100%', background: 'var(--color-primary)', borderRadius: '2px' }}
              animate={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Steps Panels */}
      <Card hoverable={false} className="glow-purple-pulse" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-title)' }}>What is the Gifting Occasion?</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {occasionOptions.map((occ) => (
                  <button
                    key={occ}
                    onClick={() => setAnswers({ ...answers, occasion: occ })}
                    style={{
                      padding: '14px 20px',
                      borderRadius: 'var(--radius-md)',
                      background: answers.occasion === occ ? 'rgba(157, 78, 221, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid',
                      borderColor: answers.occasion === occ ? 'var(--color-primary)' : 'var(--glass-border)',
                      color: answers.occasion === occ ? '#ffffff' : 'var(--text-primary)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    {occ}
                    {answers.occasion === occ && <Check size={16} style={{ color: 'var(--color-primary)' }} />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-title)' }}>Select Recipient's Design Vibe</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', flexWrap: 'wrap' }}>
                {vibeOptions.map((vibe) => (
                  <button
                    key={vibe.value}
                    onClick={() => setAnswers({ ...answers, vibe: vibe.value })}
                    style={{
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      background: answers.vibe === vibe.value ? 'rgba(157, 78, 221, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid',
                      borderColor: answers.vibe === vibe.value ? 'var(--color-primary)' : 'var(--glass-border)',
                      color: answers.vibe === vibe.value ? '#ffffff' : 'var(--text-primary)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div className="flex-between" style={{ width: '100%' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{vibe.label}</span>
                      {answers.vibe === vibe.value && <Check size={14} style={{ color: 'var(--color-primary)' }} />}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{vibe.desc}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-title)' }}>Allocated Gifting Budget</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Set the price boundaries. GiftConcierge will optimize recommendations to maximize relationship impact.
              </p>

              <div style={{ padding: '10px 0', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-title)', fontWeight: 800, color: 'var(--color-primary)' }}>
                  ₹{answers.budget}
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="25"
                  value={answers.budget}
                  onChange={(e) => setAnswers({ ...answers, budget: Number(e.target.value) })}
                  style={{
                    width: '100%',
                    accentColor: 'var(--color-primary)',
                    marginTop: '20px',
                    height: '6px',
                    borderRadius: '3px',
                    background: 'rgba(255,255,255,0.08)'
                  }}
                />
                <div className="flex-between" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                  <span>₹50 Min</span>
                  <span>₹1,000 Max</span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              {isLoading ? (
                <div className="flex-center" style={{ minHeight: '260px', flexDirection: 'column', gap: '16px' }}>
                  <div className="animate-float-slow" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--glass-bg-accent)', border: '1px solid rgba(157, 78, 221, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={20} style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <p style={{ fontSize: '0.88rem' }}>Scoring product catalog matrices...</p>
                </div>
              ) : quizResults ? (
                <div>
                  {/* Results Affinity score */}
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <Badge variant="premium">{quizResults.compatibilityLabel}</Badge>
                    <div style={{ fontSize: '2.8rem', fontFamily: 'var(--font-title)', fontWeight: 800, color: 'var(--color-success)', marginTop: '8px' }}>
                      {quizResults.compatibilityScore}% Match
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '500px', margin: '6px auto 0 auto' }}>
                      {quizResults.reasoning}
                    </p>
                  </div>

                  {/* Recommendations */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {quizResults.suggestions?.map((item) => (
                      <div 
                        key={item.gift.id}
                        style={{
                          padding: '16px',
                          borderRadius: 'var(--radius-md)',
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid var(--glass-border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '16px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img 
                            src={item.gift.image} 
                            alt={item.gift.name} 
                            style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                          />
                          <div>
                            <h4 style={{ fontSize: '0.88rem', fontWeight: 600 }}>{item.gift.name}</h4>
                            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                              ₹{item.gift.price}
                            </span>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Badge variant="success">{item.score}% Match</Badge>
                          <Button onClick={() => handleAddQuizGift(item.gift)} size="sm" variant="glass" icon={Heart}>
                            Select Gift
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
          {step < 4 ? (
            <>
              <Button
                onClick={handlePrev}
                disabled={step === 1}
                variant="ghost"
                icon={ArrowLeft}
              >
                Back
              </Button>

              {step === 3 ? (
                <Button
                  onClick={handleSubmit}
                  variant="primary"
                  icon={Sparkles}
                >
                  Analyze Catalog
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="secondary"
                  icon={ArrowRight}
                >
                  Continue
                </Button>
              )}
            </>
          ) : (
            <Button
              onClick={handleRestart}
              variant="glass"
              icon={RotateCcw}
              style={{ margin: '0 auto' }}
            >
              Restart Matching Quiz
            </Button>
          )}
        </div>

      </Card>

    </div>
  );
};

export default GiftFinderQuizPage;
