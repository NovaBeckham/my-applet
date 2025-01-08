<template>
  <view class="content">
    <view class="item" @click="toWait"> 思肯 - 无线面罩 </view>
    <view class="item"> 尖超 - X3 </view>
    <view class="item"> 初见未来 - XE </view>
    <view class="item"> 启哲 - N5Lite </view>
  </view>
</template>

<script setup lang="ts">

const toWait = () => {
  uni.switchTab({
    url: "/pages/wait/index",
  })
}

</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.item {
  width: 80%;
  background: #fff;
  padding: 20rpx;
  border: 1rpx solid rgba(33, 84, 118, 1);
  margin: 20rpx 0;
}
</style>
