import { wxPromiseify } from '@/common'
import store from '@/store'
import { APP_AUTH_BIND, APP_WHO } from '@/store/modules/app/keys'

export const getUserInfo = async (obj) => {
  if (obj.errMsg !== 'getPhoneNumber:ok') return
  const { encryptedData, iv } = obj
  // 因为会用到用户的 sessionToken 解密，所以需要验证 session 是否过期
  const { errMsg } = await wxPromiseify(wx.checkSession)()
  if (errMsg === 'checkSession:ok') {
    await store.dispatch(APP_AUTH_BIND, { encryptedData, iv })
    await store.dispatch(APP_WHO)
  }
}