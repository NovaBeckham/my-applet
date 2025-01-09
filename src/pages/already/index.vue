<template>
  <view v-for="item in list" :key="item.oddNumbers" @click="onClick">
    <InspectionCom :item="item" status="already" />
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue"
import type { Inspection } from "@/interface"
import InspectionCom from "@/components/Inspection/index.vue"

const list = ref<Inspection[]>([
  {
    oddNumbers: "单号111111111111",
    platform: "shopify",
    goods: "商品111",
    createTime: "2024-09-25",
    warehouse: "分仓111",
    boxList: [
      { boxNo: "1111", skuNo: "1111", snNo: "1111" },
      { boxNo: "2222", skuNo: "2222", snNo: "2222" },
      { boxNo: "3333", skuNo: "3333", snNo: "3333" },
      { boxNo: "4444", skuNo: "4444", snNo: "4444" },
    ],
  },
  {
    oddNumbers: "单号222222222222",
    platform: "shopify",
    goods: "商品111",
    createTime: "2024-09-25",
    warehouse: "分仓111",
    boxList: [
      { boxNo: "1111", skuNo: "1111", snNo: "1111" },
      { boxNo: "2222", skuNo: "2222", snNo: "2222" },
      { boxNo: "3333", skuNo: "3333", snNo: "3333" },
      { boxNo: "4444", skuNo: "4444", snNo: "4444" },
    ],
  },
  {
    oddNumbers: "单号333333333333",
    platform: "shopify",
    goods: "商品111",
    createTime: "2024-09-25",
    warehouse: "分仓111",
    boxList: [
      { boxNo: "1111", skuNo: "1111", snNo: "1111" },
      { boxNo: "2222", skuNo: "2222", snNo: "2222" },
      { boxNo: "3333", skuNo: "3333", snNo: "3333" },
      { boxNo: "4444", skuNo: "4444", snNo: "4444" },
    ],
  },
  {
    oddNumbers: "单号444444444444",
    platform: "shopify",
    goods: "商品111",
    createTime: "2024-09-25",
    warehouse: "分仓111",
    boxList: [
      { boxNo: "1111", skuNo: "1111", snNo: "1111" },
      { boxNo: "2222", skuNo: "2222", snNo: "2222" },
      { boxNo: "3333", skuNo: "3333", snNo: "3333" },
      { boxNo: "4444", skuNo: "4444", snNo: "4444" },
    ],
  },
])

function onClick(value: Inspection) {
  console.log("value", value)
  uni.navigateTo({
    url: "/pages/box/index",
  })
}
</script>

<style lang="scss">
page {
  background-color: rgba(239, 239, 239, 1);
}
</style>
