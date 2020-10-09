import _ from 'lodash'
import { uniPromiseify } from '@/common'
import HttpError from '@/common/http-error'

import store from '@/store'

const _buildUrl = (path) => {
  const baseUrl = _.get(store.state, 'app.baseUrl')
  return `${baseUrl}${path}`
}

const _request = async (config) => {
  const response = await uniPromiseify(uni.request)(config)

  const { statusCode } = response
  if (statusCode >= 200 && statusCode < 300) return response

  throw new HttpError('Request failed with status code ' + statusCode, config, statusCode, response)
}

// 授权
export const weappAuth = async () => {
  const { code } = await uniPromiseify(uni.login)()
  const params = { authType: 'MINAPP' }
  return _request({
    url: _buildUrl('/sso/oauth/token?authType=' + params.authType),
    data: {
      'client_id': _.get(store.state, 'app.clientId'),
      'grant_type': 'password',
      'scope': 'login',
      'username': code,
      'password': 'MINAPP',
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${_.get(store.state, 'app.clientBasicToken')}`,
    },
    method: 'POST',
  })
}

// 微信登录
// eslint-disable-next-line require-await
export const weappLogin = async () => {
  return _request({
    url: _buildUrl('/sso/oauth/token'),
    data: {
      'grant_type': 'client_credentials',
      'scope': 'login',
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${_.get(store.state, 'app.clientBasicToken')}`,
    },
    method: 'POST',
  })
}

// 绑定用户请求封装
export const requestToken = (action, payload = {}, { target = 'client' } = {}) => {
  const data = payload
  return _request({
    url: _buildUrl(`/${target}/${action}`),
    data,
    header: { 'Authorization': `Bearer ${_.get(store.state, 'app.auth.accessToken')}` },
    method: 'POST',
  })
}

// 用户信息请求封装
export const requestWho = (action, { target = 'client' } = {}) => {
  return _request({
    url: _buildUrl(`/${target}/${action}`),
    header: { 'Authorization': `Bearer ${_.get(store.state, 'app.auth.accessToken')}` },
    method: 'GET',
  })
}

// 支付请求
export const payment = (action, payload = {}, { target = 'pay' } = {}) => {
  const data = payload

  return _request({
    url: _buildUrl(`/${target}/${action}`),
    data,
    header: { 'Authorization': `Bearer ${_.get(store.state, 'app.auth.accessToken')}` },
    method: 'POST',
  })
}

// 行程分享获取订单信息
export const shareOrder = (action, payload = {}) => {
  return _request({
    url: _buildUrl(`/client/${action}`),
    data: payload,
    method: 'POST',
  })
}

// 通用请求封装
export const requestV3 = (action, payload = {}, { target = 'client', version = 'v3' } = {}) => {
  const data = target === 'client' ? payload : { action, version, payload }
  return _request({
    url: _buildUrl(`/${target}?action=${action}&version=${version}`),
    data,
    header: { 'Authorization': `Bearer ${_.get(store.state, 'app.auth.accessToken')}` },
    method: 'POST',
  })
}

export const geoCoord = async () => {
  const accessToken = _.get(store.state, 'app.auth.accessToken')
  const { latitude, longitude } = await uniPromiseify(uni.getLocation)({ type: 'gcj02' })
  return _request({
    url: _buildUrl('/position/map/geoCoder'),
    data: {
      'x': latitude,
      'y': longitude,
      'coordType': 'GCJ02',
    },
    header: { 'Authorization': `Bearer ${accessToken}` },
    method: 'POST',
  })
}

// scoket 相关
let subscribes = {}
// websocket连接
let ws = null

export const wsConnectCreate = () => {
  return new Promise((resolve) => {
    if (!ws) {
      ws = wx.connectSocket({
        url: `${_.get(store.state, 'app.baseUrl').replace('https', 'wss')}/ws?access_token=${_.get(store.state, 'app.auth.accessToken')}`,
      })
      ws.onOpen(
        () => resolve()
      )
      ws.onClose(() => {
        stCloseHandle() })
      ws.onMessage(res => { stMessage(res) })
      ws.onError(() => {})
    } else {
      resolve()
    }
  })
}

const stMessage = (res) => {
  const { data } = res
  const message = JSON.parse(data)
  const { action, topic } = message
  switch (action) {
    case 'SUBSCRIBE':
      callbackHandle(message, subscribes[topic])
      break
    case 'CONNECTED':
      ws.send({
        data: JSON.stringify({ action: 'SUBSCRIBE', topic }),
      })
      heartHandle()
      break
    case 'PONG':
      break
    default:
  }
}

const stCloseHandle = () => {
  ws = null
  var flag = false
  Object.keys(subscribes).forEach(k => {
    if (subscribes[k]) {
      flag = true
    }
  })
  if (flag) {
    setTimeout(() => { wsConnectCreate() }, 3000)
  }
}

let heartTime = null

const heartHandle = () => {
  if (ws) {
    ws.send({ data: JSON.stringify({ action: 'PING' }) })
    heartTime = setTimeout(() => heartHandle(), 30000)
  }
}

const callbackHandle = (message, fun) => {
  fun(message)
}

export const sendHandle = (topic, callback = () => {}) => {
  var flag = true
  if (subscribes[topic]) {
    flag = false
  }
  if (flag && ws) {
    subscribes[topic] = callback
    ws.send({
      data: JSON.stringify({ action: 'SUBSCRIBE', topic }),
    })
  }
}

export const closeSocket = (topic) => {
  subscribes[topic] = null
  if (ws) {
    var flag = true
    Object.keys(subscribes).forEach(k => {
      if (subscribes[k]) {
        flag = false
      }
    })
    if (flag) {
      clearTimeout(heartTime)
      ws.close()
      ws = null
      subscribes = {}
    }
  }
}
