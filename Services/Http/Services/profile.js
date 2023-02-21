const userProfileURI = 'user/profile'

/**
 * Example of intercept provided client
 * @param {import('axios').AxiosInstance} Client
 * @returns {Axios}
 */
const setEntrypoint = (Client) => {
  Client.defaults.baseURL = Client.getUri({ url: userProfileURI }) // Untested|Unverified
  return Client
}

// Profile
const anonimize = (Client, id) => setEntrypoint(Client).delete(`${id}`)
const getProfile = (Client) => setEntrypoint(Client).get()

// Account
const changePassword = (Client, data) => setEntrypoint(Client).post('changePassword', data)

// Adress
const createAddress = (Client, userId, data) => setEntrypoint(Client).post(`${userId}/address`, data)
const updateAddress = (Client, userId, addressId, data) => setEntrypoint(Client).put(`${userId}/address/${addressId}`, data)

export default {
  anonimize,
  changePassword,
  createAddress,
  getProfile,
  updateAddress
}
