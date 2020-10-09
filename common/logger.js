import _ from 'lodash'
import HttpError from './http-error'

const log = (level, message, error, printStack) => {
  console.info(`[${level}] ${message}`);
  (error && printStack) && console.error(error)
}

const defaultErrorConfig = { message: undefined, showToast: true, printStack: true }

export const error = (error, config = defaultErrorConfig) => {
  const { message, showToast, printStack } = Object.assign(defaultErrorConfig, config)
  const title = message
    ? message
    : (typeof error === 'string'
      ? error
      : (error instanceof HttpError
        ? _.get(error.response, 'data.detail', _.get(error.response, 'data.message', error.message))
        : error.message))

  log('error', title, error, printStack)
  showToast && uni.showToast({ title, icon: 'none', duration: 3000 })
}

export const debug = (message) => log('debug', message)

const defaultInfoConfig = { icon: 'success' }

export const info = (message, config = defaultInfoConfig) => {
  const { icon } = Object.assign(defaultInfoConfig, config)
  log('info', message)
  uni.showToast({ title: message, icon })
}
