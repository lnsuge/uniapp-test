<template lang='pug'>
  .container
    .site(@tap='handleSite(isPd05)')
      .circle.origin
      .address(v-if='pd05Start.name') {{ pd05Start.name }}
      .placeholder(v-else) {{ startPlaceholder }}
    .history(v-if='isPd05')
      .title(v-for='(item, index) in stations' :key='index' @tap="handleRecommend('pd05Start', item)") {{ item.name }}
    //- .history
    //-   .title(v-for='(item, index) in commonsParking' :key='index' @tap="handleRecommend('pd05Start', item.location)") {{ item.name }}
    .box
      .line
      app-icon.change(type ='change-site', :size="80", color="#407fea" :animation="animationS" @tap="changeSite")
    .site(@tap='handleSite(!isPd05)')
      .circle.blue
      .address(v-if='pd05End.name') {{ pd05End.name }}
      .placeholder(v-else) {{ endPlaceholder }}
    .history(v-if='!isPd05')
      .title(v-for='(item, index) in stations' :key='index' @tap="handleRecommend('pd05End', item)") {{ item.name }}
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

import { PD05_CHANGE_PARAMS, PD05_STATION_LIST } from '@/store/modules/pd05/keys'

export default {
  props: {
    pd05Start: {},
    pd05End: {},
    city: {},
    useTime: { default: '' },
  },

  components: { AppIcon },

  data () {
    return {
      // 下车点历史记录
      siteHistoryList: [],
      isPd05: false, //true 接站 false 送站
      animationS: {},
      // 机场信息
      stations: [],
      commonsParking: [],
    }
  },

  computed: {
    startPlaceholder () {
      return this.isPd05 ? '请选择站点' : '请选择上车位置'
    },

    endPlaceholder () {
      return this.isPd05 ? '请选择下车位置' : '请选择站点'
    },

    commonsParkings () {
      return _.get(this.$store.state.commons, 'commonsParkings')
    },

    cityAdCode () {
      return _.get(this.city, 'adCode')
    },

    business () {
      return _.get(this.$store.state.commons, 'business')
    },

    pd05Type () {
      return _.get(this.$store.state.pd05, 'pd05Type')
    },
  },

  watch: {
    cityAdCode () {
      if (this.cityAdCode) {
        this.commonsParking = this.commonsParkings
        this.fetchStation()
      }
    },
  },

  methods: {
    handleSite (isPd05) {
      if (isPd05) {
        uni.navigateTo({ url: `/pd05/pd05-station-list/index?cityCode=${this.cityAdCode}&isPd05=${this.isPd05}` })
      }else{
        const level = !this.isPd05 ? 2 : 0
        const direction = !this.isPd05 ? 'pd05Start' : 'pd05End'
        uni.navigateTo({ url: `/public/site-list/index?level=${level}&direction=${direction}&city=${JSON.stringify(this.city)}` })
      }
      
    },

    animation () {
      if (this.isPd05) {
        this.SAnimation.rotate(-90).step({ duration: 300 })
        this.animationS = this.SAnimation.export()
      } else {
        this.SAnimation.rotate(90).step({ duration: 300 })
        this.animationS = this.SAnimation.export()
      }
    },

    changeSite () {
      this.animation()
      this.isPd05 = !this.isPd05
      // const median = this.commonsParking
      // this.commonsParking = this.stations
      // this.stations = median

      let pages = getCurrentPages()
      let prevPage = pages[pages.length - 1]
      prevPage.$vm['pd05Start'] = this.pd05End
      prevPage.$vm['pd05End'] = this.pd05Start

      if (this.isPd05) {
        this.$store.commit(PD05_CHANGE_PARAMS, { key: 'pd05Type', value: 'pickUp' })
      } else {
        this.$store.commit(PD05_CHANGE_PARAMS, { key: 'pd05Type', value: 'dropOff' })
      }
    },

    // 查询机场信息
    async fetchStation () {
      const { adCode } = this.city
      const payload = {
        cityCode: adCode,
      }
      const { data } = await this.$store.dispatch(PD05_STATION_LIST, payload)
      this.stations = data
    },

    handleRecommend (key, value) {
      this.$emit('formChange', key, value)
    },

    // 显示选择日期时间组件
    handleDateTime () {
      this.$emit('formChange', 'isShowLayout', true)
    },
  },

  mounted (){
    this.isPd05 = this.pd05Type === 'pickUp' ? true : false
  },

  async created () {
    if (this.cityAdCode) {
      this.commonsParking = this.commonsParkings
      await this.fetchStation()
    }
  },

  onReady () {
    const SAnimation = uni.createAnimation({
      timingFunction: 'ease',
      delay: 0,
    })
    this.SAnimation = SAnimation
  },
}
</script>

<style lang='scss' scoped>
.container {
  .box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .line {
      width: 100%;
      margin-right: 64rpx;
    }
  }
  .change {
    position: absolute;
    right: 44rpx;
    transform: rotate(90deg);
  }
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
    .row {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 40rpx;
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
        height: 40rpx;
        font-size: 28rpx;
        line-height: 40rpx;
      }
      .placeholder {
        flex: 1;
        height: 40rpx;
        color: #cfcfcf;
        font-size: 28rpx;
        line-height: 40rpx;
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
