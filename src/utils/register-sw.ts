// Register Service Worker for PWA
export function registerServiceWorker() {
  // Only register in production
  if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration.scope)
          
          // Check for updates periodically
          setInterval(() => {
            registration.update()
          }, 60 * 60 * 1000) // Check every hour
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })
    })
  } else if (import.meta.env.DEV && 'serviceWorker' in navigator) {
    // Unregister any existing service workers in development
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister().then((success) => {
          if (success) {
            console.log('Service Worker unregistered for development')
          }
        })
      })
    })
  }
}

