<template lang='pug'>
  .container
    .body
      slot
</template>

<script>

export default {

}
</script>

<style lang='scss' scoped>
.container {
  padding: 0 20rpx;
  margin-bottom: 20rpx;
  .body {
    background-color: #fff;
    box-shadow: 0 6rpx 6rpx rgba(106, 106, 106, .16);
    border-radius: 6rpx;
  }
}
</style>