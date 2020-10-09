<template lang="pug">
  .tabsContent
    .tabs
      .tab(
        v-for='(item, index) in businesses'
        :key='index'
        :class="business === item.code ? 'active' : ''"
        @tap='handleTap(item)') {{ item.name }}
    .right(@tap='handleMoreBusiness')
      app-icon.business(type='business' :size='36' color="#A2A2A2")
</template>

<script>
import _ from 'lodash'
import { navigate } from '@/tools/navigate'

import AppIcon from '@/components/icon'

import { COMMONS_CHANGE_PARAMS } from '@/store/modules/commons/keys'

export default {
  components: { AppIcon },

  props: {
    city: {},
  },

  computed: {
    business () {
      return _.get(this.$store.state.commons, 'business')
    },

    businesses () {
      return _.get(this.$store.state.commons, 'businessConfig.business')
    },
  },

  methods: {
    handleTap (item) {
      const { type, extra, code } = item
      if (type === 'emit') {
        this.$store.commit(COMMONS_CHANGE_PARAMS, { key: 'business', value: code })
      }
      if (type === 'minapp') {
        navigate(`minapp://${extra.appId}${extra.path}`)
      }
    },

    // 跳转到更多业务页面
    handleMoreBusiness () {
      uni.navigateTo({ url: '/public/business/index' })
    },

    buildUrl (url, params) {
      const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
      return queryString.length > 0 ? `${url}?${queryString}` : url
    },
  },
}
</script>

<style lang="scss" scoped>
.tabsContent {
  display: flex;
  align-items: center;
  padding: 16rpx 16rpx 16rpx 32rpx;
  background-color: #f9f9f9;

  .tabs {
    flex: 1;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
    &::-webkit-scrollbar {
      display: none;
    }
    .tab {
      display: inline-block;
      box-sizing: border-box;
      padding: 8rpx 24rpx;
      margin-right: 50rpx;
      color: #000;
      font-size: 24rpx;
      font-weight: 400;
      border: 2rpx solid transparent;
      border-radius: 100rpx;
    }
    .active {
      color: #f18635;
      border-color: rgba(241, 134, 53, 1);
    }
  }
  .right {
    display: flex;
    width: 60rpx;
    height: 52rpx;
    .business {
      margin: auto;
    }
  }
}
</style>

