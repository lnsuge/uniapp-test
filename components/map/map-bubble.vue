<template lang="pug">
    .container
      .content(v-if="isTime !== null")
        .time
          .text {{ isTime }}
          .value {{ minute }}:{{ second }}
      .content(v-else) 在这上车
      .bottom
        .triangle
</template>

<script>
import dayjs from 'dayjs'

export default {
  props: {
    isTime: null,
  },

  data () {
    return {
      minute: '0' + 0, // 分
      second: '0' + 0, // 秒
      intervalID: null,
    }
  },

  computed: {
    imgStyle () {
      return `
        position: absolute;z-index: 99;width: 280rpx;height: 210rpx;top: -24rpx;left: -6rpx
      `
    },

    createTime () {
      return uni.getStorageSync('createTime')
    },

    waitAboardTime () {
      return uni.getStorageSync('waitAboardTime')
    },

    minutes () {
      let minute = 0
      const year = dayjs().format('YYYY-MM-DD HH:mm:ss')
      if(this.waitAboardTime !== '') {
        minute = Math.abs(dayjs(year).diff(dayjs(this.waitAboardTime), 'minute'))
      }else if (this.createTime !== '') {
        minute = Math.abs(dayjs(year).diff(dayjs(this.createTime), 'minute'))

      }
      return minute

    },

    seconds () {
      let second = 0
      const year = dayjs().format('YYYY-MM-DD HH:mm:ss')
      if (this.waitAboardTime !== '') {
        second = Math.round(Math.abs(dayjs(year).
          diff(dayjs(this.waitAboardTime)) / 1000 -
          dayjs(year).diff(dayjs(this.waitAboardTime), 'minute') * 60) )
      }else if (this.createTime !== '') {
        second = Math.round(Math.abs(dayjs(year).
          diff(dayjs(this.createTime)) / 1000 - dayjs(year).
          diff(dayjs(this.createTime), 'minute') * 60) )
      }
      return second
    },
  },

  methods: {
    setInterval () {
      let second = this.second
      let minute = this.minute
      setInterval(()=>{
        second++
        if (second < 10) {
          // 少于10补零
          this.second = '0' + second
        } else {
          this.second = second
        }
        if (second >= 60) {
          second = 0 //  大于等于60秒归零
          this.second = '0' + second
          minute++
          if (minute < 10) {
            // 少于10补零
            this.minute = '0' + minute
          } else {
            this.minute = minute
          }

        }
      }, 1000)
    },
  },

  watch: {
    isTime (newVal){
      if (newVal === '车辆已到达') {
        this.setInterval()
      }
    },
  },

  mounted () {
    this.minute = this.minutes
    this.second = this.seconds
  },
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 268rpx;
  .content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 78rpx;
    background-color: #fff;
    border-radius: 40rpx;
  }
  .bottom {
    display: flex;
    justify-content: center;
    .triangle {
      width: 0;
      height: 0;
      border-top: 12rpx solid #fff;
      border-right: 12rpx solid transparent;
      border-left: 12rpx solid transparent;
    }
  }
}
.time {
  display: flex;
  justify-content: center;
  .text {
    margin-right: 5rpx;
    color: rgba(119,119,119,1);
    font-size: 26rpx;
    font-weight: 400;
  }
  .value {
    color: rgba(241,134,53,1);
    font-size: 28rpx;
    font-weight: 800;
  }
}
</style>
