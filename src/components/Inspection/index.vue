<template>
  <uni-card padding="10px 10px 10px 0">
    <view class="item">
      <view class="item-icon" v-if="status === 'already'"
        ><uni-icons type="checkmarkempty" color="#2da641" size="20"></uni-icons
      ></view>
      <view class="item-image">
        <image
          mode="aspectFit"
          :src="ProductImage"
          class="image-content"
        ></image>
      </view>
      <view class="item-container">
        <view class="container-icon" v-if="status === 'wait'"
          ><uni-icons type="right" size="20"></uni-icons
        ></view>
        <view class="item-content first">
          <view class="content">
            <uni-icons
              custom-prefix="iconfont"
              type="icon-RectangleCopy2"
              class="inspection-icon"
              size="28"
            ></uni-icons>
            <text class="content-text">{{ item.warehousePlat }}</text>
          </view>
          <view class="content">
            <uni-icons
              custom-prefix="iconfont"
              type="icon-RectangleCopy3"
              class="inspection-icon"
              size="28"
            ></uni-icons>
            <text class="content-text"
              >{{ item.cartonNum }}箱/{{ item.quantity }}</text
            >
          </view>
        </view>
        <view class="item-content second">
          <view class="content">
            <uni-icons
              custom-prefix="iconfont"
              type="icon-RectangleCopy1"
              class="inspection-icon"
              size="28"
            ></uni-icons>
            <text class="content-text">{{
              dayjs(item.deliveryDate).format("YYYY-MM-DD")
            }}</text>
          </view>
          <view class="content">
            <uni-icons
              custom-prefix="iconfont"
              type="icon-RectangleCopy"
              class="inspection-icon"
              size="28"
            ></uni-icons>
            <view class="content-text">{{
              formattedIbrNo(item.ibrNo ?? "")
            }}</view>
          </view>
        </view>
      </view>
    </view>
  </uni-card>
</template>

<script setup lang="ts">
import type { Inspection } from "@/api"
import dayjs from "dayjs"
import ProductImage from "@/static/product.png"

interface Props {
  item: Inspection
  status: "wait" | "already"
}

const props = defineProps<Props>()

const { item, status } = props

const formattedIbrNo = (ibrNo: string) => {
  if (ibrNo.length <= 9) {
    return ibrNo
  }
  return ibrNo.slice(0, 5) + "..." + ibrNo.slice(-4)
}
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
  flex: 2;
}
.item-container {
  flex: 7;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
}
.container-icon {
  position: absolute;
  float: right;
  top: 0;
  right: 10rpx;
}
.item-content {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: start;
}
.first {
  flex: 2;
}
.second {
  flex: 3;
}
.content {
  display: flex;
  align-items: center;
  margin: 10rpx 0;
  word-break: break-all;
}
.content-text {
  font-size: 14px;
}
.inspection-icon {
  text {
    line-height: 28px;
  }
}

.image-content {
  width: 130rpx;
  height: 120rpx;
}
</style>
