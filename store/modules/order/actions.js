/* eslint-disable no-empty-pattern */
/* eslint-disable no-return-await */
import { proxyAction } from '@/store/vuex-helper'
import * as api from '@/store/api'
import {
  ORDER_PROCESS, ORDER_CANCEL_REASON_LIST, ORDER_PERFECT,
  ORDER_INFO, ORDER_CANCEL, ORDER_TRIP_DETAIL,
  ORDER_PRICE_INFO, ORDER_LIST, ORDER_SHARE_INFO, ORDER_REFUND, ORDER_REFUNDFEE
} from './keys'

export default {
  // 查询是否已经有订单
  async [ORDER_PROCESS] ({ commit }, payload) {
    const proxy = () => api.requestV3('order/process', payload)
    const response = await proxyAction(proxy, ORDER_PROCESS)
    commit(ORDER_PROCESS, response.data)
  },

  // 订单取消原因列表
  async [ORDER_CANCEL_REASON_LIST] () {
    const proxy = () => api.requestV3('order/cancelReasonList')
    return await proxyAction(proxy, ORDER_CANCEL_REASON_LIST)
  },

  // 提交取消订单原因
  async [ORDER_PERFECT] ({}, payload) {
    const proxy = () => api.requestV3('order/perfect', payload)
    return await proxyAction(proxy, ORDER_PERFECT)
  },

  // 查询订单信息
  async [ORDER_INFO] ({}, payload) {
    const proxy = () => api.requestV3('order/info', payload)
    return await proxyAction(proxy, ORDER_INFO)
  },

  // 取消订单
  async [ORDER_CANCEL] ({}, payload) {
    const proxy = () => api.requestV3('order/cancel', payload)
    return await proxyAction(proxy, ORDER_CANCEL)
  },

  // 查询订单费用明细
  async [ORDER_TRIP_DETAIL] ({}, payload) {
    const proxy = () => api.requestV3('order/tripDetail', payload)
    return await proxyAction(proxy, ORDER_TRIP_DETAIL)
  },

  // 查询预估价详情
  async [ORDER_PRICE_INFO] ({}, payload) {
    const proxy = () => api.requestV3('order/priceInfo', payload)
    return await proxyAction(proxy, ORDER_PRICE_INFO)
  },

  // 获取订单列表
  async [ORDER_LIST] ({}, payload) {
    const proxy = () => api.requestV3('order/list', payload)
    return await proxyAction(proxy, ORDER_LIST)
  },

  // 行程分享入口获取订单信息
  async [ORDER_SHARE_INFO] ({}, payload) {
    const proxy = () => api.shareOrder('share/order', payload)
    return await proxyAction(proxy, ORDER_SHARE_INFO)
  },

  //- 退票手续费
  async [ORDER_REFUNDFEE] ({}, payload) {
    const proxy = () => api.requestV3('order/refundFee', payload)
    return await proxyAction(proxy, ORDER_REFUNDFEE)
  },

  //- 退票
  async [ORDER_REFUND] ({}, payload) {
    const proxy = () => api.requestV3('order/batch/refund', payload)
    return await proxyAction(proxy, ORDER_REFUND)
  },
}
