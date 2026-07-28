<template>
  <view class="orders-page">
    <PortalNavBar title="订单" :scroll-top="scrollTop" home-path="/pages/dermatology/index" nav-background="#f3f8f1" secondary />
    <view class="orders-content" :style="{ paddingTop: `${contentTop}px` }">
      <view class="status-tabs">
        <button
          v-for="item in ORDER_FILTERS"
          :key="item.value"
          :class="{ active: activeFilter === item.value }"
          @tap="selectFilter(item.value)"
        >{{ item.label }}</button>
      </view>

      <view class="orders-layout">
        <view class="orders-list">
          <template v-if="loading">
            <view v-for="item in 3" :key="item" class="order-card skeleton">
              <view></view><view></view><view></view>
            </view>
          </template>

          <view v-else-if="errorMessage" class="orders-state">
            <PortalEmptyState title="订单加载失败" desc="请检查网络后重新加载" :animated="true" />
            <button class="dermatology-button dermatology-button--primary" @tap="loadOrders">重新加载</button>
          </view>

          <view v-else-if="!visibleOrders.length" class="orders-state">
            <PortalEmptyState :title="emptyTitle" desc="暂时没有符合条件的皮肤科订单" :animated="true" />
            <button v-if="activeFilter === 'all'" class="dermatology-button dermatology-button--primary" @tap="chooseService">去选择服务</button>
          </view>

          <view
            v-for="(order, index) in visibleOrders"
            v-else
            :key="order.orderId"
            :class="['order-card', `is-${order.status}`, { highlighted: highlightedOrderId === order.orderId }]"
            :style="{ animationDelay: `${Math.min(index, 4) * 32}ms` }"
            hover-class="order-card--pressed"
            :hover-stay-time="100"
            @tap="openDetail(order.orderId)"
          >
            <view class="order-card__head">
              <strong>{{ order.serviceName }}</strong>
              <text class="status">{{ ORDER_STATUS_META[order.status].label }}</text>
            </view>
            <view class="order-card__meta">
              <view class="order-card__time">
                <text>下单时间</text>
                <strong>{{ order.orderTime }}</strong>
              </view>
            </view>
            <view class="order-card__amount">
              <text>项目费用</text><strong>¥{{ order.amount }}</strong>
            </view>
            <view class="order-card__footer">
              <view class="order-card__patient">
                <text>就诊人</text>
                <strong>{{ order.patientNameMasked }}（{{ order.patientRelation }}） {{ order.patientCardMasked }}</strong>
              </view>
              <view class="order-card__actions">
                <DermatologyAreaTag :area="order.area" />
                <button class="detail-action dermatology-button dermatology-button--secondary" @tap.stop="openDetail(order.orderId)">查看详情</button>
                <button
                  v-if="order.status === 'pending'"
                  class="primary-action dermatology-button dermatology-button--primary"
                  :disabled="settlingOrderId === order.orderId"
                  @tap.stop="settle(order.orderId)"
                >{{ settlingOrderId === order.orderId ? '结算中…' : '去结算' }}</button>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
  <view v-if="confirmingOrder" class="settlement-mask" @tap="closeSettlementConfirm">
    <view class="settlement-dialog" @tap.stop>
      <view class="settlement-dialog__title">确认结算</view>
      <view class="settlement-dialog__row"><text>服务项目</text><strong>{{ confirmingOrder.serviceName }}</strong></view>
      <view class="settlement-dialog__row"><text>就诊人</text><strong>{{ confirmingOrder.patientNameMasked }}（{{ confirmingOrder.patientRelation }}）</strong></view>
      <view class="settlement-dialog__amount"><text>应付金额</text><strong>¥{{ confirmingOrder.amount }}</strong></view>
      <view v-if="settlementError" class="settlement-dialog__error">{{ settlementError }}</view>
      <view class="settlement-dialog__actions">
        <button class="dermatology-button dermatology-button--secondary" :disabled="settlingOrderId === confirmingOrder.orderId" @tap="closeSettlementConfirm">取消</button>
        <button class="primary-action dermatology-button dermatology-button--primary" :disabled="settlingOrderId === confirmingOrder.orderId" @tap="confirmSettlement">{{ settlingOrderId === confirmingOrder.orderId ? '结算中…' : '确认结算' }}</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro, { useDidShow, usePageScroll, usePullDownRefresh } from '@tarojs/taro'
