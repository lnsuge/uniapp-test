<template lang='pug'>
  .container
    .head
      .item(v-for="item in items" :key="item.code" @tap='clickItem(item)')
        .text(:class="pickType === item.code ? 'active' : ''") {{ item.name }}
    //- 接机表单
    template(v-if="pickType === 'pickUp'")
      .site
        .row
          .circle.origin
          .placeholder(v-if="!pd02StartFlight.code" @tap='handleFligt()') 请选择航班
          .flight(v-else @tap='handleFligt()')
            .code {{ pd02StartFlight.code }}
            .time {{ pd02StartFlight.arriveDate }} {{ pd02StartFlight.arriveTime }} 抵达 {{ pd02StartFlight.arrive }}
      .line
      .site
        .row
          .circle.blue
          .placeholder(v-if="!pd02End.name" @tap='handleSite("pd02End")') 请选择到达位置
          .address(v-if="pd02End.name" @tap='handleSite("pd02End")') {{ pd02End.name }}
      .history(v-if="pickType === 'pickUp'")
        .title(v-for='(item, index) in siteHistoryList' :key='index' @tap="handleRecommend('pd02End', item)") {{ item.name }}

    //- 送机表单
    template(v-if="pickType === 'dropOff'")
      .site
        .row
          .circle.origin
          .address(v-if="start.name && start.name !== pd02StartFlight.arriveLocation[0].name" @tap='handleSite("start")') {{ start.name }}
          .placeholder(v-else @tap='handleSite("start")') 请选择出发位置
      .history
        .title(v-for='(item, index) in commonsParkings' :key='index' @tap="handleRecommend('start', item.location)") {{ item.location.name }}
      .line
      .site
        .row
          .circle.blue
          .placeholder(v-if="!pd02EndAirport.name" @tap='handlePd02AirportList()') 请选择到达位置
          .address(v-if="pd02EndAirport.name" @tap='handlePd02AirportList()') {{ pd02EndAirport.name }}
      .history
        .title(v-for='(item, index) in flyAirports' :key='index' @tap="handleRecommend('pd02EndAirport', item)") {{ item.name }}
      .line
      .site(@tap='handleDateTime()')
        .row
          app-icon.clock(type='clock' :size='24' color="#AFAFAF")
          .useTime(v-if="useTime") {{ useTime }}
          .placeholder(v-else) 请选择用车时间
</template>

<script>
import _ from 'lodash'

import AppIcon from '@/components/icon'

import { PD02_CHANGE_PARAMS, PD02_FLY_AIRPORT } from '@/store/modules/pd02/keys'
import { COMMONS_SITE_HISTORY_LIST } from '@/store/modules/commons/keys'

export default {
  props: {
    start: {},
    pd02StartFlight: {},
    pd02End: {},
    pd02EndAirport: {},
    city: {},
    useTime: { default: '' },
  },

  components: { AppIcon },

  data () {
    return {
      items: [
        {
          name: '接机',
          code: 'pickUp',
        },
        {
          name: '送机',
          code: 'dropOff',
        }
      ],
      // 机场信息
      flyAirports: [],
      // 下车点历史记录
      siteHistoryList: [],
    }
  },

  computed: {
    pickType () {
      return _.get(this.$store.state.pd02, 'pickType')
    },

    commonsParkings () {
      return _.get(this.$store.state.commons, 'commonsParkings')
    },

    business () {
      return _.get(this.$store.state.commons, 'business')
    },

    cityAdCode () {
      return _.get(this.city, 'adCode')
    },
  },

  watch: {
    cityAdCode () {
      if (this.cityAdCode) {
        this.historyList('site')
        this.fetchFlyAirport()
      }
    },
  },

  methods: {
    clickItem (item) {
      this.$store.commit(PD02_CHANGE_PARAMS, { key: 'pickType', value: item.code })
    },

    handlePd02AirportList () {
      uni.navigateTo({ url: `/pd02/pd02-airport-list/index?cityCode=${this.cityAdCode}` })
    },

    // 显示选择日期时间组件
    handleDateTime () {
      this.$emit('formChange', 'isShowLayout', true)
    },

    // 跳转到位置选择页面
    handleSite (direction) {
      if (direction === 'pd02End' && _.isEmpty(this.pd02StartFlight)) {
        uni.showModal({
          title: '温馨提示',
          content: '请先选择航班',
        })
        return
      }
      const level = direction === 'start' ? 2 : 0
      uni.navigateTo({ url: `/public/site-list/index?level=${level}&productType=PD02&direction=${direction}&city=${JSON.stringify(this.city)}` })
    },

    // 跳转到航班选择页面
    handleFligt () {
      uni.navigateTo({ url: '/pd02/pd02-flight/index' })
    },

    handleRecommend (key, value) {
      if (key === 'pd02End' && _.isEmpty(this.pd02StartFlight)) {
        uni.showModal({
          title: '温馨提示',
          content: '请先选择航班',
        })
        return
      }
      this.$emit('formChange', key, value)
    },

    // 查询机场信息
    async fetchFlyAirport () {
      const { adCode } = this.city
      const payload = {
        cityCode: adCode,
      }
      const { data } = await this.$store.dispatch(PD02_FLY_AIRPORT, payload)
      this.flyAirports = data
    },

    // 获取下车位置历史记录
    async historyList (type) {
      const payload = {
        productType: 'PD02',
        adCode: this.cityAdCode,
        type: type,
      }

      const { data } = await this.$store.dispatch(COMMONS_SITE_HISTORY_LIST, payload)
      this.siteHistoryList = data
    },
  },

  async created () {
    if (this.cityAdCode) {
      await this.historyList('site')
      await this.fetchFlyAirport()
    }
  },

  // mounted () {
  //   this.$emit('formHeight')
  // },
}
</script>

<style lang='scss' scoped>
.container {
  width: 100%;
  .head {
    display: flex;
    box-sizing: border-box;
    height: 100rpx;
    border-bottom: 2rpx solid rgba(228, 228, 228, 1);
    .item {
      box-sizing: border-box;
      width: 50%;
      height: 100rpx;
      .text {
        box-sizing: border-box;
        width: 136rpx;
        height: 100rpx;
        margin: auto;
        color: rgba(0, 0, 0, 1);
        font-size: 24rpx;
        font-weight: 400;
        line-height: 100rpx;
        text-align: center;
      }
      .active {
        border-bottom: 5rpx solid rgba(69, 149, 253, 1);
      }
    }
  }

  .site {
    .row {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 100rpx;
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
        height: 100rpx;
        font-size: 28rpx;
        line-height: 100rpx;
      }
      .placeholder {
        flex: 1;
        height: 100rpx;
        color: #cfcfcf;
        font-size: 28rpx;
        line-height: 100rpx;
      }
      .clock {
        margin-right: 10rpx;
      }
      .useTime {
        color: rgba(207, 207, 207, 1);
      }
      .flight {
        flex: 1;
        .code {
          color: rgba(36, 36, 36, 1);
          font-size: 28rpx;
          font-weight: 400;
          line-height: 40rpx;
        }
        .time {
          color: rgba(241, 134, 53, 1);
          font-size: 24rpx;
          font-weight: 400;
          line-height: 34rpx;
        }
      }
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
