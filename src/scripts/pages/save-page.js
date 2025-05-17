import BookmarkDB from '../utils/bookmark-db'

export default class SavedPage {
  async render() {
    return `
      <section class="container">
        <h1>Story yang Tersimpan</h1>
        <div id="saved-map" style="height: 400px; margin: 20px 0; display: none; border-radius: 8px;"></div>
        <button id="close-saved-map-btn" class="auth-button secondary" style="display: none; margin: 0 0 20px 20px;">Close Map</button>
        <div id="saved-story-list" class="story-container"></div>
      </section>
    `
  }

  async afterRender() {
    const stories = await BookmarkDB.getAllStories()
    this._renderStories(stories)
  }

  _renderStories(stories) {
    const container = document.getElementById('saved-story-list')
    if (!stories.length) {
      container.innerHTML = '<p>Tidak ada story yang disimpan.</p>'
      return
    }

    container.innerHTML = stories
      .map(
        (story) => `
        <style>
            .story-container {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 20px;
            }
        </style>
        <article class="story-card">
          <img src="${story.photoUrl}" alt="${story.description}" class="story-image" loading="lazy">
          <div class="story-content">
            <div class="story-header">
              <h3>${story.name}</h3>
              <span class="story-date">${this._formatDate(story.createdAt)}</span>
            </div>
            <p class="story-description">${story.description}</p>
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
              ${
                story.lat
                  ? `
                <button class="show-location-btn" 
                  data-lat="${story.lat}" 
                  data-lon="${story.lon}"
                  data-description="${story.description}">
                  <i class="map-icon">📍</i> Tampilkan Lokasi
                </button>
              `
                  : ''
              }
              <button class="show-location-btn secondary delete-btn" data-id="${story.id}">
                🗑 Hapus
              </button>
            </div>
          </div>
        </article>
      `
      )
      .join('')

    this._initMapHandlers()
    this._initDeleteHandlers()
  }

  _formatDate(isoString) {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
    return new Date(isoString).toLocaleDateString('id-ID', options)
  }

  _initMapHandlers() {
    const mapDiv = document.getElementById('saved-map')
    const closeMapBtn = document.getElementById('close-saved-map-btn')

    document.querySelectorAll('.show-location-btn[data-lat]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault()

        mapDiv.style.display = 'block'
        closeMapBtn.style.display = 'inline-block'
        window.scrollTo({ top: 0, behavior: 'smooth' })

        if (!window.savedMapInstance) {
          window.savedMapInstance = L.map('saved-map').setView([-6.1754, 106.8272], 13)
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(window.savedMapInstance)
        }

        const lat = parseFloat(btn.dataset.lat)
        const lon = parseFloat(btn.dataset.lon)

        if (window.savedMapInstance.marker) {
          window.savedMapInstance.removeLayer(window.savedMapInstance.marker)
        }

        window.savedMapInstance.marker = L.marker([lat, lon])
          .addTo(window.savedMapInstance)
          .bindPopup(btn.dataset.description)
          .openPopup()

        window.savedMapInstance.setView([lat, lon], 13)

        setTimeout(() => {
            window.savedMapInstance.invalidateSize()
        }, 200)
      })
    })

    closeMapBtn.addEventListener('click', () => {
      mapDiv.style.display = 'none'
      closeMapBtn.style.display = 'none'
    })
  }

  _initDeleteHandlers() {
    document.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id
        await BookmarkDB.deleteStory(id)
        alert('Story dihapus dari bookmark.')
        this.afterRender()
      })
    })
  }
}
