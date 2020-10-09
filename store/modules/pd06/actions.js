/* eslint-disable no-empty-pattern */
/* eslint-disable no-return-await */
import { proxyAction } from '@/store/vuex-helper'
import * as api from '@/store/api'
import { PD06_STATION_LIST, PD06_CODE_CHECK, PD06_VEHICLE_LIST } from './keys'

export default {
  // 查询站点信息
  async [PD06_STATION_LIST] ({}, payload) {
    const proxy = () => api.requestV3('pd06/site/list', payload)
    return await proxyAction(proxy, PD06_STATION_LIST)
  },

  // 校验优惠码
  async [PD06_CODE_CHECK] ({}, payload) {
    const proxy = () => api.requestV3('pd06/check/enterpriseCode', payload)
    return await proxyAction(proxy, PD06_CODE_CHECK)
  },

  // 查询车辆列表
  async [PD06_VEHICLE_LIST] ({}, payload) {
    const proxy = () => api.requestV3('pd06/estimatePrice', payload)
    return await proxyAction(proxy, PD06_VEHICLE_LIST)
  },
}
