<template>
  <view class="order-detail-page">
    <PortalNavBar title="订单详情" :scroll-top="scrollTop" secondary />
    <view class="order-detail-content" :style="{ paddingTop: `${contentTop}px` }">
      <view v-if="loading" class="detail-skeleton" aria-label="正在加载订单详情">
        <view class="detail-skeleton__status"><view></view><view></view><view></view></view>
        <view class="detail-skeleton__card"><view></view><view></view><view></view></view>
        <view class="detail-skeleton__card"><view></view><view></view></view>
      </view>
      <view v-else-if="errorMessage" class="detail-state detail-error-state">
        <strong>订单详情加载失败</strong><text>{{ errorMessage }}</text>
        <button class="dermatology-button dermatology-button--primary" @tap="load">重新加载</button>
      </view>
      <view v-else-if="!order" class="detail-state">
        <strong>未找到该订单</strong><text>订单可能已失效或编号不正确</text>
        <button class="dermatology-button dermatology-button--primary" @tap="backToOrders">返回订单</button>
      </view>
      <template v-else>
        <view :class="['status-card', `is-${order.status}`]">
          <view><text>当前状态</text><strong>{{ ORDER_STATUS_META[order.status].label }}</strong></view>
          <view class="status-price"><text>项目费用</text><strong>¥{{ order.amount }}</strong></view>
          <small>订单编号 {{ order.orderId }}</small>
        </view>
        <view class="detail-card">
          <view class="section-title">服务信息</view>
          <view class="info-row"><text>服务项目</text><strong>{{ order.serviceName }}</strong></view>
          <view class="info-row"><text>就诊院区</text><DermatologyAreaTag :area="order.area" /></view>
          <view class="info-row"><text>下单时间</text><strong>{{ order.orderTime }}</strong></view>
        </view>
        <view class="detail-card">
          <view class="section-title">就诊人信息</view>
          <view class="info-row"><text>就诊人</text><strong>{{ order.patientNameMasked }} <small>{{ order.patientRelation }}</small></strong></view>
          <view class="info-row"><text>就诊卡</text><strong>自费卡 {{ order.patientCardMasked }}</strong></view>
        </view>
        <view class="warm-tip">
          <image :src="alertCircleIcon" mode="aspectFit" />
          <text>请携带就诊人对应的自费卡或电子健康卡，到{{ order.area }}后按现场指引就诊。</text>
        </view>
      </template>
    </view>
    <view v-if="order?.status === 'pending'" class="detail-bottom">
      <view><text>项目费用</text><strong>¥{{ order.amount }}</strong></view>
      <button class="dermatology-button dermatology-button--primary" :disabled="settling" @tap="settle">{{ settling ? '结算中…' : '去结算' }}</button>
    </view>
    <view v-if="showSettlementConfirm && order" class="settlement-mask" @tap="closeSettlementConfirm">
      <view class="settlement-dialog" @tap.stop>
        <view class="settlement-dialog__title">确认结算</view>
        <view class="settlement-dialog__row"><text>服务项目</text><strong>{{ order.serviceName }}</strong></view>
        <view class="settlement-dialog__row"><text>就诊人</text><strong>{{ order.patientNameMasked }}（{{ order.patientRelation }}）</strong></view>
        <view class="settlement-dialog__amount"><text>应付金额</text><strong>¥{{ order.amount }}</strong></view>
        <view v-if="settlementError" class="settlement-dialog__error">{{ settlementError }}</view>
        <view class="settlement-dialog__actions">
          <button class="dermatology-button dermatology-button--secondary" :disabled="settling" @tap="closeSettlementConfirm">取消</button>
          <button class="primary-action dermatology-button dermatology-button--primary" :disabled="settling" @tap="confirmSettlement">{{ settling ? '结算中…' : '确认结算' }}</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro, { usePageScroll } from '@tarojs/taro'
import { ref } from 'vue'
import PortalNavBar from '@/components/PortalNavBar/index.vue'
import DermatologyAreaTag from '@/components/DermatologyAreaTag/index.vue'
import { getSafeMenuButtonBoundingClientRect } from '@/utils'
import alertCircleIcon from '@/assets/icons/common/circle-alert.svg'
import { ORDER_STATUS_META, type DermatologyOrder } from '../orders/order-model'
import { dermatologyOrderRepository } from '../orders/order-repository'
import './index.less'

const order = ref<DermatologyOrder>()
const menuButtonInfo = getSafeMenuButtonBoundingClientRect()
const contentTop = menuButtonInfo.bottom + 16
const loading = ref(true)
const errorMessage = ref('')
const settling = ref(false)
const showSettlementConfirm = ref(false)
const settlementError = ref('')
const scrollTop = ref(0)
const orderId = Taro.getCurrentInstance().router?.params?.orderId || ''
const load = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    order.value = orderId ? await dermatologyOrderRepository.getOrderById(orderId) : undefined
  } catch (error) {
    order.value = undefined
    errorMessage.value = error instanceof Error ? error.message : '请检查网络后重试'
  } finally {
    loading.value = false
  }
}
const settle = () => {
  if (!order.value || settling.value) return
  settlementError.value = ''
  showSettlementConfirm.value = true
}
const closeSettlementConfirm = () => {
  if (!settling.value) showSettlementConfirm.value = false
}
const confirmSettlement = async () => {
  if (!order.value || settling.value) return
  settling.value = true
  settlementError.value = ''
  try {
    await new Promise(resolve => setTimeout(resolve, 450))
    order.value = await dermatologyOrderRepository.settleOrder(order.value.orderId)
    showSettlementConfirm.value = false
    Taro.showToast({ title: '结算成功', icon: 'success' })
  } catch (error) {
    settlementError.value = error instanceof Error ? error.message : '结算失败，请重试'
  } finally {
    settling.value = false
  }
}
const backToOrders = () => Taro.redirectTo({ url: '/pages/dermatology/orders/index' })
usePageScroll(({ scrollTop: value }) => { scrollTop.value = value || 0 })
load()
</script>
