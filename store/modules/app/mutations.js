import {
  APP_INIT
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
}
