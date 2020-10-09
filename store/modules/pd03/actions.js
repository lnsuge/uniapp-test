/* eslint-disable no-empty-pattern */
/* eslint-disable no-return-await */
import { proxyAction } from '@/store/vuex-helper'
import * as api from '@/store/api'
import {
  PD03_VEHICLE_LIST,
  PD03_ORDER_BOOK, PD03_POSITION_REAL_TIME,
  PD03_MAP_DISTANCE, PD03_DRIVER_LOCATION,
  PD03_NAVIGATION_ROUTE, PD03_FACT_ROUTE, PD03_PRICE_RULE_INFO,
  PD03_SAFE_CODE
} from './keys'

export default {
  // 即时用车车辆列表
  async [PD03_VEHICLE_LIST] ({}, payload) {
    const proxy = () => api.requestV3('pd03/vehicleList', payload)
    return await proxyAction(proxy, PD03_VEHICLE_LIST)
  },

  // 创建订单
  async [PD03_ORDER_BOOK] ({}, payload) {
    const proxy = () => api.requestV3('pd03/orderBook', payload)
    return await proxyAction(proxy, PD03_ORDER_BOOK)
  },

  // 获取实时里程/价格
  async [PD03_POSITION_REAL_TIME] ({}, payload) {
    const proxy = () => api.requestV3('pd03/positionRealtime', payload)
    return await proxyAction(proxy, PD03_POSITION_REAL_TIME)
  },

  // 预估行驶距离和时间
  async [PD03_MAP_DISTANCE] ({}, payload) {
    const proxy = () => api.requestV3('pd03/mapDistance', payload)
    return await proxyAction(proxy, PD03_MAP_DISTANCE)
  },

  // 获取司机的实时位置
  async [PD03_DRIVER_LOCATION] ({}, payload) {
    const proxy = () => api.requestV3('pd03/driverLocation', payload)
    return await proxyAction(proxy, PD03_DRIVER_LOCATION)
  },

  // 查询导航轨迹
  async [PD03_NAVIGATION_ROUTE] ({}, payload) {
    const proxy = () => api.requestV3('pd03/navigationRoute', payload)
    return await proxyAction(proxy, PD03_NAVIGATION_ROUTE)
  },

  // 查询实际轨迹
  async [PD03_FACT_ROUTE] ({}, payload) {
    const proxy = () => api.requestV3('pd03/factRoute', payload)
    return await proxyAction(proxy, PD03_FACT_ROUTE)
  },

  // 查询计价规则
  async [PD03_PRICE_RULE_INFO] ({}, payload) {
    const proxy = () => api.requestV3('pd03/priceRuleInfo', payload)
    return await proxyAction(proxy, PD03_PRICE_RULE_INFO)
  },

  async [PD03_SAFE_CODE] ({}, payload) {
    const proxy = () => api.requestV3('safeCode', payload)
    return await proxyAction(proxy, PD03_SAFE_CODE)
  },
}
