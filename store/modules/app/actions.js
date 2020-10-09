import { promisify } from '@/tools'
// import { proxyAction } from '@/store/vuex-helper'
// import * as api from '@/store/api'
import {
  APP_INIT
} from './keys'

export default {
  async [APP_INIT] ({ commit }) {
    const systemInfo = await promisify(uni.getSystemInfo)()
    commit(APP_INIT, { systemInfo })
  },
}
