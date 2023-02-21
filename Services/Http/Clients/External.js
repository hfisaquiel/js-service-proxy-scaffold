import Axios from 'axios'
import { Log } from '../../../Services'
import ErrorBag from './Responses/ErrorBag'
import ResponseBag from './Responses/ResponseBag'

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
  (response) => Promise.resolve(ResponseBag(response)),
  (error) => {
    Log.error('Failed when load external service info', error)
    return Promise.reject(error.response ? ErrorBag(error) : error)
  }
)

export default ExternalClient
