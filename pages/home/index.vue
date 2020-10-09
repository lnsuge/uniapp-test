<template lang='pug'>
  .container
    .wrap(v-if="isShowLayout" @tap="handWrap" @touchstart="handWrap")
    ad-modal-provider(:place-code="'IMAGE_HOME_MODAL'")
    .map(v-show="isShowMap")
      common-map(
        ref='CommonMap'
        :extra-height='formHeight + bottomHeight'
        :is-show-tip='true'
        :is-show-bubble='false'
        @regionchange='regionchange')
    .background(v-show="!isShowMap")
      image.image(src="/static/home/background.png")
    ext-city.city(
      :style='cityStyle'
      :city='city'
      @func="getMsgFormSon")
    .content(:style='contentStyle')
      .box
        ext-form.form(
          :start="start"
          :pd01Start="pd01Start"
          :pd01End="pd01End"
          :pd02StartFlight="pd02StartFlight"
          :pd02EndAirport="pd02EndAirport"
          :pd02End="pd02End"
          :pd03End="pd03End"
          :pd05End="pd05End"
          :pd05Start="pd05Start"
          :pd06Start="pd06Start"
          :pd06End="pd06End"
          :useTime="useTime"
          :city="city"
          @change='handleChange'
          @getFormHeight="getFormHeight")
        ext-tip
        ext-hot-city(v-if="business === 'PD04'")
        ext-ad
    uni-drawer.drawer(:visible='isOpenDrawer' @close='closeDrawer')
      ext-mine
    ext-layout.layout(ref="ExtLayout" :city="city" :business="business" :isShow="isShowLayout" @handHide="handHide")
</template>

<script>
import _ from 'lodash'
import { uniPromiseify } from '@/common'
import dayjs from 'dayjs'

import * as logger from '@/common/logger'

import uniDrawer from '@/components/uni-drawer/uni-drawer'
import CommonMap from '@/components/map/map'
import AdModalProvider from '@/components/ad-modal-provider'

import ExtCity from '@/pages/home/city'
import ExtForm from '@/pages/home/form'
import ExtAd from '@/pages/home/ad'
import ExtTip from '@/pages/home/tip'
import ExtHotCity from '@/pages/home/hot-city'
import ExtMine from '@/pages/home/mine'
import ExtLayout from '@/pages/home/layout'

import { COMMONS_CHANGE_PARAMS, COMMONS_GEO_CODER, COMMONS_PARKING, COMMONS_BUSINESS_CONFIG } from '@/store/modules/commons/keys'

import { ORDER_PROCESS } from '@/store/modules/order/keys'

