import { DeliveryResponse } from "@/interface"
import { request } from "@/utils/request"

export interface Inspection {
  cartonNum: number
  createTime: number
  deliveryDate: number
  ibrNo: string
  id: number
  productId: number
  quantity: number
  status: number
  warehousePlat: string
}

export interface ProductList {
  id: number
  productImg: null
  productName: string
  seqNo: number
  status: number
  vendor: string
}

export interface CartonRecord {
  cartonNo: string
  deliveryTaskId: number
  ibrNo: string
  id: number
  logisticNo: string
  skuId: string
}

/**
 *
 * @param productId
 * @description 获取待验列表
 */
export const getWaitList = (productId: string) => {
  return request<DeliveryResponse<Inspection[] | undefined>>({
    url: `/rest/iniasc/deliveryTask/waitList?productId=${productId}`,
  })
}

/**
 *
 * @param productId
 * @description 获取已验列表
 */
export const getFinishList = (productId: string) => {
  return request<DeliveryResponse<Inspection[] | undefined>>({
    url: `/rest/iniasc/deliveryTask/finishList?productId=${productId}`,
  })
}

/**
 *
 * @param deliveryTaskId
 * @description 获取箱号列表
 */
export const getCartonList = (deliveryTaskId: string) => {
  return request<DeliveryResponse<CartonRecord[] | undefined>>({
    url: `/rest/iniasc/carton/cartonSkuList?deliveryTaskId=${deliveryTaskId}`,
  })
}

/**
 *
 * @param deliveryTaskId
 * @description 箱号列表验证完成接口
 */
export const boxCheckFinish = (deliveryTaskId: string) => {
  return request<DeliveryResponse<undefined>>({
    url: `/rest/iniasc/deliveryTask/finish?deliveryTaskId=${deliveryTaskId}`,
    method: "POST",
  })
}

/**
 * @description 获取产品列表
 */
export const getProductList = () => {
  return request<DeliveryResponse<ProductList[] | undefined>>({
    url: "/rest/iniasc/deliveryTask/waitList",
  })
}

/**
 * 
 * @param file 
 * @description 上传文件
 */
export const uploadFileByExcel = (file: File) => {
  return request<DeliveryResponse<undefined>>({
    url: "/rest/iniasc/deliveryTask/importDeliveryTask",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: file,
  })
}
