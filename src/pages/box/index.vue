<template>
  <view v-if="!scanFunctionIsUseable" v-for="item in data.boxList" :key="item.boxNo">
    <uni-card :title="item.product">
      <view class="box-item">
        <view> 箱号：{{ item.boxNo }} </view>
        <view>
          <button type="primary" size="mini" @click="check">验证</button>
        </view>
      </view>
    </uni-card>
  </view>
  <view>
    <camera
      v-if="scanFunctionIsUseable"
      mode="scanCode"
      device-position="back"
      flash="off"
      @scancode="handleScanCode"
      @error="handleError"
      style="width: 100%; height: 100vh"
    ></camera>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue"

const scanFunctionIsUseable = ref(false)
const scanCount = ref(0)
const maxScanCount = 3

const data = ref({
  oddNumbers: "单号111111111111",
  platform: "shopify",
  goods: "商品111",
  createTime: "2024-09-25",
  warehouse: "分仓111",
  boxList: [
    { boxNo: "1111", product: "1111" },
    { boxNo: "2222", product: "2222" },
    { boxNo: "3333", product: "3333" },
    { boxNo: "4444", product: "4444" },
  ],
})

const check = () => {
  scanFunctionIsUseable.value = true
}

const handleScanCode = (e: any) => {
  if (scanCount.value < maxScanCount) {
    scanCount.value++
    console.log("扫码结果：", e.detail.result)
    // 处理扫码结果
    // ...

    // 禁用扫码功能，等待间隔时间后再次启用
    scanFunctionIsUseable.value = false
  } else {
    // 达到最大扫码次数，可以在这里处理后续逻辑
    console.log("已达到最大扫码次数")
    scanFunctionIsUseable.value = false
  }
}

const handleError = () => {
  console.error("摄像头错误")
  // 处理错误，例如提示用户授权
}
</script>

<style>
.box-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
