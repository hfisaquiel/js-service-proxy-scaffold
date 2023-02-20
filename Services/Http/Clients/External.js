import Axios from 'axios'
import Log from '../../Log'

/**
 * Client for external or uncontexted services
 */
const ExternalClient = Axios.create({
  responseType: 'json'
})

ExternalClient.interceptors.request.use(
  (requestConfig) => requestConfig,
  (error) => {
    Log.error('Invalid request configs:', error)
    throw error
  }
)

ExternalClient.interceptors.response.use(
  (response) => Promise.resolve(response.data),
  (error) => {
    Log.error('Failed when load externa service info', error)
    return Promise.reject(error)
  }
)

export default ExternalClient
