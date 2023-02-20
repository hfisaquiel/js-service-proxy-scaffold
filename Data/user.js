export const getUserData = () => JSON.parse(localStorage.getItem('UserData'))

export const setUserData = (payload) => {
  localStorage.setItem('UserData', JSON.stringify(payload))

  return { payload, isAuthenticated: true }
}

export const appendUserData = (payload) => setUserData({ ...getUserData(), ...payload })

export const removeUserData = () => {
  localStorage.removeItem('UserData')
  return {}
}

export const hasUser = () => {
  try {
    const localUserData = getUserData()
    if (!localUserData) {
      return false
    }

    const active = !!localUserData.access_token && Date.now() < localUserData.valid_at

    if (!active) {
      localStorage.removeItem('UserData')
    }

    return active
  } catch (error) {
    return false
  }
}

export default {
  appendUserData,
  getUserData,
  hasUser,
  removeUserData,
  setUserData
}
