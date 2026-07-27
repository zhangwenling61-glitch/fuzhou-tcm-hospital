import Taro from '@tarojs/taro'
import type { DermatologyHospitalArea, DermatologyOrder } from './order-model'
import { maskCard, maskName, sortOrders } from './order-model'

const STORAGE_KEY = 'dermatology-service-orders-v1'

export interface CreateDermatologyOrderInput {
  orderId: string
  serviceId: string
  serviceName: string
  area: DermatologyHospitalArea
  orderTime: string
  amount: number
  patientName: string
  patientCard: string
  patientRelation: string
}

const seedOrders: DermatologyOrder[] = [
  {
    orderId: 'PF202607230940',
    serviceId: 'p1',
    serviceName: '微针生发疗法',
    status: 'pending',
    area: '鼓楼院区',
    orderTime: '2026-07-23 09:40',
    amount: 132,
    patientNameMasked: '*明',
    patientCardMasked: '**** 5678',
    patientRelation: '本人',
    canSettle: true
  },
  {
    orderId: 'PF202607151430',
    serviceId: 'p2',
    serviceName: '梅花针生发疗法',
    status: 'settled',
    area: '鼓楼院区',
    orderTime: '2026-07-15 14:30',
    amount: 147,
    patientNameMasked: '*明',
    patientCardMasked: '**** 5678',
    patientRelation: '本人',
    canSettle: false
  },
  {
    orderId: 'PF202607140915',
    serviceId: 'p3',
    serviceName: '面部刮痧面膜疗法',
    status: 'cancelled',
    area: '五四北院区',
    orderTime: '2026-07-14 09:15',
    amount: 132,
    patientNameMasked: '*芳',
    patientCardMasked: '**** 9012',
    patientRelation: '配偶',
    canSettle: false
  }
]

const read = (): DermatologyOrder[] => {
  const stored = Taro.getStorageSync<DermatologyOrder[]>(STORAGE_KEY)
  if (Array.isArray(stored) && stored.length) return sortOrders(stored)
  Taro.setStorageSync(STORAGE_KEY, seedOrders)
  return sortOrders(seedOrders)
}

const write = (orders: DermatologyOrder[]) => Taro.setStorageSync(STORAGE_KEY, sortOrders(orders))

export const dermatologyOrderRepository = {
  async listOrders() {
    return read().map(order => ({ ...order }))
  },
  async getOrderById(orderId: string) {
    const order = read().find(item => item.orderId === orderId)
    return order ? { ...order } : undefined
  },
  async saveOrder(input: CreateDermatologyOrderInput) {
    const orders = read()
    const existing = orders.find(item => item.orderId === input.orderId)
    if (existing) return { ...existing }
    const order: DermatologyOrder = {
      ...input,
      status: 'pending',
      patientNameMasked: maskName(input.patientName),
      patientCardMasked: maskCard(input.patientCard),
      canSettle: true
    }
    write([order, ...orders])
    return { ...order }
  },
  async settleOrder(orderId: string) {
    const orders = read()
    const index = orders.findIndex(item => item.orderId === orderId)
    if (index < 0) throw new Error('未找到该订单')
    if (!orders[index].canSettle) throw new Error('该订单当前无需结算')
    const settled: DermatologyOrder = { ...orders[index], status: 'settled', canSettle: false }
    orders[index] = settled
    write(orders)
    return { ...settled }
  }
}

