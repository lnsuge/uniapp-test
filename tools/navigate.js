/**
 * 全局路由跳转方法
 * @param {*} url
 */
import _ from 'lodash'

export const navigate = (url) => {
  const type = url.split('://')[0]
  switch (type) {
    //跳转到小程序指定页面
    case 'page':{
      const action = url.split('://')[1].split('/')[0]
      const param = url.split(action)[1]
      const delta = parseInt(param.split('/')[1])
      switch (action) {
        case 'navigateTo':
          wx.navigateTo({ url: param })
          break
        case 'redirectTo':
          wx.redirectTo({ url: param })
          break
        case 'reLaunch':
          wx.reLaunch({ url: param })
          break
        case 'switchTab':
          wx.redirectTo({ url: param })
          break
        case 'navigateBack':
          wx.navigateBack({ delta: delta })
          break
        default:
          break
      }
      break
    }
    
    //跳转H5页面
    case 'http': case 'https': {
      wx.navigateTo({ url: `/public/webview/index?src=${encodeURIComponent(url)}` })
      break
    }

    //跳转到其他小程序
    case 'minapp': {
      const appId = _.get(url.split('://')[1].split('/'), [0])
      const path = _.get(url.split(appId)[1].split('?'), [0])
      const extraData = _.get(url.split(appId)[1].split('?'), [1], '')
      const param = {
        appId: appId,
        path: path,
        extraData: extraData,
      }
      wx.navigateToMiniProgram(param)
      break
    }

    // 打开/关闭 modal对话框
    // case 'modal': {
    //   let imgUrl = ''
    //   let target = ''
    //   const action = url.split('://')[1]
    //   switch (action) {
    //     case 'open':{
    //       url.split('?')[1].split('&').forEach(element => {
    //         switch (element.split('=')[0]) {
    //           case 'imgUrl':
    //             imgUrl = element.split('=')[0]
    //             break
    //           case 'target':
    //             target = element.split('=')[0]
    //             break
    //           default:
    //             break
    //         }
    //       })
    //       break
    //     }
    //     case 'close':
    //       break
    //     default:
    //       break
    //   }
    //   break
    // }

    default:
      break
  }
}
