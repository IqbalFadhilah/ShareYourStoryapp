import { StoryModel } from '../../models/story-model'

export default class HomePresenter {
  constructor({ view }) {
    this.view = view
    this.model = new StoryModel()
  }

  async init() {
    try {
      const token = localStorage.getItem('token')
      const stories = await this.model.getAllStories(token)
      this.view.showStories(stories)
    } catch (error) {
      this.view.showError(error.message)
    }
  }
}
