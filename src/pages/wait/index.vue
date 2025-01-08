<template>
  <view v-for="item in list" :key="item.oddNumbers" class="item" @click="onClick">
    <view class="item-image">
      <image :src="ProductImage" class="image-content"></image>
    </view>
    <view class="item-container">
      <view class="item-content">
        <view class="content">
          <uni-icons type="home-filled" size="30"></uni-icons>
          <text class="content-text">{{ item.platform }}</text>
        </view>
        <view class="content">
          <uni-icons type="home-filled" size="30"></uni-icons>
          <text class="content-text">{{ item.warehouse }}</text>
        </view>
      </view>
      <view class="item-content">
        <view class="content">
          <uni-icons type="home-filled" size="30"></uni-icons>
          <text class="content-text">{{ item.createTime }}</text>
        </view>
        <view class="content">
          <uni-icons type="home-filled" size="30"></uni-icons>
          <text class="content-text">{{ item.oddNumbers }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue"
import ProductImage from "../../static/product.png"

interface Inspection {
  oddNumbers?: string
  platform?: string
  goods?: string
  createTime?: string
  warehouse?: string
  boxList?: Array<{ boxNo?: string; skuNo?: string; snNo?: string }>
}

const list = ref<Inspection[]>([
  {
    oddNumbers: "单号111111111111",
    platform: "shopify",
    goods: "商品111",
    createTime: "2024-09-25",
    warehouse: "分仓111",
    boxList: [
      { boxNo: "1111", skuNo: "1111", snNo: '1111' },
      { boxNo: "2222", skuNo: "2222", snNo: '2222' },
      { boxNo: "3333", skuNo: "3333", snNo: '3333' },
      { boxNo: "4444", skuNo: "4444", snNo: '4444' },
    ],
  },
  {
    oddNumbers: "单号222222222222",
    platform: "shopify",
    goods: "商品111",
    createTime: "2024-09-25",
    warehouse: "分仓111",
    boxList: [
      { boxNo: "1111", skuNo: "1111", snNo: '1111' },
      { boxNo: "2222", skuNo: "2222", snNo: '2222' },
      { boxNo: "3333", skuNo: "3333", snNo: '3333' },
      { boxNo: "4444", skuNo: "4444", snNo: '4444' },
    ],
  },
  {
    oddNumbers: "单号333333333333",
    platform: "shopify",
    goods: "商品111",
    createTime: "2024-09-25",
    warehouse: "分仓111",
    boxList: [
      { boxNo: "1111", skuNo: "1111", snNo: '1111' },
      { boxNo: "2222", skuNo: "2222", snNo: '2222' },
      { boxNo: "3333", skuNo: "3333", snNo: '3333' },
      { boxNo: "4444", skuNo: "4444", snNo: '4444' },
    ],
  },
  {
    oddNumbers: "单号444444444444",
    platform: "shopify",
    goods: "商品111",
    createTime: "2024-09-25",
    warehouse: "分仓111",
    boxList: [
      { boxNo: "1111", skuNo: "1111", snNo: '1111' },
      { boxNo: "2222", skuNo: "2222", snNo: '2222' },
      { boxNo: "3333", skuNo: "3333", snNo: '3333' },
      { boxNo: "4444", skuNo: "4444", snNo: '4444' },
    ],
  },
])

function onClick(value: Inspection) {
  console.log("value", value)
  uni.navigateTo({
    url: "/pages/box/index",
  })
}
</script>

<style lang="scss">
page {
  background-color: rgba(239, 239, 239, 1);
}
.item {
  display: flex;
  margin: 10rpx auto;
  padding: 10rpx;
  border: 1px solid #ccc;
  border-radius: 5rpx;
  background-color: #ffffff;
  width: 90%;
  height: 160rpx;
  align-items: center;
  justify-content: space-between;
}
.item-image {
  flex: 1;
}
.item-container {
  flex: 3;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.item-content {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: start;
}
.content {
  display: flex;
  align-items: center;
}
.content-text {
  line-height: 30rpx;
}
.image-content {
  width: 130rpx;
  height: 120rpx;
}
</style>
