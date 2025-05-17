import { StoryModel } from '../../models/story-model' 

export default class AddStoryPresenter {
  constructor(view) {
    this.view = view
    this.model = new StoryModel()
    this.selectedLocation = null
    this.mediaStream = null
    this.capturedPhoto = null
    this.marker = null
    this.map = null
  }

  initMap() {
    if (window.mapInstance) {
      window.mapInstance.remove()
      window.mapInstance = null
    }

    this.map = L.map('map').setView([-6.1754, 106.8272], 5)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(
      this.map
    )

    this.map.on('click', e => {
      this.selectedLocation = e.latlng
      this.view.updateLocationInfo(e.latlng)

      if (this.marker) this.map.removeLayer(this.marker)
      this.marker = L.marker(e.latlng)
        .addTo(this.map)
        .bindPopup('Selected Location')
        .openPopup()
    })
  }

  async startCamera(videoElement) {
    try {
      this.stopCamera()

      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment',
        },
      }

      this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      videoElement.srcObject = this.mediaStream
      return new Promise(resolve => {
        videoElement.onloadedmetadata = () => {
          videoElement.play()
          resolve()
        }
      })
    } catch (err) {
      alert('Failed to access camera: ' + err.message)
    }
  }

  stopCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop())
      this.mediaStream = null

      const videoElement = document.getElementById('cameraPreview')
      if (videoElement) videoElement.srcObject = null
    }
  }

  capturePhoto(videoElement, previewElement) {
    const canvas = document.createElement('canvas')
    canvas.width = videoElement.videoWidth
    canvas.height = videoElement.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)

    this.stopCamera()

    const img = document.createElement('img')
    img.src = canvas.toDataURL('image/jpeg')
    img.style.maxWidth = '100%'
    img.style.borderRadius = '8px'

    previewElement.innerHTML = ''
    previewElement.appendChild(img)

    this.capturedPhoto = canvas.toDataURL('image/jpeg')
  }

  async submitStory(description, file) {
    try {
      this.view.showLoading()
      const token = localStorage.getItem('token')
      
      await this.model.addNewStory({
        token,
        description,
        file,
        capturedPhoto: this.capturedPhoto,
        location: this.selectedLocation,
      })
      
      this.view.onStoryAdded()
    } catch (error) {
      this.view.onError(error.message)
    } finally {
      this.view.hideLoading()
    }
  }
}
