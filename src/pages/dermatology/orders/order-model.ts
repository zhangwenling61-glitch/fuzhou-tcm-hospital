export type DermatologyOrderStatus = 'pending' | 'settled' | 'cancelled'
export type DermatologyOrderFilter = 'all' | DermatologyOrderStatus
export type DermatologyHospitalArea = '鼓楼院区' | '五四北院区'

export interface DermatologyOrder {
  orderId: string
  serviceId: string
  serviceName: string
  status: DermatologyOrderStatus
  area: DermatologyHospitalArea
  orderTime: string
  amount: number
  patientNameMasked: string
  patientCardMasked: string
  patientRelation: string
  canSettle: boolean
}

export const ORDER_FILTERS: Array<{ value: DermatologyOrderFilter; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待结算' },
  { value: 'settled', label: '已结算' },
  { value: 'cancelled', label: '已取消' }
]

export const ORDER_STATUS_META: Record<DermatologyOrderStatus, { label: string; action: string }> = {
  pending: { label: '待结算', action: '去结算' },
  settled: { label: '已结算', action: '查看详情' },
  cancelled: { label: '已取消', action: '' }
}

export const filterOrders = (orders: DermatologyOrder[], filter: DermatologyOrderFilter) =>
  filter === 'all' ? orders : orders.filter(order => order.status === filter)

export const sortOrders = (orders: DermatologyOrder[]) =>
  [...orders].sort((a, b) => b.orderTime.localeCompare(a.orderTime))

export const maskName = (name: string) => {
  if (!name) return ''
  if (name.length <= 1) return '*'
  if (name.length === 2) return `*${name.slice(-1)}`
  return `${name[0]}${'*'.repeat(name.length - 2)}${name.slice(-1)}`
}

export const maskCard = (card: string) => `**** ${card.replace(/\s/g, '').slice(-4)}`
