<template>
  <view
    v-if="!scanFunctionIsUseable"
    v-for="item in data.boxList"
    :key="item.boxNo"
  >
    <uni-card :title="item.product">
      <view class="box-item">
        <view> 箱号：{{ item.boxNo }} </view>
        <view>
          <button type="primary" size="mini" @click="check">验证</button>
        </view>
      </view>
    </uni-card>
  </view>
  <view v-if="scanFunctionIsUseable" class="camera-container">
    <view class="button-list">
      <button
        v-for="item in scanCodeList"
        :key="item"
        size="mini"
        type="primary"
      >
        {{ item }}
      </button>
    </view>
    <camera
      mode="scanCode"
      device-position="back"
      flash="off"
      @scancode="handleScanCode"
      @error="handleError"
      class="camera"
    />
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue"

const scanFunctionIsUseable = ref(false)
const isScanAllowed = ref(false)
const scanCount = ref(0)
const scanCodeList = ref<string[]>([])
const maxScanCount = 3
let scanTimeoutId: null | number = null

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
  isScanAllowed.value = true
  scanCodeList.value = []
  scanCount.value = 0
}

const handleScanCode = (e: any) => {
  if (isScanAllowed.value && scanCount.value < maxScanCount) {
    scanCount.value++
    console.log("扫码结果：", e.detail.result)
    scanCodeList.value.push(e.detail.result)
    // 处理扫码结果
    // ...

    // 禁用扫码功能，等待间隔时间后再次启用
    isScanAllowed.value = false
    if (scanTimeoutId) {
      clearTimeout(scanTimeoutId) // 清除之前的定时器
    }
    scanTimeoutId = setTimeout(() => {
      isScanAllowed.value = true
    }, 1000) // 1秒后再次启用扫码功能
    if (scanCount.value >= maxScanCount) {
      console.log("已达到最大扫码次数")
      // 达到最大扫码次数后不再启动扫码功能
      clearTimeout(scanTimeoutId)
      isScanAllowed.value = false
      scanFunctionIsUseable.value = false
    }
  } else {
    // 达到最大扫码次数，可以在这里处理后续逻辑
    console.log("扫码功能当前不可用")
  }
}

const handleError = () => {
  console.error("摄像头错误")
  // 处理错误，例如提示用户授权
  if (isScanAllowed.value) {
    isScanAllowed.value = false
    setTimeout(() => {
      isScanAllowed.value = true // 1秒后再次启用扫码功能
    }, 1000)
  }
}
</script>

<style>
.box-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.camera-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100vh;
}

.camera {
  width: 100%;
  height: 96%;
}

.button-list {
  display: flex;
  justify-content: space-around;
  width: 100%;
}
</style>
