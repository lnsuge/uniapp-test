<template lang='pug'>
  .container(v-if="city.name")
    button.user(v-if="isPersist" @tap="getUserInfo")
      app-icon(type='user' :size='24' color="#2D2D2D")
    button.user(v-else open-type="getPhoneNumber" @getphonenumber="handleGetPhoneNumber")
      app-icon(type='user' :size='24' color="#2D2D2D")
    .line
    .city(@tap='hangleCity')
      .cityName {{ city.name }}
      app-icon.dropDown(type='drop-down' :size='18' color='#333333')
</template>

<script>
import _ from 'lodash'
import * as getAuth from '@/common/auth'

import AppIcon from '@/components/icon'

export default {
  props: {
    city: {},
  },

  components: { AppIcon },

  computed: {
    isPersist () {
      return _.get(this.$store.state, 'app.userInfo.mobile', undefined) ? true : false
    },
  },

  methods: {
    hangleCity () {
      uni.navigateTo({ url: '/public/city-list/index?level=1' })
    },

    getUserInfo () {
      this.$emit('func')
    },

    async handleGetPhoneNumber ({ detail }) {
      await getAuth.getUserInfo(detail)
      if (detail.errMsg !== 'getPhoneNumber:ok') return
      this.$emit('func')
    },
  },
}
</script>

<style lang='scss' scoped>
.container {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 220rpx;
  height: 100%;
  background: rgba(255, 255, 255, .79);
  border-radius: 32rpx;
  opacity: .8;
  .user {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    height: 100%;
    padding: 0;
    margin: 0;
    background: transparent;
    border-radius: 32rpx;
    opacity: .8;
    &:after {
      border: none;
    }
  }
  .line {
    width: 1rpx;
    height: 40rpx;
    background: #ddd;
  }
  .city {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5rpx 16rpx;
    .cityName {
      margin-right: 10rpx;
      font-size: 24rpx;
    }
    .dropDown {
      display: flex;
    }
  }
  .drawer {
    z-index: 999;
  }
}
</style>
