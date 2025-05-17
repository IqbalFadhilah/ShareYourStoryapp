import { getStories, addStory } from '../data/api'

export class StoryModel {
  async getAllStories(token) {
    if (!token) throw new Error('Please login first')
    return await getStories(token, { page: 1, size: 20, location: 1 })
  }

  async addNewStory({ token, description, file, capturedPhoto, location }) {
    if (!description) throw new Error('Please enter a description')
    if (!file && !capturedPhoto) throw new Error('Please add a photo')
    if (!token) throw new Error('Please login first')
  
    const formData = new FormData()
    formData.append('description', description)
  
    if (capturedPhoto) {
      const blob = await fetch(capturedPhoto).then(res => res.blob())
      formData.append('photo', blob, 'photo.jpg')
    } else {
      formData.append('photo', file)
    }
  
    if (location) {
      formData.append('lat', location.lat)
      formData.append('lon', location.lng)
    }
  
    const response = await addStory(token, formData)
    return { success: true, message: 'Story added successfully' } 
  }
}


