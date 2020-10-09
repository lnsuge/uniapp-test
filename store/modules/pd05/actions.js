/* eslint-disable no-empty-pattern */
/* eslint-disable no-return-await */
import { proxyAction } from '@/store/vuex-helper'
import * as api from '@/store/api'
import { PD05_STATION_LIST } from './keys'

export default {
  // 查询站点信息
  async [PD05_STATION_LIST] ({}, payload) {
    const proxy = () => api.requestV3('pd02/siteList', payload)
    return await proxyAction(proxy, PD05_STATION_LIST)
  },
}
