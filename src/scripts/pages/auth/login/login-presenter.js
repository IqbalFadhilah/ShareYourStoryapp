import { AuthModel } from '../../../models/auth-model'

export default class LoginPresenter {
  #view
  #model

  constructor(view) {
    this.#view = view
    this.#model = new AuthModel()
  }

  async loginUser({ email, password }) {
    this.#view.showLoading()

    try {
      await this.#model.login(email, password)
      this.#view.onLoginSuccess()
    } catch (error) {
      this.#view.onLoginFailed(error.message)
    } finally {
      this.#view.hideLoading()
    }
  }
}