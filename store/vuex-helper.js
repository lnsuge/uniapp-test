import HttpError from '@/common/http-error'
import store from '@/store'
import { APP_LOGIN } from '@/store/modules/app/keys'
import _ from 'lodash'

// 全局的 action 请求状态管理
const pending = (key, pending) => {
  if (!key) return
  store.commit('pending', { key, pending })
}

// action 代理，内部封装了请求状态管理，授权异常处理
export const proxyAction = async (block, key, autoCommit = false, afterCommit) => {
  // if (!store.getters.permission(key)) return {}

  const exec = async () => {
    // 判断本地 token 是否存在
    const accessToken = _.get(store.state, 'app.auth.accessToken')
    if (!accessToken) await store.dispatch(APP_LOGIN)

    // 执行请求
    const result = await block()
    if (autoCommit) {
      store.commit(key, result.data)
      if (typeof afterCommit === 'function') {
        afterCommit()
      }
    }
    return result === undefined ? true : result
  }

  try {
    // 标记请求开始
    pending(key, true)
    return await exec()
  } catch (error) {
    if (error instanceof HttpError) {
      switch (error.code) {
      // 如果请求出现 401 异常，则重新获取 token
        case 401:
          await store.dispatch(APP_LOGIN)
          return await exec()
        case 500:
          error.message = '服务器开了个小差'
          break
        default:
          error.message = _.get(error, 'response.data.detail', error.message)
          break
      }
    }
    throw error
  } finally {
    // 标记请求结束
    pending(key, false)
  }
}
