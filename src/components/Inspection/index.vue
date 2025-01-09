<template>
  <uni-card>
    <view class="item">
      <view class="item-icon" v-if="status === 'already'"
        ><uni-icons type="checkmarkempty" color="#2da641" size="20"></uni-icons
      ></view>
      <view class="item-image">
        <image :src="ProductImage" class="image-content"></image>
      </view>
      <view class="item-container">
        <view class="item-content">
          <view class="content">
            <uni-icons custom-prefix="iconfont" type="icon-RectangleCopy2" size="20"></uni-icons>
            <text class="content-text">{{ item.platform }}</text>
          </view>
          <view class="content">
            <uni-icons custom-prefix="iconfont" type="icon-RectangleCopy3" size="20"></uni-icons>
            <text class="content-text">{{ item.warehouse }}</text>
          </view>
        </view>
        <view class="item-content">
          <view class="content">
            <uni-icons custom-prefix="iconfont" type="icon-RectangleCopy1" size="20"></uni-icons>
            <text class="content-text">{{ item.createTime }}</text>
          </view>
          <view class="content">
            <uni-icons custom-prefix="iconfont" type="icon-RectangleCopy" size="20"></uni-icons>
            <text class="content-text">{{ item.oddNumbers }}</text>
          </view>
        </view>
      </view>
    </view>
  </uni-card>
</template>

<script setup lang="ts">
import ProductImage from "@/static/product.png"
import type { Inspection } from "@/interface"

interface Props {
  item: Inspection
  status: "wait" | "already"
}

const props = defineProps<Props>()

const { item, status } = props
</script>

<style lang="scss">
.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.item-icon {
  position: absolute;
  float: left;
  top: 0;
  left: 10rpx;
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
  margin: 10rpx 0;
}
.content-text {
  line-height: 30rpx;
}
.image-content {
  width: 130rpx;
  height: 120rpx;
}
</style>
