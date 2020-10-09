/* eslint-disable no-empty-pattern */
/* eslint-disable no-return-await */
import { proxyAction } from '@/store/vuex-helper'
import * as api from '@/store/api'
import {
  PD02_FLY_AIRPORT, PD02_FLY, PD02_FLY_CITY,
  PD02_ORDER_CREATE, PD02_ORDER_INFO, PD02_ORDER_REFUND_FEE, PD02_ORDER_REFUND, PD02_ORDER_PREPAY
} from './keys'

export default {
  // 查询机场信息
  async [PD02_FLY_AIRPORT] ({}, payload) {
    const proxy = () => api.requestV3('pd02/flyAirport', payload)
    return await proxyAction(proxy, PD02_FLY_AIRPORT)
  },

  // 查询航班信息/起降城市查询航班信息
  async [PD02_FLY] ({}, payload) {
    const proxy = () => api.requestV3('pd02/fly', payload)
    return await proxyAction(proxy, PD02_FLY)
  },

  // 查询起降城市
  async [PD02_FLY_CITY] ({}, payload) {
    const proxy = () => api.requestV3('pd02/flyCity', payload)
    return await proxyAction(proxy, PD02_FLY_CITY)
  },

  // 接送机下单
  async [PD02_ORDER_CREATE] ({}, payload) {
    const proxy = () => api.requestV3('pd02/orderCreate', payload)
    return await proxyAction(proxy, PD02_ORDER_CREATE)
  },

  // 查询订单详情
  async [PD02_ORDER_INFO] ({}, payload) {
    const proxy = () => api.requestV3('order/info', payload)
    return await proxyAction(proxy, PD02_ORDER_INFO)
  },

  // 查询订单与支付参数
  async [PD02_ORDER_PREPAY] ({}, payload) {
    const proxy = () => api.requestV3('order/prePay', payload)
    return await proxyAction(proxy, PD02_ORDER_PREPAY)
  },

  // 查询退票手续费
  async [PD02_ORDER_REFUND_FEE] ({}, payload) {
    const proxy = () => api.requestV3('order/refundFee', payload)
    return await proxyAction(proxy, PD02_ORDER_REFUND_FEE)
  },

  // 退票
  async [PD02_ORDER_REFUND] ({}, payload) {
    const proxy = () => api.requestV3('order/refund/v3', payload)
    return await proxyAction(proxy, PD02_ORDER_REFUND)
  },
}