export default {
  components: {
    CommonMap,
    ExtCity, ExtForm, ExtAd, ExtTip, ExtMine, ExtLayout, ExtHotCity,
    uniDrawer,
    AdModalProvider,
  },

  data () {
    return {
      // 表单高度
      formHeight: 346,
      // 表单到屏幕底部的高度(单位px)
      bottomHeight: 65,
      systemInfo: uni.getSystemInfoSync(),
      menuButtonInfo: uni.getMenuButtonBoundingClientRect(),
      isOpenDrawer: false,
      isShowLayout: false,
      start: {},
      pd01Start: {},
      pd01End: {},
      pd02End: {},
      pd02StartFlight: {},
      pd02EndAirport: {},
      pd03End: {},
      pd05Start: {},
      pd05End: {},
      pd06Start: {},
      pd06End: {},
      city: {},
      useTime: '',
      customBusiness: undefined,
    }
  },

  computed: {
    cityStyle () {
      const { top, height } = this.menuButtonInfo
      return `
        top: ${top}px;
        height: ${height}px;
      `
    },

    contentStyle () {
      const formTopHeight = _.get(this.systemInfo, 'windowHeight') - this.formHeight - this.bottomHeight

      const { top, height } = this.menuButtonInfo

      return this.isShowMap ? `top: ${ formTopHeight }px;` : `top: ${ top + height + 10 }px;`
    },

    business () {
      return _.get(this.$store.state.commons, 'business')
    },

    mobile () {
      return _.get(this.$store.state.app, 'userInfo.mobile')
    },

    pickType () {
      return _.get(this.$store.state.pd02, 'pickType')
    },

    // 接送站类型
    pd05Type () {
      return _.get(this.$store.state.pd05, 'pd05Type')
    },

    pd06Type () {
      return _.get(this.$store.state.pd06, 'pd06Type')
    },

    isShowMap () {
      return !_.includes(['PD01', 'PD04'], this.business)
    },

    cityCode () {
      return _.get(this.$store.state.commons, 'city.adCode')
    },
  },

  watch: {
    pd02EndAirport (point) {
      if (!_.isEmpty(point) && (_.get(this.city, 'adCode') !== _.get(point, 'cityCode'))) {
        this.start = _.get(point, 'airportCity.center')
        this.city = _.get(point, 'airportCity')
      }
    },

    start () {
      this.moveMapCenter()
    },

    cityCode () {
      this.fetchBusinessConfig()
    },
  },

  methods: {
    // 获取锚点经纬度
    async regionchange (res) {
      const { lng, lat } = res
      const { location } = await this.geoCoder(lat, lng)
      if (location) {
        this.start = location
        this.pd05Start = location
        this.pd06Start = location
      }
    },

    // 移动地图锚点到指定位置
    moveMarker (longitude, latitude) {
      this.$refs.CommonMap.setCenterLocation(longitude, latitude)
    },

    // 坐标反转解析
    async geoCoder (latitude, longitude) {
      const payload = {
        latitude,
        longitude,
        geoType: 'GCJ02',
      }
      const { data } = await this.$store.dispatch(COMMONS_GEO_CODER, payload)
      return data
    },

    // 获取推荐上车点
    async fetchParking (latitude, longitude) {
      const payload = {
        latitude,
        longitude,
        'geoType': 'GCJ02',
      }
      await this.$store.dispatch(COMMONS_PARKING, payload)
    },

    handleChange (key, value) {
      _.set(this, key, value)
      this.goPd02Vehicle()
      this.goPd03Vehicle()
    },

    handHide (obj) {
      this.isShowLayout = false
      if (!obj) return
      if (obj.date) {
        const date = _.get(obj.date, 'date')
        const str1 = (Array(2).join(0) + obj.hour.date).slice(-2)
        const str2 = (Array(2).join(0) + obj.minute.date).slice(-2)
        this.useTime = `${date} ${str1}:${str2}:00`
      }
      this.goPd02Vehicle()
    },

    // 获取业务功能配置
    async fetchBusinessConfig () {
      try {
        const payload = {
          cityCode: this.cityCode,
        }
        const data = (await this.$store.dispatch(COMMONS_BUSINESS_CONFIG, payload)).data
        this.$store.commit(COMMONS_CHANGE_PARAMS, { key: 'businessConfig', value: data })
        this.$store.commit(COMMONS_CHANGE_PARAMS, { key: 'business', value: this.customBusiness ? this.customBusiness : data.defaultBusiness })
      } catch (error) {
        logger.error(error, { printStack: false })
      }
    },

    // 数据初始化
    async init () {
      let lat
      let long

      try {
        const { latitude, longitude } = await uniPromiseify(uni.getLocation)({ type: 'gcj02' })
        lat = latitude
        long = longitude
      } catch (error) {
        const { confirm } = await uniPromiseify(uni.showModal)({
          title: '位置授权申请',
          content: '请允许我们使用您的位置信息，并打开手机GPS，它将帮助我们确保业务的正常进行',
          showCancel: false,
        })
        if (confirm) {
          await uniPromiseify(uni.openSetting)()
          await this.init()
        }
      }

      if (lat && long) {
        try {
          const point = await this.geoCoder(lat, long)
          this.start = point.location
          const cityData = {
            adCode: point.adCode,
            name: point.city,
            center: point.location,
          }
          this.city = cityData
          this.$store.commit(COMMONS_CHANGE_PARAMS, { key: 'currentCity', value: cityData })
          this.$store.commit(COMMONS_CHANGE_PARAMS, { key: 'city', value: cityData })

          this.moveMapCenter()
        } catch (error) {
          logger.error(error, { printStack: false })
          await this.geoCoder(lat, long)
        }
      }
    },

    handWrap () {
      this.$refs.ExtLayout.handHide()
    },

    // 获取进行中订单
    async getProcessOrder () {
      if (this.mobile) {
        await this.$store.dispatch(ORDER_PROCESS, { mobile: this.mobile })
      }
    },

    // 移动地图中心点到start坐标位置
    moveMapCenter () {
      const longitude = _.get(this.start.geo, 'coordinates[0]', undefined)
      const latitude = _.get(this.start.geo, 'coordinates[1]', undefined)
      if (longitude && latitude) {
        this.moveMarker(longitude, latitude)
      }
    },

    goPd03Vehicle () {
      if (!_.isEmpty(this.pd03End) && this.business === 'PD03') {
        uni.navigateTo({ url: `/pd03/pd03-vehicle/index?start=${JSON.stringify(this.start)}&end=${JSON.stringify(this.pd03End)}&city=${JSON.stringify(this.city)}` })
        this.pd03End = {}
      }
    },

    goPd02Vehicle () {
      if (this.business === 'PD02') {
        // 接机
        if (!_.isEmpty(this.pd02StartFlight) && !_.isEmpty(this.pd02End) && this.pickType === 'pickUp') {
          const airportCode = _.get(this.pd02StartFlight, 'airportCode')
          const depart = _.get(this.pd02StartFlight, 'arriveLocation[0]')
          const code = _.get(this.pd02StartFlight, 'code')
          const arrive = this.pd02End
          const arriveTime = `${_.get(this.pd02StartFlight, 'arriveDate')} ${_.get(this.pd02StartFlight, 'arriveTime')}:00`
          uni.navigateTo({ url: `/pd02/pd02-vehicle/index?arriveTime=${arriveTime}&airportCode=${airportCode}&code=${code}&depart=${JSON.stringify(depart)}&end=${JSON.stringify(arrive)}` })
          this.pd02End = {}
        }
        // 送机
        if (!_.isEmpty(this.start) && !_.isEmpty(this.pd02EndAirport) && this.useTime && this.pickType === 'dropOff') {
          const stationCode = _.get(this.pd02EndAirport, 'code')
          const depart = this.start
          const arrive = _.get(this.pd02EndAirport, 'location')
          uni.navigateTo({ url: `/pd02/pd02-vehicle/index?stationCode=${stationCode}&depart=${JSON.stringify(depart)}&end=${JSON.stringify(arrive)}&useTime=${this.useTime}` })
          this.useTime = ''
        }
      } else if (this.business === 'PD05') {
        if (!_.isEmpty(this.pd05Start) && !_.isEmpty(this.pd05End) && this.useTime) {
          const stationCode = this.pd05Type === 'pickUp' ? _.get(this.pd05Start, 'code') : _.get(this.pd05End, 'code')
          const depart = this.pd05Type === 'pickUp' ? _.get(this.pd05Start, 'location') : this.pd05Start
          const arrive = this.pd05Type === 'pickUp' ? this.pd05End : _.get(this.pd05End, 'location')
          uni.navigateTo({ url: `/pd05/pd05-vehicle/index?stationCode=${stationCode}&depart=${JSON.stringify(depart)}&end=${JSON.stringify(arrive)}&useTime=${this.useTime}` })
          this.useTime = ''
        }
      } else if (this.business === 'PD06') {
        if (!_.isEmpty(this.pd06Start) && !_.isEmpty(this.pd06End) && this.useTime) {
          const stationCode = this.pd06Type === 'pickUp' ? _.get(this.pd06Start, 'code') : _.get(this.pd06End, 'code')
          const depart = this.pd06Type === 'pickUp' ? _.get(this.pd06Start, 'location') : this.pd06Start
          const arrive = this.pd06Type === 'pickUp' ? this.pd06End : _.get(this.pd06End, 'location')
          uni.navigateTo({ url: `/pd06/pd06-vehicle/index?stationCode=${stationCode}&depart=${JSON.stringify(depart)}&end=${JSON.stringify(arrive)}&useTime=${this.useTime}` })
          this.useTime = ''
        }
      }
    },

    goPd01Process () {
      if (!_.isEmpty(this.pd01Start) && !_.isEmpty(this.pd01End)) {
        const date = dayjs().format('YYYY-MM-DD')
        
        uni.navigateTo({
          url: `/pd01/pd01-process/index?originCode=${_.get(this.pd01Start, 'code', undefined)}&siteCode=${_.get(this.pd01End, 'code', undefined)}&date=${date}`,
          success: () => {
            this.pd01End = {}
          },
        })
      }
    },

    // 打开抽屉
    getMsgFormSon () {
      this.isOpenDrawer = true
    },

    // 关闭抽屉
    closeDrawer () {
      this.isOpenDrawer = false
    },
  },

  async onLoad (options) {
    const { customBusiness } = options
    if (customBusiness) {
      this.customBusiness = customBusiness
    }
    await this.init()
  },

  onShareAppMessage () {
    return {
      title: '旅程约车',
      path: '/pages/boot/index',
    }
  },

  onShow () {
    this.moveMapCenter()
    this.getProcessOrder()
    this.goPd02Vehicle()
    this.goPd03Vehicle()
    this.goPd01Process()
  },
}
</script>

<style lang='scss' scoped>
.container {
  width: 100vw;
  height: 100vh;

  .wrap {
    position: fixed;
    z-index: 999;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, .3);
  }

  .layout {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
  }

  .city {
    position: fixed;
    left: 20rpx;
    z-index: 2;
  }

  .content {
    position: absolute;
    right: 0;
    left: 0;
    z-index: 3;
    box-sizing: border-box;
    overflow-x: scroll;
    overflow-y: hidden;
    width: 100vw;
    &::-webkit-scrollbar {
      display: none;
    }

    .box {
      width: 100.2vw;
    }
  }

  .map {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .background {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(249,249,249,1);
    .image {
      width: 100vw;
    }
  }

  .drawer {
    pointer-events: auto;
  }
}
</style>
