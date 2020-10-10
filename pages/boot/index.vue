<template lang="pug">
  .container
    .title-wrapper
      .title 启动页
      view.version Ver {{ version }}
    .error(v-if="showError") 正在启动
</template>

<script>
import _ from 'lodash'

import { APP_INIT } from '@/store/modules/app/keys'

export default {

  data () {
    return {
      isReady: false,
      launchTime: 0,
      showError: false,
    }
  },

  computed: {
    version () {
      return _.get(this.$store.state, 'app.version')
    },

    isPersist () {
      return _.get(this.$store.state, 'app.auth.isPersist', false)
    },
  },

  methods: {
    async launch () {
      // 判断是否已登录
      // if (this.isPersist) {}
    },

    async init () {
      let doing = true
      while (doing) {
        try {
          await this.$store.dispatch(APP_INIT)

          doing = false
          // 延迟至少 1.5 秒切换
          const cost = Date.now() - this.launchTime
          setTimeout(() => {  uni.switchTab({ url: '/pages/home/index' }) }, Math.max(1500 - cost, 0))
        } catch (error) {
          this.showError = true
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      }
    },
  },

  onLoad () {
    this.init()
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
</style>
