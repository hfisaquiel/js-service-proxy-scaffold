import Axios from 'axios'
import Cookies from 'cookie-handler'

import { Log } from 'Services'

/**
 * Client without authentication controll
 */
const PublicClient = Axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  responseType: 'json'
})

PublicClient.interceptors.request.use(
  (requestConfig) => {
    const settings = {
      trackingId: Cookies.get('tracking_id')
    }

    return { ...requestConfig, ...settings }
  },
  (error) => {
    Log.error('Invalid request configs:', error)
    throw error
  }
)

PublicClient.interceptors.response.use(
  (response) => Promise.resolve(response.data),
  (error) => Promise.reject(error)
)

export default PublicClient
