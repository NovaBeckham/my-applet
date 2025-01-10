<template>
  <view v-if="isWait && boxMap.size > 0" class="camera-container">
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
      <view class="item-container">
        <view class="item-content">
          <view class="content huodai">
            <uni-icons
              custom-prefix="iconfont"
              type="icon-huodai"
              size="20"
            ></uni-icons>
            <text class="content-text">{{ item[1].ibrNo }}</text>
          </view>
          <view class="content sku">
            <uni-icons
              custom-prefix="iconfont"
              type="icon-sku"
              size="20"
            ></uni-icons>
            <text class="content-text">{{ item[1].skuId }}</text>
          </view>
          <view class="content easyinput">
            <uni-tag :text="`x ${item[1].value}`" type="primary" />
          </view>
        </view>
        <view>
          <view class="content">
            <uni-icons
              custom-prefix="iconfont"
              type="icon-xianghao"
              size="20"
            ></uni-icons>
            <text class="content-text">{{ item[0] }}</text>
          </view>
          <view class="content" v-if="isWait">
            <uni-icons
              type="calendar-filled"
              size="20"
              color="#2da641"
              v-if="item[1].value && item[1].value > 0"
            ></uni-icons
            ><uni-icons type="calendar" size="20" v-else></uni-icons>
          </view>
        </view>
      </view>
    </uni-card>
  </view>
  <view v-if="isWait">
    <button class="fab" @click="onFabClick">完成</button>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app"
import { computed, ref } from "vue"
import { add, isEmpty, isNil } from "ramda"
import { boxCheckFinish, getCartonList, type CartonRecord } from "@/api"

interface QueryOptions {
  status?: "wait" | "already"
  deliveryTaskId?: string
}

interface BoxItem extends CartonRecord {
  value?: number
  cartonNoCheck?: number
  skuIdCheck?: number
  ibrCheck?: number
}

const isScanAllowed = ref(true)
const state = ref<QueryOptions>({})
const boxMap = ref<Map<string, BoxItem>>(new Map())
const targetBox = ref("")
const result = ref("")
const showModal = ref(false)
let scanTimeoutId: null | number = null

/**
 * @description: 判断是否从待验页面跳转过来的
 */
const isWait = computed(() => {
  return state.value.status === "wait"
})

onLoad((options?: QueryOptions) => {
  if (options) {
    state.value = options
    getCartonList(options.deliveryTaskId ?? "").then((res) => {
      const { code, data } = res
      if (code === 200 && !isNil(data)) {
        const listMap: Map<string, BoxItem> = new Map()
        data.forEach((item) => {
          listMap.set(item.cartonNo ?? "", {
            ...item,
            value: 0,
            cartonNoCheck: 0,
            skuIdCheck: 0,
            ibrCheck: 0,
          })
        })
        boxMap.value = listMap
      }
    })
  }
})

const onFabClick = () => {
  boxCheckFinish(state.value.deliveryTaskId ?? "").then((res) => {
    const { code } = res
    if (code === 200) {
      uni.showToast({
        title: "验证成功",
      })
      uni.navigateBack()
    }
  })
}

const checkTarget = () => {
  const boxItem = boxMap.value.get(result.value)
  if (boxItem) {
    if (isEmpty(targetBox.value) || targetBox.value !== result.value) {
      targetBox.value = result.value
      boxItem.cartonNoCheck = add(boxItem.cartonNoCheck ?? 0, 1)
    } else {
      showModal.value = true
      uni.showModal({
        title: "提示",
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
        if (item.ibrNo !== result.value && item.skuId !== result.value) {
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
        if (item.skuId === result.value) {
          item.skuIdCheck = add(item.skuIdCheck ?? 0, 1)
        }
        // 和SN匹配
        if (item.ibrNo === result.value) {
          item.ibrCheck = add(item.ibrCheck ?? 0, 1)
        }
        if (
          item.cartonNoCheck === item.skuIdCheck &&
          item.cartonNoCheck === item.ibrCheck &&
          item.cartonNoCheck !== item.value
        ) {
          item.value = item.cartonNoCheck
        }
      }
    }
  }
}

const handleScanCode = (e: any) => {
  if (isScanAllowed.value && !showModal.value) {
    uni.showToast({
      title: `${e.detail.result}`,
      icon: "success",
    })
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
    }, 1500) // 1.5秒后再次启用扫码功能
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

.item-container {
  display: flex;
  flex-direction: column;
}
.item-content {
  display: flex;

  .huodai {
    flex: 3;
  }

  .sku {
    flex: 3;
  }

  .easyinput {
    flex: 1;
  }
}
.content {
  display: flex;
  align-items: center;
  margin: 10rpx 0;

  .content-text {
    margin-left: 10rpx;
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
