import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/api';

const getSessionId = () => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

// Expose a function for tracking custom events
export const trackEvent = async (eventType, path, itemId = null, metadata = {}) => {
  try {
    await api.post('/analytics/event', {
      sessionId: getSessionId(),
      eventType,
      path,
      itemId,
      metadata: JSON.stringify(metadata)
    });
  } catch (err) {
    console.error('[Analytics] Failed to send event:', err);
  }
};

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackEvent('PAGE_VIEW', location.pathname + location.search);
  }, [location]);

  return null;
};

export default AnalyticsTracker;
