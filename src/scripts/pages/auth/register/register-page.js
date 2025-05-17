import RegisterPresenter from './register-presenter';

const RegisterPage = {
  async render() {
    return `
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <h2>Create Account</h2>
            <p>Please register to get started</p>
          </div>
          
          <form id="registerForm" class="auth-form">
            <div class="form-group">
              <label for="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                placeholder="Your Name" 
                required
              >
            </div>

            <div class="form-group">
              <label for="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                placeholder="your@email.com" 
                required
              >
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <input 
                type="password" 
                id="password" 
                placeholder="••••••••" 
                required
              >
            </div>
            
            <p id="register-error" class="error-message"></p>
            <p id="register-message" class="success-message"></p>
            
            <button type="submit" class="auth-button" id="register-btn">Register</button>
          </form>
          
          <div class="auth-footer">
            Already have an account? <a href="#/login">Login here</a>
          </div>
        </div>
      </div>
    `
  },

  async afterRender() {
    const presenter = new RegisterPresenter(this);

    const form = document.getElementById('registerForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      await presenter.registerUser({ name, email, password });
    });
  },

  showLoading() {
    const btn = document.getElementById('register-btn');
    if (btn) {
      btn.textContent = 'Loading...';
      btn.disabled = true;
    }
  },

  hideLoading() {
    const btn = document.getElementById('register-btn');
    if (btn) {
      btn.textContent = 'Register';
      btn.disabled = false;
    }
  },

  onRegisterSuccess(message) {
    const errorEl = document.getElementById('register-error');
    const successEl = document.getElementById('register-message');
    
    if (errorEl) errorEl.textContent = '';
    if (successEl) {
      successEl.textContent = message;
      setTimeout(() => {
        window.location.hash = '#/login';
      }, 1500);
    }
  },

  onRegisterFailed(errorMessage) {
    const errorEl = document.getElementById('register-error');
    const successEl = document.getElementById('register-message');
    
    if (successEl) successEl.textContent = '';
    if (errorEl) errorEl.textContent = errorMessage;
  }
};

export default RegisterPage
