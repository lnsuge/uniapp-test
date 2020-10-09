<template lang="pug">
  .pick-time
    .title
      cover-view.text
        cover-view.use-text 选择用车时间
      .right(@tap="handHide")
        app-icon.icon(type="cancel" :size="32" color="#c0c0c0")
    .time-pick
      picker-view.pick(:value="value" indicator-style="height: 40px;" style="width: 100%; height: 100%;" @change="bindChange")
        picker-view-column.pick-one
          view(class="item" style="line-height: 40px" v-for="(item,index) in dateArr" :key="index") {{ item.dateStr }}
        picker-view-column.pick-two(v-if="business !== 'PD04'")
          view(class="item" style="line-height: 40px" v-for="(item,index) in hours" :key="index") {{ item.dateStr }}
        picker-view-column.pick-three(v-if="business !== 'PD04'")
          view(class="item" style="line-height: 40px" v-for="(item,index) in minutes" :key="index") {{ item.dateStr }}
    .btn
      .button(@tap="handSelectTime") 确定
</template>

<script>
import AppIcon from '@/components/icon'
import dayjs from 'dayjs'
import _ from 'lodash'

export default {
  components: { AppIcon },

  props: {
    city: {
      type: Object,
    },
    business: {
      type: String,
    },
  },

  data () {
    let dateArr = []
    // 初次显示的
    let defaultHours = []
    let defaultMinutes = []
    // 切换的时间
    let newHours = []
    let newMinutes = []

    const city = _.get(this.city, 'adCode', '530100')

    const pd02TimeLimit = _.get(uni.getStorageSync('config'), 'pd02TimeLimit', {})

    // temp步长，默认为4, 预约4小时以后的时间
    let temp = this.business === 'PD06' ? 0.16 : (pd02TimeLimit[city] ? pd02TimeLimit[city] / 60 : 4)

    const today = dayjs().format('YYYY-MM-DD')

    let tempDay = dayjs().add(temp, 'hour').format('YYYY-MM-DD')

    let tempHour = dayjs().add(temp, 'hour').get('hour')

    const tempMinute = dayjs().add(temp, 'hour').get('minute')

    const tempDeg = dayjs().add(temp, 'hour').get('minute') % 10

    let preMuinute = tempDeg > 4 ? tempMinute + (10 - tempDeg) : tempMinute - tempDeg

    if (tempMinute + (10 - tempDeg) >= 60) {
      preMuinute = 0
      if (tempHour === 23) {
        tempHour = 0
        tempDay = dayjs().add(1, 'day').format('YYYY-MM-DD')
      } else {
        tempHour += 1
      }
    }

    // 第一列
    if (today === tempDay) {
      for (let i = 0; i <= 30; i++) {
        const day = dayjs().add(i, 'day').get('date')
        let mouths = dayjs().add(i, 'day').get('month') + 1
        let str
        switch (i) {
          case 0:
            str = '今天'
            break
          case 1:
            str = '明天'
            break
          case 2:
            str = '后天'
            break
          default:
            str = ''
            break
        }
        let dateStr = `${mouths}月${day} ${str}`
        let obj = { dateStr, date: dayjs().add(i, 'day').format('YYYY-MM-DD') }
        dateArr.push(obj)
      }
    } else {
      for (let i = 1; i <= 30; i++) {
        let day = dayjs().add(i, 'day').get('date')
        let mouths = dayjs().add(i, 'day').get('month') + 1
        let str = i === 1 ? '明天' : (i === 2 ? '后天' : '')
        let dateStr = `${mouths}月${day} ${str}`
        let obj = { dateStr, date: dayjs().add(i, 'day').format('YYYY-MM-DD') }
        dateArr.push(obj)
      }      
    }

    // 第二列
    for (let i = tempHour; i <= 23; i++) {
      let dateStr = `${i}点`
      let obj = { dateStr, date: i }
      defaultHours.push(obj)
    }

    for (let i = 0; i <= 23; i++) {
      let dateStr = `${i}点`
      let obj = { dateStr, date: i }
      newHours.push(obj)
    }

    // 第三列
    for (let i = preMuinute; i <= 50; i += 10) {
      let dateStr = i === 0 ? `0${i}分` : `${i}分`
      let obj = { dateStr, date: i }
      defaultMinutes.push(obj)
    }

    for (let i = 0; i <= 50; i += 10) {
      let dateStr = i === 0 ? `0${i}分` : `${i}分`
      let obj = { dateStr, date: i }
      newMinutes.push(obj)
    }

    return {
      dateArr,
      hours: JSON.parse(JSON.stringify(defaultHours)),
      minutes: JSON.parse(JSON.stringify(defaultMinutes)),
      newHours,
      newMinutes,
      defaultHours,
      defaultMinutes,
      dateStr: dateArr[0],
      hourStr: defaultHours[0],
      minuteStr: defaultMinutes[0],
      value: [0, 0, 0],
    }
  },

  computed: {
    currentCity () {
      return _.get(this.$store.state, 'commons.currentCity.adCode', '530100')
    },

    pd02TimeLimit () {
      return _.get(uni.getStorageSync('config'), 'pd02TimeLimit', {})
    },
  },

  methods: {
    // 隐藏组件
    handHide (date, hour, minute) {
      let obj = date && hour && minute ? { date, hour, minute } : undefined
      this.$emit('handHide', obj)
    },

    // 操作时间选择
    bindChange (e) {
      const val = e.detail.value
      const defaultHours = JSON.parse(JSON.stringify(this.defaultHours))
      const defaultMinutes = JSON.parse(JSON.stringify(this.defaultMinutes))
      const newHours = JSON.parse(JSON.stringify(this.newHours))
      const newMinutes = JSON.parse(JSON.stringify(this.newMinutes))
      if (val[0] === 0) {
        this.hours = defaultHours
        this.minutes = defaultMinutes
        if (val[1] === 0) {
          this.hours = defaultHours
          this.minutes = defaultMinutes
        } else {
          this.minutes = newMinutes
        }
      } else {
        this.hours = newHours
        this.minutes = newMinutes
      }
      this.dateStr = this.dateArr[val[0]]
      this.hourStr = this.hours[val[1]]
      this.minuteStr = this.minutes[val[2]]
      this.value = val
    },

    // 选择时间
    handSelectTime () {
      this.handHide(this.dateStr, this.hourStr, this.minuteStr)
      uni.$emit('pd04FormDateChoose', { 'useDate': this.dateStr.date })
    },
  },
}
</script>

<style lang="scss" scoped>
.pick-time {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
  height: 650rpx;
  padding-bottom: 20rpx;
  margin: 0 20rpx 20rpx 20rpx;
  background-color: #fff;
  box-shadow: 0 3px 3px rgba(106, 106, 106, .16);
  border-radius: 8rpx;
  .title {
    z-index: 10000;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 96rpx;
    padding-left: 44rpx;
    background-color: #fff;
    border-bottom: 1rpx solid rgba(233, 233, 233, .5);
    .text {
      display: flex;
      align-items: center;
      flex: 1;
      height: 100%;
      color: #414141;
      .use-text {
        font-size: 32rpx;
        font-weight: 800;
      }
    }
    .right {
      display: flex;
      width: 100rpx;
      height: 100%;
      .icon {
        margin: auto;
      }
    }
  }
  .time-pick {
    position: relative;
    flex: 1;
    .pick {
      position: absolute;
      left: 0;
      margin-top: -90rpx;
      color: #000;
      font-family: "PingFang SC";
      .item {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .btn {
    box-sizing: border-box;
    padding: 0 8rpx;
    .button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 92rpx;
      color: #fff;
      background-color: #407fea;
      border-radius: 6rpx;
    }
  }
}
</style>
