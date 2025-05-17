import CONFIG from '../config'

export async function login({ email, password }) {
  const response = await fetch(`${CONFIG.BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.message)
  return data.loginResult.token
}

export async function register({ name, email, password }) {
  const response = await fetch(`${CONFIG.BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.message)
  return data.message
}

export async function getStories(token, options = {}) {
  const { page = 1, size = 10, location = 0 } = options

  const response = await fetch(
    `${CONFIG.BASE_URL}/stories?page=${page}&size=${size}&location=${location}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )

  const data = await response.json()
  if (!response.ok) throw new Error(data.message)
  return data.listStory
}

export const addStory = async (token, formData) => {
  const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
  return response.json()
}
