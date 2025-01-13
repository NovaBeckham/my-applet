import { isEmpty, isNil } from "ramda"
import { BaseURL } from "./config"

// 定义请求方法的类型
type RequestMethod = "GET" | "POST" | "PUT" | "DELETE"

// 定义请求选项的类型
interface RequestOptions {
  url: string
  method?: RequestMethod
  data?: Record<string, any>
  headers?: Record<string, string>
}

// 封装请求方法
export const request = <T = any>(options: RequestOptions): Promise<T> => {
  const UID = uni.getStorageSync("UID")
  const LT = uni.getStorageSync("LT")
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BaseURL}${options.url}`,
      method: options.method ?? "GET",
      data: options.data ?? {},
      header: {
        "Content-Type": "application/json",
        ...options.headers,
        Cookie:
          !isNil(UID) && !isEmpty(UID) ? `UID=${UID}; LT=${LT}` : undefined,
      },
      success: (res) => {
        if (res.statusCode === 200) {
          if (!isNil(res.data)) {
            const data: any = res.data
            if (data.code === 403) {
              uni.showToast({
                title: "请重新登录",
              })
              uni.reLaunch({
                url: "/pages/login/index",
              })
              return
            }
            resolve(res.data as T)
          }
        } else {
          uni.showToast({
            title: `${res.errMsg}`,
          })
          reject(res)
        }
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}
