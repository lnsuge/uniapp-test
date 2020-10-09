<template lang="pug">
  view.container
    app-icon.icon(@tap='handBack' type="warm" :size="80" color="#d3d3d3")
    view.title {{ error }}
    view.button(@tap="handleRefresh") {{ buttonText }}
</template>

<script>
import AppIcon from '@/components/icon'

export default {
  components: { AppIcon },
  props: {
    error: {
      type: String,
    },
    buttonText: {
      type: String,
      default: '重新下单',
    },
  },
  methods: {
    handleRefresh () {
      uni.navigateBack({ delta: 1 })
    },
  },
}
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 470rpx;
  margin: 0 60rpx;

  .title {
    color: #aaa;
    font-size: 28rpx;
    text-align: center;
  }

  .button {
    width: 100%;
    padding: 30rpx 20rpx;
    color: #fff;
    font-size: 28rpx;
    font-weight: bold;
    text-align: center;
    background-color: #407fea;
    border-radius: 6rpx;
  }
}
</style>
