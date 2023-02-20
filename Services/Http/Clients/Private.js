import Axios from 'axios'
import Log from '../../Log'
import { getUserData, removeUserData } from '../../../Data/user'

const PrivateClient = Axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  responseType: 'json'
})

PrivateClient.interceptors.request.use(
  (requestConfig) => {
    const config = requestConfig
    const UserData = getUserData()

    if (UserData && UserData.session && UserData.session.token) {
      config.headers.Authorization = `${UserData.session.token_type} ${UserData.session.token}`
    }
    return config
  },
  (error) => {
    Log.error('Invalid request configs:', error)
    throw error
  }
)

PrivateClient.interceptors.response.use(
  (response) => Promise.resolve(response.data),
  (error) => {
    Log.error('Error when get reponse from private api', error)
    if (error.response && error.response.status === 401) {
      removeUserData()
      window.location.href = '/'
    }

    return Promise.reject(error)
  }
)

export default PrivateClient
