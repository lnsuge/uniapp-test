/* eslint-disable no-empty-pattern */
/* eslint-disable no-return-await */
import { proxyAction } from '@/store/vuex-helper'
import * as api from '@/store/api'
import {
  COMMONS_CITY_LIST, COMMONS_CITY_HISTORY_ADD, COMMONS_PAY_CHANNEL, COMMONS_PAY,
  COMMONS_PARKING, COMMONS_BUSINESS_CONFIG, COMMONS_NEAR_CAR, COMMONS_NOTICE, COMMONS_AD,
  COMMONS_GEO_CODER, COMMONS_SITE_LIST, COMMONS_SITE_ADD, COMMONS_SITE_DEL, COMMONS_SITE_HISTORY_LIST,
  COMMONS_TRADE, COMMONS_ESTIMATE_PRICE_CREATE, COMMONS_QR_SCAN, COMMONS_PASSENGER_LIST, COMMONS_PASSENGER_CREATE,
  COMMONS_PASSENGER_MODIFY, COMMONS_PASSENGER_DELETE
} from './keys'

export default {
  // 获取城市列表
  async [COMMONS_CITY_LIST] ({}, payload) {
    const proxy = () => api.requestV3('commons/cityList', payload)
    return await proxyAction(proxy, COMMONS_CITY_LIST)
  },

  // 添加城市选择历史记录
  async [COMMONS_CITY_HISTORY_ADD] ({}, payload) {
    const proxy = () => api.requestV3('commons/cityHistoryAdd', payload)
    return await proxyAction(proxy, COMMONS_CITY_HISTORY_ADD)
  },

  // 获取业务数据
  async [COMMONS_BUSINESS_CONFIG] ({}, payload) {
    const proxy = () => api.requestV3('commons/businessConfig', payload)
    return await proxyAction(proxy, COMMONS_BUSINESS_CONFIG)
  },

  // 获取推荐上车点列表
  async [COMMONS_PARKING] ({ commit }, payload) {
    const proxy = () => api.requestV3('commons/parking', payload)
    const response = await proxyAction(proxy, COMMONS_PARKING)
    commit(COMMONS_PARKING, response.data)
  },

  // 获取周边运力
  async [COMMONS_NEAR_CAR] ({}, payload) {
    const proxy = () => api.requestV3('commons/nearCar', payload)
    return await proxyAction(proxy, COMMONS_NEAR_CAR)
  },

  // 获取公告
  async [COMMONS_NOTICE] ({}, payload) {
    const proxy = () => api.requestV3('commons/notice', payload)
    return await proxyAction(proxy, COMMONS_NOTICE)
  },

  // 获取广告
  async [COMMONS_AD] ({}, payload) {
    const proxy = () => api.requestV3('commons/AD', payload)
    return await proxyAction(proxy, COMMONS_AD)
  },

  // 坐标反查
  async [COMMONS_GEO_CODER] ({}, payload) {
    const proxy = () => api.requestV3('commons/geoCoder', payload)
    return await proxyAction(proxy, COMMONS_GEO_CODER)
  },

  // 获取上下车地点列表
  async [COMMONS_SITE_LIST] ({}, payload) {
    const proxy = () => api.requestV3('commons/siteList', payload)
    const response = await proxyAction(proxy, COMMONS_SITE_LIST)
    return response.data
  },

  // 上下车位置查询记录上传
  async [COMMONS_SITE_ADD] ({}, payload) {
    const proxy = () => api.requestV3('commons/siteAdd', payload)
    return await proxyAction(proxy, COMMONS_SITE_ADD)
  },

  // 上下车位置查询记录清除
  async [COMMONS_SITE_DEL] ({}, payload) {
    const proxy = () => api.requestV3('commons/siteDel', payload)
    return await proxyAction(proxy, COMMONS_SITE_DEL)
  },

  // 获取上下车位置历史记录
  async [COMMONS_SITE_HISTORY_LIST] ({}, payload) {
    const proxy = () => api.requestV3('commons/siteHistoryList', payload)
    return await proxyAction(proxy, COMMONS_SITE_HISTORY_LIST)
  },

  // 订单支付
  async [COMMONS_TRADE] ({}, payload) {
    const proxy = () => api.requestV3('commons/trade', payload)
    return await proxyAction(proxy, COMMONS_TRADE)
  },

  // 查询接送机车辆类型
  async [COMMONS_ESTIMATE_PRICE_CREATE] ({}, payload) {
    const proxy = () => api.requestV3('commons/estimatePriceCreate', payload)
    return await proxyAction(proxy, COMMONS_ESTIMATE_PRICE_CREATE)
  },

  // 二维码解析
  async [COMMONS_QR_SCAN] ({}, payload) {
    const proxy = () => api.requestV3('qr/scan', payload)
    return await proxyAction(proxy, COMMONS_QR_SCAN)
  },

  // 查询乘客列表
  async [COMMONS_PASSENGER_LIST] ({}, payload) {
    const proxy = () => api.requestV3('passenger/query/list', payload)
    return await proxyAction(proxy, COMMONS_PASSENGER_LIST)
  },

  // 创建乘车人
  async [COMMONS_PASSENGER_CREATE] ({}, payload) {
    const proxy = () => api.requestV3('passenger/create', payload)
    return await proxyAction(proxy, COMMONS_PASSENGER_CREATE)
  },

  // 修改乘车人
  async [COMMONS_PASSENGER_MODIFY] ({}, payload) {
    const proxy = () => api.requestV3('passenger/modify', payload)
    return await proxyAction(proxy, COMMONS_PASSENGER_MODIFY)
  },

  // 删除乘车人
  async [COMMONS_PASSENGER_DELETE] ({}, payload) {
    const proxy = () => api.requestV3('passenger/delete', payload)
    return await proxyAction(proxy, COMMONS_PASSENGER_DELETE)
  },

  // 查询支付方式
  async [COMMONS_PAY_CHANNEL] ({}, payload) {
    const proxy = () => api.requestV3('pay/channel', payload)
    return await proxyAction(proxy, COMMONS_PAY_CHANNEL)
  },

  // 企业账户支付
  async [COMMONS_PAY] ({}, payload) {
    const proxy = () => api.requestV3('pay', payload)
    return await proxyAction(proxy, COMMONS_PAY)
  },
}
