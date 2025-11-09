import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export function getErrorMessage(e: unknown) {
  if (axios.isAxiosError(e)) {
    return (
      e.response?.data?.message ||
      e.response?.statusText ||
      e.message ||
      'Request failed'
    )
  }
  return 'Unexpected error'
}
