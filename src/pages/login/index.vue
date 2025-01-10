<template>
  <view class="login-container">
    <view class="login-info">
      <cover-image src="/static/logo.png"></cover-image>
      <text>验货小程序</text>
    </view>
    <uni-forms ref="loginForm" :modelValue="formData" :rules="rules">
      <uni-forms-item label="手机号" name="mobile">
        <uni-easyinput
          type="text"
          v-model="formData.mobile"
          placeholder="请输入手机号"
        />
      </uni-forms-item>
      <uni-forms-item label="密码" name="password">
        <uni-easyinput
          type="password"
          v-model="formData.password"
          placeholder="请输入密码"
        />
      </uni-forms-item>
    </uni-forms>
    <button
      type="default"
      @click="onSubmit"
      style="background-color: #445471; color: #ffff"
    >
      手机号码登录
    </button>
    <view class="login-power">
      <text>PowerBy X6 Technology</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { BaseURL } from "@/utils/config"
import { isEmpty } from "ramda"
import { ref } from "vue"

const rules = {
  mobile: {
    rules: [{ required: true, errorMessage: "请填写手机号" }],
  },
  password: {
    rules: [{ required: true, errorMessage: "请填写密码" }],
  },
}

const loginForm = ref<any>(null)

const formData = ref<{ mobile?: string; password?: string }>({})

const parseCookies = (cookies: string[]) => {
  const cookieMap: { [key: string]: string } = {}
  cookies.forEach((cookieStr) => {
    cookieStr.split(";").forEach((cookie) => {
      const [key, value] = cookie.trim().split("=")
      cookieMap[key] = value
    })
  })
  return cookieMap
}

const onSubmit = async () => {
  if (loginForm.value) {
    await loginForm.value.validate()
    uni
      .request({
        url: `${BaseURL}/rest/iniasc/user/login?mobile=${formData.value.mobile}&password=${formData.value.password}`,
        method: "POST",
      })
      .then((res) => {
        console.log("res", res.cookies)
        if (!isEmpty(res.cookies)) {
          const cookieMap = parseCookies(res.cookies)
          if (cookieMap.UID && cookieMap.LT) {
            uni.setStorageSync("UID", cookieMap.UID)
            uni.setStorageSync("LT", cookieMap.LT)
            uni.switchTab({
              url: "/pages/index/index",
            })
          }
        }
      })
  }
}
</script>

<style lang="scss">
.login-container {
  padding: 50rpx;
}
.login-info {
  margin: 50rpx auto;
  text-align: center;

  cover-image {
    width: 50%;
    margin: 20rpx auto;
  }

  text {
    font-weight: 800;
  }
}

.login-power {
  position: fixed;
  bottom: 100rpx;
  left: 50%;
  transform: translateX(-50%);
}
</style>
