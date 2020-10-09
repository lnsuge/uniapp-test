<template lang='pug'>
  .container(v-if="orderProcess.length" :style='containerMarginTop')
    .content(v-for="(item, index) in orderProcess" :key="index")
      .title 您有一个进行中的订单
      .btn(@tap="handOrderTap(item)") 去查看
</template>

<script>
import _ from 'lodash'

export default {
  computed: {
    orderProcess () {
      return _.get(this.$store.state.order, 'orderProcess')
    },

    business () {
      return _.get(this.$store.state.commons, 'business')
    },

    containerMarginTop () {
      return this.business === 'PD04' ? 'margin-top: 60rpx;' : 'margin-top: 20rpx;'
    },
  },

  methods: {
    // 跳转对应业务订单
    handOrderTap (record) {
      const url = `/${(record.productType).toLowerCase()}/${(record.productType).toLowerCase()}-process/index?superNo=${record.superNo}`
      uni.navigateTo({ url })
    },
  },
}
</script>

<style lang='scss' scoped>
.container {
  box-sizing: border-box;
  padding: 0 20rpx;
  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 90rpx;
    padding: 0 32rpx;
    margin-top: 20rpx;
    font-size: 28rpx;
    background-color: #fff;
    .title {
      font-weight: bold;
    }
    .btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 140rpx;
      height: 60rpx;
      color: #fff;
      font-size: 26rpx;
      background-color: #409eff;
      border-radius: 6rpx;
    }
  }
}
</style>