import { computed, nextTick, ref } from 'vue'
import PortalNavBar from '@/components/PortalNavBar/index.vue'
import PortalEmptyState from '@/components/PortalEmptyState/index.vue'
import DermatologyAreaTag from '@/components/DermatologyAreaTag/index.vue'
import { getSafeMenuButtonBoundingClientRect } from '@/utils'
import { dermatologyOrderRepository } from './order-repository'
import { filterOrders, ORDER_FILTERS, ORDER_STATUS_META, sortOrders, type DermatologyOrder, type DermatologyOrderFilter } from './order-model'
import './index.less'

let savedFilter: DermatologyOrderFilter = 'all'
let savedScrollTop = 0
const orders = ref<DermatologyOrder[]>([])
const activeFilter = ref<DermatologyOrderFilter>(savedFilter)
const loading = ref(true)
const errorMessage = ref('')
const scrollTop = ref(0)
const settlingOrderId = ref('')
const confirmingOrder = ref<DermatologyOrder>()
const settlementError = ref('')
const router = Taro.getCurrentInstance().router
const menuButtonInfo = getSafeMenuButtonBoundingClientRect()
const contentTop = menuButtonInfo.bottom + 16
const highlightedOrderId = ref(router?.params?.highlightOrderId || '')
const visibleOrders = computed(() => filterOrders(sortOrders(orders.value), activeFilter.value))
const emptyTitle = computed(() => ({
  all: '暂无皮肤科服务订单',
  pending: '暂无待结算订单',
  settled: '暂无已结算订单',
  cancelled: '暂无已取消订单'
}[activeFilter.value]))

const loadOrders = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    orders.value = await dermatologyOrderRepository.listOrders()
  } catch (error) {
    errorMessage.value = '订单加载失败'
  } finally {
    loading.value = false
    Taro.stopPullDownRefresh()
  }
}
const selectFilter = (filter: DermatologyOrderFilter) => {
  if (activeFilter.value === filter) return
  activeFilter.value = filter
  savedFilter = filter
  savedScrollTop = 0
  Taro.pageScrollTo({ scrollTop: 0, duration: 180 }).catch(() => {})
}
const openDetail = (orderId: string) => Taro.navigateTo({ url: `/pages/dermatology/order-detail/index?orderId=${orderId}` })
const chooseService = () => Taro.redirectTo({ url: '/pages/dermatology/index' })
const settle = (orderId: string) => {
  confirmingOrder.value = orders.value.find(order => order.orderId === orderId)
  settlementError.value = ''
}
const closeSettlementConfirm = () => {
  if (!settlingOrderId.value) confirmingOrder.value = undefined
}
const confirmSettlement = async () => {
  const target = confirmingOrder.value
  if (!target || settlingOrderId.value) return
  if (settlingOrderId.value) return
  settlingOrderId.value = target.orderId
  settlementError.value = ''
  try {
    await new Promise(resolve => setTimeout(resolve, 450))
    await dermatologyOrderRepository.settleOrder(target.orderId)
    await loadOrders()
    confirmingOrder.value = undefined
    Taro.showToast({ title: '结算成功', icon: 'success' })
    openDetail(target.orderId)
  } catch (error) {
    settlementError.value = error instanceof Error ? error.message : '结算失败，请重试'
  } finally {
    settlingOrderId.value = ''
  }
}
usePageScroll(({ scrollTop: value }) => {
  scrollTop.value = value || 0
  savedScrollTop = scrollTop.value
})
useDidShow(() => {
  loadOrders().then(() => nextTick(() => {
    if (savedScrollTop > 0) Taro.pageScrollTo({ scrollTop: savedScrollTop, duration: 0 }).catch(() => {})
  }))
  if (highlightedOrderId.value) setTimeout(() => { highlightedOrderId.value = '' }, 1200)
})
usePullDownRefresh(loadOrders)
</script>
