<template lang="pug">
  .container
    .title
      view.text
        .use-text 费用信息
      .cancel(@tap="handHide")
        app-icon.icon(type="cancel" :size="32" color="#c0c0c0")
    .content
      .price
        .price-name 车费
        .price-num ￥{{ priceDetail.price / 100 }}
      .detail
        .detail-title 费用说明
        .detail-content
          .price-item 费用包含
          .text 包含本次用车的车辆使用费、路桥费、高速费、停车费、司机服务费、拥堵费、油费。
          .price-item 费用不含
          .text 不含用车的超时等待费、与用车无直接关联的费用（如景区门票等）。
          .price-item 注意
          .text 接送机为一口价，不接受中途经停、绕路、临时变更线路。
</template>

<script>
import AppIcon from '@/components/icon'

export default {
  components: { AppIcon },
  props: {
    priceDetail: {
      type: Object,
    },
  },

  methods: {
    handHide () {
      this.$emit('handHide')
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
  height: 620rpx;
  padding-bottom: 20rpx;
  margin: 0 20rpx;
  margin-bottom: 16rpx;
  background-color: #fff;
  box-shadow: 0 3px 3px rgba(106,106,106,.16);
  border-radius: 6rpx;
  .title {
    z-index: 10000;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 96rpx;
    padding-left: 44rpx;
    background-color: #fff;
    border-bottom: 1rpx solid rgba(233, 233, 233, .7);
    .text {
      display: flex;
      align-items: center;
      height: 100%;
      color: #414141;
      .use-text {
        margin-right: 20rpx;
        font-size: 32rpx;
        font-weight: 800;
      }
      .text-one {
        font-size: 28rpx;
        font-weight: 400;
      }
    }
    .cancel {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 90rpx;
      height: 100%;
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    flex: 1;
    .price {
      display: flex;
      align-items: center;
      height: 88rpx;
      padding-left: 40rpx;
      color: #6a6a6a;
      font-size: 28rpx;
      border-bottom: 1rpx solid rgba(233, 233, 233, .7);
      .price-name {
        margin-right: 40rpx;
      }
    }
    .detail {
      display: flex;
      flex-direction: column;
      flex: 1;
      color: #555;
      font-size: 28rpx;
      .detail-title {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 90rpx;
      }
      .detail-content {
        flex: 1;
        padding-left: 20rpx;
        color: #969696;
        .price-item {
          margin: 10rpx 0;
          font-size: 28rpx;
          font-weight: bold;
        }
        .text {
          font-size: 24rpx;
        }
      }
    }
  }
}
</style>
