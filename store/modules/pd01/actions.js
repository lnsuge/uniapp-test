/* eslint-disable no-empty-pattern */
/* eslint-disable no-return-await */
import { proxyAction } from '@/store/vuex-helper'
import * as api from '@/store/api'
import { PD01_SUGGEST, PD01_SCHEDULE_LIST, PD01_SITE_LIST, PD01_SCHEDULE_INFO, PD01_ORDER_CREATE, PD01_ORDER_TICKETLIST, PD01_BATCH_REFUND } from './keys'

export default {
  // 推荐上下车点
  async [PD01_SUGGEST] ({}, payload) {
    const proxy = () => api.requestV3('pd01/suggest', payload)
    return await proxyAction(proxy, PD01_SUGGEST)
  },

  // 获取班次列表
  async [PD01_SCHEDULE_LIST] ({}, payload) {
    const proxy = () => api.requestV3('pd01/schedule/list', payload)
    return await proxyAction(proxy, PD01_SCHEDULE_LIST)
  },

  //获取班次详情信息
  async [PD01_SCHEDULE_INFO] ({}, payload) {
    const proxy = () => api.requestV3('pd01/schedule/info', payload)
    return await proxyAction(proxy, PD01_SCHEDULE_INFO)
  },

  // 创建订单
  async [PD01_ORDER_CREATE] ({}, payload) {
    const proxy = () => api.requestV3('pd01/order/create', payload)
    return await proxyAction(proxy, PD01_ORDER_CREATE)
  },
  
  // 获取站点列表
  async [PD01_SITE_LIST] ({}, payload) {
    const proxy = () => api.requestV3('pd01/site/list', payload)
    return await proxyAction(proxy, PD01_SITE_LIST)
  },

  // 获取退票订单列表
  async [PD01_ORDER_TICKETLIST] ({}, payload) {
    const proxy = () => api.requestV3('pd01/order/ticketList', payload)
    return await proxyAction(proxy, PD01_ORDER_TICKETLIST)
  },

  // 退票
  async [PD01_BATCH_REFUND] ({}, payload) {
    const proxy = () => api.requestV3('order/batch/refund', payload)
    return await proxyAction(proxy, PD01_BATCH_REFUND)
  },
}
