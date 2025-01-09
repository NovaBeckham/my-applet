<template>
  <view v-if="scanFunctionIsUseable" class="camera-container">
    <camera
      mode="scanCode"
      device-position="back"
      flash="off"
      @scancode="handleScanCode"
      @error="handleError"
      class="camera"
    />
  </view>
  <view v-for="item in data.boxList" :key="item.boxNo" @click="check(item)">
    <uni-card>
      <view class="uni-item-row">
        <uni-row>
          <uni-col :span="10"
            ><text>箱号：{{ item.boxNo }}</text></uni-col
          >
          <uni-col :span="10"
            ><text>sku：{{ item.skuNo }}</text></uni-col
          >
          <uni-col :span="4"
            ><uni-easyinput
              :clearable="false"
              v-model="item.value"
              type="number"
              disabled
            ></uni-easyinput
          ></uni-col>
        </uni-row>
        <uni-row>
          <uni-col :span="22"
            ><text>SN：{{ item.snNo }}</text></uni-col
          >
          <uni-col :span="2" class="col-checkbox"
            ><uni-icons
              type="calendar-filled"
              size="20"
              color="#2da641"
              v-if="item.check"
            ></uni-icons
            ><uni-icons type="calendar" size="20" v-else></uni-icons
          ></uni-col>
        </uni-row>
      </view>
    </uni-card>
  </view>
  <view>
    <button class="fab" @click="onFabClick">完成</button>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue"

interface BoxItem {
  boxNo?: string
  skuNo?: string
  snNo?: string
  value?: number
  check?: boolean
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
    { boxNo: "1111", skuNo: "111111111", snNo: "1111", value: 0, check: true },
    { boxNo: "2222", skuNo: "222222222", snNo: "2222", value: 0, check: false },
    { boxNo: "3333", skuNo: "333333333", snNo: "3333", value: 0, check: false },
    { boxNo: "4444", skuNo: "444444444", snNo: "4444", value: 0, check: false },
  ],
})

const check = (value: BoxItem) => {
  if (value.check) {
    return
  }
  scanFunctionIsUseable.value = true
  isScanAllowed.value = true
  targetBox.value = value
  scanCodeList.value = []
  scanCount.value = 0
}

const onFabClick = () => {
  if (scanFunctionIsUseable.value) {
    isScanAllowed.value = false
    scanFunctionIsUseable.value = false
  }
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
    (item) => targetBox.value.skuNo === item
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
    (item) => targetBox.value.snNo === item
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
      content: "验证成功",
      showCancel: false, // 不显示取消按钮
      confirmText: "好的", // 确认按钮的文字
    })
    data.value.boxList.forEach((val) => {
      if (val.boxNo === targetBox.value.boxNo) {
        val.check = true
      }
    })
  } else {
    uni.showModal({
      title: "扫码失败",
      icon: "error",
      content: "验证失败",
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

<style lang="scss">
.camera-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 50vh;
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

.box-easyinput {
  .uni-easyinput {
    text-align: center;
  }
}

.uni-item-row {
  .uni-row {
    display: flex;
    align-items: center;
    justify-content: start;
  }
  .uni-row:last-child {
    margin-top: 20rpx;
  }
}
.fab {
  position: fixed; /* 固定定位 */
  bottom: 60rpx; /* 距离底部20px */
  left: 50%; /* 水平居中 */
  transform: translateX(-50%); /* 使按钮向左移动其自身宽度的一半 */
  width: 60%; /* 按钮宽度 */
  height: 70rpx; /* 按钮高度 */
  border-radius: 15rpx; /* 圆形按钮 */
  background-color: #6200ea; /* 按钮背景色 */
  color: white; /* 按钮文字颜色 */
  border: none; /* 去掉边框 */
  box-shadow: 0 8rpx 18rpx rgba(0, 0, 0, 0.2); /* 阴影效果 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.fab:hover {
  background-color: #3700b3; /* 悬停时的背景色 */
}
</style>
