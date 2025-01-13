<template>
  <view class="content">
    <view
      v-for="item in list"
      :key="item.id"
      class="item"
      @click="toWait(item.id)"
    >
      {{ item.vendor }} - {{ item.productName }}
    </view>
    <view>
      <uni-file-picker
        ref="files"
        file-mediatype="all"
        @select="fileSelect"
      ></uni-file-picker>
    </view>
  </view>
</template>

<script setup lang="ts">
import { getProductList, ProductList } from "@/api"
import { BaseURL } from "@/utils/config"
import { onLoad } from "@dcloudio/uni-app"
import { isEmpty, isNil } from "ramda"
import { ref } from "vue"

const files = ref<any>(null)

const list = ref<ProductList[]>([])

const toWait = (productId: number) => {
  uni.setStorageSync("productId", productId)
  uni.switchTab({
    url: `/pages/wait/index`,
  })
}

const fileSelect = (res: any) => {
  console.log("res", res)
  const { tempFilePaths } = res
  console.log("files", files)
  const UID = uni.getStorageSync("UID")
  const LT = uni.getStorageSync("LT")
  const result = uni.uploadFile({
    url: `${BaseURL}/rest/iniasc/deliveryTask/importDeliveryTask`,
    header: {
      Cookie: `UID=${UID}; LT=${LT}`,
    },
    name: "file",
    filePath: tempFilePaths[0],
  })
  console.log("result", result)
}

onLoad(() => {
  const UID = uni.getStorageSync("UID")
  const LT = uni.getStorageSync("LT")
  uni.removeStorageSync("productId")
  if (isNil(UID) || isEmpty(UID)) {
    uni.showToast({
      title: "请重新登录",
    })
    uni.reLaunch({
      url: "/pages/login/index",
    })
  } else {
    console.log("UID", UID)
    console.log("LT", LT)
    getProductList().then((res) => {
      const { code, data } = res
      if (code === 200 && !isNil(data)) {
        list.value = data
      }
    })
  }
})
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.item {
  width: 80%;
  background: #fff;
  padding: 20rpx;
  border: 1rpx solid rgba(33, 84, 118, 1);
  margin: 20rpx 0;
  color: rgba(33, 84, 118, 1);
  font-size: 28rpx;
}
</style>
