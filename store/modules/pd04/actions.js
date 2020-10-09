/* eslint-disable no-empty-pattern */
/* eslint-disable no-return-await */
import { proxyAction } from '@/store/vuex-helper'
import * as api from '@/store/api'
import {
  PD04_SCHEDULE_LIST, PD04_SCHEDULE_INFO, PD04_CHOOSE_GEO, PD04_ORDER_CREATE,
  PD04_CITY_HOT, PD04_CITY_HISTORY_LIST, PD04_CITY_HISTORY_DEL, PD04_CITY_LIST
} from './keys'

export default {

  // 获取班次列表
  async [PD04_SCHEDULE_LIST] ({}, payload) {
    const proxy = () => api.requestV3('pd04/schedule/list', payload)
    return await proxyAction(proxy, PD04_SCHEDULE_LIST)
  },

  // 获取班次详情信息
  async [PD04_SCHEDULE_INFO] ({}, payload) {
    const proxy = () => api.requestV3('pd04/schedule/info', payload)
    return await proxyAction(proxy, PD04_SCHEDULE_INFO)
  },

  //- 查询围栏信息
  async [PD04_CHOOSE_GEO] ({}, payload) {
    const proxy = () => api.requestV3('pd04/choose/geo', payload)
    return await proxyAction(proxy, PD04_CHOOSE_GEO)
  },

  //- 下单
  async [PD04_ORDER_CREATE] ({}, payload) {
    const proxy = () => api.requestV3('pd04/order/create', payload)
    return await proxyAction(proxy, PD04_ORDER_CREATE)
  },

  // 城际用车查询热门城市
  async [PD04_CITY_HOT] ({}, payload) {
    const proxy = () => api.requestV3('pd04/city/hot', payload)
    return await proxyAction(proxy, PD04_CITY_HOT)
  },

  // 城际用车查询历史查询记录
  async [PD04_CITY_HISTORY_LIST] ({}, payload) {
    const proxy = () => api.requestV3('pd04/cityHistory/list', payload)
    return await proxyAction(proxy, PD04_CITY_HISTORY_LIST)
  },

  // 城际用车删除历史查询记录
  async [PD04_CITY_HISTORY_DEL] ({}, payload) {
    const proxy = () => api.requestV3('pd04/cityHistory/del', payload)
    return await proxyAction(proxy, PD04_CITY_HISTORY_DEL)
  },

  // 城际用车查询出发城市/目的城市列表
  async [PD04_CITY_LIST] ({}, payload) {
    const proxy = () => api.requestV3('pd04/city/list', payload)
    return await proxyAction(proxy, PD04_CITY_LIST)
  },
}
