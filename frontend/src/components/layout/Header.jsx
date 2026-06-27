import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, Search, Calendar, Briefcase, User, ChevronDown, 
  MessageSquareText, Sparkles, BarChart3, Heart, 
  UsersRound, Gamepad2, PlaySquare, Package, LogOut, Settings, 
  ClipboardList, SearchCode, HeartHandshake, Truck,
  Sun, Moon, Download
} from 'lucide-react';
import { useGiftStore } from '../../store/giftStore';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';


const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, searchTerm, setSearchTerm, selectedCategory, setSelectedCategory } = useGiftStore();
  const { user, logout, isAuthenticated } = useAuthStore();
  const {
    addToast,
    theme,
    setTheme,
    deferredPrompt,
    isInstallable,
    setDeferredPrompt,
    setIsInstallable,
    navCategories
  } = useUiStore();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [userPincode, setUserPincode] = useState(localStorage.getItem('user_pincode') || '');

  const userMenuRef = useRef(null);
  const moreMenuRef = useRef(null);

  const totalCartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  // Cycling search placeholder to mimic FNP's dynamic feel
  const [placeholderText, setPlaceholderText] = useState("Search premium gifts, hampers, flowers...");
  useEffect(() => {
    const placeholders = [
      "Personalised Photo Frames",
      "Birthday Chocolate Cakes",
      "Father's Day Special Hampers",
      "Fresh Rose Bouquets",
      "Gourmet Luxury Gift Baskets",
      "Succulent Indoor Plants"
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % placeholders.length;
      setPlaceholderText(placeholders[idx]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false);
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) setShowMoreMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isEnabled = (flagKey) => {
    if (!user) return false;
    const flags = user.featureFlags || user.toggles || {};
    return flags[flagKey] === true;
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/login');
  };

  const handleLocationClick = () => {
    const pincode = prompt("Enter your delivery pincode (6 digits):", "400001");
    if (pincode && pincode.trim().length === 6) {
      addToast(`Delivery location set to: ${pincode}`, 'success');
      localStorage.setItem("user_pincode", pincode);
      setUserPincode(pincode);
    } else if (pincode !== null) {
      addToast("Please enter a valid 6-digit pincode.", "warning");
    }
  };

  // PWA Install handler
  const handlePwaInstall = async () => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

    if (isStandalone) {
      addToast('Louvion Hampers is already installed.', 'info');
      return;
    }

    if (!deferredPrompt) {
      addToast('Install is not available yet. Refresh once, then tap Install App again.', 'warning');
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      setDeferredPrompt(null);
      setIsInstallable(false);

      if (outcome === 'accepted') {
        addToast('Thank you for installing Louvion Hampers!', 'success');
      } else {
        addToast('Install cancelled. You can try again from the browser install icon.', 'info');
      }
    } catch (err) {
      console.error('PWA install error:', err);
      setDeferredPrompt(null);
      setIsInstallable(false);
      addToast('Could not start app install. Try the browser install icon.', 'error');
    }
  };

  // Build nav items for the "More" dropdown
  const moreNavItems = [
    { label: 'AI Gift Advisor', path: '/giftgpt', icon: MessageSquareText, show: isAuthenticated && isEnabled('aiAssistant') },
    { label: 'Gift Finder Quiz', path: '/quiz', icon: Sparkles, show: isAuthenticated && isEnabled('aiAssistant') },
    { label: 'AI Detective', path: '/detective', icon: SearchCode, show: isAuthenticated && isEnabled('aiAssistant') },
    { label: 'Emotion Search', path: '/emotions', icon: HeartHandshake, show: isAuthenticated && isEnabled('aiAssistant') },
    { label: 'Budget Planner', path: '/budget', icon: BarChart3, show: isAuthenticated && isEnabled('budgetPlanner') },
    { label: 'Wishlists', path: '/wishlists', icon: Heart, show: isAuthenticated && isEnabled('groupGifting') },
    { label: 'Group Gifting', path: '/groupgifting', icon: UsersRound, show: isAuthenticated && isEnabled('groupGifting') },
    { label: 'Secret Santa', path: '/secretsanta', icon: Gamepad2, show: isAuthenticated && isEnabled('secretSanta') },
    { label: 'Gift Stories', path: '/stories', icon: PlaySquare, show: isAuthenticated && isEnabled('giftStories') },
    { label: 'Recipients', path: '/recipients', icon: User, show: isAuthenticated && isEnabled('recipientVault') },
    { label: 'Future Locker', path: '/futurelocker', icon: ClipboardList, show: isAuthenticated && isEnabled('futureLocker') },
  ].filter(i => i.show);

  // Dynamic categories from store (filtered for visible ones)
  const visibleCategories = navCategories.filter(item => item.visible);

  return (
    <header
      className="lh-site-header"
      style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid #eaeaea',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
        position: 'sticky',
        top: 0,
        zIndex: 999,
        color: 'var(--text-primary)'
      }}
    >
      {/* 2. Main Header Row */}
      <div
        className="lh-header-main"
        style={{
          height: '72px',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}
      >
        {/* Left: Logo + Deliver to */}
        <div className="lh-header-left" style={{ display: 'flex', alignItems: 'center', gap: '24px', flexShrink: 0 }}>
          {/* Brand Logo */}
          <div
            className="lh-brand"
            onClick={() => { setSelectedCategory('All'); setSearchTerm(''); navigate('/'); }} 
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <img
              className="lh-brand-logo"
              src="/logo.jpg" 
              alt="Louvion Hampers Logo" 
              style={{
                height: '46px',
                width: 'auto',
                objectFit: 'contain',
                borderRadius: '6px'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* Fallback Monogram */}
            <div style={{ display: 'none', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                border: '2px solid var(--brand-gold)',
                background: 'linear-gradient(135deg, var(--brand-rose-gold) 0%, #a05a63 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: '12px', fontWeight: 800, fontFamily: 'serif', color: 'var(--brand-cream)' }}>LH</span>
              </div>
              <span style={{ fontFamily: 'Georgia, serif', fontWeight: 800, fontSize: '1.05rem', color: 'var(--brand-rose-gold)' }}>
                Louvion Hampers
              </span>
            </div>
          </div>

          {/* India Flag Location Selector */}
          <div
            className="lh-delivery-selector"
            onClick={handleLocationClick}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '15px', borderRadius: '2px', overflow: 'hidden', border: '1px solid #eaeaea', flexShrink: 0 }}>
              <svg viewBox="0 0 9 6" width="22" height="15">
                <rect width="9" height="2" fill="#FF9933" />
                <rect y="2" width="9" height="2" fill="#FFFFFF" />
                <rect y="4" width="9" height="2" fill="#138808" />
                <circle cx="4.5" cy="3" r="0.7" fill="#000080" />
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)', lineHeight: 1 }}>Where to deliver?</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-rose-gold)', display: 'flex', alignItems: 'center', gap: '2px', marginTop: '2px' }}>
                {userPincode || 'Location missing'}
                <ChevronDown size={10} />
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search */}
        <div className="lh-search" style={{ flex: 1, maxWidth: '420px', position: 'relative' }}>
          <input
            type="text"
            placeholder={placeholderText}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px 10px 38px',
              background: 'var(--bg-primary)',
              border: '1px solid var(--glass-border)',
              borderRadius: '30px',
              fontSize: '0.82rem',
              color: 'var(--text-primary)',
              outline: 'none',
              transition: 'border 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--brand-rose-gold)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
          />
          <Search size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>

        {/* Right: Actions */}
        <div className="lh-actions" style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
          
          {/* Download App (PWA) Button */}
          <button
            type="button"
            className="hide-on-mobile"
            onClick={handlePwaInstall}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              transition: 'color 0.2s',
              opacity: isInstallable ? 1 : 0.72,
              border: 'none',
              background: 'transparent',
              padding: 0,
              fontFamily: 'inherit'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--brand-rose-gold)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            title={isInstallable ? 'Install Louvion Hampers' : 'Install App'}
            aria-label="Install Louvion Hampers app"
          >
            <Download size={18} />
            <span style={{ fontSize: '0.62rem', fontWeight: 600, marginTop: '4px' }}>Install App</span>
          </button>

          {/* Theme Switcher Button */}
          <div 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: 'var(--text-secondary)', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--brand-rose-gold)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <span style={{ fontSize: '0.62rem', fontWeight: 600, marginTop: '4px' }}>Theme</span>
          </div>

          {/* My Reminders */}
          <div 
            className="hide-on-mobile"
            onClick={() => navigate('/calendar')}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: 'var(--text-secondary)', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--brand-rose-gold)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <Calendar size={18} />
            <span style={{ fontSize: '0.62rem', fontWeight: 600, marginTop: '4px' }}>My Reminders</span>
          </div>

          {/* Currency (INR) */}
          <div 
            className="hide-on-mobile"
            onClick={() => addToast('Currently only INR (₹) is supported for corporate gifting.', 'info')}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--brand-rose-gold)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            title="Change Currency"
          >
            <div style={{ fontSize: '0.9rem', fontWeight: 800, height: '18px', display: 'flex', alignItems: 'center' }}>₹</div>
            <span style={{ fontSize: '0.62rem', fontWeight: 600, marginTop: '4px' }}>INR</span>
          </div>

          {/* Corporate Dashboard */}
          {isAuthenticated && (
            <div 
              className="hide-on-mobile"
              onClick={() => navigate('/dashboard')}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: 'var(--text-secondary)', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--brand-rose-gold)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <Briefcase size={18} />
              <span style={{ fontSize: '0.62rem', fontWeight: 600, marginTop: '4px' }}>Corporate</span>
            </div>
          )}

          {/* Cart */}
          <div 
            onClick={() => navigate('/checkout')}
            style={{ position: 'relative', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--brand-rose-gold)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <ShoppingCart size={18} />
            <span style={{ fontSize: '0.62rem', fontWeight: 600, marginTop: '4px' }}>Cart</span>
            {totalCartCount > 0 && (
              <span style={{
                position: 'absolute', top: '-6px', right: '4px',
                background: 'var(--brand-rose-gold)', color: '#fff',
                fontSize: '0.55rem', fontWeight: 700,
                width: '15px', height: '15px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 1px 4px rgba(183,110,121,0.4)'
              }}>
                {totalCartCount}
              </span>
            )}
          </div>

          {/* User Account Dropdown */}
          <div ref={userMenuRef} style={{ position: 'relative' }}>
            <div 
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}
            >
              <User size={18} />
              <span style={{ fontSize: '0.62rem', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                Hi {isAuthenticated ? (user?.name?.split(' ')[0] || 'User') : 'Guest'}
                <ChevronDown size={8} />
              </span>
            </div>

            {showUserMenu && (
              <div 
                className="lh-dropdown-menu"
                style={{
                background: 'var(--bg-secondary)', borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                border: '1px solid var(--glass-border)',
                minWidth: '200px', zIndex: 1000,
                padding: '8px 0',
              }}>
                {isAuthenticated ? (
                  <>
                    <button onClick={() => { navigate('/settings'); setShowUserMenu(false); }} style={{ ...dropdownItemStyle, color: 'var(--text-primary)' }}>
                      <Settings size={14} style={{ color: 'var(--brand-rose-gold)' }} /> Settings
                    </button>
                    <button onClick={() => { navigate('/orders'); setShowUserMenu(false); }} style={{ ...dropdownItemStyle, color: 'var(--text-primary)' }}>
                      <Package size={14} style={{ color: 'var(--brand-rose-gold)' }} /> My Orders
                    </button>
                    {user?.role === 'ADMIN' && (
                      <>
                        <div style={{ height: '1px', background: 'var(--glass-border)', margin: '4px 0' }} />
                        <button onClick={() => { navigate('/admin/catalog'); setShowUserMenu(false); }} style={{ ...dropdownItemStyle, color: 'var(--text-primary)' }}>
                          Catalog Mgmt
                        </button>
                        <button onClick={() => { navigate('/admin/hero-carousel'); setShowUserMenu(false); }} style={{ ...dropdownItemStyle, color: 'var(--text-primary)' }}>
                          Hero Carousel
                        </button>
                        <button onClick={() => { navigate('/admin/users'); setShowUserMenu(false); }} style={{ ...dropdownItemStyle, color: 'var(--text-primary)' }}>
                          User Mgmt
                        </button>
                        <button onClick={() => { navigate('/admin/orders'); setShowUserMenu(false); }} style={{ ...dropdownItemStyle, color: 'var(--text-primary)' }}>
                          Verify Payments
                        </button>
                        <button onClick={() => { navigate('/admin/analytics'); setShowUserMenu(false); }} style={{ ...dropdownItemStyle, color: 'var(--text-primary)' }}>
                          Analytics
                        </button>
                      </>
                    )}
                    <div style={{ height: '1px', background: 'var(--glass-border)', margin: '4px 0' }} />
                    <button onClick={handleLogout} style={{ ...dropdownItemStyle, color: '#e53e3e' }}>
                      <LogOut size={14} /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { navigate('/login'); setShowUserMenu(false); }} style={{ ...dropdownItemStyle, color: 'var(--text-primary)' }}>
                      Login
                    </button>
                    <button onClick={() => { navigate('/register'); setShowUserMenu(false); }} style={{ ...dropdownItemStyle, color: 'var(--text-primary)' }}>
                      Create Account
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* More Gifting Tools Dropdown */}
          <div ref={moreMenuRef} style={{ position: 'relative' }}>
            <div 
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: 'var(--text-secondary)', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--brand-rose-gold)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <div style={{ display: 'flex', gap: '2px', alignItems: 'center', height: '18px' }}>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'currentColor' }} />
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'currentColor' }} />
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'currentColor' }} />
              </div>
              <span style={{ fontSize: '0.62rem', fontWeight: 600, marginTop: '4px' }}>More</span>
            </div>

            {showMoreMenu && (
              <div 
                className="lh-dropdown-menu"
                style={{
                background: 'var(--bg-secondary)', borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                border: '1px solid var(--glass-border)',
                minWidth: '220px', zIndex: 1000,
                padding: '8px 0',
              }}>
                {moreNavItems.length > 0 ? (
                  moreNavItems.map((item) => (
                    <button 
                      key={item.path} 
                      onClick={() => { navigate(item.path); setShowMoreMenu(false); }}
                      style={{
                        ...dropdownItemStyle,
                        color: isActive(item.path) ? 'var(--brand-rose-gold)' : 'var(--text-primary)',
                        fontWeight: isActive(item.path) ? 700 : 500
                      }}
                    >
                      <item.icon size={14} style={{ color: 'var(--brand-rose-gold)' }} />
                      {item.label}
                    </button>
                  ))
                ) : (
                  <div style={{ padding: '8px 16px', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    {isAuthenticated ? 'No premium features enabled for your account' : 'Login to access premium gifting features'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Subheader FNP Category Links Row */}
      <div
        style={{
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '46px',
          borderTop: '1px solid var(--glass-border)',
          overflowX: 'auto',
          background: 'var(--bg-secondary)',
          scrollbarWidth: 'none'
        }}
        className="custom-scrollbar"
      >
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', width: '100%', justifyItems: 'space-between', justifyContent: 'space-between' }}>
          {/* Home / Explore All */}
          <button 
            onClick={() => { setSelectedCategory('All'); setSearchTerm(''); navigate('/'); }}
            style={{
              border: 'none',
              background: 'transparent',
              color: selectedCategory === 'All' && !searchTerm ? 'var(--brand-rose-gold)' : 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '0.84rem',
              fontWeight: selectedCategory === 'All' && !searchTerm ? 700 : 600,
              whiteSpace: 'nowrap',
              transition: 'color 0.2s',
              fontFamily: 'inherit'
            }}
          >
            Explore All
          </button>

          {visibleCategories.map((item) => {
            const isSelected = selectedCategory === item.category && !searchTerm;
            return (
              <button
                key={item.label}
                onClick={() => {
                  setSelectedCategory(item.category);
                  setSearchTerm('');
                  navigate('/');
                }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: isSelected ? 'var(--brand-rose-gold)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '0.84rem',
                  fontWeight: isSelected ? 700 : 600,
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'color 0.2s',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--brand-rose-gold)'}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.color = 'var(--text-primary)';
                }}
              >
                {item.label}
                <ChevronDown size={11} style={{ opacity: 0.6 }} />
              </button>
            );
          })}
        </div>
      </div>


    </header>
  );
};

const dropdownItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  padding: '10px 16px',
  border: 'none',
  background: 'transparent',
  fontSize: '0.82rem',
  fontWeight: 500,
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'background 0.15s'
};

export default Header;
