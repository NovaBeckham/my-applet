<template>
  <view class="content">
    <view
      v-for="item in list"
      :key="item.id"
      class="item"
      @click="toWait(item.id)"
    >
      <text>{{ item.vendor }} - {{ item.productName }}</text>
      <uni-icons
        type="right"
        size="20"
        color="rgba(33, 84, 118, 1)"
      ></uni-icons>
    </view>
    <view class="divider"></view>
    <view>
      <uni-file-picker
        ref="files"
        :limit="1"
        title="上传文件"
        file-mediatype="all"
        @select="fileSelect"
      ></uni-file-picker>
    </view>
  </view>
</template>

<script setup lang="ts">
import { getProductList, type ProductList } from "@/api"
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

const fileSelect = async (res: any) => {
  const { tempFiles } = res
  const UID = uni.getStorageSync("UID")
  const LT = uni.getStorageSync("LT")
  uni.showLoading({
    title: "加载中",
  })
  const { data } = await uni.uploadFile({
    url: `${BaseURL}/rest/iniasc/deliveryTask/importDeliveryTask`,
    header: {
      Cookie: `UID=${UID}; LT=${LT}`,
      "Content-Type": "multipart/form-data",
    },
    formData: {
      // file: JSON.stringify(files),
      originalFilename: tempFiles[0].name,
    },
    filePath: tempFiles[0].url,
    name: "file",
  })
  uni.hideLoading()
  if (!isNil(data) && !isEmpty(data)) {
    const result = JSON.parse(data)
    if (result.code === 200) {
      uni.showToast({
        title: "上传成功",
        icon: "success",
      })
    } else {
      uni.showToast({
        title: "上传失败",
        icon: "error",
      })
    }
  } else {
    uni.showToast({
      title: "上传失败",
      icon: "error",
    })
  }
}

onLoad(async () => {
  const UID = uni.getStorageSync("UID")
  uni.removeStorageSync("productId")
  if (isNil(UID) || isEmpty(UID)) {
    uni.showToast({
      title: "请重新登录",
      icon: "none",
    })
    uni.reLaunch({
      url: "/pages/login/index",
    })
  } else {
    uni.showLoading({
      title: "加载中",
    })
    const { code, data } = await getProductList()
    uni.hideLoading()
    if (code === 200 && !isNil(data) && !isEmpty(data)) {
      list.value = data
    } else {
      uni.showToast({
        title: "数据为空",
        icon: "none",
      })
    }
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
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.divider {
  width: 100%; /* 与.item的宽度一致 */
  height: 1rpx; /* 分割线高度，可根据需要调整 */
  background-color: rgba(33, 84, 118, 0.5); /* 分割线颜色，可根据需要调整 */
  margin: 20rpx 0; /* 与.item的间距一致 */
}
</style>
