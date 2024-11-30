import {API_BASE_URL} from '../config'

const originalFetch = window.fetch

window.fetch = async (input, init) => {
  // If the input is already a full URL, don't modify it
  if (input.startsWith('http://') || input.startsWith('https://')) {
    return originalFetch(input, init)
  }

  // Prepend the base URL
  const url = `${API_BASE_URL}/${input.startsWith('/') ? input.slice(1) : input}`

  return originalFetch(url, init)
}

