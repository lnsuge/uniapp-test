<template lang="pug">
  .container
    .top
      .avatar
        open-data(type="userAvatarUrl")
      open-data.name(type="userNickName")
    .content
      view 为提供更好的服务我们需要您的授权
      view 请点击下方授权按钮
    .row
      button.left(open-type="getPhoneNumber" @getphonenumber="handleGetPhoneNumber") 同意授权
</template>

<script>
import { wxPromiseify } from '@/common'

import { APP_AUTH_BIND, APP_WHO } from '@/store/modules/app/keys'

export default {
  methods: {
    async handleGetPhoneNumber ({ detail }) {
      if (detail.errMsg !== 'getPhoneNumber:ok') return

      const { encryptedData, iv } = detail
      // 因为会用到用户的 sessionToken 解密，所以需要验证 session 是否过期
      const { errMsg } = await wxPromiseify(wx.checkSession)()

      if (errMsg === 'checkSession:ok') {
        await this.$store.dispatch(APP_AUTH_BIND, { encryptedData, iv })
        await this.$store.dispatch(APP_WHO)
        
        uni.navigateBack({ detail: 1 })
      }
    },
  },
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100vh;
  padding: 0 20rpx 40rpx 20rpx;
  .top {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 40%;
    .name {
      margin-top: 20rpx;
    }
    .avatar {
      overflow: hidden;
      width: 144rpx;
      height: 144rpx;
      border-radius: 50%;
    }
  }
  .content {
    view {
      display: flex;
      justify-content: center;
      line-height: 70rpx;
    }
  }
  .row {
    display: flex;
    flex-direction: column-reverse;
    flex: 1;
    .left {
      padding: 0;
      margin: 0;
      color: #fff;
      background-color: #409eff;
      border: none;
      &:after {
        border: none;
      }
    }
  }
}
</style>
