const packageInfo = require('@/package.json')

const isProd = process.env.NODE_ENV === 'production'

export default {
  // 运行环境
  isProd,

  // 应用版本
  version: packageInfo.version,

  systemInfo: {
    SDKVersion: '0.0.0',
    batteryLevel: 0,
    brand: '', // devtools
    fontSizeSetting: 0, // 16
    language: '', // zh
    model: '', // iPhone 7 Plus
    pixelRatio: 1,
    platform: '', // devtools
    safeArea: { right: 0, bottom: 0, left: 0, top: 0, width: 0 },
    screenHeight: 0,
    screenWidth: 0,
    statusBarHeight: 0,
    system: '', // iOS 10.0.1
    version: '', // 7.0.4
    windowHeight: 0,
    windowWidth: 0,
  },

  // 接口访问配置
  baseUrl: isProd ? '正式环境地址' : '测试环境地址',
  clientId: isProd ? '8a0049b6-e43d-4869-bdde-800eea361edd' : 'e18c276d-9340-4888-9ec3-22b8585cbd8e',
  clientBasicToken: isProd ? 'OGEwMDQ5YjYtZTQzZC00ODY5LWJkZGUtODAwZWVhMzYxZWRkOmV4emMwYmZrdzl1YzhmZXY=' : 'ZTE4YzI3NmQtOTM0MC00ODg4LTllYzMtMjJiODU4NWNiZDhlOjE1eG45MXc1YmZveGR0bng',

  // 授权相关
  auth: {
    // 是否已登录
    isPersist: false,

    accessToken: null,
  },

  // 配置信息
  config: {},

  // 用户信息
  userInfo: {},

  // 全局的 action 请求状态管理
  pending: {},
}
