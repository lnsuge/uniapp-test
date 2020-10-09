<template lang='pug'>
  .form
    .head(v-if="isShowHead")
      common-safe-center(@tap='handleSafeCenter')
      common-position(@tap='handlePosition')
    .wrapper
      ext-notice
      .content
        ext-tabs(:city="city")
        .business-form
          ext-pd03-form(
            v-if="business === 'PD03'"
            :start="start"
            :city="city"
            :pd03End="pd03End"
            @formChange="formChange"
            @formHeight="formHeight")

          ext-pd02-form(
            v-else-if="business === 'PD02'"
            :city="city"
            :start="start"
            :pd02StartFlight="pd02StartFlight"
            :pd02End="pd02End"
            :pd02EndAirport="pd02EndAirport"
            :useTime="useTime"
            @formChange="formChange"
            @formHeight="formHeight")

          ext-pd05-form(
            v-else-if="business === 'PD05'"
            :city="city"
            :pd05Start="pd05Start"
            :pd05End="pd05End"
            :useTime="useTime"
            @formChange="formChange"
            @formHeight="formHeight")

          ext-pd01-form(
            v-else-if="business === 'PD01'"
            :pd01Start="pd01Start"
            :start="start"
            :pd01End="pd01End"
            @formChange="formChange"
            @formHeight="formHeight")

          ext-pd06-form(
            v-else-if="business === 'PD06'"
            :city="city"
            :pd06Start="pd06Start"
            :pd06End="pd06End"
            :useTime="useTime"
            @formChange="formChange"
            @formHeight="formHeight")

          ext-pd04-form(
            v-else-if="business === 'PD04'"
            :start="start"
            @formChange="formChange")

          ext-no-form(v-else)
</template>

<script>
import _ from 'lodash'
import { promisify } from '@/tools'

import CommonSafeCenter from '@/components/safe-center'
import CommonPosition from '@/components/position'
import { navigate } from '@/tools/navigate'

import ExtNotice from '@/pages/home/notice'
import ExtTabs from '@/pages/home/tabs'
import ExtPd03Form from '@/pages/home/pd03-form'
import ExtPd02Form from '@/pages/home/pd02-form'
import ExtPd05Form from '@/pages/home/pd05-form'
import ExtPd01Form from '@/pages/home/pd01-form'
import ExtPd06Form from '@/pages/home/pd06-form'
import ExtPd04Form from '@/pages/home/pd04-form'
import ExtNoForm from '@/pages/home/no-form'

import { COMMONS_GEO_CODER } from '@/store/modules/commons/keys'

export default {
  props: {
    start: {},
    pd01Start: {},
    pd01End: {},
    pd02StartFlight: {},
    pd02End: {},
    pd02EndAirport: {},
    pd03End: {},
    pd05Start: {},
    pd05End: {},
    pd06Start: {},
    pd06End: {},
    city: {},
    useTime: { default: '' },
  },

  components: {
    CommonSafeCenter, CommonPosition,
    ExtNotice, ExtTabs,
    ExtPd03Form, ExtPd02Form, ExtNoForm, ExtPd05Form, ExtPd01Form, ExtPd06Form, ExtPd04Form,
  },

  computed: {
    business () {
      return _.get(this.$store.state.commons, 'business')
    },

    businesses () {
      return _.get(this.$store.state.commons, 'businessConfig.business')
    },

    cityAdCode () {
      return _.get(this.city, 'adCode')
    },

    isShowHead () {
      return !_.includes(['PD01', 'PD04'], this.business)
    },

    // commonsParkings () {
    //   return _.get(this.$store.state.commons, 'commonsParkings')
    // },
  },

  watch: {
    // commonsParkings () {
    //   this.formHeight()
    // },
  },

  methods: {
    handleSafeCenter () {
      navigate('page://navigateTo/public/police-call/index')
    },

    async handlePosition () {
      const { longitude, latitude } = await promisify(uni.getLocation)({ type: 'gcj02' })

      const point = await this.geoCoder(latitude, longitude)

      const cityData = {
        adCode: point.adCode,
        name: point.city,
        center: point.location,
      }

      this.formChange('city', cityData)
      this.formChange('start', point.location)
      this.formChange('pd05Start', point.location)
      this.formChange('pd06Start', point.location)
    },

    // 计算容器尺寸
    calcFormRect (className) {
      return new Promise((resolve) => {
        uni.createSelectorQuery().select(className).boundingClientRect().exec(res => resolve(_.get(res, 0, {})))
      })
    },

    formChange (key, value) {
      this.$emit('change', key, value)
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
  },
}
</script>

<style lang='scss' scoped>
.form {
  box-sizing: border-box;
  width: 100vw;
  padding: 0 20rpx;
  .head {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20rpx;
  }
  .wrapper {
    width: 100%;
    background-color: transparent;

    .content {
      background: rgba(255, 255, 255, 1);
      box-shadow: 0 3px 3px rgba(106, 106, 106, .16);
      border-radius: 6rpx;
      .business-form {
        padding: 16rpx 32rpx;
      }
    }
  }
}
</style>
