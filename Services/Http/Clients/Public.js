import Axios from 'axios'
import Cookies from 'cookie-handler'

import { Log } from '../../../Services'
import ErrorBag from './Responses/ErrorBag'
import ResponseBag from './Responses/ResponseBag'

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
  (response) => Promise.resolve(ResponseBag(response)),
  (error) => {
    Log.error('Failed when load public resources', error)
    return Promise.reject(error.response ? ErrorBag(error) : error)
  }
)

export default PublicClient
