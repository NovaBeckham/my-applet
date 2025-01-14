<template>
  <view class="login-container">
    <view class="login-info">
      <image mode="aspectFit" src="/static/logo.png"></image>
      <view>
        <text>验货小程序</text>
      </view>
    </view>
    <view style="margin-top: 160rpx;">
      <uni-forms ref="loginForm" :modelValue="formData" :rules="rules">
        <uni-forms-item label="手机号" name="mobile">
          <uni-easyinput
            type="number"
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
    </view>
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
import { onLoad } from "@dcloudio/uni-app"
import { isEmpty, isNil } from "ramda"
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
    uni.showLoading({
      title: "加载中",
    })
    const { data, cookies } = await uni.request({
      url: `${BaseURL}/rest/iniasc/user/login?mobile=${formData.value.mobile}&password=${formData.value.password}`,
      method: "POST",
    })
    uni.hideLoading()
    if (isNil(data)) {
      uni.showToast({
        title: "用户名密码错误",
        icon: "error",
      })
      return
    }
    if ((data as any).code !== 200) {
      uni.showToast({
        title: "用户名密码错误",
        icon: "error",
      })
      return
    }
    if (!isEmpty(cookies)) {
      const cookieMap = parseCookies(cookies)
      if (cookieMap.UID && cookieMap.LT) {
        uni.setStorageSync("UID", cookieMap.UID)
        uni.setStorageSync("LT", cookieMap.LT)
        uni.setStorageSync("mobile", formData.value.mobile)
        uni.switchTab({
          url: "/pages/index/index",
        })
      }
    }
  }
}

onLoad(() => {
  const mobile = uni.getStorageSync("mobile")
  if (!isNil(mobile)) {
    formData.value.mobile = mobile
  }
})
</script>

<style lang="scss">
.login-container {
  padding: 50rpx;
}
.login-info {
  margin: 50rpx auto;
  text-align: center;

  image {
    width: 278rpx;
    height: 139rpx;
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
