<template>
  <view v-for="item in list" :key="item.id" @click="onClick(item.id)">
    <InspectionCom :item="item" status="already" />
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue"
import InspectionCom from "@/components/Inspection/index.vue"
import { getFinishList, type Inspection } from "@/api"
import { onShow } from "@dcloudio/uni-app"
import { isEmpty, isNil } from "ramda"

const list = ref<Inspection[]>([])

onShow(async () => {
  const productId = uni.getStorageSync("productId")
  if (!isNil(productId)) {
    uni.showLoading({
      title: "加载中",
    })
    const { code, data } = await getFinishList(productId)
    uni.hideLoading()
    if (
      code === 200 &&
      !isNil(data) &&
      !isNil(data.dateList) &&
      !isEmpty(data.dateList)
    ) {
      list.value = data.dateList
    } else {
      uni.showToast({
        title: "数据为空",
        icon: "error",
      })
    }
  } else {
    uni.showToast({
      title: "请从首页点击进入",
      icon: "none",
    })
  }
})

function onClick(deliveryTaskId: number) {
  uni.navigateTo({
    url: `/pages/box/index?status=already&deliveryTaskId=${deliveryTaskId}`,
  })
}
</script>

<style lang="scss">
page {
  background-color: rgba(239, 239, 239, 1);
}
</style>
