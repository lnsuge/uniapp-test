<template lang='pug'>
  .row
    app-icon.icon(:type="iconType" :size="36" color="#000")
    .title {{ title }}
</template>

<script>
import AppIcon from '@/components/icon'

export default {
  components: { AppIcon },

  props: {
    iconType: { default: '' },
    title: { default: '' },
  },
}
</script>

<style lang='scss' scoped>
.row {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 40rpx;

  .icon {
    margin-left: 24rpx;
  }

  .title {
    margin-left: 20rpx;
    font-size: 32rpx;
    font-weight: 400;
  }
}
</style>
