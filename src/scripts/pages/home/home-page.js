import HomePresenter from '../../pages/home/home-presenter'

export default class HomePage {
  constructor() {
    this.presenter = new HomePresenter({ view: this })
  }

  async render() {
    return `
      <section class="container">
        <h1>Story List</h1>
        <div id="map" style="height: 400px; margin: 20px; display: none;"></div>
        <button id="close-map-btn" style="display: none; margin: 10px 20px;">Close Map</button>
        <div id="story-list" class="story-container"></div>
      </section>
    `
  }

  async afterRender() {
    this.presenter.init()
  }

  showStories(stories) {
    const container = document.getElementById('story-list')
    container.innerHTML = stories
      .map(
        story => `
      <article class="story-card">
        <img src="${story.photoUrl}" alt="${story.description}" class="story-image">
        <div class="story-content">
          <div class="story-header">
            <h3>${story.name}</h3>
            <span class="story-date">${this._formatDate(story.createdAt)}</span>
          </div>
          <p class="story-description">${story.description}</p>
          ${
            story.lat
              ? `
            <div class="story-actions">
              <button class="show-location-btn" 
                data-lat="${story.lat}" 
                data-lon="${story.lon}"
                data-description="${story.description}">
                <i class="map-icon">📍</i> Show Location
              </button>
              <button class="bookmark-btn" data-id="${story.id}">
                <img src="images/logo-bookmark.png" alt="Bookmark" class="bookmark-icon" />
              </button>
            </div>
          `
              : ''
          }
        </div>
      </article>
    `
      )
      .join('')

    this._initMapHandlers()
    this._initBookmarkHandlers(stories);
  }

  showError(message) {
    document.getElementById('story-list').innerHTML = `
      <p class="error">${message}</p>
    `
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
    const mapDiv = document.getElementById('map')
    const closeMapBtn = document.getElementById('close-map-btn')

    document.querySelectorAll('.show-location-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault()

        mapDiv.style.display = 'block'
        closeMapBtn.style.display = 'inline-block'

        window.scrollTo({ top: 0, behavior: 'smooth' })

        if (!window.mapInstance) {
          window.mapInstance = L.map('map').setView([-6.1754, 106.8272], 13)
          L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          ).addTo(window.mapInstance)
        }

        const lat = parseFloat(btn.dataset.lat)
        const lon = parseFloat(btn.dataset.lon)

        if (window.mapInstance.marker) {
          window.mapInstance.removeLayer(window.mapInstance.marker)
        }

        window.mapInstance.marker = L.marker([lat, lon])
          .addTo(window.mapInstance)
          .bindPopup(btn.dataset.description)
          .openPopup()

        window.mapInstance.setView([lat, lon], 13)
      })
    })

    closeMapBtn.addEventListener('click', () => {
      mapDiv.style.display = 'none'
      closeMapBtn.style.display = 'none'
    })
  }

  _initBookmarkHandlers(stories) {
    document.querySelectorAll('.bookmark-btn').forEach(button => {
      button.addEventListener('click', async (e) => {
        const id = e.currentTarget.dataset.id;
        const story = stories.find(s => s.id === id);

        if (!story) {
          alert('Story tidak ditemukan');
          return;
        }

        try {
          const BookmarkDB = (await import('../../utils/bookmark-db.js')).default;
          await BookmarkDB.saveStory(story);
          alert('Story telah disimpan!');
        } catch (error) {
          console.error('Gagal menyimpan story:', error);
          alert('Gagal menyimpan story');
        }
      });
    });
  }
}
