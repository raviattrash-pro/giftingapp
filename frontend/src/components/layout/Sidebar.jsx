import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Users, Calendar, MessageSquareText, Sparkles, 
  SearchCode, Gift, BarChart3, HeartHandshake, LogOut, ChevronLeft, ChevronRight,
  ClipboardList, Heart, UsersRound, HelpCircle, Gamepad2, PlaySquare, Settings, CreditCard, Package, LogIn
} from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { useRecipientStore } from '../../store/recipientStore';
import AnimatedAvatar from '../ui/AnimatedAvatar';

const Sidebar = () => {
  const navigate = useNavigate();
  const { sidebarExpanded, toggleSidebar, setSidebarExpanded, activeTab, setActiveTab } = useUiStore();
  const { logout, user } = useAuthStore();
  const { recipients } = useRecipientStore();

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNav = (tabId, path) => {
    setActiveTab(tabId);
    navigate(path);
    if (isMobile) {
      setSidebarExpanded(false);
    }
  };

  const isEnabled = (flagKey) => {
    const flags = user?.featureFlags || user?.toggles || {};
    return flags[flagKey] === true;
  };

  const navGroups = [];

  // 1. Management Group
  const managementItems = [
    { id: 'browse', label: 'Browse Curation', icon: Gift, path: '/' }, // Default route — always visible
  ];
  if (user) {
    managementItems.push({ id: 'orders', label: 'My Orders', icon: Package, path: '/orders' });
  }
  if (isEnabled('dashboard')) {
    managementItems.push({ id: 'dashboard', label: 'Metrics Dashboard', icon: LayoutDashboard, path: '/dashboard' });
  }
  if (isEnabled('recipientVault')) {
    managementItems.push({ id: 'recipients', label: 'Relationship Vault', icon: Users, path: '/recipients' });
  }
  if (isEnabled('occasionCalendar')) {
    managementItems.push({ id: 'calendar', label: 'Occasion Calendar', icon: Calendar, path: '/calendar' });
  }
  if (isEnabled('budgetPlanner')) {
    managementItems.push({ id: 'budget', label: 'Budget Planner', icon: BarChart3, path: '/budget' });
  }
  if (isEnabled('futureLocker')) {
    managementItems.push({ id: 'futurelocker', label: 'Future Locker', icon: ClipboardList, path: '/futurelocker' });
  }
  navGroups.push({
    title: 'Management',
    items: managementItems
  });

  // 2. AI Concierge Group
  if (isEnabled('aiAssistant')) {
    navGroups.push({
      title: 'AI Concierge',
      items: [
        { id: 'gpt', label: 'GiftGPT Advisor', icon: MessageSquareText, path: '/giftgpt' },
        { id: 'quiz', label: 'Gift Finder Quiz', icon: Sparkles, path: '/quiz' },
        { id: 'detective', label: 'AI Gift Detective', icon: SearchCode, path: '/detective' }
      ]
    });
  }

  // 3. Shopping & Emotions (only if AI features are on)
  if (isEnabled('aiAssistant')) {
    navGroups.push({
      title: 'Shopping',
      items: [
        { id: 'emotions', label: 'Emotion Search', icon: HeartHandshake, path: '/emotions' }
      ]
    });
  }

  // 4. Social & Co-op Group
  const socialItems = [];
  if (isEnabled('groupGifting')) {
    socialItems.push({ id: 'wishlists', label: 'Wishlists', icon: Heart, path: '/wishlists' });
    socialItems.push({ id: 'groupgift', label: 'Group Gifting', icon: UsersRound, path: '/groupgifting' });
  }
  if (isEnabled('secretSanta')) {
    socialItems.push({ id: 'secret-santa', label: 'Secret Santa', icon: Gamepad2, path: '/secretsanta' });
  }
  if (isEnabled('giftStories')) {
    socialItems.push({ id: 'stories', label: 'Gift Stories', icon: PlaySquare, path: '/stories' });
  }
  if (socialItems.length > 0) {
    navGroups.push({
      title: 'Social & Co-op',
      items: socialItems
    });
  }

  // 5. Admin Panel Section
  if (user?.role === 'ADMIN') {
    navGroups.push({
      title: 'Admin Panel',
      items: [
        { id: 'admin-catalog', label: 'Manage Catalog', icon: ClipboardList, path: '/admin/catalog' },
        { id: 'admin-users', label: 'Manage Users', icon: Users, path: '/admin/users' },
        { id: 'admin-cms', label: 'Content Management', icon: ClipboardList, path: '/admin/cms' },
        { id: 'admin-orders', label: 'Verify Payments', icon: CreditCard, path: '/admin/orders' },
        { id: 'admin-analytics', label: 'Sales Analytics', icon: BarChart3, path: '/admin/analytics' }
      ]
    });
  }


  // Calculate overall relationship health score
  const overallHealth = Math.round(
    recipients.reduce((acc, curr) => acc + curr.relationshipScore, 0) / (recipients.length || 1)
  );

  const sidebarVariants = {
    mobile: {
      x: sidebarExpanded ? 0 : -320,
      width: 280,
      transition: { type: 'spring', damping: 25, stiffness: 200 }
    },
    desktop: {
      x: 0,
      width: sidebarExpanded ? 280 : 80,
      transition: { type: 'spring', damping: 20, stiffness: 200 }
    }
  };

  return (
    <motion.aside
      animate={isMobile ? 'mobile' : 'desktop'}
      variants={sidebarVariants}
      style={{
        background: 'rgba(12, 18, 32, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid var(--glass-border)',
        height: '100vh',
        position: isMobile ? 'fixed' : 'sticky',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 1001
      }}
    >
      {/* Sidebar Header */}
      <div 
        style={{
          padding: '24px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarExpanded ? 'space-between' : 'center',
          borderBottom: '1px solid var(--glass-border)'
        }}
      >
        {sidebarExpanded ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => handleNav('browse', '/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer'
            }}
          >
            <div 
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '2px solid var(--brand-gold)',
                background: 'linear-gradient(135deg, var(--brand-rose-gold) 0%, #a05a63 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px var(--brand-rose-gold-glow)'
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 800, fontFamily: 'serif', color: 'var(--brand-cream)', letterSpacing: '0.5px' }}>LH</span>
            </div>
            <span 
              style={{
                fontFamily: 'var(--font-title)',
                fontWeight: 700,
                fontSize: '1.15rem',
                background: 'var(--text-gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Louvion Hampers
            </span>
          </motion.div>
        ) : (
          <div 
            onClick={() => handleNav('browse', '/')}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '2px solid var(--brand-gold)',
              background: 'linear-gradient(135deg, var(--brand-rose-gold) 0%, #a05a63 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px var(--brand-rose-gold-glow)',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 800, fontFamily: 'serif', color: 'var(--brand-cream)', letterSpacing: '0.5px' }}>LH</span>
          </div>
        )}

        <button
          onClick={toggleSidebar}
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '4px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: sidebarExpanded ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* Navigation Groups */}
      <div 
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
        className="custom-scrollbar"
      >
        {navGroups.map((group, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {sidebarExpanded && (
              <span 
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--text-muted)',
                  paddingLeft: '12px',
                  marginBottom: '6px'
                }}
              >
                {group.title}
              </span>
            )}
            
            {group.items.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id, item.path)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: sidebarExpanded ? '12px' : '0px',
                    justifyContent: sidebarExpanded ? 'flex-start' : 'center',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected 
                      ? 'linear-gradient(135deg, rgba(157, 78, 221, 0.15) 0%, rgba(247, 37, 133, 0.05) 100%)' 
                      : 'transparent',
                    border: '1px solid',
                    borderColor: isSelected ? 'rgba(157, 78, 221, 0.25)' : 'transparent',
                    color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                    transition: 'var(--transition-fast)',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <Icon size={18} style={{ color: isSelected ? 'var(--color-primary)' : 'inherit' }} />
                  {sidebarExpanded && (
                    <span style={{ fontSize: '0.88rem', fontWeight: isSelected ? 600 : 500 }}>
                      {item.label}
                    </span>
                  )}
                  {isSelected && !sidebarExpanded && (
                    <div 
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '25%',
                        height: '50%',
                        width: '3px',
                        background: 'var(--color-primary)',
                        borderRadius: '3px 0 0 3px'
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div 
        style={{
          borderTop: '1px solid var(--glass-border)',
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        {/* Relationship Score Badge */}
        {sidebarExpanded && user && (
          <div 
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div className="flex-between">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Relationship Health</span>
              <span 
                style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 600, 
                  color: overallHealth >= 80 ? 'var(--color-success)' : 'var(--color-warning)' 
                }}
              >
                {overallHealth}%
              </span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '2px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  width: `${overallHealth}%`, 
                  height: '100%', 
                  background: `linear-gradient(90deg, var(--color-secondary) 0%, var(--color-success) 100%)` 
                }} 
              />
            </div>
          </div>
        )}

        {/* User Card & Logout / Login */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarExpanded ? 'space-between' : 'center', gap: '8px', width: '100%' }}>
          {user ? (
            sidebarExpanded ? (
              <>
                <div 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                  onClick={() => handleNav('settings', '/settings')}
                >
                  <AnimatedAvatar src={user?.avatar} name={user?.name || 'MEMBER'} size="sm" />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>{user?.name || 'MEMBER'}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--color-primary)' }}>Premium Concierge</span>
                  </div>
                </div>
                <button
                  onClick={() => { logout(); navigate('/login'); }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-danger)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <button
                onClick={() => { logout(); navigate('/login'); }}
                style={{
                  background: 'rgba(255, 0, 127, 0.05)',
                  border: '1px solid rgba(255, 0, 127, 0.15)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-danger)',
                  cursor: 'pointer',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'var(--transition-fast)'
                }}
              >
                <LogOut size={16} />
              </button>
            )
          ) : (
            sidebarExpanded ? (
              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 16px',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'center',
                  boxShadow: '0 0 10px var(--color-primary-glow)',
                  transition: 'var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
              >
                <LogIn size={16} />
                <span>Sign In</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'rgba(157, 78, 221, 0.15)',
                  border: '1px solid rgba(157, 78, 221, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-primary)',
                  cursor: 'pointer',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(157, 78, 221, 0.25)';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(157, 78, 221, 0.15)';
                  e.currentTarget.style.color = 'var(--color-primary)';
                }}
              >
                <LogIn size={16} />
              </button>
            )
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
