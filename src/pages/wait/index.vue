<template>
  <view v-for="item in list" :key="item.id" @click="onClick(item.id)">
    <InspectionCom :item="item" status="wait" />
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue"
import InspectionCom from "@/components/Inspection/index.vue"
import { onLoad } from "@dcloudio/uni-app"
import { isNil } from "ramda"
import { getWaitList, type Inspection } from "@/api"

const list = ref<Inspection[]>([])

onLoad((options?: { productId?: string }) => {
  if (options && !isNil(options.productId)) {
    console.log("productId", options.productId)
    getWaitList(options.productId).then((res) => {
      const { code, data } = res
      if (code === 200 && !isNil(data)) {
        list.value = data
      }
    })
  }
})

function onClick(deliveryTaskId: number) {
  console.log("deliveryTaskId", deliveryTaskId)
  uni.navigateTo({
    url: `/pages/box/index?status=wait&deliveryTaskId=${deliveryTaskId}`,
  })
}
</script>

<style lang="scss">
page {
  background-color: rgba(239, 239, 239, 1);
}
.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.item-image {
  flex: 1;
}
.item-container {
  flex: 3;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.item-content {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: start;
}
.content {
  display: flex;
  align-items: center;
}
.content-text {
  line-height: 30rpx;
}
.image-content {
  width: 130rpx;
  height: 120rpx;
}
</style>
