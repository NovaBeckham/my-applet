<template>
  <view v-for="item in list" :key="item.oddNumbers">
    <uni-card
      :title="item.goods"
      :sub-title="item.platform"
      :extra="item.createTime"
      @click="onClick"
    >
      <view>单号：{{ item.oddNumbers }}</view>
      <view>分仓：{{ item.warehouse }}</view>
      <view slot="actions">
        <button class="mini-btn" type="primary" size="mini">验证</button>
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
}

const list = ref<Inspection[]>([
  {
    oddNumbers: "111111111111",
    platform: "shopify",
    goods: "111",
    createTime: "2024-09-25",
    warehouse: "111",
  },
])

function onClick(e: any) {
  console.log("e", e)
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
