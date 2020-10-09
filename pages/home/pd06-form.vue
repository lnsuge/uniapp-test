<template lang='pug'>
  .container
    .code
      .site
        .left
          .circle.priceCode
          input.inp(v-model="enterpriseCode" type="number" placeholder="请输入企业码" maxlength="6", cursor-spacing="20" placeholder-style="color: #CFCFCF")
        app-icon(v-if="checkLoading" :class="iconload" @tap="clear" :type="iconType" :size="36" color="#42ACFF")
    .content(v-if="iconType === 'pd06-sucess'")
      .site(@tap="handleSite(isPd06)")
        .circle.origin
        .address(v-if='pd06Start.name') {{ pd06Start.name }}
        .placeholder(v-else) {{ startPlaceholder }}
      .history(v-if='isPd06')
        .title(v-for='(item, index) in stations' :key='index' @tap="handleRecommend('pd06Start', item)") {{ item.name }}
      //- .history
      //-   .title(v-for='(item, index) in commonsParking' :key='index' @tap="handleRecommend('pd06Start', item.location)") {{ item.name }}
      .box
        .line
        app-icon.change(type ='change-site', :size="80", color="#407fea" :animation="animationS" @tap="changeSite")
      .site(@tap='handleSite(!isPd06)')
        .circle.blue
        .address(v-if='pd06End.name') {{ pd06End.name }}
        .placeholder(v-else) {{ endPlaceholder }}
      .history(v-if='!isPd06')
        .title(v-for='(item, index) in stations' :key='index' @tap="handleRecommend('pd06End', item)") {{ item.name }}
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

import { PD06_CHANGE_PARAMS, PD06_STATION_LIST, PD06_CODE_CHECK } from '@/store/modules/pd06/keys'

export default {
  props: {
    pd06Start: {},
    pd06End: {},
    city: {},
    useTime: { default: '' },
  },

  components: { AppIcon },

  data () {
    return {
      enterpriseCode: undefined,
      no: undefined,
      desc: undefined,
      // 下车点历史记录
      siteHistoryList: [],
      isPd06: false, //true 接站 false 送站
      animationS: {},
      // 机场信息
      stations: [],
      commonsParking: [],
      checkLoading: false,
      iconType: 'pd06-loading',
      timer: null,
    }
  },

  computed: {
    startPlaceholder () {
      return this.isPd06 ? '请选择站点' : '请选择上车位置'
    },

    endPlaceholder () {
      return this.isPd06 ? '请选择下车位置' : '请选择站点'
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

    pd06Type () {
      return _.get(this.$store.state.pd06, 'pd06Type')
    },

    loading () {
      return !!_.get(this.$store.state.app.pending, [PD06_CODE_CHECK])
    },

    iconload () {
      return this.iconType === 'pd06-loading' ? 'load' : ''
    },

    listLoading () {
      return !!_.get(this.$store.state.app.pending, [PD06_STATION_LIST])
    },
  },

  watch: {
    enterpriseCode () {
      this.checkLoading = false
      this.iconType = 'pd06-loading' 
      if (this.enterpriseCode.length === 6) {
        this.commonsParking = this.commonsParkings
        wx.hideKeyboard()
        this.checkCode()
      }
    },
  },

  methods: {
    handleSite (isPd06) {
      if (isPd06) {
        uni.navigateTo({ url: `/pd06/pd06-station-list/index?cityCode=${this.cityAdCode}&isPd06=${this.isPd06}&enterpriseCode=${this.enterpriseCode}` })
      } else {
        const level = !this.isPd06 ? 2 : 0
        const direction = !this.isPd06 ? 'pd06Start' : 'pd06End'
        uni.navigateTo({ url: `/public/site-list/index?level=${level}&direction=${direction}&city=${JSON.stringify(this.city)}` })
      }
      
    },

    clear () {
      if (this.iconType === 'pd06-error') this.enterpriseCode = ''
    },

    animation () {
      if (this.isPd06) {
        this.SAnimation.rotate(-90).step({ duration: 300 })
        this.animationS = this.SAnimation.export()
      } else {
        this.SAnimation.rotate(90).step({ duration: 300 })
        this.animationS = this.SAnimation.export()
      }
    },

    changeSite () {
      this.animation()
      this.isPd06 = !this.isPd06

      let pages = getCurrentPages()
      let prevPage = pages[pages.length - 1]
      prevPage.$vm['pd06Start'] = this.pd06End
      prevPage.$vm['pd06End'] = this.pd06Start

      if (this.isPd06) {
        this.$store.commit(PD06_CHANGE_PARAMS, { key: 'pd06Type', value: 'pickUp' })
      } else {
        this.$store.commit(PD06_CHANGE_PARAMS, { key: 'pd06Type', value: 'dropOff' })
      }
    },

    async checkCode () {
      this.checkLoading = true
      const payload = {
        enterpriseCode: this.enterpriseCode,
      }
      const { data } = await this.$store.dispatch(PD06_CODE_CHECK, payload)
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        if (data.valid) {
          this.$store.commit(PD06_CHANGE_PARAMS, { key: 'enterpriseCode', value: this.enterpriseCode })
          this.iconType = 'pd06-sucess'
          this.fetchStation()
        } else {
          uni.showToast({
            title: '无效的优惠码',
            icon: 'none',
          })
          this.iconType = 'pd06-error'
        }
        clearTimeout(this.timer)
      }, 400)

    },

    // 查询机场信息
    async fetchStation () {
      // const { adCode } = this.city
      if (!this.enterpriseCode) return
      const payload = {
        enterpriseCode: this.enterpriseCode,
      }
      const { data } = await this.$store.dispatch(PD06_STATION_LIST, payload)
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
    this.isPd06 = this.pd06Type === 'pickUp' ? true : false
  },

  created () {
    if (this.cityAdCode) {
      this.commonsParking = this.commonsParkings
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

    .inp {
      width: 500rpx;
    }

    .circle {
      width: 20rpx;
      height: 20rpx;
      margin-right: 10rpx;
      border-radius: 50%;
    }
    .priceCode {
      background-color: #8a2be2;
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
  .code {
    .site {
      justify-content: space-between;
      .left {
        display: flex;
        align-items: center;
      }
      .load {
        animation: btnLoading 1.5s linear infinite;
      }
    }
  }
}

@keyframes btnLoading {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(90deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
