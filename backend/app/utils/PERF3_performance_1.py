// register-sw.js

/**
 * Register the Service Worker
 * @returns {Promise<void>}
 */
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('Service Worker registered successfully:', registration.scope);
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content is available, notify user
            notifyUserOfUpdate();
          }
        });
      });
      
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
}

/**
 * Notify user of available update
 */
function notifyUserOfUpdate() {
  const updateNotification = document.createElement('div');
  updateNotification.className = 'update-notification';
  updateNotification.innerHTML = `
    <p>New version available!</p>
    <button onclick="window.location.reload()">Refresh</button>
  `;
  document.body.appendChild(updateNotification);
}

// Register SW when page loads
window.addEventListener('load', registerServiceWorker);
