<template lang='pug'>
  .container
    .circle
      app-icon.icon(type='shield' :size='34' color="#407FEA")
    .right
      .text 安全中心
</template>

<script>
import AppIcon from '@/components/icon'

export default {
  components: { AppIcon },
}
</script>

<style lang='scss' scoped>
.container {
  position: relative;
  display: flex;
  align-items: center;
  .circle {
    z-index: 9;
    display: flex;
    width: 68rpx;
    height: 68rpx;
    background: rgba(255,255,255,1);
    border-radius: 50%;
    .icon {
      margin: auto;
    }
  }
  .right {
    position: absolute;
    left: 40rpx;
    display: flex;
    width: 160rpx;
    height: 50rpx;
    background: rgba(64,127,234,1);
    box-shadow: 0 6rpx 6rpx rgba(106,106,106,.16);
    border-radius: 0 100rpx 100rpx 0;
    .text {
      margin: auto;
      color: rgba(255,255,255,1);
      font-size: 24rpx;
      font-weight: 400;
      line-height: 26rpx;
      text-align: right;
    }
  }
}
</style>
