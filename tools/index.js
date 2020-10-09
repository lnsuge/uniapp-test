import { init as configInit, read, persist } from './config'

// 初始化配置项
configInit()

export const promisify = (fn) => {
  return (args) => {
    return new Promise((resolve, reject) => {
      fn({ ...args, success: resolve, fail: reject })
    })
  }
}

export const config = { read, persist }
