import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Heart, Info, Filter, ShoppingBag, ArrowRight, Truck, Sparkles, 
  ChevronLeft, ChevronRight, LayoutDashboard, MessageSquareText, Calendar, 
  BarChart3, HeartHandshake, UsersRound, Gamepad2, PlaySquare, SearchCode,
  ClipboardList, User, CreditCard, Gift, Package, Star, ChevronDown, ChevronUp, CheckCircle
} from 'lucide-react';
import { useGiftStore } from '../store/giftStore';
import { useUiStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import api from '../services/api';

const GiftBrowsePage = () => {
  const navigate = useNavigate();
  const { catalog, fetchCatalog, searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, addToCart } = useGiftStore();
  const { addToast, navCategories } = useUiStore();
  const { isAuthenticated, user } = useAuthStore();

  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselSlides = [
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

  // Occasions tab filtering
  const occasionTabs = navCategories && navCategories.length > 0 
    ? ['All', ...navCategories.map(cat => cat.label)] 
    : ['All', "Father's Day", "Birthday", "Anniversary", "Love N Romance", "Wedding", "Congratulations", "Thank You"];
  const [activeOccasionTab, setActiveOccasionTab] = useState('All');

  // Catalog Filters State
  const [minPrice, setMinPrice] = useState(100);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState('Recommended');
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  
  // Collapsible Filters State
  const [isPriceCollapsed, setIsPriceCollapsed] = useState(false);
  const [isGiftTypeCollapsed, setIsGiftTypeCollapsed] = useState(false);
  const [isFlowerTypeCollapsed, setIsFlowerTypeCollapsed] = useState(false);
  const [isOccasionCollapsed, setIsOccasionCollapsed] = useState(false);

  // Filter Values
  const [selectedGiftType, setSelectedGiftType] = useState('All');
  const [selectedFlowerType, setSelectedFlowerType] = useState('All');
  const [selectedOccasionFilter, setSelectedOccasionFilter] = useState('All');
  const [favFlowers, setFavFlowers] = useState([]);

  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  useEffect(() => {
    // Fetch Fav Flowers from API
    const fetchFlowers = async () => {
      try {
        const { data } = await api.get('/flowers?activeOnly=true');
        setFavFlowers(data);
      } catch (err) {
        console.error('Failed to fetch flowers', err);
      }
    };
    fetchFlowers();
  }, []);

  // Carousel autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselSlides.length]);

  const categories = ['All', 'Home & Living', 'Stationery', 'Fragrance', 'Self Care', 'Travel', 'Technology', 'Fine Wine & Spirits', 'Soft Toys', 'Traditional Gifts'];

  // Subcategories circular pills data
  const subcategoryPills = [
    { label: 'Cakes', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=150' },
    { label: 'Flowers', image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=150' },
    { label: 'Plants', image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=150' },
    { label: 'Chocolates', image: '/chocolates_gift.png' },
    { label: 'Personalised', image: '/personalized_gift.png' },
    { label: 'Gift Hampers', image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=150' },
    { label: 'Combos', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=150' },
    { label: 'LUXE', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=150' }
  ];

  // Filters logic
  const filteredCatalog = catalog.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = (selectedSubcategory === 'All') ? true : (selectedCategory === 'All' || item.category === selectedCategory);
    
    // Price Range Filter
    const matchesPrice = item.price >= minPrice && item.price <= maxPrice;

    // Gift Type Filter
    let matchesGiftType = true;
    if (selectedGiftType !== 'All') {
      if (selectedGiftType === 'Digital') matchesGiftType = item.isDigital;
      if (selectedGiftType === 'Experience') matchesGiftType = item.isExperience;
      if (selectedGiftType === 'Physical') matchesGiftType = !item.isDigital && !item.isExperience;
    }

    // Flower Type Filter
    let matchesFlowerType = true;
    if (selectedFlowerType !== 'All') {
      matchesFlowerType = item.name.toLowerCase().includes(selectedFlowerType.toLowerCase()) ||
                          item.description.toLowerCase().includes(selectedFlowerType.toLowerCase());
    }

    // Occasion Filter
    let matchesOccasion = true;
    if (selectedOccasionFilter !== 'All') {
      matchesOccasion = item.name.toLowerCase().includes(selectedOccasionFilter.toLowerCase()) ||
                        item.description.toLowerCase().includes(selectedOccasionFilter.toLowerCase()) ||
                        (item.tags && item.tags.some(t => t.toLowerCase() === selectedOccasionFilter.toLowerCase()));
    }

    // Subcategory circular pill filter
    let matchesSubcategory = true;
    if (selectedSubcategory !== 'All') {
      matchesSubcategory = item.name.toLowerCase().includes(selectedSubcategory.toLowerCase()) ||
                           item.description.toLowerCase().includes(selectedSubcategory.toLowerCase()) ||
                           item.category.toLowerCase().includes(selectedSubcategory.toLowerCase()) ||
                           (item.subcategory && item.subcategory.toLowerCase().includes(selectedSubcategory.toLowerCase()));
    }

    return matchesSearch && matchesCategory && matchesPrice && matchesGiftType && matchesFlowerType && matchesOccasion && matchesSubcategory;
  });

  // Sort logic
  const sortedCatalog = [...filteredCatalog].sort((a, b) => {
    if (sortBy === 'LowToHigh') return a.price - b.price;
    if (sortBy === 'HighToLow') return b.price - a.price;
    if (sortBy === 'Rating') return (b.rating || 0) - (a.rating || 0);
    return 0; // 'Recommended' (original order)
  });

  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (item.stock <= 0) {
      addToast(`${item.name} is currently out of stock.`, 'warning');
      return;
    }
    addToCart(item, 1);
    addToast(`Added ${item.name} to cart.`, 'success');
  };

  const selectQuickFilter = (categoryName) => {
    setSelectedCategory(categoryName);
    setSelectedSubcategory('All');
  };

  const isEnabled = (flagKey) => {
    if (!user) return false;
    const flags = user.featureFlags || user.toggles || {};
    return flags[flagKey] !== false;
  };

  // Feature cards data
  const featureCards = [
    { title: 'AI Gift Advisor', desc: 'Get personalized gift suggestions powered by AI', icon: MessageSquareText, path: '/giftgpt', color: '#8b5cf6', show: isAuthenticated && isEnabled('aiAssistant') },
    { title: 'Gift Finder Quiz', desc: 'Answer questions to find the perfect gift', icon: Sparkles, path: '/quiz', color: '#f59e0b', show: isAuthenticated && isEnabled('aiAssistant') },
    { title: 'AI Gift Detective', desc: 'Analyze social profiles for gift insights', icon: SearchCode, path: '/detective', color: '#06b6d4', show: isAuthenticated && isEnabled('aiAssistant') },
    { title: 'Emotion Search', desc: 'Find gifts by the emotions they evoke', icon: HeartHandshake, path: '/emotions', color: '#ec4899', show: isAuthenticated && isEnabled('aiAssistant') },
    { title: 'Metrics Dashboard', desc: 'Track your gifting stats and performance', icon: LayoutDashboard, path: '/dashboard', color: '#3b82f6', show: isAuthenticated && isEnabled('dashboard') },
    { title: 'Occasion Calendar', desc: 'Never miss a birthday or anniversary', icon: Calendar, path: '/calendar', color: '#10b981', show: isAuthenticated && isEnabled('occasionCalendar') },
    { title: 'Budget Planner', desc: 'Plan and optimize your gifting budget', icon: BarChart3, path: '/budget', color: '#f97316', show: isAuthenticated && isEnabled('budgetPlanner') },
    { title: 'Relationship Vault', desc: 'Store gift preferences for every person', icon: User, path: '/recipients', color: '#6366f1', show: isAuthenticated && isEnabled('recipientVault') },
    { title: 'Wishlists', desc: 'Create & share collaborative wishlists', icon: Heart, path: '/wishlists', color: '#ef4444', show: isAuthenticated && isEnabled('groupGifting') },
    { title: 'Group Gifting', desc: 'Pool money together for bigger gifts', icon: UsersRound, path: '/groupgifting', color: '#14b8a6', show: isAuthenticated && isEnabled('groupGifting') },
    { title: 'Secret Santa', desc: 'Organize Secret Santa events easily', icon: Gamepad2, path: '/secretsanta', color: '#e11d48', show: isAuthenticated && isEnabled('secretSanta') },
    { title: 'Gift Stories', desc: 'Share and discover gifting stories', icon: PlaySquare, path: '/stories', color: '#a855f7', show: isAuthenticated && isEnabled('giftStories') },
    { title: 'Future Locker', desc: 'Schedule gifts for future occasions', icon: ClipboardList, path: '/futurelocker', color: '#0ea5e9', show: true },
  ].filter(f => f.show);

  const adminCards = [
    { title: 'Manage Catalog', desc: 'Add, edit and manage gift products', icon: ClipboardList, path: '/admin/catalog', color: '#7c3aed' },
    { title: 'Manage Users', desc: 'View and manage user accounts', icon: User, path: '/admin/users', color: '#2563eb' },
    { title: 'Manage Orders', desc: 'Process and track customer orders', icon: Package, path: '/admin/orders', color: '#db2777' },
    { title: 'Store Analytics', desc: 'View sales and performance metrics', icon: BarChart3, path: '/admin/analytics', color: '#059669' },
    { title: 'Fav Flowers', desc: 'Manage the pick their fav flowers section', icon: ClipboardList, path: '/admin/flowers', color: '#f59e0b' },
    { title: 'Coupons', desc: 'Create and manage discount codes', icon: CheckCircle, path: '/admin/coupons', color: '#10b981' }
  ];

  // Determine view mode
  const viewMode = (selectedCategory !== 'All' || searchTerm.trim() !== '') ? 'catalog' : 'home';

  // Dynamic values for catalog reviews details
  const getMockReviewsCount = () => {
    const hash = selectedCategory.charCodeAt(0) + (selectedCategory.charCodeAt(selectedCategory.length - 1) || 0);
    const giftsCount = (hash * 17) % 200 + 45;
    const reviewsCount = hash * 123 + 8200;
    return { giftsCount, reviewsCount };
  };
  const { giftsCount, reviewsCount } = getMockReviewsCount();

  // Filter products for the Tailored section on the home page
  const tailoredProducts = catalog.filter(item => item.category === activeOccasionTab || activeOccasionTab === 'All');

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '0px' }}>
      
      {/* View Switcher Container */}
      {viewMode === 'home' ? (
        /* ==================== HOME PAGE VIEW ==================== */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
          
          {/* Hero Carousel Banner */}
          <div style={{ padding: '20px 24px 0', position: 'relative', height: '380px', width: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', width: '100%', position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>
              {carouselSlides.map((slide, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: currentSlide === idx ? 1 : 0,
                    transition: 'opacity 0.8s ease-in-out',
                    zIndex: currentSlide === idx ? 1 : 0
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(90deg, rgba(29, 29, 29, 0.75) 0%, rgba(29, 29, 29, 0.1) 100%)',
                    zIndex: 2
                  }} />
                  
                  <img
                    src={slide.image}
                    alt={slide.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  <div style={{
                    position: 'absolute',
                    left: '60px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#ffffff',
                    zIndex: 3,
                    maxWidth: '500px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <span style={{ fontSize: '0.72rem', background: 'var(--brand-gold)', color: '#fff', padding: '4px 10px', borderRadius: '4px', alignSelf: 'flex-start', fontWeight: 700, letterSpacing: '1px' }}>
                      {slide.tag}
                    </span>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'Georgia, serif', lineHeight: '1.2', color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.5)', margin: 0 }}>
                      {slide.title}
                    </h2>
                    <p style={{ fontSize: '0.95rem', color: '#e2e8f0', lineHeight: '1.5', margin: 0 }}>
                      {slide.subtitle}
                    </p>
                    <button
                      onClick={() => selectQuickFilter('Traditional Gifts')}
                      style={{
                        background: 'var(--brand-rose-gold)',
                        border: 'none',
                        borderRadius: '30px',
                        padding: '12px 24px',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        width: 'fit-content',
                        marginTop: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(183,110,121,0.4)',
                        transition: 'filter 0.2s'
                      }}
                    >
                      Order Now <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Carousel Arrows */}
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length)}
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 4, background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)}
                style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 4, background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
              >
                <ChevronRight size={20} />
              </button>

              {/* Dots */}
              <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 4 }}>
                {carouselSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    style={{
                      width: currentSlide === idx ? '24px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      border: 'none',
                      background: currentSlide === idx ? 'var(--brand-rose-gold)' : 'rgba(255,255,255,0.5)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Quick Category Circular Links */}
          <div style={{ padding: '32px 24px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-rose-gold)', margin: 0 }}>
                Shop By Categories
              </h2>
              <span style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 600 }}>Fast Dispatch</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '20px', justifyContent: 'space-between' }}>
              {[
                { name: 'Explore All', textInside: 'All', category: 'All' },
                { name: "Father's Day", image: '/fathers_day_gift.png', category: "Father's Day" },
                { name: 'Birthday', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=200', category: 'Birthday' },
                { name: 'Anniversary', image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=200', category: 'Anniversary' },
                { name: 'Love N Romance', image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=200', category: 'Love N Romance' },
                { name: 'Wedding', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=200', category: 'Wedding' },
                { name: 'Congratulations', image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=200', category: 'Congratulations' },
                { name: 'Thank You', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=200', category: 'Thank You' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setActiveOccasionTab(item.category);
                    document.getElementById('tailored-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', textAlign: 'center' }}
                >
                  <div 
                    style={{ 
                      width: '76px', 
                      height: '76px', 
                      borderRadius: '50%', 
                      overflow: 'hidden', 
                      border: item.textInside ? '2px solid var(--brand-rose-gold)' : '2px solid var(--glass-border)', 
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      transition: 'transform 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: item.textInside ? 'rgba(183,110,121,0.06)' : 'transparent',
                      color: 'var(--brand-rose-gold)',
                      fontWeight: 800,
                      fontSize: '1.2rem'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {item.textInside ? (
                      item.textInside
                    ) : (
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </div>
                  <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pick Their Fav Flowers */}
          {favFlowers.length > 0 && (
            <div style={{ padding: '32px 24px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-rose-gold)', margin: 0 }}>
                Pick Their Fav Flowers
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }} className="mobile-scroll-row">
                {favFlowers.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => selectQuickFilter('Fragrance')}
                    style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                    border: '1px solid var(--glass-border)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    background: 'var(--bg-secondary)'
                  }}
                >
                  <div style={{ height: '140px', overflow: 'hidden' }}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} 
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>
                    <div style={{ padding: '8px 4px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {item.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Anniversary Specials Split Banner */}
          <div style={{ padding: '32px 24px 0', display: 'grid', gridTemplateColumns: '4fr 8fr', gap: '24px' }} className="mobile-stack">
            <div 
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #fcebeb 0%, #fae1e1 100%)',
                border: '1px solid #f7d2d2',
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '16px',
                minHeight: '280px',
                position: 'relative'
              }}
            >
              <span style={{ fontSize: '0.8rem', color: '#b76e79', fontWeight: 800 }}>CELEBRATIONS MADE EXTRAORDINARY</span>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', fontWeight: 900, color: 'var(--brand-rose-gold)', lineHeight: '1.3', margin: 0 }}>
                Birthdays Made Special
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#555', margin: 0 }}>
                Joyful, curated gift baskets and custom flower boxes for premium milestone gifting.
              </p>
              <button 
                onClick={() => selectQuickFilter('Traditional Gifts')}
                style={{ width: 'fit-content', border: 'none', background: 'var(--brand-rose-gold)', color: '#fff', padding: '10px 20px', borderRadius: '30px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                Explore <ChevronRight size={14} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }} className="mobile-scroll-row">
              {[
                { name: 'Floral Baskets', image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=250', cat: 'Fragrance' },
                { name: 'Cakes & Treats', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=250', cat: 'Self Care' },
                { name: 'Personalized Mugs', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=250', cat: 'Stationery' },
                { name: 'Green Plants', image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=250', cat: 'Home & Living' },
                { name: 'Premium Sets', image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=250', cat: 'Traditional Gifts' },
                { name: 'Gift Hampers', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=250', cat: 'Self Care' },
                { name: 'Balloon Decors', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=250', cat: 'Traditional Gifts' },
                { name: 'Best Sellers', image: '/personalized_gift.png', cat: 'All' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => selectQuickFilter(item.cat)}
                  style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    border: '1px solid var(--glass-border)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    background: 'var(--bg-secondary)'
                  }}
                >
                  <div style={{ height: '100px', overflow: 'hidden' }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '8px 2px', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabbed Catalog Section */}
          <div id="tailored-section" style={{ padding: '32px 24px 0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 900, color: 'var(--brand-rose-gold)', marginBottom: '4px', marginTop: 0 }}>
                Tailored For Your Occasions
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#718096', margin: 0 }}>Filter luxury curations specifically aligned to your celebration goals.</p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', borderBottom: '1px solid #eee' }} className="custom-scrollbar">
              {occasionTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveOccasionTab(tab)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '30px',
                    background: activeOccasionTab === tab ? 'var(--brand-rose-gold)' : 'var(--bg-tertiary)',
                    border: 'none',
                    color: activeOccasionTab === tab ? '#ffffff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px', marginTop: '10px' }}>
              {tailoredProducts.map((item) => (
                <Card
                  key={item.id}
                  hoverable={true}
                  onClick={() => navigate(isAuthenticated ? `/gifts/${item.id}` : '/login')}
                  style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0px', borderRadius: '16px', overflow: 'hidden', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)' }}
                >
                  <div style={{ height: '220px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                      <Badge variant={item.availability === 'Out of Stock' ? 'danger' : 'success'}>{item.availability}</Badge>
                    </div>
                  </div>
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--brand-rose-gold)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>{item.category}</span>
                      <h3 style={{ fontSize: '0.94rem', fontWeight: 700, lineHeight: 1.4, marginBottom: '6px', color: 'var(--text-primary)', marginTop: 0 }}>{item.name}</h3>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '12px' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--brand-rose-gold)' }}>₹{item.price}</span>
                      <button 
                        onClick={(e) => handleAddToCart(e, item)}
                        style={{ background: 'rgba(183,110,121,0.06)', border: '1px solid rgba(183,110,121,0.2)', color: 'var(--brand-rose-gold)', padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontWeight: 700, fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <ShoppingBag size={13} /> Add
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Gifting Toolkit */}
          {featureCards.length > 0 && (
            <div style={{ padding: '48px 24px 0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 900, color: 'var(--brand-rose-gold)', margin: '0 0 4px' }}>
                  Your Gifting Toolkit
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#718096', margin: 0 }}>All your premium gifting tools in one place</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                {featureCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.path}
                      onClick={() => navigate(card.path)}
                      style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px', borderRadius: '14px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', cursor: 'pointer' }}
                    >
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: card.color + '12', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={20} style={{ color: card.color }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>{card.title}</div>
                        <div style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>{card.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Admin Panel */}
          {user?.role === 'ADMIN' && (
            <div style={{ padding: '40px 24px 0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                  🔐 Admin Control Panel
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Manage your store, users, and orders</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                {adminCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.path}
                      onClick={() => navigate(card.path)}
                      style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px', borderRadius: '14px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', cursor: 'pointer' }}
                    >
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: card.color + '12', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={20} style={{ color: card.color }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>{card.title}</div>
                        <div style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>{card.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      ) : (
        /* ==================== CATALOG VIEW ==================== */
        <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          
          {/* Breadcrumbs */}
          <div style={{ fontSize: '0.78rem', color: '#718096', marginBottom: '20px', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => { setSelectedCategory('All'); setSearchTerm(''); }}>Home</span>
            <span>/</span>
            <span style={{ color: 'var(--brand-rose-gold)', fontWeight: 600 }}>{selectedCategory === 'All' ? 'Search Results' : `${selectedCategory} Gifts Online`}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px' }} className="mobile-stack">
            
            {/* LEFT SIDEBAR: FILTERS PANEL */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Filter size={18} /> Filters
                </span>
                {(minPrice !== 100 || maxPrice !== 5000 || selectedGiftType !== 'All' || selectedFlowerType !== 'All' || selectedOccasionFilter !== 'All' || selectedSubcategory !== 'All') && (
                  <button 
                    onClick={() => { setMinPrice(100); setMaxPrice(5000); setSelectedGiftType('All'); setSelectedFlowerType('All'); setSelectedOccasionFilter('All'); setSelectedSubcategory('All'); }}
                    style={{ border: 'none', background: 'transparent', color: 'var(--brand-rose-gold)', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Collapsible Price Filter */}
              <div style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
                <div 
                  onClick={() => setIsPriceCollapsed(!isPriceCollapsed)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-primary)', marginBottom: '12px' }}
                >
                  Price
                  {isPriceCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </div>
                {!isPriceCollapsed && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* HTML5 Range Slider for Max Price */}
                    <input 
                      type="range"
                      min="100"
                      max="10000"
                      step="100"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--brand-rose-gold)', cursor: 'pointer' }}
                    />
                    
                    {/* Min / Max manual inputs */}
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.65rem', color: '#718096', display: 'block', marginBottom: '4px' }}>Minimum</span>
                        <input 
                          type="number"
                          value={minPrice}
                          onChange={(e) => setMinPrice(Number(e.target.value))}
                          style={{ width: '100%', padding: '6px 10px', border: '1px solid var(--glass-border)', borderRadius: '4px', fontSize: '0.78rem', outline: 'none', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                        />
                      </div>
                      <span style={{ color: '#aaa', marginTop: '16px' }}>-</span>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Maximum</span>
                        <input 
                          type="number"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(Number(e.target.value))}
                          style={{ width: '100%', padding: '6px 10px', border: '1px solid var(--glass-border)', borderRadius: '4px', fontSize: '0.78rem', outline: 'none', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Collapsible Gift Type Filter */}
              <div style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
                <div 
                  onClick={() => setIsGiftTypeCollapsed(!isGiftTypeCollapsed)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-primary)', marginBottom: '12px' }}
                >
                  Gift Type
                  {isGiftTypeCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </div>
                {!isGiftTypeCollapsed && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {['All', 'Physical', 'Digital', 'Experience'].map((type) => (
                      <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        <input 
                          type="radio"
                          name="giftType"
                          checked={selectedGiftType === type}
                          onChange={() => setSelectedGiftType(type)}
                          style={{ accentColor: 'var(--brand-rose-gold)' }}
                        />
                        {type === 'All' ? 'All Types' : type}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Collapsible Flower Type Filter */}
              <div style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
                <div 
                  onClick={() => setIsFlowerTypeCollapsed(!isFlowerTypeCollapsed)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-primary)', marginBottom: '12px' }}
                >
                  Flower Type
                  {isFlowerTypeCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </div>
                {!isFlowerTypeCollapsed && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {['All', 'Roses', 'Orchids', 'Carnations', 'Sunflowers', 'Gerberas'].map((flower) => (
                      <label key={flower} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        <input 
                          type="radio"
                          name="flowerType"
                          checked={selectedFlowerType === flower}
                          onChange={() => setSelectedFlowerType(flower)}
                          style={{ accentColor: 'var(--brand-rose-gold)' }}
                        />
                        {flower === 'All' ? 'All Flowers' : flower}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Collapsible Occasion Filter */}
              <div style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
                <div 
                  onClick={() => setIsOccasionCollapsed(!isOccasionCollapsed)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-primary)', marginBottom: '12px' }}
                >
                  Occasion
                  {isOccasionCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </div>
                {!isOccasionCollapsed && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {['All', "Father's Day", 'Birthday', 'Anniversary', 'Wedding', 'Congratulations', 'Thank You'].map((occ) => (
                      <label key={occ} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        <input 
                          type="radio"
                          name="occasionFilter"
                          checked={selectedOccasionFilter === occ}
                          onChange={() => setSelectedOccasionFilter(occ)}
                          style={{ accentColor: 'var(--brand-rose-gold)' }}
                        />
                        {occ === 'All' ? 'All Occasions' : occ}
                      </label>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT MAIN PANEL: RESULTS LIST */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Category info */}
              <div>
                <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.75rem', fontWeight: 900, color: 'var(--brand-rose-gold)', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {selectedCategory === 'All' ? `Search Results for "${searchTerm}"` : `Memorable ${selectedCategory} Gifts`}
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500, fontFamily: 'sans-serif' }}>
                    ({giftsCount} of {reviewsCount} Gifts | 91734 Reviews)
                  </span>
                </h1>
                
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                  {descriptionExpanded ? (
                    <>
                      Explore our premium, curated selection of {selectedCategory.toLowerCase()} hampers, gift baskets, and handcompiled bouquets. Standard and Instant booking options available. Louvion Hampers provides beautiful wax-sealed greeting cards, fresh ingredients, and reliable logistics booking for all luxury gift orders. Our portal allows you to track and plan your budget easily.
                      <span 
                        onClick={() => setDescriptionExpanded(false)} 
                        style={{ color: 'var(--brand-rose-gold)', fontWeight: 700, marginLeft: '6px', cursor: 'pointer' }}
                      >
                        Read Less
                      </span>
                    </>
                  ) : (
                    <>
                      A carefully curated selection of perfect {selectedCategory.toLowerCase()} gifts awaits at Louvion Hampers. From fresh flowers to gourmet luxury treats...
                      <span 
                        onClick={() => setDescriptionExpanded(true)} 
                        style={{ color: 'var(--brand-rose-gold)', fontWeight: 700, marginLeft: '6px', cursor: 'pointer' }}
                      >
                        Read More
                      </span>
                    </>
                  )}
                </p>
              </div>

              {/* Subcategories Horizontal Scrollable Pills */}
              <div 
                style={{ 
                  display: 'flex', 
                  gap: '16px', 
                  overflowX: 'auto', 
                  paddingBottom: '10px', 
                  borderBottom: '1px solid #f0f0f0',
                  scrollbarWidth: 'none'
                }}
                className="custom-scrollbar"
              >
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {/* All subcategories pill */}
                  <div 
                    onClick={() => setSelectedSubcategory('All')}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                  >
                    <div style={{ 
                      width: '64px', 
                      height: '64px', 
                      borderRadius: '50%', 
                      overflow: 'hidden', 
                      border: '2px solid',
                      borderColor: selectedSubcategory === 'All' ? 'var(--brand-rose-gold)' : 'var(--glass-border)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(183,110,121,0.05)',
                      color: 'var(--brand-rose-gold)',
                      fontWeight: 700,
                      fontSize: '0.8rem'
                    }}>
                      All
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: selectedSubcategory === 'All' ? 'var(--brand-rose-gold)' : 'var(--text-primary)' }}>Explore All</span>
                  </div>

                  {subcategoryPills.map((pill) => {
                    const isSelected = selectedSubcategory === pill.label;
                    return (
                      <div 
                        key={pill.label}
                        onClick={() => setSelectedSubcategory(pill.label)}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                      >
                        <div style={{ 
                          width: '64px', 
                          height: '64px', 
                          borderRadius: '50%', 
                          overflow: 'hidden', 
                          border: '2px solid',
                          borderColor: isSelected ? 'var(--brand-rose-gold)' : 'var(--glass-border)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                          transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                          <img src={pill.image} alt={pill.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: isSelected ? 'var(--brand-rose-gold)' : 'var(--text-primary)' }}>{pill.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sort + Count details */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Showing <strong style={{ color: 'var(--text-primary)' }}>{sortedCatalog.length}</strong> items matching filters
                </span>

                {/* Sort selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      border: '1px solid var(--glass-border)',
                      background: 'var(--bg-secondary)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Recommended">Recommended</option>
                    <option value="LowToHigh">Price: Low to High</option>
                    <option value="HighToLow">Price: High to Low</option>
                    <option value="Rating">Customer Rating</option>
                  </select>
                </div>
              </div>

              {/* Catalog Grid */}
              {sortedCatalog.length === 0 ? (
                <EmptyState 
                  icon={ShoppingBag}
                  title="No items match your filters"
                  description="Try resetting your price range or clearing category tags."
                  actionText="Reset Filters"
                  onAction={() => { setMinPrice(100); setMaxPrice(5000); setSelectedGiftType('All'); setSelectedFlowerType('All'); setSelectedOccasionFilter('All'); setSelectedSubcategory('All'); }}
                />
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                  {sortedCatalog.map((item) => (
                    <Card
                      key={item.id}
                      hoverable={true}
                      onClick={() => navigate(isAuthenticated ? `/gifts/${item.id}` : '/login')}
                      style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        height: '100%', 
                        padding: '0px', 
                        borderRadius: '16px',
                        overflow: 'hidden',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--glass-border)',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.02)'
                      }}
                    >
                      {/* Product image */}
                      <div style={{ height: '200px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />
                        <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                          <Badge variant={item.availability === 'Out of Stock' ? 'danger' : item.availability === 'Low Stock' ? 'warning' : 'success'}>
                            {item.availability}
                          </Badge>
                        </div>
                        {item.rating && (
                          <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(255,255,255,0.9)', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.7rem', fontWeight: 700, color: '#333' }}>
                            <Star size={11} fill="#f59e0b" style={{ color: '#f59e0b' }} />
                            {item.rating}
                          </div>
                        )}
                      </div>

                      {/* Product details */}
                      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
                        <div>
                          <span style={{ fontSize: '0.66rem', textTransform: 'uppercase', color: 'var(--brand-rose-gold)', fontWeight: 700, display: 'block', marginBottom: '2px', letterSpacing: '0.5px' }}>
                            {item.category}
                          </span>
                          <h3 style={{ fontSize: '0.88rem', fontWeight: 700, lineHeight: 1.4, marginBottom: '4px', color: 'var(--text-primary)', marginTop: 0 }}>
                            {item.name}
                          </h3>
                          <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4', margin: 0 }}>
                            {item.description}
                          </p>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '10px' }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--brand-rose-gold)', fontFamily: 'Georgia, serif' }}>
                            ₹{item.price}
                          </span>
                          
                          <button 
                            onClick={(e) => handleAddToCart(e, item)} 
                            style={{
                              background: 'rgba(183,110,121,0.06)',
                              border: '1px solid rgba(183,110,121,0.2)',
                              color: 'var(--brand-rose-gold)',
                              padding: '5px 12px',
                              borderRadius: '20px',
                              cursor: 'pointer',
                              fontWeight: 700,
                              fontSize: '0.74rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--brand-rose-gold)'; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(183,110,121,0.06)'; e.currentTarget.style.color = 'var(--brand-rose-gold)'; }}
                          >
                            <ShoppingBag size={12} />
                            {item.stock <= 0 ? 'Out' : 'Add'}
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* 10. Storefront Footer */}
      <footer style={{ marginTop: '48px', borderTop: '1px solid var(--glass-border)', paddingTop: '32px', paddingLeft: '24px', paddingRight: '24px', paddingBottom: '32px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }} className="mobile-stack">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <img src="/logo.jpg" alt="Louvion Hampers" style={{ height: '40px', width: 'auto', borderRadius: '6px' }} onError={(e) => { e.target.style.display = 'none'; }} />
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--brand-rose-gold)', margin: 0 }}>LOUVION HAMPERS</h4>
            </div>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Premium intra-city gifting service providing luxury baskets and floral arrangements. Automated delivery options integrated with Porter and Rapido.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '12px', marginTop: 0 }}>CUSTOMER SERVICE</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.74rem' }}>
              <li><a href="/orders" onClick={(e) => { e.preventDefault(); navigate('/orders'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Track Your Order</a></li>
              <li><a href="/support" onClick={(e) => { e.preventDefault(); navigate('/support'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>FAQs</a></li>
              <li><a href="/support" onClick={(e) => { e.preventDefault(); navigate('/support'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Contact Us</a></li>
              <li><a href="/support" onClick={(e) => { e.preventDefault(); navigate('/support'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Delivery Terms</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '12px', marginTop: 0 }}>DELIVERY PARTNERS</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
              <li>🚛 Porter Bike & Truck Logistics</li>
              <li>🛵 Rapido Hyperlocal Delivery</li>
              <li>⚡ Automated booking on confirmation</li>
              <li>⏱ Real-time ETA updates</li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '12px', marginTop: 0 }}>STORE HOURS</h4>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
              Admin preferred shipping slots: <strong>Before 8 AM IST</strong> & <strong>After 7 PM IST</strong>. Surcharge applies during regular day shifts.
            </p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--glass-border)', marginTop: '24px', paddingTop: '16px', textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} Louvion Hampers. All rights reserved.
        </div>
      </footer>

    </div>
  );
};

export default GiftBrowsePage;
