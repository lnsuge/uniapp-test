/* eslint-disable no-return-await */
/* eslint-disable require-await */
import { promisify } from '@/tools'
import { proxyAction } from '@/store/vuex-helper'
import * as api from '@/store/api'
import {
  APP_INIT, APP_LOGIN, APP_AUTH, APP_WHO, APP_CONFIG,
  APP_AUTH_BIND, APP_AUTH_UNBIND, APP_AUTH_PASSWOED_SET
} from './keys'

export default {
  async [APP_INIT] ({ commit }) {
    const systemInfo = await promisify(uni.getSystemInfo)()
    commit(APP_INIT, { systemInfo })
  },

  async [APP_AUTH] ({ commit, dispatch }) {
    const response = await api.weappAuth()
    commit(APP_AUTH, response.data)
    await dispatch(APP_CONFIG)
  },

  async [APP_WHO] ({ commit }) {
    const response = await api.requestWho('detail', { target: 'sso' })
    commit(APP_WHO, response.data)
  },

  async [APP_LOGIN] () {
    await api.weappLogin()
  },

  async [APP_CONFIG] ({ commit }) {
    const proxy = () => api.requestV3('commons/config')
    const response = await proxyAction(proxy, APP_CONFIG, true)
    commit(APP_CONFIG, response.data)
  },

  async [APP_AUTH_BIND] ({ dispatch, commit }, payload) {
    const proxy = () => api.requestToken('user/bind', payload, { target: 'sso' })
    await proxyAction(proxy, APP_AUTH_BIND, true)
    dispatch(APP_LOGIN)
    commit(APP_AUTH_BIND)
  },

  async [APP_AUTH_UNBIND] ({ dispatch }) {
    const proxy = () => api.request('user/unbind', null, { target: 'sso' })
    return proxyAction(proxy, APP_AUTH_UNBIND, true, () => dispatch(APP_LOGIN))
  },

  async [APP_AUTH_PASSWOED_SET] (payload) {
    const proxy = () => api.request('user/password/set', payload, { target: 'sso' })
    return await proxyAction(proxy, APP_AUTH_PASSWOED_SET)
  },
}
