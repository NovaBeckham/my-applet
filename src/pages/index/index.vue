<template>
  <view v-for="item in list" :key="item.oddNumbers">
    <uni-card
      :title="item.goods"
      :sub-title="item.platform"
      :extra="item.createTime"
      @click="onClick(item)"
    >
      <view>
        <view>单号：{{ item.oddNumbers }}</view>
        <view>分仓：{{ item.warehouse }}</view>
      </view>
    </uni-card>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue"

interface Inspection {
  oddNumbers?: string
  platform?: string
  goods?: string
  createTime?: string
  warehouse?: string
  boxList?: Array<{ boxNo?: string; product?: string }>
}

const list = ref<Inspection[]>([
  {
    oddNumbers: "单号111111111111",
    platform: "shopify",
    goods: "商品111",
    createTime: "2024-09-25",
    warehouse: "分仓111",
    boxList: [
      { boxNo: "1111", product: "1111" },
      { boxNo: "2222", product: "2222" },
      { boxNo: "3333", product: "3333" },
      { boxNo: "4444", product: "4444" },
    ],
  },
  {
    oddNumbers: "单号222222222222",
    platform: "shopify",
    goods: "商品111",
    createTime: "2024-09-25",
    warehouse: "分仓111",
    boxList: [
      { boxNo: "1111", product: "1111" },
      { boxNo: "2222", product: "2222" },
      { boxNo: "3333", product: "3333" },
      { boxNo: "4444", product: "4444" },
    ],
  },
  {
    oddNumbers: "单号333333333333",
    platform: "shopify",
    goods: "商品111",
    createTime: "2024-09-25",
    warehouse: "分仓111",
    boxList: [
      { boxNo: "1111", product: "1111" },
      { boxNo: "2222", product: "2222" },
      { boxNo: "3333", product: "3333" },
      { boxNo: "4444", product: "4444" },
    ],
  },
  {
    oddNumbers: "单号444444444444",
    platform: "shopify",
    goods: "商品111",
    createTime: "2024-09-25",
    warehouse: "分仓111",
    boxList: [
      { boxNo: "1111", product: "1111" },
      { boxNo: "2222", product: "2222" },
      { boxNo: "3333", product: "3333" },
      { boxNo: "4444", product: "4444" },
    ],
  },
])

function onClick(value: Inspection) {
  uni.navigateTo({
    url: "/pages/box/index",
  })
}
</script>

<style>
.content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
