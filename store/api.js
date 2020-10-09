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

// 通用请求封装
export const requestData = (action, payload = {}, { target = 'client', version = 'v3' } = {}) => {
  const data = target === 'client' ? payload : { action, version, payload }
  return _request({
    url: _buildUrl(`/${target}?action=${action}&version=${version}`),
    data,
    header: { 'Authorization': `Bearer ${_.get(store.state, 'app.auth.accessToken')}` },
    method: 'POST',
  })
}
