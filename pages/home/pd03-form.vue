<template lang='pug'>
  .container
    .site(@tap='handleSite("start")')
      .circle.origin
      .address(v-if='start.name') {{ start.name }}
      .placeholder(v-else) 请选择出发位置
    .history
      .title(v-for='(item, index) in commonsParkings' :key='index' @tap="handleRecommend('start', item.location)") {{ item.location.name }}
    .line
    .site(@tap='handleSite("pd03End")')
      .circle.blue
      .address(v-if='pd03End.name') {{ pd03End.name }}
      .placeholder(v-else) 您要去哪里
    .history
      .title(v-for='(item, index) in siteHistoryList' :key='index' @tap="handleRecommend('pd03End', item)") {{ item.name }}
</template>

<script>
import _ from 'lodash'

import { COMMONS_SITE_HISTORY_LIST } from '@/store/modules/commons/keys'

export default {
  props: {
    start: {},
    pd03End: {},
    city: {},
  },

  data () {
    return {
      // 下车点历史记录
      siteHistoryList: [],
    }
  },

  computed: {
    commonsParkings () {
      return _.get(this.$store.state.commons, 'commonsParkings')
    },

    cityAdCode () {
      return _.get(this.city, 'adCode')
    },

    business () {
      return _.get(this.$store.state.commons, 'business')
    },
  },

  watch: {
    cityAdCode () {
      if (this.cityAdCode) {
        this.historyList('site')
      }
    },
  },

  methods: {
    handleSite (direction) {
      const level = direction === 'start' ? 2 : 0
      uni.navigateTo({ url: `/public/site-list/index?level=${level}&direction=${direction}&city=${JSON.stringify(this.city)}` })
    },

    handleRecommend (key, value) {
      if (key === 'start') {
        this.$emit('formChange', key, value)
      } else {
        uni.navigateTo({ url: `/pd03/pd03-vehicle/index?start=${JSON.stringify(this.start)}&end=${JSON.stringify(value)}&city=${JSON.stringify(this.city)}` })
      }
    },

    // 获取下车位置历史记录
    async historyList (type) {
      const payload = {
        productType: 'PD03',
        adCode: this.cityAdCode,
        type: type,
      }

      const { data } = await this.$store.dispatch(COMMONS_SITE_HISTORY_LIST, payload)
      this.siteHistoryList = data
      // setTimeout(() => { this.$emit('formHeight') }, 300)
    },
  },

  async created () {
    if (this.cityAdCode) {
      await this.historyList('site')
    }
  },
}
</script>

<style lang='scss' scoped>
.container {
  .site {
    display: flex;
    align-items: center;
    padding: 25rpx 0;
    .circle {
      width: 20rpx;
      height: 20rpx;
      margin-right: 10rpx;
      border-radius: 50%;
    }
    .origin {
      background-color: #f5832b;
    }
    .blue {
      background-color: #2793e7;
    }
    .address {
      flex: 1;
      font-size: 28rpx;
    }
    .placeholder {
      flex: 1;
      color: #cfcfcf;
      font-size: 28rpx;
    }
  }

  .history {
    box-sizing: border-box;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
    &::-webkit-scrollbar {
      display: none;
    }
    .title {
      display: inline-block;
      box-sizing: border-box;
      padding: 6rpx 16rpx;
      margin-right: 56rpx;
      margin-bottom: 8rpx;
      color: #909090;
      font-size: 24rpx;
      background: rgba(240, 240, 240, 1);
      border-radius: 6px;
    }
  }

  .line {
    height: 2rpx;
    background: rgba(228, 228, 228, 1);
  }
}
</style>
