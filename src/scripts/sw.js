self.addEventListener('push', (event) => {
  console.log('Push event received:', event)

  let data = {}
  try {
    data = event.data.json()
  } catch (err) {
    console.error('Push event data is not valid JSON', err)
  }

  const title = data.title || 'Notifikasi Baru'
  const options = data.options || {
    body: 'Ada notifikasi baru untuk Anda.',
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})

const CACHE_NAME = 'story-app-v1';
const APP_SHELL = [
  '/ShareYourStoryapp/',
  '/ShareYourStoryapp/index.html',
  '/ShareYourStoryapp/app.css',
  '/ShareYourStoryapp/app.bundle.js',
  '/ShareYourStoryapp/app.webmanifest',
  '/ShareYourStoryapp/images/logo.png',
  '/ShareYourStoryapp/images/logo-bookmark.png',
];

self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching app shell...');
      return cache.addAll(APP_SHELL);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if found, otherwise fetch from network
      return cachedResponse || fetch(event.request).catch(() => {
        // Fallback kalau offline dan request gagal
        if (event.request.destination === 'document') {
          return caches.match('/'); // fallback ke halaman utama
        }
      });
    })
  );
});

