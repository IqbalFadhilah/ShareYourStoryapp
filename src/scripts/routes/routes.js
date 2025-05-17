import LoginPage from '../pages/auth/login/login-page'
import RegisterPage from '../pages/auth/register/register-page'
import HomePage from '../pages/home/home-page'
import AddStoryPage from '../pages/home/add-story-page'
import SavedPage from '../pages/save-page'

const routes = {
  '/': LoginPage,
  '/login': LoginPage,
  '/register': RegisterPage,
  '/home': new HomePage(),
  '/add': new AddStoryPage(),
  '/saved': new SavedPage(),
}

export default routes
