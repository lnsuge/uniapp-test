import {
  APP_INIT, APP_AUTH, APP_WHO, APP_CONFIG,
  APP_AUTH_BIND, APP_AUTH_UNBIND
} from './keys'

export default {
  pending (state, { key, pending }) {
    state.pending = { ...state.pending, [key]: pending }
  },

  [APP_INIT] (state, { systemInfo }) {
    const { isPersist = false, accessToken } = JSON.parse(uni.getStorageSync('persist::auth') || '{}')
    state.auth.isPersist = isPersist
    state.auth.accessToken = accessToken
    state.systemInfo = systemInfo
    uni.setStorageSync('persist::auth', JSON.stringify(state.auth))
  },

  [APP_WHO] (state, payload) {
    const { alias, authorities, company, mobile, openid, platform, username } = payload
    const userInfo = { alias, authorities, company, mobile, openid, platform, username }
    state.userInfo = userInfo
    if (userInfo.mobile) {
      state.auth.isPersist = true
      const storage = JSON.parse(uni.getStorageSync('persist::auth'))
      storage.isPersist = state.auth.isPersist
      uni.setStorageSync('persist::auth', JSON.stringify(storage))      
    } else {
      state.auth.isPersist = false
      const storage = JSON.parse(uni.getStorageSync('persist::auth'))
      storage.isPersist = state.auth.isPersist
      uni.setStorageSync('persist::auth', JSON.stringify(storage))           
    }
  },

  [APP_AUTH] (state, payload) {
    const { access_token } = payload || {}
    state.auth.accessToken = access_token
    uni.setStorageSync('persist::auth', JSON.stringify(state.auth))
  },

  [APP_CONFIG] (state, payload) {
    state.config = payload
    uni.setStorageSync('config', payload)
  },

  [APP_AUTH_BIND] (state) {
    uni.setStorageSync('persist::auth', JSON.stringify(state.auth))
  },

  // 退出/注销
  [APP_AUTH_UNBIND] (state) {
    state.auth.isPersist = false
    state.auth.accessToken = null
    uni.removeStorageSync('persist::auth')
  },
}
