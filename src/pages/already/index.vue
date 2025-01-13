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
import { isNil } from "ramda"

const list = ref<Inspection[]>([])

onShow(() => {
  const productId = uni.getStorageSync("productId")
  if (!isNil(productId)) {
    console.log("productId", productId)
    getFinishList(productId).then((res) => {
      const { code, data } = res
      if (code === 200 && !isNil(data) && !isNil(data.dateList)) {
        list.value = data.dateList ?? []
      }
    })
  } else {
    uni.showToast({
      title: "请从首页点击进入",
    })
  }
})

function onClick(deliveryTaskId: number) {
  console.log("deliveryTaskId", deliveryTaskId)
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
