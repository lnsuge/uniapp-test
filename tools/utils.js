/**
 * 首页针对业务功能导航公共处理方法
 * @param {*} item
 */
export const navigate = (item) => {
  const { type, url, method, extra } = item
  switch (type) {
    case 'emit':
      return extra
    case 'page':
      switch (method) {
        case 'navigateTo':
          uni.navigateTo({ url: this.buildUrl(url, extra) })
          break
        case 'redirectTo':
          uni.redirectTo({ url: this.buildUrl(url, extra) })
          break
        case 'reLaunch':
          uni.reLaunch({ url: this.buildUrl(url, extra) })
          break
        case 'switchTab':
          uni.redirectTo({ url: url })
          break
        case 'navigateBack':
          uni.navigateBack({ delta: extra })
          break
        default:
          break
      }
      break
    case 'webview':
      uni.navigateTo({ url: `/public/webview/index?src=${extra}` })
      break
    case 'minapp':
      uni.navigateToMiniProgram(extra)
      break
    default:
      break
  }
}
