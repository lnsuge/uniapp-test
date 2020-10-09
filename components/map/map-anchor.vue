<template lang="pug">
  view.anchor
    view.pin
      view.top(:animation="animationTop")
        view(v-show="isShow")
          ext-map-bubble.bubble(:is-time="isTime")
        view.circle
          view.inner-circle
        view.leg
      view.shadow(:animation="animationShadow")
    view.ripple
</template>

<script>
import ExtMapBubble from './map-bubble'
export default {
  components: { ExtMapBubble },

  props: {
    isMove: { default: 0 },
    isShow: { default: true },
    isTime: null,
  },

  watch: {
    isMove (newVal) {
      this.topAnimation(newVal)
      this.shadowAnimation(newVal)
    },
  },

  data () {
    return {
      animationTop: {},
      animationShadow: {},
    }
  },

  methods: {
    topAnimation (isOffset = 1) {
      switch (isOffset) {
        case 1:
          // top向上偏移
          this.tAnimation.translate(0, -10).step({ duration: 300 })
          this.animationTop = this.tAnimation.export()
          break
        case 2:
          // top复位
          this.tAnimation.translate(0, 0).step({ duration: 300 })
          this.animationTop = this.tAnimation.export()
          break
        default:
          break
      }
    },

    shadowAnimation (isOffset = 0) {
      switch (isOffset) {
        //锚点底部阴影缩放
        case 2:
          this.sAnimation.scale(3, 4).step({ duration: 1000 })
          this.animationShadow = this.sAnimation.export()
          setTimeout(() => {
            this.sAnimation.scale(1, 1).step({ duration: 800 })
            this.animationShadow = this.sAnimation.export()
          }, 500)
          break
        default:
          break
      }
    },
  },

  onReady () {
    const tAnimation = uni.createAnimation({
      timingFunction: 'ease',
      delay: 0,
    })
    const sAnimation = uni.createAnimation({
      timingFunction: 'ease',
      delay: 0,
    })
    this.tAnimation = tAnimation
    this.sAnimation = sAnimation
  },
}
</script>

<style lang="scss" scoped>
.anchor {
  position: relative;
  display: flex;
  justify-content: center;
  pointer-events: none;
}
.ripple {
  position: absolute;
}
.pin {
  display: flex;
  flex-direction: column;
  align-items: center;
  .top {
    display: flex;
    flex-direction: column;
    align-items: center;
    .circle {
      position: relative;
      z-index: 100;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 44rpx;
      height: 44rpx;
      background: rgba(241,134,53,1);
      border: 4rpx solid #fafafa;
      border-radius: 50%;

      .inner-circle {
        width: 20rpx;
        height: 20rpx;
        background-color: #fafafa;
        border-radius: 50%;
      }
    }

    .bubble {
      position: relative;
      z-index: 100;
    }

    .leg {
      position: relative;
      top: -4rpx;
      z-index: 99;
      width: 4rpx;
      height: 30rpx;
      background-color: rgba(241,134,53,1);
      border-radius: 8rpx;
    }
  }
  .shadow {
    position: relative;
    top: -6rpx;
    width: 18rpx;
    height: 8rpx;
    background-color: rgba(241,134,53,.4);
    border-radius: 50%;
    animation: myfirst 3s;
  }
}
@keyframes myfirst {
  from {
    bottom: 0rpx;
  }
  to {
    bottom: 10rpx;
  }
}
</style>
