<template lang="pug">
  .nav-wrap(:style="{ 'height': (statusHeight + navHeight) + 'px' }")
    .status(:style="{'height': statusHeight + 'px' }")
    .home-icon(:style="{ 'top': (statusHeight + statusMargin) + 'px' }")
      app-icon.icon(:type="iconType" :size="40" color="#000")
</template>

<script>
let sysinfo = uni.getSystemInfoSync()
let isiOS = sysinfo.system.indexOf('iOS') > -1

import AppIcon from '@/components/icon'

export default {
  components: { AppIcon },

  props: {
    iconType: {
      type: String,
      default: 'home',
    },
  },

  computed: {
    navHeight () {
      let navHeight = 0
      if (!isiOS) {
        navHeight = 48
      } else {
        navHeight = 44
      }
      return navHeight
    },

    statusMargin () {
      let line = 0
      if (!isiOS) {
        line = 8
      } else {
        line = 6
      }
      return line
    },

    statusHeight () {
      return sysinfo.statusBarHeight
    },
  },

  created () {
    this.$emit('getNavHeigt', this.statusHeight + this.navHeight)
  },
}
</script>

<style lang="scss" scoped>
.nav-wrap {
  position: fixed;
  top: 0;
  z-index: 1000;
  width: 100%;
  .home-icon {
    position: absolute;
    left: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    width: 34px;
    height: 34px;
    background: rgba(255, 255, 255, .7);
    border: 1rpx solid rgba(111, 111, 111, .1);
    border-radius: 50%;
  }
}
</style>
