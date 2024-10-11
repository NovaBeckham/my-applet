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
          <button type="primary" size="mini" @click="check(item)">验证</button>
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

interface BoxItem {
  boxNo?: string
  product?: string
  sku?: string
  wareCode?: string
}

const scanFunctionIsUseable = ref(false)
const isScanAllowed = ref(false)
const scanCount = ref(0)
const scanCodeList = ref<string[]>([])
const targetBox = ref<BoxItem>({})
const maxScanCount = 3
let scanTimeoutId: null | number = null

const data = ref({
  oddNumbers: "单号111111111111",
  platform: "shopify",
  goods: "商品111",
  createTime: "2024-09-25",
  warehouse: "分仓111",
  boxList: [
    { boxNo: "1111", product: "1111", sku: "1111", wareCode: "1111" },
    { boxNo: "2222", product: "2222", sku: "2222", wareCode: "2222" },
    { boxNo: "3333", product: "3333", sku: "3333", wareCode: "3333" },
    { boxNo: "4444", product: "4444", sku: "4444", wareCode: "4444" },
  ],
})

const check = (value: BoxItem) => {
  scanFunctionIsUseable.value = true
  isScanAllowed.value = true
  targetBox.value = value
  scanCodeList.value = []
  scanCount.value = 0
}

/** 判断箱号是否相同 */
const judgeBoxNo = () => {
  const index = scanCodeList.value.findIndex(
    (item) => targetBox.value.boxNo === item
  )
  if (index > -1) {
    scanCodeList.value.splice(index, 1)
    return true
  }
  return false
}

/** 判断SKU是否相同 */
const judgeSku = () => {
  const index = scanCodeList.value.findIndex(
    (item) => targetBox.value.sku === item
  )
  if (index > -1) {
    scanCodeList.value.splice(index, 1)
    return true
  }
  return false
}

/** 判断wareCode是否相同 */
const judgeWareCode = () => {
  const index = scanCodeList.value.findIndex(
    (item) => targetBox.value.wareCode === item
  )
  if (index > -1) {
    scanCodeList.value.splice(index, 1)
    return true
  }
  return false
}

const checkTarget = () => {
  const hasBoxNo = judgeBoxNo()
  const hasSku = judgeSku()
  const hasWareCode = judgeWareCode()
  if (hasBoxNo && hasSku && hasWareCode) {
    uni.showModal({
      title: "扫码成功",
      icon: "success",
      content: "二维码已成功识别",
      showCancel: false, // 不显示取消按钮
      confirmText: "好的", // 确认按钮的文字
    })
  } else {
    uni.showModal({
      title: "扫码失败",
      icon: "error",
      content: "二维码已成功识别",
      showCancel: false, // 不显示取消按钮
      confirmText: "好的", // 确认按钮的文字
    })
  }
}

const handleScanCode = (e: any) => {
  if (isScanAllowed.value && scanCount.value < maxScanCount) {
    scanCount.value++
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
      // 达到最大扫码次数后不再启动扫码功能
      clearTimeout(scanTimeoutId)
      isScanAllowed.value = false
      scanFunctionIsUseable.value = false
      checkTarget()
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
