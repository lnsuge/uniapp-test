<template lang='pug'>
  .container
    app-image(
      v-for="(item, index) in ads"
      @tap="handAd(item)"
      :src="item.resource"
      :key="index"
      :mergeStyle="adImageStyle")
</template>

<script>
import _ from 'lodash'
import { navigate } from '@/tools/navigate'

import AppImage from '@/components/app-image/image'

export default {
  components: { AppImage },

  data () {
    return {
      ads: [],
    }
  },

  computed: {
    adImageStyle () {
      return `
        width: 100%;
        margin-top: 20rpx;
        vertical-align: middle;
        box-shadow: 0 3px 3px rgba(106,106,106,.16);
        border-radius: 6rpx;
      `
    },

    business () {
      return _.get(this.$store.state.commons, 'business')
    },
  },

  watch: {
    business () {
      this.getAds()
    },
  },

  methods: {
    handAd (item) {
      if (item.jump) {
        navigate(item.jump)
      }

      let arr = uni.getStorageSync('UnShowAdCodes') || []

      // 标记点击后取消展示的广告，并存入微信缓存内
      if (item.showMode === 'click') {
        if (!_.includes(arr, item.no)) {
          arr.push(item.no)
        }
        uni.setStorageSync('UnShowAdCodes', arr)
      }

      this.getAds()
    },

    getAds () {
      let arr = uni.getStorageSync('UnShowAdCodes') || []

      const data = _.get(this.$store.state.app, `config.ads.IMAGE_HOME_BOTTOM_${this.business}`, [])

      // 过滤出需要显示的广告
      this.ads = data.filter((item) => !_.includes(arr, item.no))

      // 标记只显示一次的广告，并存入微信缓存内
      _.forEach(this.ads, (item) => {
        if (item.showMode === 'once') {
          if (!_.includes(arr, item.no)) {
            arr.push(item.no)
          }
          uni.setStorageSync('UnShowAdCodes', arr)
        }
      })
    },
  },

  created () {
    this.getAds()
  },
}
</script>

<style lang='scss' scoped>
.container {
  box-sizing: border-box;
  width: 100vw;
  padding: 0 20rpx 20rpx 20rpx;
}
</style>
