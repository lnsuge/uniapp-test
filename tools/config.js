import _ from 'lodash'

const CONFIG_KEY = 'appconfig'

const defaultConfig = Object.freeze({})

let localConfig = Object.freeze({})

/**
 * 初始化配置
 */
export const init = () => {
  const data = uni.getStorageSync({ key: CONFIG_KEY }) || {}
  localConfig = Object.freeze(_.merge(defaultConfig, data))
}

/**
 * 读取配置项
 * @param {*} path 配置项路径
 * @param {*} defaultValue 默认值
 */
export const read = (path, defaultValue = undefined) => {
  return _.get(localConfig, path, _.get(defaultConfig, path, defaultValue))
}

/**
 * 持久化配置内容
 * @param {*} config 需要持久化的配置内容
 */
export const persist = (config) => {
  localConfig = Object.freeze(_.merge(defaultConfig, config))
  uni.setStorageSync({ key: CONFIG_KEY, data: localConfig })
  return localConfig
}