export const registerServiceWorker = () => {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.warn('GiftConcierge service worker registration failed:', error);
    });
  });
};
