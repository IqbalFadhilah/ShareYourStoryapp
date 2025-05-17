import LoginPresenter from './login-presenter'

const LoginPage = {
  async render() {
    return `
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <h2>Welcome</h2>
            <p>Please login to continue</p>
          </div>
          
          <form id="loginForm" class="auth-form">
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
            
            <p id="login-error" class="error-message"></p>
            
            <button type="submit" class="auth-button" id="loginBtn">Login</button>
          </form>
          
          <div class="auth-footer">
            Don't have an account? <a href="#/register">Register here</a>
          </div>
        </div>
      </div>
    `
  },

  async afterRender() {
    const presenter = new LoginPresenter(this)

    const form = document.getElementById('loginForm')
    form.addEventListener('submit', e => {
      e.preventDefault()
      const email = document.getElementById('email').value
      const password = document.getElementById('password').value
      presenter.loginUser({ email, password })
    })
  },

  showLoading() {
    const btn = document.getElementById('loginBtn')
    if (btn) {
      btn.textContent = 'Loading...'
      btn.disabled = true
    }
  },

  hideLoading() {
    const btn = document.getElementById('loginBtn')
    if (btn) {
      btn.textContent = 'Login'
      btn.disabled = false
    }
  },

  onLoginSuccess() {
    const errorElement = document.getElementById('login-error')
    if (errorElement) {
      errorElement.textContent = ''
    }
    
    window.location.hash = '#/home'
  },
  
  onLoginFailed(errorMessage) {
    const errorElement = document.getElementById('login-error')
    if (errorElement) {
      errorElement.textContent = errorMessage
    }
  }
}

export default LoginPage
