<template lang='pug'>
  .container
    .address
      .item(@tap="handCity('0')")
        .placehold(v-if="!startCity.name") 出发地
        .start(v-else) {{ startCity.name }}
      .item(@tap="handleChangeSite")
        app-icon(type='change-site' :size="80" color="#2CBF4A")
      .item(@tap="handCity('1')")
        .placehold(v-if="!endCity.name") 目的地
        .end(v-else) {{ endCity.name }}
    .dateRow
      .left(@tap="handleDay('reduce')")
        app-icon(type='pd04-left' :size="28" color="#6A6A6A")
      .date(@tap='handleDateTime()') {{ useDate }}
      .right(@tap="handleDay('add')")
        app-icon(type='pd04-right' :size="28" color="#6A6A6A")
    .historyRow(v-if="cityHistory.length")
      .history
        .title(v-for='(item, index) in cityHistory' :key='index' @tap="handleHistory(item)") {{ item.name }}
      .clearHistory(@tap="handleDelCityHistory()") 清空历史记录
    .button(@tap="handScheduleTap") 查询
</template>

<script>
import _ from 'lodash'
import dayjs from 'dayjs'

import AppIcon from '@/components/icon'

import { PD04_CITY_HISTORY_LIST, PD04_CITY_HISTORY_DEL } from '@/store/modules/pd04/keys'

export default {
  components: { AppIcon },

  props: {
    start: {},
  },

  data () {
    return {
      cityHistory: [],
      startCity: {},
      endCity: {},
      useDate: dayjs().format('YYYY-MM-DD'),
    }
  },

  methods: {
    async getCityHistory () {
      const { data } = await this.$store.dispatch(PD04_CITY_HISTORY_LIST)
      this.cityHistory = data
    },

    handScheduleTap () {
      if (_.isEmpty(this.startCity)) {
        uni.showModal({ title: '温馨提示', content: '请选择出发地！' })
        return
      }
      if (_.isEmpty(this.endCity)) {
        uni.showModal({ title: '温馨提示', content: '请选择目的地！' })
        return
      }
      uni.navigateTo({ url: `/pd04/pd04-schedule-list/index?startCity=${JSON.stringify(this.startCity)}&endCity=${JSON.stringify(this.endCity)}&useDate=${this.useDate}` })
      // 监听是否更新历史记录
      uni.$on('pd04CityHistoryChoose', this.getCityHistory)
    },

    async handleDelCityHistory () {
      if (await this.$store.dispatch(PD04_CITY_HISTORY_DEL)) {
        await this.getCityHistory()  
      }
    },

    handleHistory (history) {
      const { city, toCity } = history
      this.handleChange('startCity', city)
      this.handleChange('endCity', toCity)
    },

    // 显示选择日期时间组件
    handleDateTime () {
      this.$emit('formChange', 'isShowLayout', true)
      // 监听日期选择
      uni.$once('pd04FormDateChoose', (data) => {
        this.handleChange('useDate', data.useDate)
      })
    },

    handleDay (type) {
      if (type === 'add') {
        this.handleChange('useDate', dayjs(this.useDate).add(1, 'day').format('YYYY-MM-DD'))
      }
      if (type === 'reduce') {
        if(this.useDate <= dayjs().format('YYYY-MM-DD')) return
        this.handleChange('useDate', dayjs(this.useDate).subtract(1, 'day').format('YYYY-MM-DD'))
      }
    },

    handleChangeSite () {
      const oldStart = _.clone(this.startCity)
      const oldEnd = _.clone(this.endCity)
      this.handleChange('startCity', oldEnd)
      this.handleChange('endCity', oldStart)
    },

    handCity (type) {
      // 监听城市选择
      uni.$once('pd04CityChoose', (data) => {
        const { type, city } = data
        if (type === '0') this.handleChange('startCity', city)
        if (type === '1') this.handleChange('endCity', city)
      })
      // 0：出发城市；1：目的城市
      uni.navigateTo({ url: `/pd04/pd04-site-list/index?type=${type}&cityCode=${type === '1' ? this.startCity.code : undefined }` })
    },

    handleChange (key, value) {
      _.set(this, key, value)
    },
  },

  created () {
    this.getCityHistory()

    // 监听热门城市选择
    uni.$on('pd04HotCityChoose', (data) => {
      this.handleChange('endCity', data.endCity)
    })
  },

  destroyed () {
    // 关闭监听热门城市选择
    uni.$off('pd04HotCityChoose')

    // 关闭监听更新历史记录
    uni.$off('pd04CityHistoryChoose')
  },
}
</script>

<style lang='scss' scoped>
.container {
  position: relative;
  padding-bottom: 60rpx;
  .address {
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 2rpx solid rgba(228,228,228,1);
    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
      height: 80rpx;
    }
    .placehold {
      color: rgba(207,207,207,1);
      font-family: PingFang SC;
      font-size: 28rpx;
      font-weight: 400;
      line-height: 40rpx;
    }
  }

  .dateRow {
    display: flex;
    justify-content: center;
    align-items: center;

    .date {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
      height: 140rpx;
    }

    .left {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 20%;
      height: 140rpx;
    }

    .right {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 20%;
      height: 140rpx;
    }
  }

  .historyRow {
    display: flex;
    justify-content: center;
    align-items: center;

    .history {
      display: flex;
      flex: 1;
      box-sizing: border-box;
      overflow-x: scroll;
      overflow-y: hidden;
      margin-right: 20rpx;
      white-space: nowrap;
      &::-webkit-scrollbar {
        display: none;
      }
      .title {
        display: inline-block;
        height: 34rpx;
        padding: 20rpx 20rpx;
        margin-right: 30rpx;
        color: rgba(96,96,96,1);
        font-family: PingFang SC;
        font-size: 24rpx;
        font-weight: 400;
        text-align: center;
        background: rgba(240,240,240,1);
        border-radius: 6rpx;
      }
    }

    .clearHistory {
      width: 144rpx;
      height: 34rpx;
      padding: 20rpx 0;
      color: rgba(170,228,250,1);
      font-family: PingFang SC;
      font-size: 24rpx;
      font-weight: 400;
      line-height: 34rpx;
    }
  }

  .button {
    position: absolute;
    right: 0;
    bottom: -60rpx;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 600rpx;
    height: 80rpx;
    margin: auto;
    color: rgba(255,255,255,1);
    font-family: PingFang SC;
    font-size: 28rpx;
    font-weight: 400;
    line-height: 40rpx;
    background: rgba(64,127,234,1);
    box-shadow: 0rpx 6rpx 12rpx rgba(0,0,0,.16);
    border-radius: 40rpx;
  }
}
</style>
