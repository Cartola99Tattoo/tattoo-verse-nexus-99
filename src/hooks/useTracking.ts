
import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getTrackingService } from '@/services/serviceFactory';
import { useAuth } from '@/contexts/AuthContext';

export default function useTracking() {
  const location = useLocation();
  const { user } = useAuth();
  const trackingService = getTrackingService();
  const sessionId = trackingService.getOrCreateSession();
  
  // Track page views automatically
  useEffect(() => {
    trackingService.trackEvent({
      eventType: 'pageView',
      userId: user?.id,
      sessionId,
      path: location.pathname,
      data: {
        pageType: getPageType(location.pathname),
        referrer: document.referrer,
        query: location.search
      }
    });
  }, [location.pathname, location.search, user, sessionId, trackingService]);
  
  // Get page type from URL path
  const getPageType = (path: string) => {
    if (path === '/') return 'home';
    if (path.startsWith('/artists')) return 'artists';
    if (path.startsWith('/blog')) return 'blog';
    if (path.startsWith('/shop')) return 'shop';
    if (path.startsWith('/contact')) return 'contact';
    return 'other';
  };
  
  // Track user interaction
  const trackEvent = useCallback((eventType: 'click' | 'search' | 'filter' | 'appointment' | 'contact' | 'custom', data?: Record<string, any>) => {
    trackingService.trackEvent({
      eventType,
      userId: user?.id,
      sessionId,
      path: location.pathname,
      data
    });
  }, [user, sessionId, location.pathname, trackingService]);
  
  // Track user qualification data
  const updateQualification = useCallback((data: {
    interestedIn?: string[];
    budget?: string;
    timeframe?: string;
    bodyLocation?: string;
    contactPreference?: string;
  }) => {
    if (user?.id) {
      trackingService.updateQualification(user.id, data);
    }
  }, [user, trackingService]);
  
  return {
    trackEvent,
    updateQualification
  };
}
