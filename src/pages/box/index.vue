<template>
  <view
    v-if="state.status === 'wait' && boxMap.size > 0"
    class="camera-container"
  >
    <camera
      mode="scanCode"
      device-position="back"
      flash="off"
      @scancode="handleScanCode"
      @error="handleError"
      class="camera"
    />
  </view>
  <view v-for="item in boxMap" :key="item[0]">
    <uni-card>
      <view class="uni-item-row">
        <uni-row>
          <uni-col :span="10"
            ><text>箱号：{{ item[0] }}</text></uni-col
          >
          <uni-col :span="10"
            ><text>sku：{{ item[1].skuNo }}</text></uni-col
          >
          <uni-col :span="4"
            ><uni-easyinput
              :clearable="false"
              v-model="item[1].value"
              type="number"
              disabled
            ></uni-easyinput
          ></uni-col>
        </uni-row>
        <uni-row>
          <uni-col :span="22"
            ><text>SN：{{ item[1].snNo }}</text></uni-col
          >
          <uni-col :span="2" class="col-checkbox"
            ><uni-icons
              type="calendar-filled"
              size="20"
              color="#2da641"
              v-if="item[1].value && item[1].value > 0"
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
import { onLoad, onUnload } from "@dcloudio/uni-app"
import { ref } from "vue"
import { add, clone, isEmpty } from "ramda"

interface BoxItem {
  boxNo?: string
  skuNo?: string
  snNo?: string
  value?: number
  boxNoCheck?: number
  skuNoCheck?: number
  snNoCheck?: number
}

interface QueryOptions {
  status?: "wait" | "already"
  oddNumbers?: string
  platform?: string
  goods?: string
  warehouse?: string
}

const isScanAllowed = ref(true)
const state = ref<QueryOptions>({})
const boxMap = ref<Map<string, BoxItem>>(new Map())
const targetBox = ref("")
const result = ref("")
const showModal = ref(false)
let scanTimeoutId: null | number = null

onLoad((options?: QueryOptions) => {
  if (options) {
    state.value = options
    const boxList = [
      {
        boxNo: "1111",
        skuNo: "111111111",
        snNo: "1111",
        value: 1,
        boxNoCheck: 1,
        skuNoCheck: 1,
        snNoCheck: 1,
      },
      {
        boxNo: "6900966577117",
        skuNo: "6973939344870",
        snNo: "6922266450365",
        value: 0,
        boxNoCheck: 0,
        skuNoCheck: 0,
        snNoCheck: 0,
      },
      {
        boxNo: "3333",
        skuNo: "333333333",
        snNo: "3333",
        value: 0,
        boxNoCheck: 0,
        skuNoCheck: 0,
        snNoCheck: 0,
      },
      {
        boxNo: "4444",
        skuNo: "444444444",
        snNo: "4444",
        value: 0,
        boxNoCheck: 0,
        skuNoCheck: 0,
        snNoCheck: 0,
      },
    ]
    const listMap: Map<string, BoxItem> = new Map()
    boxList.forEach((item) => {
      listMap.set(item.boxNo ?? "", clone(item))
    })
    boxMap.value = listMap
    // listMap.clear()
  }
})

onUnload(() => {
  console.log("离开")
})

const onFabClick = () => {
  const item = boxMap.value.get("2222")
  if (item) {
    item.boxNoCheck = add(item.boxNoCheck ?? 0, 1)
    item.skuNoCheck = add(item.skuNoCheck ?? 0, 1)
    item.snNoCheck = add(item.snNoCheck ?? 0, 1)
    item.value = item.boxNoCheck
  }
}

const checkTarget = () => {
  const boxItem = boxMap.value.get(result.value)
  if (boxItem) {
    if (isEmpty(targetBox.value) || targetBox.value !== result.value) {
      targetBox.value = result.value
      boxItem.boxNoCheck = add(boxItem.boxNoCheck ?? 0, 1)
    } else {
      showModal.value = true
      uni.showModal({
        title: "提示",
        icon: "error",
        content: "扫码重复",
        showCancel: false, // 不显示取消按钮
        confirmText: "好的", // 确认按钮的文字
        success: (result) => {
          if (result.confirm) {
            showModal.value = false
          }
        },
      })
    }
  } else {
    if (isEmpty(targetBox.value)) {
      showModal.value = true
      uni.showModal({
        title: "错误",
        icon: "error",
        content: "请先扫箱号",
        showCancel: false,
        confirmText: "好的",
        success: (result) => {
          if (result.confirm) {
            showModal.value = false
          }
        },
      })
    } else {
      const item = boxMap.value.get(targetBox.value)
      if (item) {
        if (item.snNo !== result.value && item.skuNo !== result.value) {
          showModal.value = true
          uni.showModal({
            title: "错误",
            icon: "error",
            content: `箱号 ${targetBox.value} 内容不匹配`,
            showCancel: false,
            confirmText: "好的",
            success: (result) => {
              if (result.confirm) {
                showModal.value = false
              }
            },
          })
          return
        }
        // 和SKU匹配
        if (item.skuNo === result.value) {
          item.skuNoCheck = add(item.skuNoCheck ?? 0, 1)
        }
        // 和SN匹配
        if (item.snNo === result.value) {
          item.snNoCheck = add(item.snNoCheck ?? 0, 1)
        }
        if (
          item.boxNoCheck === item.skuNoCheck &&
          item.boxNoCheck === item.snNoCheck &&
          item.boxNoCheck !== item.value
        ) {
          item.value = item.boxNoCheck
        }
      }
    }
  }
}

const handleScanCode = (e: any) => {
  if (isScanAllowed.value && !showModal.value) {
    console.log("result", e.detail.result)
    result.value = e.detail.result
    checkTarget()
    // 处理扫码结果
    // ...

    // 禁用扫码功能，等待间隔时间后再次启用
    isScanAllowed.value = false
    if (scanTimeoutId) {
      clearTimeout(scanTimeoutId) // 清除之前的定时器
    }
    scanTimeoutId = setTimeout(() => {
      isScanAllowed.value = true
    }, 2000) // 2秒后再次启用扫码功能
    // if
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
