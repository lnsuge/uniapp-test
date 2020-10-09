<template lang="pug">
  .container
    .title-wrapper
      .logon
        app-image(:src="logo" :mergeStyle="logoStyle")
      .title 旅程约车
      view.version Ver {{ version }}
    .error(v-if="showError") 正在启动
    .copyright 2007 ~ {{ year }} &copy 云南天谷科技开发有限公司
</template>

<script>
import _ from 'lodash'
import { navigate } from '@/tools/navigate'

import AppImage from '@/components/app-image/image'

import { APP_INIT, APP_AUTH, APP_WHO, APP_LOGIN } from '@/store/modules/app/keys'
import { COMMONS_QR_SCAN } from '@/store/modules/commons/keys'

export default {
  components: { AppImage },

  data () {
    return {
      isReady: false,
      launchTime: 0,
      showError: false,
      logo: 'https://cloud.untrip.net/agreement/client/images/logo.png',
      // 扫码进入二维码code
      code: undefined,
    }
  },

  computed: {
    version () {
      return _.get(this.$store.state, 'app.version')
    },

    isPersist () {
      return _.get(this.$store.state, 'app.auth.isPersist', false)
    },

    year () {
      return new Date().getFullYear()
    },

    logoStyle () {
      return `
        width: 80px; height: 80px; border-radius: 50%;
      `
    },
  },

  methods: {
    async launch () {
      // 判断是否已登录
      if (this.isPersist) {
        await this.$store.dispatch(APP_LOGIN)
      }
    },

    getLoge () {
      const { logo } = uni.getStorageSync('config')
      if (logo) {
        this.logo = logo
      }
    },

    getQrCode (q) {
      const url = decodeURIComponent(q)
      if (_.startsWith(url, 'https://qr.untrip.net/')) {
        const code = url.split('https://qr.untrip.net/')[1]
        this.code = code
      }
    },

    async fetchQrScan (code) {
      const payload = {
        code,
      }
      const { data } = await this.$store.dispatch(COMMONS_QR_SCAN, payload)
      navigate(data.route)
    },

    async init () {
      let doing = true
      while (doing) {
        try {
          // eslint-disable-next-line no-await-in-loop
          await this.$store.dispatch(APP_INIT)
          // eslint-disable-next-line no-await-in-loop
          await this.$store.dispatch(APP_AUTH)
          // eslint-disable-next-line no-await-in-loop
          await this.$store.dispatch(APP_WHO)
          doing = false
          // 延迟至少 1.5 秒切换
          // const cost = Date.now() - this.launchTime
          // setTimeout(this.launch, Math.max(1500 - cost, 0))
          // eslint-disable-next-line no-await-in-loop
          await this.launch()
          if (this.code) {
            // eslint-disable-next-line no-await-in-loop
            try {
              // eslint-disable-next-line no-await-in-loop
              await this.fetchQrScan(this.code)
            } catch (error) {
              navigate('page://redirectTo/pages/home/index')
            }
          } else {
            navigate('page://redirectTo/pages/home/index')
          }
        } catch (error) {
          this.showError = true
          // eslint-disable-next-line no-await-in-loop
          // await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      }
    },
  },

  onLoad (option) {
    const { q } = option
    this.option = option
    if (q) {
      this.getQrCode(q)
    }
    this.getLoge()
    this.init()
  },

  onShareAppMessage () {
    return {
      title: '旅程约车',
      path: '/pages/boot/index',
    }
  },

  onShow () {
    this.launchTime = Date.now()
  },
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.title-wrapper {
  position: relative;
  margin-top: -256rpx;
  text-align: center;
}
.title {
  margin-top: 94rpx;
  color: #3a3a3a;
  font-size: 32rpx;
  font-weight: 400;
}
.version {
  display: inline-block;
  padding: 0 8rpx;
  margin: 0 auto;
  margin-top: 94rpx;
  color: #cacaca;
  font-size: 28rpx;
}
.error {
  position: fixed;
  right: 0;
  bottom: 192rpx;
  left: 0;
  color: #acacac;
  font-size: 28rpx;
  text-align: center;
}
.copyright {
  position: fixed;
  right: 0;
  bottom: 32rpx;
  left: 0;
  color: #acacac;
  font-size: 24rpx;
  text-align: center;
}
</style>
