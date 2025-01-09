<template>
  <view class="content">
    <view class="item" @click="toWait"><text> 思肯 - 无线面罩 </text></view>
    <view class="item"><text> 尖超 - X3 </text></view>
    <view class="item"><text> 初见未来 - XE </text></view>
    <view class="item"><text> 启哲 - N5Lite </text></view>
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
  color: rgba(33,84,118,1);
  font-size: 28rpx;
}
</style>
