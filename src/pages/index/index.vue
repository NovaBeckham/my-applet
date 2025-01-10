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
        @upload="onUpload"
      ></uni-file-picker>
    </view>
  </view>
</template>

<script setup lang="ts">
import { getProductList, ProductList, uploadFileByExcel } from "@/api"
import { BaseURL } from "@/utils/config"
import { onLoad } from "@dcloudio/uni-app"
import { isEmpty, isNil, map } from "ramda"
import { ref } from "vue"

const files = ref<any>(null)

const list = ref<ProductList[]>([
  {
    id: 8,
    productName: "Model3",
    vendor: "BSD",
    status: 1,
    seqNo: 2,
    productImg: null,
  },
  {
    id: 9,
    productName: "Model-S",
    vendor: "范丝哲",
    status: 1,
    seqNo: 3,
    productImg: null,
  },
  {
    id: 10,
    productName: "X3",
    vendor: "尖超",
    status: 1,
    seqNo: 4,
    productImg: null,
  },
  {
    id: 11,
    productName: "New-Model-S",
    vendor: "BSD",
    status: 1,
    seqNo: 5,
    productImg: null,
  },
  {
    id: 12,
    productName: "New-Mask",
    vendor: "思肯",
    status: 1,
    seqNo: 6,
    productImg: null,
  },
  {
    id: 13,
    productName: "XE",
    vendor: "初见未来",
    status: 1,
    seqNo: 7,
    productImg: null,
  },
  {
    id: 14,
    productName: "N5-Lite",
    vendor: "启哲",
    status: 1,
    seqNo: 8,
    productImg: null,
  },
])

const toWait = (productId: number) => {
  uni.switchTab({
    url: `/pages/wait/index?productId=${productId}`,
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
    filePath: tempFilePaths[0]
  })
  console.log("result", result)
}

const onUpload = () => {
  const formData = new FormData()
  console.log("files", files.value)
  // formData.append(files.value)
  // uploadFileByExcel()
}

onLoad(() => {
  const UID = uni.getStorageSync("UID")
  const LT = uni.getStorageSync("LT")
  // if (isNil(UID) || isEmpty(UID)) {
  //   uni.showToast({
  //     title: "请重新登录",
  //   })
  //   uni.reLaunch({
  //     url: "/pages/login/index",
  //   })
  // } else {
  //   console.log('UID', UID)
  //   console.log('LT', LT)
  //   getProductList().then((res) => {
  //     const { code, data } = res
  //     if (code === 200 && !isNil(data)) {
  //       list.value = data
  //     }
  //   })
  // }
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
