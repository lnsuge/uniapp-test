<template lang='pug'>
  .loader(v-if="loading" :style="'background-color: ' + color")
    view(v-if="loading").lds-ellipsis
      view(style="background-color: #4181eb")
      view(style="background-color: #4181eb")
      view(style="background-color: #4181eb")
      view(style="background-color: #4181eb")
</template>

<script>
export default {
  props: {
    color: { type: String, default: '#ffffff' },
    loading: { type: Boolean, default: false },
  },
}
</script>

<style lang='scss' scoped>
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin: 0 20rpx;
}

.lds-ellipsis {
  position: relative;
  display: inline-block;
  display: flex;
  align-items: center;
  width: 64px;
  height: 64px;

  view {
    position: absolute;
    top: 27px;
    width: 11px;
    height: 11px;
    background: #fff;
    border-radius: 50%;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
    &:nth-child(1) {
      left: 6px;
      animation: lds-ellipsis1 .6s infinite;
    }
    &:nth-child(2) {
      left: 6px;
      animation: lds-ellipsis2 .6s infinite;
    }
    &:nth-child(3) {
      left: 26px;
      animation: lds-ellipsis2 .6s infinite;
    }
    &:nth-child(4) {
      left: 45px;
      animation: lds-ellipsis3 .6s infinite;
    }
  }
}

@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(19px, 0);
  }
}
</style>
