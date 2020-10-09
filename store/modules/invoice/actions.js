/* eslint-disable no-empty-pattern */
/* eslint-disable no-return-await */
import { proxyAction } from '@/store/vuex-helper'
import * as api from '@/store/api'
import {
  INVOICE_ORDER_LIST, INVOICE_HISTORY_ORDER_LIST, INVOICE_CREATE, INVOICE_DETAIL, INVOICE_DETAIL_ORDER_LIST,
  INVOICE_CREDIT, INVOICE_SEND, INVOICE_ORDER_SHEET,
  INVOICE_TITLE_CREATE, INVOICE_TITLE_LIST, INVOICE_TITLE_MODIFY, INVOICE_TITLE_DELETE, INVOICE_TITLE_ACTIVE
} from './keys'

export default {
  // 可开票订单列表
  async [INVOICE_ORDER_LIST] ({}, payload) {
    const proxy = () => api.requestV3('invoice/orders', payload)
    return await proxyAction(proxy, INVOICE_ORDER_LIST)
  },

  // 开票历史列表
  async [INVOICE_HISTORY_ORDER_LIST] ({}, payload) {
    const proxy = () => api.requestV3('invoice/history', payload)
    return await proxyAction(proxy, INVOICE_HISTORY_ORDER_LIST)
  },

  // 开票
  async [INVOICE_CREATE] ({}, payload) {
    const proxy = () => api.requestV3('invoice/create', payload)
    return await proxyAction(proxy, INVOICE_CREATE)
  },

  // 发票详情
  async [INVOICE_DETAIL] ({}, payload) {
    const proxy = () => api.requestV3('invoice/detail', payload)
    return await proxyAction(proxy, INVOICE_DETAIL)
  },

  //获取订单列表开票数
  async [INVOICE_ORDER_SHEET] ({}, payload) {
    const proxy = () => api.requestV3('invoice/sheet', payload)
    return await proxyAction(proxy, INVOICE_ORDER_SHEET)
  },

  // 发票详情包含订单列表
  async [INVOICE_DETAIL_ORDER_LIST] ({}, payload) {
    const proxy = () => api.requestV3('order/list', payload)
    return await proxyAction(proxy, INVOICE_DETAIL_ORDER_LIST)
  },

  // 企业税号查询
  async [INVOICE_CREDIT] ({}, payload) {
    const proxy = () => api.requestV3('invoice/credit', payload)
    return await proxyAction(proxy, INVOICE_CREDIT)
  },

  // 重发邮件
  async [INVOICE_SEND] ({}, payload) {
    const proxy = () => api.requestV3('invoice/send', payload)
    return await proxyAction(proxy, INVOICE_SEND)
  },

  // 创建发票抬头
  async [INVOICE_TITLE_CREATE] ({}, payload) {
    const proxy = () => api.requestV3('invoiceBuyer/create', payload)
    return await proxyAction(proxy, INVOICE_TITLE_CREATE)
  },

  // 查询发票抬头列表
  async [INVOICE_TITLE_LIST] () {
    const proxy = () => api.requestV3('invoiceBuyer/list')
    return await proxyAction(proxy, INVOICE_TITLE_LIST)
  },

  // 发票抬头修改
  async [INVOICE_TITLE_MODIFY] ({}, payload) {
    const proxy = () => api.requestV3('invoiceBuyer/modify', payload)
    return await proxyAction(proxy, INVOICE_TITLE_MODIFY)
  },

  // 发票抬头删除
  async [INVOICE_TITLE_DELETE] ({}, payload) {
    const proxy = () => api.requestV3('invoiceBuyer/delete', payload)
    return await proxyAction(proxy, INVOICE_TITLE_DELETE)
  },

  // 发票抬头设置默认项
  async [INVOICE_TITLE_ACTIVE] ({}, payload) {
    const proxy = () => api.requestV3('invoiceBuyer/active', payload)
    return await proxyAction(proxy, INVOICE_TITLE_ACTIVE)
  },
}
