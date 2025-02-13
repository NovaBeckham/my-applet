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
  <scroll-view
    class="list-container"
    :scroll-y="true"
    :scroll-into-view="scrollIntoViewId"
    :scroll-with-animation="true"
  >
    <view v-for="item in boxMap" :key="item[0]" :id="item[0]">
      <uni-card padding="0">
        <view class="item-container">
          <view class="item-content">
            <view
              :class="`content huodai ${
                item[1].logisticCheck ? 'isCheck' : 'noCheck'
              }`"
            >
              <uni-icons
                custom-prefix="iconfont"
                type="icon-huodai"
                class="box-icon"
                size="28"
              ></uni-icons>
              <text class="content-text">{{ item[1].logisticNo }}</text>
            </view>
            <view
              :class="`content sku ${
                item[1].skuIdCheck ? 'isCheck' : 'noCheck'
              }`"
            >
              <uni-icons
                custom-prefix="iconfont"
                type="icon-sku"
                class="box-icon"
                size="28"
              ></uni-icons>
              <text class="content-text">{{ item[1].skuId }}</text>
            </view>
            <view class="content easyinput">
              <uni-tag :text="`x ${item[1].skuIdCheck}`" type="primary" />
            </view>
          </view>
          <view class="item-content">
            <view
              :class="`content xianghao ${
                item[1].cartonNoCheck ? 'isCheck' : 'noCheck'
              }`"
            >
              <uni-icons
                custom-prefix="iconfont"
                type="icon-xianghao"
                class="box-icon"
                size="28"
              ></uni-icons>
              <text class="content-text">{{ item[0] }}</text>
            </view>
            <view class="content calendar" v-if="isWait">
              <uni-icons
                type="calendar-filled"
                size="26"
                color="#2da641"
                v-if="
                  item[1].cartonNoCheck > 0 &&
                  item[1].logisticCheck > 0 &&
                  item[1].skuIdCheck > 0
                "
              ></uni-icons
              ><uni-icons type="calendar" size="26" v-else></uni-icons>
            </view>
          </view>
        </view>
      </uni-card>
    </view>
  </scroll-view>
  <view v-if="isWait">
    <button class="fab" @click="onFabClick">完成</button>
  </view>
</template>

<script setup lang="ts">
import { onLoad, onUnload } from "@dcloudio/uni-app"
import { computed, nextTick, ref } from "vue"
import { add, clone, isEmpty, isNil } from "ramda"
import { boxCheckFinish, getCartonList, type CartonRecord } from "@/api"

interface QueryOptions {
  status?: "wait" | "already"
  deliveryTaskId?: string
}

interface BoxItem extends CartonRecord {
  cartonNoCheck: number
  skuIdCheck: number
  logisticCheck: number
}

const isScanAllowed = ref(true)
const isAllCheck = ref(false)
const state = ref<QueryOptions>({})
const boxMap = ref<Map<string, BoxItem>>(new Map())
const targetBox = ref("")
const result = ref("")
const showModal = ref(false)
/** 用于记录需要滚动到的元素的id */
const scrollIntoViewId = ref("")
let scanTimeoutId: null | number = null

/**
 * @description: 判断是否从待验页面跳转过来的
 */
const isWait = computed(() => {
  return state.value.status === "wait"
})

onLoad(async (options?: QueryOptions) => {
  if (options) {
    state.value = options
    uni.showLoading({
      title: "加载中",
    })
    const { code, data } = await getCartonList(options.deliveryTaskId ?? "")
    uni.hideLoading()
    if (code === 200 && !isNil(data) && !isEmpty(data)) {
      const list: BoxItem[] | undefined = uni.getStorageSync(
        options.deliveryTaskId ?? ""
      )
      const storageMap: Map<string, BoxItem> = new Map()
      if (!isNil(list) && !isEmpty(list)) {
        list.forEach((item) => {
          storageMap.set(item.cartonNo ?? "", item)
        })
      }
      const listMap: Map<string, BoxItem> = new Map()
      data.forEach((item) => {
        const oldItem = storageMap.get(item.cartonNo ?? "")
        const newItem = isNil(oldItem)
          ? {
              ...item,
              cartonNoCheck: 0,
              skuIdCheck: 0,
              logisticCheck: 0,
            }
          : clone(oldItem)
        listMap.set(item.cartonNo ?? "", newItem)
      })
      boxMap.value = listMap
      storageMap.clear()
    } else {
      uni.showToast({
        title: "数据为空",
        icon: "error",
      })
    }
  }
})

onUnload(() => {
  if (!isAllCheck.value) {
    const list: BoxItem[] = []
    boxMap.value.forEach((value) => {
      list.push(clone(value))
    })
    uni.setStorageSync(state.value.deliveryTaskId ?? "", list)
  }
})

const onFabClick = async () => {
  let cartonNo = ""
  boxMap.value.forEach((value, key) => {
    if (
      value.cartonNoCheck === 0 ||
      value.logisticCheck === 0 ||
      value.skuIdCheck === 0
    ) {
      cartonNo = key
    }
  })
  if (!isEmpty(cartonNo)) {
    uni.showModal({
      title: "错误",
      content: `箱号 ${cartonNo} 还未验证成功`,
      showCancel: false,
      confirmText: "好的",
    })
    return
  }
  uni.showLoading({
    title: "加载中",
  })
  const { code } = await boxCheckFinish(state.value.deliveryTaskId ?? "")
  uni.hideLoading()
  if (code === 200) {
    uni.showToast({
      title: "验证成功",
    })
    isAllCheck.value = true
    uni.removeStorageSync(state.value.deliveryTaskId ?? "")
    uni.navigateBack()
  } else {
    uni.showToast({
      title: "验证失败",
      icon: "error",
    })
  }
}

const checkTarget = () => {
  const boxItem = boxMap.value.get(result.value)
  if (boxItem) {
    targetBox.value = result.value
    uni.showToast({
      title: `箱号：${result.value}`,
      icon: "success",
    })
    boxItem.cartonNoCheck = add(boxItem.cartonNoCheck ?? 0, 1)
    nextTick(() => {
      scrollIntoViewId.value = result.value
    })
  } else {
    if (isEmpty(targetBox.value)) {
      showModal.value = true
      uni.showModal({
        title: "错误",
        content: "箱号不存在",
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
        if (item.logisticNo !== result.value && item.skuId !== result.value) {
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
          uni.showToast({
            title: `SKU：${result.value}`,
            icon: "success",
          })
          item.skuIdCheck = add(item.skuIdCheck ?? 0, 1)
        }
        // 和ibr匹配
        if (item.logisticNo === result.value) {
          item.logisticCheck = add(item.logisticCheck ?? 0, 1)
          uni.showToast({
            title: `货代号：${result.value}`,
            icon: "success",
          })
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

.list-container {
  height: 720rpx;
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
    margin-left: 5px;
  }

  .xianghao {
    flex: 6;
  }

  .calendar {
    flex: 1;
    margin-left: 5px;
  }
}
.content {
  display: flex;
  align-items: center;
  justify-content: start;
  margin: 10rpx 0;
  word-break: break-all;

  .content-text {
    margin-left: 10rpx;
    font-size: 14px;
    width: 80%;
  }
}

.box-icon {
  text {
    line-height: 28px;
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

.noCheck {
  color: rgba(206, 206, 206, 1);
}

.isCheck {
  color: rgba(33, 84, 118, 1);
}
</style>
