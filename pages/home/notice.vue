<template lang="pug">
  .notice
    .icon
      app-icon(type="inform" :size="34" color="#B7B7B7")
    .text
      swiper.swiper(
        :interval="5000"
        :circular="true"
        :autoplay="true")
        swiper-item.swiper-item(
          v-for="(item, index) in notices"
          @tap="handleNotice(item)"
          :key="index")
          .title {{ item.resource }}
</template>

<script>
import _ from 'lodash'
import { navigate } from '@/tools/navigate'
import AppIcon from '@/components/icon'

export default {
  components: { AppIcon },

  data () {
    return {
      notices: [],
    }
  },

  methods: {
    handleNotice (item) {
      if (item.jump) {
        navigate(item.jump)
      }

      let arr = uni.getStorageSync('UnShowAdCodes') || []

      // 标记点击后取消展示的公告，并存入微信缓存内
      if (item.showMode === 'click') {
        if (!_.includes(arr, item.no)) {
          arr.push(item.no)
        }
        uni.setStorageSync('UnShowAdCodes', arr)
      }

      this.getNotices()
    },

    getNotices () {
      let arr = uni.getStorageSync('UnShowAdCodes') || []

      const data = _.get(this.$store.state.app, 'config.ads.TEXT_HOME_NOTICE', [])

      // 过滤出需要显示的公告
      this.notices = data.filter((item) => !_.includes(arr, item.no))

      // 标记只显示一次的公告，并存入微信缓存内
      _.forEach(this.notices, (item) => {
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
    this.getNotices()
  },
}
</script>

<style lang="scss" scoped>
.notice {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 22rpx;
  margin-bottom: 20rpx;
  background: rgba(255,255,255,1);
  box-shadow: 0 6rpx 6rpx rgba(106,106,106,.16);
  border-radius: 6rpx;

  .icon {
    margin-right: 12rpx;
  }

  .text {
    flex: 1;

    .swiper {
      height: 80rpx;

      .swiper-item {
        height: 80rpx;
        line-height: 80rpx;

        .title {
          overflow: hidden;
          color: rgba(147,147,147,1);
          font-size: 24rpx;
          font-weight: 400;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
