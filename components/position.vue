<template lang='pug'>
  .container
    app-icon.icon(type='position' :size='36' color="#4A4A4A")
</template>

<script>
import AppIcon from '@/components/icon'

export default {
  components: { AppIcon },
}
</script>

<style lang='scss' scoped>
.container {
  display: flex;
  width: 68rpx;
  height: 68rpx;
  background: rgba(255,255,255,1);
  border-radius: 50%;
  box-shadow: 0px 3px 3px rgba(106,106,106,0.16);
  .icon {
    margin: auto;
  }
}
</style>
