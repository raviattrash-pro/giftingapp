import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useUiStore } from './store/uiStore';
import { useGiftStore } from './store/giftStore';
import { ToastContainer } from './components/ui/Toast';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import RecipientsPage from './pages/RecipientsPage';
import RecipientDetailPage from './pages/RecipientDetailPage';
import AddRecipientPage from './pages/AddRecipientPage';
import OccasionCalendarPage from './pages/OccasionCalendarPage';
import GiftGPTPage from './pages/GiftGPTPage';
import GiftFinderQuizPage from './pages/GiftFinderQuizPage';
import GiftDetectivePage from './pages/GiftDetectivePage';
import GiftBrowsePage from './pages/GiftBrowsePage';
import GiftDetailPage from './pages/GiftDetailPage';
import GiftCheckoutPage from './pages/GiftCheckoutPage';
import EmotionSearchPage from './pages/EmotionSearchPage';
import BudgetPlannerPage from './pages/BudgetPlannerPage';
import WishlistPage from './pages/WishlistPage';
import GroupGiftPage from './pages/GroupGiftPage';
import SecretSantaPage from './pages/SecretSantaPage';
import GiftStoriesPage from './pages/GiftStoriesPage';
import SettingsPage from './pages/SettingsPage';
import FutureLockerPage from './pages/FutureLockerPage';
import AdminCatalogPage from './pages/admin/AdminCatalogPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminFlowersPage from './pages/admin/AdminFlowersPage';
import AdminCouponsPage from './pages/admin/AdminCouponsPage';
import AdminHeroCarouselPage from './pages/admin/AdminHeroCarouselPage';
import AdminCMSPage from './pages/admin/AdminCMSPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import CustomerServicePage from './pages/CustomerServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsConditionsPage from './pages/TermsConditionsPage';
import CookieBanner from './components/ui/CookieBanner';
import AnalyticsTracker from './components/utils/AnalyticsTracker';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, checkAuth } = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const FeatureRoute = ({ flagKey, children }) => {
  const { user } = useAuthStore();
  const flags = user?.featureFlags || {};
  const isEnabled = flags[flagKey] === true;

  return isEnabled ? children : <Navigate to="/settings" replace />;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuthStore();
  return user?.role === 'ADMIN' ? children : <Navigate to="/dashboard" replace />;
};

const App = () => {
  const { theme, setDeferredPrompt, setIsInstallable, addToast, fetchNavCategories } = useUiStore();
  const { syncPendingOrders } = useGiftStore();

  useEffect(() => {
    fetchNavCategories();
  }, [fetchNavCategories]);

  // Background offline sync
  useEffect(() => {
    syncPendingOrders();
    const interval = setInterval(syncPendingOrders, 30000); // retry every 30s
    return () => clearInterval(interval);
  }, [syncPendingOrders]);

  // 1. Theme application effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.body.style.backgroundColor = '#070b13';
      document.body.style.color = '#ffffff';
    } else {
      document.body.style.backgroundColor = '#fcf6f0';
      document.body.style.color = '#2d3748';
    }
  }, [theme]);

  // 2. PWA event registration effect
  useEffect(() => {
    const isStandalone = () => (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    );

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
      addToast('Louvion Hampers installed successfully.', 'success');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (isStandalone()) {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [addToast, setDeferredPrompt, setIsInstallable]);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {/* Global notifications layer */}
      <ToastContainer />
      <CookieBanner />
      <AnalyticsTracker />

      <Routes>
        {/* Auth Group */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Public Group */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<GiftBrowsePage />} />
          <Route path="/gifts" element={<GiftBrowsePage />} />
          <Route path="/gifts/:id" element={<GiftDetailPage />} />
          <Route path="/support" element={<CustomerServicePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-conditions" element={<TermsConditionsPage />} />
        </Route>

        {/* Core Authenticated Group */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Relationship vault */}
          <Route path="/recipients" element={<RecipientsPage />} />
          <Route path="/recipients/add" element={<AddRecipientPage />} />
          <Route path="/recipients/:id" element={<RecipientDetailPage />} />
          
          {/* Scheduling & financials */}
          <Route path="/calendar" element={<OccasionCalendarPage />} />
          <Route path="/budget" element={<FeatureRoute flagKey="budgetPlanner"><BudgetPlannerPage /></FeatureRoute>} />
          <Route path="/futurelocker" element={<FeatureRoute flagKey="futureLocker"><FutureLockerPage /></FeatureRoute>} />

          {/* AI Advisor tools */}
          <Route path="/giftgpt" element={<FeatureRoute flagKey="aiAssistant"><GiftGPTPage /></FeatureRoute>} />
          <Route path="/quiz" element={<FeatureRoute flagKey="aiAssistant"><GiftFinderQuizPage /></FeatureRoute>} />
          <Route path="/detective" element={<FeatureRoute flagKey="aiAssistant"><GiftDetectivePage /></FeatureRoute>} />

          {/* Shopping catalog */}
          <Route path="/checkout" element={<GiftCheckoutPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/emotions" element={<EmotionSearchPage />} />

          {/* Collaborative features */}
          <Route path="/wishlists" element={<WishlistPage />} />
          <Route path="/groupgifting" element={<FeatureRoute flagKey="groupGifting"><GroupGiftPage /></FeatureRoute>} />
          <Route path="/secretsanta" element={<FeatureRoute flagKey="secretSanta"><SecretSantaPage /></FeatureRoute>} />
          <Route path="/stories" element={<FeatureRoute flagKey="giftStories"><GiftStoriesPage /></FeatureRoute>} />

          {/* Profile / System Settings */}
          <Route path="/settings" element={<SettingsPage />} />

          {/* Admin Panel Sections */}
          <Route path="/admin/catalog" element={<AdminRoute><AdminCatalogPage /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
          <Route path="/admin/analytics" element={<AdminRoute><AdminAnalyticsPage /></AdminRoute>} />
          <Route path="/admin/flowers" element={<AdminRoute><AdminFlowersPage /></AdminRoute>} />
          <Route path="/admin/coupons" element={<AdminRoute><AdminCouponsPage /></AdminRoute>} />
          <Route path="/admin/hero-carousel" element={<AdminRoute><AdminHeroCarouselPage /></AdminRoute>} />
          <Route path="/admin/cms" element={<AdminRoute><AdminCMSPage /></AdminRoute>} />
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
