import AddStoryPresenter from './add-story-presenter'

export default class AddStoryPage {
  constructor() {
    this.presenter = new AddStoryPresenter(this)
  }

  async render() {
    return `
      <section class="container">
        <h1>Add New Story</h1>
        <form id="storyForm" class="story-form">
          <div class="form-group">
            <label for="description">Story Description</label>
            <textarea id="description" required placeholder="Share your experience..."></textarea>
          </div>
          
          <div class="form-group">
            <label for="photo">Upload Photo</label>
            <div class="photo-options">
              <button type="button" id="uploadBtn" class="auth-button">Select File</button>
              <button type="button" id="cameraBtn" class="auth-button">Use Camera</button>
              <input type="file" id="photo" accept="image/*" style="display: none;">
              <div id="cameraContainer" style="display: none;">
                <video id="cameraPreview" playsinline></video>
                <button type="button" id="captureBtn" class="auth-button">Capture Photo</button>
                <button type="button" id="cancelCameraBtn" class="auth-button secondary">Cancel</button>
              </div>
            </div>
            <div id="photoPreview" class="photo-preview"></div>
          </div>
          
          <div class="form-group">
            <label>Location (Optional)</label>
            <div id="map" style="height: 300px; margin-bottom: 10px; display: none;"></div>
            <button type="button" id="getLocationBtn" class="auth-button">Select Location</button>
            <div id="locationInfo" class="location-info"></div>
          </div>
          
          <button type="submit" class="auth-button">Submit Story</button>
        </form>
      </section>
    `
  }

  async afterRender() {
    this._initFormHandlers()
    this.presenter.initMap()
    window.addEventListener('hashchange', () => this.presenter.stopCamera())
  }

  _initFormHandlers() {
    const form = document.getElementById('storyForm')
    const uploadBtn = document.getElementById('uploadBtn')
    const cameraBtn = document.getElementById('cameraBtn')
    const photoInput = document.getElementById('photo')
    const cameraPreview = document.getElementById('cameraPreview')
    const captureBtn = document.getElementById('captureBtn')
    const cancelCameraBtn = document.getElementById('cancelCameraBtn')
    const getLocationBtn = document.getElementById('getLocationBtn')
    const photoPreview = document.getElementById('photoPreview')

    uploadBtn.addEventListener('click', () => photoInput.click())

    photoInput.addEventListener('change', e => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = event => {
        photoPreview.innerHTML = `<img src="${event.target.result}" style="max-width:100%; border-radius:8px;">`
        this.presenter.capturedPhoto = null
      }
      reader.readAsDataURL(file)
    })

    cameraBtn.addEventListener('click', () => {
      uploadBtn.style.display = 'none'
      photoInput.style.display = 'none'
      document.getElementById('cameraContainer').style.display = 'block'
      this.presenter.startCamera(cameraPreview)
    })

    captureBtn.addEventListener('click', () => {
      this.presenter.capturePhoto(cameraPreview, photoPreview)
      uploadBtn.style.display = 'block'
      document.getElementById('cameraContainer').style.display = 'none'
    })

    cancelCameraBtn.addEventListener('click', () => {
      this.presenter.stopCamera()
      uploadBtn.style.display = 'block'
      document.getElementById('cameraContainer').style.display = 'none'
    })

    getLocationBtn.addEventListener('click', () => {
      document.getElementById('map').style.display = 'block'
      document.getElementById('locationInfo').innerText =
        'Click on the map to select location'
      setTimeout(() => this.presenter.map.invalidateSize(), 300)
    })

    form.addEventListener('submit', async e => {
      e.preventDefault()
      try {
        const description = document.getElementById('description').value
        const photoFile = photoInput.files[0]
        await this.presenter.submitStory(description, photoFile)
      } catch (err) {
        alert('Failed to add story: ' + err.message)
      }
    })
  }

  showLoading() {
    const btn = document.querySelector('#storyForm button[type="submit"]')
    if (btn) {
      btn.textContent = 'Uploading...'
      btn.disabled = true
    }
  }

  hideLoading() {
    const btn = document.querySelector('#storyForm button[type="submit"]')
    if (btn) {
      btn.textContent = 'Submit Story'
      btn.disabled = false
    }
  }

  onStoryAdded() {
    alert('Story added successfully!')
    window.location.hash = '#/home'
  }

  onError(errorMessage) {
    alert('Failed to add story: ' + errorMessage)
  }

  updateLocationInfo(latlng) {
    document.getElementById('locationInfo').innerText = `
      Selected Location:
      Latitude: ${latlng.lat.toFixed(4)},
      Longitude: ${latlng.lng.toFixed(4)}
    `
  }
}
