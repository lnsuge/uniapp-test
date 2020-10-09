<template lang="pug">
  .widget(:style="style" :class="classes")
    .wrapper(:class="wrapperClass")
      swiper.card(
        :interval="3000"
        :circular="true"
        :indicator-dots="true"
        :autoplay="true")
        swiper-item.card(
          v-for="(item, index) in modals"
          :key="index")
          image.card(
            :src="item.resource"
            mode="aspectFit"
            @tap="handleImage(item)")
      .close(@tap.stop="close" v-if="closeable && anime === 1" )
        app-icon(type="close" color="#eee" size="40")
</template>

<script>
import _ from 'lodash'

import AppIcon from './icon'

import { navigate } from '@/tools/navigate'

export default {
  components: { AppIcon },

  props: {
    placeCode: String,
  },

  data () {
    return {
      state: 0,
      anime: 0,
      closeable: true,
      modals: [],
    }
  },

  computed: {
    wrapperClass () {
      return this.anime === 1 ? 'show' : ''
    },

    classes () {
      return this.anime === 1 ? 'show' : ''
    },

    style () {
      return this.state === 1 ? 'display: flex' : 'display: none'
    },
  },

  methods: {
    open () {
      this.state = 1
      this.anime = 1
    },

    close () {
      this.anime = 0
      setTimeout(() => { this.state = 0 }, 250)
      this.$emit('close')
    },

    handleImage (item) {
      if (item.jump) {
        navigate(item.jump)
      }

      let arr = uni.getStorageSync('UnShowAdCodes') || []

      // 标记点击后取消展示的模态框广告，并存入微信缓存内
      if (item.showMode === 'click') {
        if (!_.includes(arr, item.no)) {
          arr.push(item.no)
        }
        uni.setStorageSync('UnShowAdCodes', arr)
      }

      this.getModals()
  
      this.$emit('click')
    },

    getModals () {
      let arr = uni.getStorageSync('UnShowAdCodes') || []

      const ads = _.get(this.$store.state.app, `config.ads.${[this.placeCode]}`, [])

      // 过滤出需要显示的模态框广告
      this.modals = ads.filter((item) => !_.includes(arr, item.no))

      // 标记只显示一次的模态框广告，并存入微信缓存内
      _.forEach(this.modals, (item) => {
        if (item.showMode === 'once') {
          if (!_.includes(arr, item.no)) {
            arr.push(item.no)
          }
          uni.setStorageSync('UnShowAdCodes', arr)
        }
      })

      if (this.modals.length > 0) {
        this.open()
      } else {
        this.close()
      }
    },
  },

  created () {
    this.getModals()
  },
}
</script>

<style lang="scss" scoped>
.widget {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: rgba(65, 70, 92, 0);
  transition: background-color ease-in 200ms;

  &.show {
    background-color: rgba(65, 70, 92, .7);
  }
}

.wrapper {
  position: relative;
  top: -500rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all ease-in 250ms;
  opacity: 0;

  &.show {
    top: 0;
    opacity: 1;
  }
}

.card {
  overflow: hidden;
  width: 500rpx;
  height: 750rpx;
  margin: 0 auto;
  border-radius: $uni-border-radius-lg;
}

.close {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 160rpx;
  height: 160rpx;
}
</style>

