<template lang='pug'>
  .container(v-if="isShow")
    .card
      .row
        .title(@tap.stop="cancle")
          .text 请选择支付方式
          app-icon(type="app-cancel" :size="48")
        .content
          .prePay(v-for="(item, index) in payCompanyList" :key="index" @tap.stop="handleSure('enterprise', item)" :class="item.balance < orderAmount ? 'disable' : ''")
            .box
              .text {{ item.companyName }}
              .balce(v-if="item.balance >= orderAmount") 余额：￥{{ item.balance / 100 }}元
              .balce(v-else) 余额不足，剩余{{ item.balance / 100 }}元
          .weixinPay(@tap="handleSure('weixin', '')")
            .text 微信支付
</template>

<script>

import AppIcon from '@/components/icon'

export default {
  components: { AppIcon },
  props: {
    orderAmount: {
      default: 0,
      type: Number,
    },
  },
  data () {
    return {
      isShow: false,
      payCompanyList: [],
    }
  },

  methods: {
    open (businessConfigs) {
      this.payCompanyList = businessConfigs
      this.isShow = true
    },

    cancle () {
      this.isShow = false 
    },

    handleSure (payType, item) {
      switch (payType) {
        case 'weixin':
          break
        case 'enterprise':
          if (item.balance < this.orderAmount) return
          break
        default:
          break
      }
      this.$emit('change', payType, item.companyCode)
      this.isShow = false
    },
  },
}
</script>

<style lang='scss' scoped>
.container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, .5);

  justify-items: center;
  .card {
    width: 75%;
    margin: 0 auto;
    color: #2a2a2a;
    background: #fff;
    box-shadow: #888 0 0 8px;
    border-radius: 16rpx;
    .row {
      position: relative;
      font-size: 26rpx;
      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx 24rpx;
        font-size: 32rpx;
        font-weight: 500;
        border-bottom: 1rpx solid rgba(229, 229, 229, 1);
      }
      .content {
        overflow: scroll;
        max-height: 650rpx;
        color: #2a2a2a;
        font-family: "PingFang SC";
        font-size: 32rpx;
        font-weight: 400;
        .prePay {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 36rpx 0;
          font-size: 28rpx;
          border-bottom: 1rpx solid rgba(229, 229, 229, .6);
          .box {
            .balce {
              padding-top: 8rpx;
              color: #f18635;
              font-size: 24rpx;
            }
          }
        }
        .disable {
          color: #b0b0b0;
          opacity: .5;
          .box {
            .balce {
              color: #c0c0c0;
            }
          }
        }
        .weixinPay {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 56rpx 0;
        }
      }
    }
  }
}
</style>
