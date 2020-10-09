<template lang='pug'>
  .container
    .head
      open-data(type="userAvatarUrl")
    .nickName {{ userPhone }}
    ext-item(:iconType="'order'" :title="'我的订单'" @tap="handelItem('order')")
    view(v-if="show")
      view.sub(@tap="handelList('PD03')") 打车
      view.sub(@tap="handelList('PD02')") 接送机
      view.sub(@tap="handelList('PD06')") 企业用车
      view.sub(@tap="handelList('PD01')") 定制班线
      view.sub(@tap="handelList('PD04')") 城际用车
    ext-item(:iconType="'safe-center'" :title="'安全中心'" @tap="handelItem('safe-center')")
    ext-item(:iconType="'customer'" :title="'联系客服'" @tap="handelItem('customer')")
    ext-item(:iconType="'ticket-fill'" :title="'发票信息'" @tap="handelItem('ticket')")
</template>

<script>
import _ from 'lodash'

import AppIcon from '@/components/icon'

import ExtItem from '@/pages/home/item'

export default {
  props: {
    avatarUrl: { default: '' },
  },

  components: { AppIcon, ExtItem },

  data () {
    return {
      show: false,
    }
  },

  computed: {
    userPhone () {
      const mobile = _.get(this.$store.state, 'app.userInfo.mobile', '')
      return mobile.length === 11 ? (mobile.substring(0, 3) + '****' + mobile.substring(7, 11)) : mobile
    },

    customService () {
      return _.get(uni.getStorageSync('config'), 'customService', '4006510871')
    },
  },

  methods: {
    handelItem (type) {
      switch (type) {
        case 'order':
          this.show = !this.show
          break
        case 'safe-center':
          uni.navigateTo({ url: '/public/police-call/index' })
          break
        case 'customer':
          uni.makePhoneCall({
            phoneNumber: this.customService,
          })
          break
        case 'ticket':
          uni.navigateTo({ url: '/pagesInvoice/invoice/index' })
          break
        default:
          break
      }
    },

    handelList (type) {
      switch (type) {
        case 'PD01':
        case 'PD02':
        case 'PD03':
        case 'PD06':
        case 'PD04':
          uni.navigateTo({ url: `/public/order-list/index?productType=${type}` })
          break
        default:
          uni.navigateToMiniProgram({
            appId: 'wx0e42e25594debebd', 
            path: '/pages/order-list/order-list',
          })
          break
      }
    },
  },
}
</script>

<style lang='scss' scoped>
.container {
  display: flex;
  flex-direction: column;

  .head {
    overflow: hidden;
    width: 120rpx;
    height: 120rpx;
    margin: 0 auto;
    margin-top: 160rpx;
    border-radius: 50%;
  }

  .nickName {
    display: flex;
    justify-content: center;
    margin-top: 12rpx;
    margin-bottom: 80rpx;
    color: black;
    font-size: 28rpx;
    font-weight: 400;
  }

  .sub {
    padding: 0 0 40rpx 80rpx;
    color: #555;
  }
}
</style>
