export interface Inspection {
  oddNumbers?: string
  platform?: string
  goods?: string
  createTime?: string
  warehouse?: string
  boxList?: Array<{ boxNo?: string; skuNo?: string; snNo?: string }>
}

export interface DeliveryResponse<T> {
  code: number
  message: string | null
  data?: T
}