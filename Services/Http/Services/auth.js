const create = (Client, data) => Client.post('user/auth/register', data)

const login = (Client, data) => Client.post('auth/login', data)

const recover = (Client, data) => Client.post('auth/forgot', data)

const reset = (Client, token, data) => Client.post(`auth/recovery?token=${token}`, data)

export default {
  create,
  login,
  recover,
  reset
}
