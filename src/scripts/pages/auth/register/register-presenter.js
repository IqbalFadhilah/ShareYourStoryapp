import { AuthModel } from '../../../models/auth-model';

export default class RegisterPresenter {
  #view;
  #model;

  constructor(view) {
    this.#view = view;
    this.#model = new AuthModel();
  }

  async registerUser({ name, email, password }) {
    this.#view.showLoading();

    try {
      const message = await this.#model.register(name, email, password);
      this.#view.onRegisterSuccess(message);
    } catch (error) {
      this.#view.onRegisterFailed(error.message);
    } finally {
      this.#view.hideLoading();
    }
  }
}