import '../styles/styles.css'
import App from './pages/app'
import { registerServiceWorker } from './utils'
import { urlBase64ToUint8Array } from './utils'
import CONFIG from './config'

const VAPID_PUBLIC_KEY = CONFIG.VAPID_PUBLIC_KEY

function getInitialRoute() {
  const hash = window.location.hash
  const token = localStorage.getItem('token')

  if (!hash || hash === '#/') {
    return token ? '#/home' : '#/login'
  }
  return hash
}

async function initApp() {
  window.location.hash = getInitialRoute()

  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  })

  await app.renderPage()
  updateNavbar()
  await registerServiceWorker()

  window.addEventListener('hashchange', async () => {
    if (document.startViewTransition) {
      document.startViewTransition(async () => {
        await app.renderPage()
        updateNavbar()
        setupPushToggleButton()
      })
    } else {
      await app.renderPage()
      updateNavbar()
      setupPushToggleButton()
    }
  })

  setupPushToggleButton() 
}

function updateNavbar() {
  const navList = document.getElementById('nav-list')
  if (!navList) return

  const currentHash = window.location.hash.substring(1)
  const token = localStorage.getItem('token')

  let path = currentHash
  if (!path || path === '/') {
    path = token ? '/home' : '/login'
  }

  const isAuthPage = ['/', '/login', '/register'].includes(path)

  if (isAuthPage) {
    navList.innerHTML = `
      <div class="nav-left">
        <li><a href="#/login" ${path === '/login' ? 'class="active"' : ''}>Login</a></li>
        <li><a href="#/register" ${path === '/register' ? 'class="active"' : ''}>Register</a></li>
      </div>
    `
  } else if (token) {
    navList.innerHTML = `
      <div class="nav-left">
        <li><a href="#/home" ${path === '/home' ? 'class="active"' : ''}>Home</a></li>
        <li><a href="#/saved" ${path === '/saved' ? 'class="active"' : ''}>Tersimpan</a></li>
        <li><a href="#/add" ${path === '/add' ? 'active' : ''}">+ Tambah Story</a></li>
      </div>
      <div class="nav-right">
        <li><button id="subscribe-btn" aria-label="Toggle Push">🔔</button></li>
        <li><button id="logout-btn">Logout</button></li>
      </div>
    `
    document.getElementById('logout-btn')?.addEventListener('click', e => {
      e.preventDefault()
      localStorage.removeItem('token')
      window.location.hash = '#/login'
    })
  } else {
    navList.innerHTML = `
      <div class="nav-left">
        <li><a href="#/login" ${path === '/login' ? 'class="active"' : ''}>Login</a></li>
        <li><a href="#/register" ${path === '/register' ? 'class="active"' : ''}>Register</a></li>
      </div>
    `
  }
}

async function setupPushToggleButton() {
  const btn = document.getElementById('subscribe-btn')
  if (!btn || !('serviceWorker' in navigator)) return

  try {
    const token = localStorage.getItem('token')
    if (!token) return

    const reg = await navigator.serviceWorker.ready
    const currentSub = await reg.pushManager.getSubscription()

    btn.textContent = currentSub ? 'Unsubscribe' : 'Subscribe'

    btn.onclick = async () => {
  try {
    const latestSub = await reg.pushManager.getSubscription()

    if (latestSub) {
      const endpoint = latestSub.endpoint
      await latestSub.unsubscribe()

      await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ endpoint }),
      })

      btn.textContent = 'Subscribe'
      alert('Berhasil unsubscribe dari notifikasi.')
    } else {
      const newSub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })

      const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: newSub.endpoint,
          keys: {
            p256dh: btoa(String.fromCharCode(...new Uint8Array(newSub.getKey('p256dh')))),
            auth: btoa(String.fromCharCode(...new Uint8Array(newSub.getKey('auth')))),
          },
        }),
      })

      const result = await response.json()
      if (result.error) throw new Error(result.message)

      btn.textContent = 'Unsubscribe'
      alert('Berhasil subscribe ke notifikasi.')
    }
  } catch (err) {
    alert('Gagal toggle notifikasi: ' + err.message)
    console.error(err)
  }
}

  } catch (err) {
    console.error('Gagal setup tombol subscribe:', err)
  }
}

document.addEventListener('DOMContentLoaded', initApp)
