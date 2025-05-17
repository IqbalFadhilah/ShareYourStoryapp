import { login, register } from '../data/api';
import { putAccessToken } from '../utils/auth';

export class AuthModel {
  async login(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    const token = await login({ email, password });
    putAccessToken(token);
    return token;
  }

  async register(name, email, password) {
    if (!name || !email || !password) {
      throw new Error('All fields are required');
    }

    const response = await register({ name, email, password });
    return response.message;
  }
}