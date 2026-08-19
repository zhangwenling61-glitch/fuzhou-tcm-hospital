<template>
  <view :class="['dermatology-page', { 'is-home-page': view === 'home', 'is-detail-page': view === 'detail', 'is-confirm-page': view === 'confirm', 'is-submitting-page': view === 'submitting', 'is-result-page': view === 'success' }]">
    <view class="dermatology-scroll" :style="{ marginTop: '0px', minHeight: '100vh' }">
      <view v-if="view === 'home'" class="dermatology-home">
        <view class="hero-card">
          <image class="hero-illustration" :src="heroIllustration" mode="aspectFit" />
          <view class="hero-badge">🏥 福州中医院 · 皮肤科</view>
          <view class="hero-title">中医特色皮肤诊疗</view>
          <view class="hero-desc">融合现代技术，提供专业诊疗</view>
        </view>

        <view class="consult-card" hover-class="consult-card--pressed" :hover-start-time="0" :hover-stay-time="120" @tap="goConsult">
          <view class="consult-shimmer" aria-hidden="true"></view>
          <view class="consult-avatar"><image class="consult-icon" :src="consultIcon" mode="aspectFit" /></view>
          <view class="consult-copy"><view class="consult-title">在线问诊  辨证施治 <text class="consult-cta">免费咨询</text></view><view class="consult-desc">脱发、痤疮、色斑、敏感肌咨询</view></view>
        </view>

        <view :class="['area-options-anchor', { 'is-pinned': isAreaTabPinned }]">
          <view :class="['area-options', 'yh-inline-segment', 'area-options--source', { 'is-source-hidden': isAreaTabPinned }]">
            <button
              v-for="area in areas"
              :key="area"
              class="area-btn"
              type="button"
              :data-area="area"
              :class="{ 'is-active': selectedArea === area }"
              hover-class="area-btn--pressed"
              :hover-start-time="0"
              :hover-stay-time="100"
              @tap="handleAreaTap"
            >
              <text class="area-btn__label">{{ area }}院区</text>
            </button>
            <view class="yh-portal-title-mark area-smile-indicator" :style="areaSmileStyle"></view>
          </view>
        </view>
        <view class="content-layout">
          <view :class="['category-list', 'category-list--source', { 'is-source-hidden': isAreaTabPinned }]">
            <button
              v-for="cat in categories"
              :key="cat.id"
              class="category-btn"
              type="button"
              :data-category="cat.id"
              :class="{ active: activeCategory === cat.id }"
              hover-class="category-btn--pressed"
              :hover-start-time="0"
              :hover-stay-time="100"
              @tap="handleCategoryTap"
            >
              <text class="category-btn__label">{{ cat.name }}</text>
            </button>
          </view>
          <view :class="['package-list', { 'is-switching': isSwitching }]">
            <view v-if="servicesLoading" class="services-skeleton" aria-label="正在加载服务">
              <view v-for="item in 3" :key="item" class="services-skeleton__card"><view></view><view></view><view></view></view>
            </view>
            <view v-else-if="servicesError" class="services-state services-state--error">
              <view class="empty-title">服务加载失败</view><view class="empty-desc">{{ servicesError }}</view><button @tap="loadServices">重新加载</button>
            </view>
            <view v-else v-for="(item, index) in filteredPackages" :key="item.id" :class="['package-card', { 'is-entering': isSwitching }]" :style="{ animationDelay: `${Math.min(index, 3) * 36}ms` }" hover-class="package-card--pressed" :hover-stay-time="100" @tap="openDetail(item)">
              <view class="package-visual" :class="item.cat"><image :src="productImage" mode="aspectFill" /></view>
              <view class="package-body"><view class="package-name">{{ item.name }}</view><view class="package-note">{{ item.note }}</view><view class="package-desc">{{ item.desc }}</view><view class="package-foot"><text class="price" :style="{ animationDelay: `${Math.min(index, 3) * 36 + 50}ms` }">¥{{ item.price }}</text><text class="duration">{{ item.duration }}</text></view></view>
            </view>
            <view v-if="!filteredPackages.length" class="empty">
              <view class="empty-icon-wrap"><image class="empty-icon" :src="emptyAreaIcon" mode="aspectFit" /></view>
              <view class="empty-title">当前院区暂无可用服务</view>
              <view class="empty-desc">可以切换院区查看其他特色服务</view>
              <button class="empty-switch-btn" hover-class="empty-switch-btn--pressed" :hover-stay-time="100" @tap="switchEmptyArea">切换至{{ alternateArea }}院区</button>
            </view>
          </view>
        </view>

        <view
          :class="['area-options-fixed', { 'is-visible': isAreaTabPinned }]"
          :style="{ top: `${fixedNavBottomPx}px` }"
        >
          <view class="area-options yh-inline-segment area-options--fixed">
            <button
              v-for="area in areas"
              :key="`fixed-${area}`"
              class="area-btn"
              type="button"
              :data-area="area"
              :class="{ 'is-active': selectedArea === area }"
              hover-class="area-btn--pressed"
              :hover-start-time="0"
              :hover-stay-time="100"
              @tap="handleAreaTap"
            >
              <text class="area-btn__label">{{ area }}院区</text>
            </button>
            <view class="yh-portal-title-mark area-smile-indicator" :style="areaSmileStyle"></view>
          </view>
        </view>

        <view
          :class="['category-fixed-shell', { 'is-visible': isAreaTabPinned }]"
          :style="{ top: `${fixedCategoryTopPx}px`, left: `${fixedCategoryLeftPx}px`, width: '142px', transform: 'none' }"
        >
          <scroll-view
            class="category-list category-list--fixed"
            scroll-y
            enhanced
            :show-scrollbar="false"
          >
            <button
              v-for="cat in categories"
              :key="`fixed-${cat.id}`"
              class="category-btn"
              type="button"
              :data-category="cat.id"
              :class="{ active: activeCategory === cat.id }"
              hover-class="category-btn--pressed"
              :hover-start-time="0"
              :hover-stay-time="100"
              @tap="handleCategoryTap"
            >
              <text class="category-btn__label">{{ cat.name }}</text>
            </button>
          </scroll-view>
        </view>
      </view>

      <view v-else-if="view === 'detail' && currentPackage" class="detail-view">
        <view class="detail-banner"><image :src="detailBannerImage" mode="aspectFill" /></view>

          <view class="detail-card detail-summary-card">
          <view class="detail-tags"><DermatologyAreaTag :area="`${selectedArea}院区`" /></view>
          <view class="detail-name">{{ currentPackage.name }}</view>
          <view class="detail-desc">{{ detailCopy.summary }}</view>
        </view>

        <view class="detail-card detail-content-card">
          <view class="detail-section-title">服务内容</view>
          <view class="detail-intro-copy">{{ detailCopy.serviceContent }}</view>
        </view>

        <view class="detail-card detail-intro-card">
          <view class="detail-section-title">图文介绍</view>
          <view class="detail-intro-copy">{{ detailCopy.graphicIntro }}</view>
          <view class="detail-environment-label">治疗环境</view>
          <image class="detail-environment-image" :src="treatmentRoomSrc" mode="aspectFill" @error="handleTreatmentRoomImageError" />
          <view class="detail-environment-copy">{{ detailCopy.environment }}</view>
        </view>

        <view class="detail-card detail-text-list-card">
          <view class="detail-section-title">适宜人群与禁忌</view>
          <view v-for="item in detailCopy.taboo" :key="item" class="detail-text-list-item"><text class="detail-list-dot">•</text><text>{{ item }}</text></view>
        </view>
        <view class="detail-card detail-text-list-card">
          <view class="detail-section-title">就诊须知</view>
          <view v-for="item in detailCopy.notice" :key="item" class="detail-text-list-item"><text class="detail-list-dot">•</text><text>{{ item }}</text></view>
        </view>

        <view class="detail-order-tip warm-tip-card"><image :src="alertCircleIcon" mode="aspectFit" /><text>以下单时内容为准</text></view>

      </view>

      <view v-else-if="view === 'confirm'" class="confirm-view">
        <view class="confirm-card confirm-patient-card">
          <view class="section-title">就诊人信息</view>
          <PortalUserCard
            class="confirm-user-card"
            kind="boundless"
            :avatar="defaultUserAvatar"
            :name="maskPatientName(selectedPatient.name)"
            :relation-label="selectedPatient.rel"
            :desc="selectedPatient.card"
            :show-switch="true"
            switch-text="切换就诊人"
            :show-insurance="true"
            insurance-label="自费"
            :show-eye="false"
            :show-primary="false"
            :show-todo-bar="false"
          />
        </view>
        <view v-if="currentPackage" class="confirm-card confirm-service-card">
          <view class="section-title">服务项目</view>
          <view class="confirm-row"><text>{{ currentPackage.name }}</text><strong>¥{{ currentPackage.price }}</strong></view>
        </view>
        <view class="confirm-notice warm-tip-card"><image :src="alertCircleIcon" mode="aspectFit" /><view>本次就诊需使用患者本人自费卡结算。如无自费卡，请先添加电子健康卡。</view></view>
        <view v-if="submitError" class="submit-error"><text>{{ submitError }}</text><button @tap="submitOrder">重新提交</button></view>
        <view class="confirm-bottom"><button :disabled="isSubmitting" :class="{ 'is-loading': isSubmitting }" hover-class="dermatology-bottom-button--pressed" :hover-start-time="0" :hover-stay-time="100" @tap="submitOrder"><view v-if="isSubmitting" class="submit-spinner"></view><text>{{ isSubmitting ? '开单中…' : '确认开单' }}</text></button></view>
      </view>

      <view v-else-if="view === 'submitting'" class="submitting-view">
        <PortalEmptyState
          class="dermatology-submitting-state"
          title="正在确认开单"
          desc="请稍候，正在生成就诊订单"
          :animated="true"
        />
      </view>

      <view v-else-if="view === 'success'" class="result-view">
        <view class="result-icon" aria-hidden="true"><image :src="successIcon" mode="aspectFit" /></view>
        <view class="result-title">开单成功</view>
        <view class="result-desc">请按就诊提示前往所选院区使用</view>
        <view class="result-order-card">
          <view><text>订单编号</text><strong>{{ orderNumber }}</strong></view>
          <view><text>服务项目</text><strong>{{ currentPackage?.name }}</strong></view>
          <view><text>就诊院区</text><DermatologyAreaTag :area="`${selectedArea}院区`" /></view>
          <view><text>就诊人</text><strong>{{ maskPatientName(selectedPatient.name) }}</strong></view>
        </view>
        <view class="result-next warm-tip-card"><image :src="alertCircleIcon" mode="aspectFit" /><view>请携带就诊人对应的自费卡或电子健康卡，到院后按现场指引就诊。</view></view>
        <view class="result-actions"><button class="result-primary" @tap="openOrder">查看订单</button><button class="result-secondary" @tap="goHome">返回首页</button></view>
      </view>

    </view>

    <view v-if="view === 'detail' && currentPackage" class="detail-bottom"><view><text>项目费用</text><strong>¥{{ currentPackage.price }}</strong></view><button hover-class="dermatology-bottom-button--pressed" :hover-start-time="0" :hover-stay-time="100" @tap="openConfirm">下一步</button></view>

    <view class="floating-actions">
    <button v-if="view === 'home'" class="home-fab" aria-label="首页" hover-class="home-fab--pressed" :hover-stay-time="100" @tap="goHome"><image :src="homeIcon" mode="aspectFit" /></button>
    <button v-if="view === 'home'" :class="['orders-fab', { 'is-compact': scrollTop > 240 }]" hover-class="orders-fab--pressed" :hover-stay-time="100" @tap="showOrders"><view class="orders-fab__shine" aria-hidden="true"></view><image :src="orderIcon" mode="aspectFit" /><text>订单</text></button>
    </view>

    <view v-if="toastText" class="toast">{{ toastText }}</view>
  </view>
</template>

<script setup lang="ts">
import Taro, { usePageScroll, useReady } from '@tarojs/taro'
import { computed, nextTick, ref, watch } from 'vue'
import PortalEmptyState from '@/components/PortalEmptyState/index.vue'
import DermatologyAreaTag from '@/components/DermatologyAreaTag/index.vue'
import PortalUserCard from '@/components/PortalUserCard/index.vue'
import orderIcon from './dermatology-order.svg'
import homeIcon from '@/assets/images/顶部导航栏/home.png'
import productImage from '@/assets/images/dermatology-product.jpg'
import detailBannerImage from '@/assets/images/dermatology-detail-banner.jpg'
import treatmentRoomImage from '@/assets/images/dermatology-treatment-room-optimized.jpg'
import defaultUserAvatar from '@/assets/images/user/default-user.png'
import alertCircleIcon from '@/assets/icons/common/circle-alert.svg'
import emptyAreaIcon from '@/assets/icons/message/hospital-message.svg'
import successIcon from '@/assets/images/成功图标-green.png'
import { dermatologyOrderRepository } from './orders/order-repository'
import './index.less'

const heroIllustration = 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E7%A6%8F%E5%B7%9E%E4%B8%AD%E5%8C%BB%E9%99%A2/%E5%9C%A8%E7%BA%BF%E5%95%86%E5%9F%8E/%E4%BB%99%E8%8D%89.png'
const consultIcon = 'https://www.figma.com/api/mcp/asset/f10228f2-ea72-449d-82e5-cc906af63600'

type PackageItem = { id: string; cat: string; name: string; price: number; area: string[]; note: string; desc: string; duration: string; icon: string; intro: string; steps: string[] }
const view = ref<'home' | 'detail' | 'confirm' | 'submitting' | 'success'>('home')
const activeCategory = ref('all')
const selectedArea = ref('鼓楼')
const isSwitching = ref(false)
const currentPackage = ref<PackageItem | null>(null)
const toastText = ref('')
const isSubmitting = ref(false)
const submitError = ref('')
const servicesLoading = ref(false)
const servicesError = ref('')
const orderNumber = ref('')
const scrollTop = ref(0)
const homeScrollTop = ref(0)
const isAreaTabPinned = ref(false)
const areaTabPinThresholdPx = ref(Number.POSITIVE_INFINITY)
// Native WeChat navigation is outside the page content viewport; fixed tabs
// must be positioned from the content viewport top instead of the old custom-nav offset.
const fixedNavBottomPx = ref(0)
const fixedCategoryTopPx = ref(136)
const fixedCategoryLeftPx = ref(28)
const areas = ['鼓楼', '五四北']
const categories = [{ id: 'all', name: '全部服务' }, { id: 'hair', name: '生发养发' }, { id: 'tcm', name: '中医疗法' }, { id: 'mole', name: '点痣祛疣' }, { id: 'whiten', name: '祛斑美白' }, { id: 'acne', name: '痘印痘坑' }, { id: 'antiaging', name: '光电抗衰' }, { id: 'soothe', name: '舒敏修复' }]
const packages: PackageItem[] = [
  { id: 'p1', cat: 'hair', name: '微针生发疗法', price: 132, area: ['鼓楼'], note: '适用于脂溢性脱发、斑秃等', desc: '头皮微针+中药酊剂+红光', duration: '约40-60分钟', icon: '🌱', intro: '将中药酊剂通过微针导入头皮，配合红光照射，综合改善头皮环境，促进毛发生长。', steps: ['清洗消毒头皮治疗区域', '头皮微针治疗，将中药酊剂导入头皮', '红光照射15分钟，促进药物吸收', '治疗后注意事项告知'] },
  { id: 'p2', cat: 'hair', name: '梅花针生发疗法', price: 147, area: ['鼓楼'], note: '适用于脂溢性脱发', desc: '梅花针叩刺+中医刮痧+红光照射', duration: '约50-70分钟', icon: '🌿', intro: '传统中医与现代物理治疗结合，多途径改善头皮微环境。', steps: ['头皮评估，确定叩刺区域', '梅花针轻叩头皮，刺激毛囊', '中医刮痧疏通头部经络', '中药酊剂外涂+红光照射'] },
  { id: 'p3', cat: 'tcm', name: '面部刮痧面膜疗法', price: 132, area: ['五四北'], note: '面部暗沉、干燥', desc: '中医面部刮痧+中药面膜贴敷', duration: '约50-60分钟', icon: '🍃', intro: '融合中医面部刮痧与中药外敷，改善气血循环，滋养肌肤。', steps: ['清洁面部', '中医面部刮痧', '中药面膜贴敷', '臭氧水热喷收尾'] },
  { id: 'p5', cat: 'mole', name: '点痣祛疣', price: 24, area: ['鼓楼'], note: '单颗价格', desc: '皮损治疗，单颗计价', duration: '约10-15分钟/颗', icon: '✨', intro: '采用专业医疗设备精准作用于皮损部位，创伤小、恢复快，由皮肤科医生操作。', steps: ['消毒皮损部位', '专业设备定点清除', '创面消毒及护理', '注意事项告知'] },
  { id: 'p8', cat: 'acne', name: '面部清痘套餐', price: 165, area: ['鼓楼'], note: '轻中度痤疮', desc: '针清+中药面膜+红蓝光', duration: '约40-50分钟', icon: '💧', intro: '从清洁到修护一站式改善痘痘问题，适合轻中度痤疮。', steps: ['面部清洁及消毒', '专业针清祛除成熟粉刺', '中药面膜湿敷消炎', '红蓝光照射及护理指导'] },
  { id: 'p14', cat: 'antiaging', name: '光子嫩肤+面膜10次', price: 5950, area: ['五四北'], note: '共10次', desc: '光子嫩肤+面膜修复', duration: '约30-40分钟/次', icon: '☀️', intro: '通过光电治疗改善肤色不均、细化毛孔，配合中药面膜修复。', steps: ['面部清洁', '光子嫩肤治疗', '冰敷镇静', '中药面膜修复'] }
]
const filteredPackages = computed(() => packages.filter(item => (activeCategory.value === 'all' || item.cat === activeCategory.value) && item.area.includes(selectedArea.value)))
const loadServices = async () => {
  servicesLoading.value = true
  servicesError.value = ''
  try {
    // 当前使用本地服务目录；接入接口时在此替换为请求并填充 packages 数据。
    await Promise.resolve()
  } catch (error) {
    servicesError.value = error instanceof Error ? error.message : '请检查网络后重试'
  } finally {
    servicesLoading.value = false
  }
}
const alternateArea = computed(() => selectedArea.value === '鼓楼' ? '五四北' : '鼓楼')
const alternateAreaHasServices = computed(() => packages.some(item => (activeCategory.value === 'all' || item.cat === activeCategory.value) && item.area.includes(alternateArea.value)))
const areaSmileStyle = computed(() => ({ left: selectedArea.value === '五四北' ? '75%' : '25%' }))
const pageTitle = computed(() => {
  if (view.value === 'home') return '皮肤科'
  if (view.value === 'detail') return '服务详情'
  if (view.value === 'confirm') return '开单确认'
  if (view.value === 'submitting') return '开单中'
  if (view.value === 'success') return '开单结果'
  return '订单详情'
})

// 皮肤科的详情、开单、结果为同一个小程序页面内的视图切换，
// 原生导航栏不会随着 CSS 背景自动更新，需在切换时同步原生颜色。
const nativeNavBackground = computed(() => {
  if (view.value === 'home') return '#DAF1CF'
  if (view.value === 'detail' || view.value === 'confirm') return '#F7FBF5'
  return '#F7FBF5'
})

watch([pageTitle, nativeNavBackground], ([title, backgroundColor]) => {
  Taro.setNavigationBarTitle({ title }).catch(() => {})
  Taro.setNavigationBarColor({
    frontColor: '#000000',
    backgroundColor
  }).catch(() => {})
}, { immediate: true })
const detailCategoryLabel = computed(() => {
  if (currentPackage.value?.cat === 'hair') return '脱发养护'
  return categories.find(category => category.id === currentPackage.value?.cat)?.name || '皮肤养护'
})
const detailCopy = computed(() => {
  const item = currentPackage.value
  if (!item) return null

  const shared = {
    environment: '福州市中医院皮肤科配备专业诊疗设备，由医护人员根据面诊评估制定适宜方案，提供安全、专业、舒适的诊疗体验。',
    taboo: ['治疗区域有破损、感染或严重皮肤病者，请先由医生评估', '孕妇及哺乳期女性，请在医生指导下选择项目', '出血体质或正在服用抗凝血药物者，请主动告知医生', '对相关药物、材料或光照治疗过敏者不宜使用'],
    notice: ['凭下单时所选就诊卡到对应院区就诊', '就诊卡需与下单时录入的自费卡或电子健康卡一致', '具体治疗方案与是否适用，以医生面诊评估结果为准', '如需退款或调整，请现场咨询工作人员']
  }

  if (item.id === 'p1') {
    return {
      ...shared,
      summary: '头皮微针+中药酊剂+红光，综合改善头皮环境，促进毛发生长',
      serviceContent: '头皮微针+中药酊剂+红光，综合改善头皮环境，促进毛发生长',
      graphicIntro: '微针生发疗法是将中药酊剂通过微针导入头皮，配合红光照射的综合治疗方案。微针可打开头皮微通道，促进药物深层渗透；红光有助于改善头皮微循环。'
    }
  }

  if (item.id === 'p2') {
    return {
      ...shared,
      summary: '梅花针叩刺+中医刮痧+红光照射，综合改善头皮微环境，促进修护吸收',
      serviceContent: '梅花针叩刺+中医刮痧+红光照射，由医生根据头皮情况制定治疗方案',
      graphicIntro: '梅花针生发疗法结合传统中医叩刺与现代红光照射，通过专业评估后进行头皮调理，帮助改善头皮微环境与毛囊周围循环。'
    }
  }

  return {
    ...shared,
    summary: `${item.desc}，具体方案以医生面诊评估结果为准`,
    serviceContent: item.desc,
    graphicIntro: item.intro
  }
})
const patients = [{ id: 1, name: '张明', rel: '本人', card: '自费卡  **** 5678' }, { id: 2, name: '李芳', rel: '配偶', card: '电子健康卡  **** 9012' }, { id: 3, name: '张小明', rel: '子女', card: '电子健康卡  **** 3456' }]
const maskPatientName = (name: string) => {
  if (!name) return ''
  if (name.length <= 1) return '*'
  if (name.length === 2) return `*${name.slice(-1)}`
  return `${name[0]}${'*'.repeat(name.length - 2)}${name.slice(-1)}`
}
const selectedPatient = ref(patients[0])
const treatmentRoomSrc = ref(treatmentRoomImage)
const handleTreatmentRoomImageError = () => {
  if (treatmentRoomSrc.value !== detailBannerImage) treatmentRoomSrc.value = detailBannerImage
}
let preservePinnedUntil = 0
let areaSwitchScrollTimer: ReturnType<typeof setTimeout> | undefined
const updatePinnedState = (value: number) => {
  if (view.value !== 'home' || !Number.isFinite(areaTabPinThresholdPx.value)) {
    isAreaTabPinned.value = false
    return
  }
  if (isAreaTabPinned.value && Date.now() < preservePinnedUntil) return
  const hysteresisPx = 4
  if (!isAreaTabPinned.value && value >= areaTabPinThresholdPx.value) {
    isAreaTabPinned.value = true
  } else if (isAreaTabPinned.value && value <= areaTabPinThresholdPx.value - hysteresisPx) {
    isAreaTabPinned.value = false
  }
}

const measurePinnedGeometry = () => {
  if (view.value !== 'home') return
  const navBottom = fixedNavBottomPx.value
  const query = Taro.createSelectorQuery()
  query.select('.area-options--source').boundingClientRect()
  query.select('.category-list--source').boundingClientRect()
  query.exec((rects: Array<{ top?: number; left?: number; bottom?: number; height?: number } | null>) => {
    const areaRect = rects?.[0]
    if (!areaRect) return

    const areaTop = Number(areaRect.top || 0)
    const areaHeight = Number(areaRect.height || 48)
    const categoryTop = Number(rects?.[1]?.top ?? areaTop + areaHeight)
    const categoryLeft = Number(rects?.[1]?.left ?? fixedCategoryLeftPx.value)
    fixedNavBottomPx.value = navBottom
    fixedCategoryTopPx.value = navBottom + Math.max(0, categoryTop - areaTop)
    fixedCategoryLeftPx.value = categoryLeft
    areaTabPinThresholdPx.value = scrollTop.value + areaTop - navBottom
    updatePinnedState(scrollTop.value)
  })
}

const handleNavLayout = ({ height }: { height: number }) => {
  if (!height || height === fixedNavBottomPx.value) return
  fixedNavBottomPx.value = height
  nextTick(() => {
    setTimeout(measurePinnedGeometry, 0)
  })
}

useReady(() => {
  nextTick(() => {
    setTimeout(measurePinnedGeometry, 60)
  })
})

usePageScroll(({ scrollTop: value }) => {
  const nextScrollTop = value || 0
  scrollTop.value = nextScrollTop
  updatePinnedState(nextScrollTop)
})
let switchTimer: ReturnType<typeof setTimeout> | undefined
const playListSwitch = () => {
  isSwitching.value = true
  if (switchTimer) clearTimeout(switchTimer)
  switchTimer = setTimeout(() => { isSwitching.value = false }, 310)
}

const stabilizePinnedAreaSwitch = () => {
  if (!Number.isFinite(areaTabPinThresholdPx.value)) return

  const targetScrollTop = Math.max(0, Math.ceil(areaTabPinThresholdPx.value + 1))
  preservePinnedUntil = Date.now() + 500
  isAreaTabPinned.value = true

  nextTick(() => {
    if (areaSwitchScrollTimer) clearTimeout(areaSwitchScrollTimer)
    areaSwitchScrollTimer = setTimeout(() => {
      Taro.pageScrollTo({ scrollTop: targetScrollTop, duration: 0 })
        .catch(() => {})
        .finally(() => {
          setTimeout(() => {
            const query = Taro.createSelectorQuery()
            query.selectViewport().scrollOffset()
            query.exec((results: Array<{ scrollTop?: number } | null>) => {
              const actualScrollTop = Number(results?.[0]?.scrollTop ?? targetScrollTop)
              preservePinnedUntil = 0
              scrollTop.value = actualScrollTop
              isAreaTabPinned.value = actualScrollTop >= areaTabPinThresholdPx.value
            })
          }, 50)
        })
    }, 0)
  })
}

const selectCategory = (categoryId: string) => {
  if (activeCategory.value === categoryId) return
  if (isAreaTabPinned.value) preservePinnedUntil = Date.now() + 600
  activeCategory.value = categoryId
  playListSwitch()
}
const selectArea = (area: string) => {
  if (selectedArea.value === area) return
  const wasPinned = isAreaTabPinned.value
  selectedArea.value = area
  playListSwitch()
  if (wasPinned) stabilizePinnedAreaSwitch()
}
type TabTapEvent = {
  currentTarget?: {
    dataset?: Record<string, string>
  }
}
const handleCategoryTap = (event: TabTapEvent) => {
  const categoryId = event.currentTarget?.dataset?.category
  if (categoryId) selectCategory(categoryId)
}
const handleAreaTap = (event: TabTapEvent) => {
  const area = event.currentTarget?.dataset?.area
  if (area) selectArea(area)
}
const switchEmptyArea = () => {
  const targetArea = alternateArea.value
  const targetHasServices = alternateAreaHasServices.value
  if (!targetHasServices) activeCategory.value = 'all'
  selectArea(targetArea)
}
const handlePageBack = () => {
  if (view.value === 'submitting') {
    toast('正在开单，请等待提交完成')
    return true
  }
  if (view.value === 'confirm') {
    view.value = 'detail'
    Taro.pageScrollTo({ scrollTop: 0, duration: 0 }).catch(() => {})
    return true
  }
  if (view.value === 'success') {
    goHome()
    return true
  }
  if (view.value === 'detail') {
    const restoreScrollTop = homeScrollTop.value
    view.value = 'home'
    currentPackage.value = null
    scrollTop.value = restoreScrollTop
    nextTick(() => {
      Taro.pageScrollTo({ scrollTop: restoreScrollTop, duration: 0 }).catch(() => {})
    })
    return true
  }
  return false
}
const openDetail = (item: PackageItem) => {
  homeScrollTop.value = scrollTop.value
  currentPackage.value = item
  view.value = 'detail'
  scrollTop.value = 0
  nextTick(() => {
    Taro.pageScrollTo({ scrollTop: 0, duration: 0 }).catch(() => {})
  })
}
const openConfirm = () => {
  view.value = 'confirm'
  scrollTop.value = 0
  nextTick(() => { Taro.pageScrollTo({ scrollTop: 0, duration: 0 }).catch(() => {}) })
}
const openOrder = () => Taro.redirectTo({ url: `/pages/dermatology/orders/index?highlightOrderId=${orderNumber.value}` })
const showOrders = () => Taro.navigateTo({ url: '/pages/dermatology/orders/index' })
const goHome = () => Taro.reLaunch({ url: '/pages/dermatology/index' })
const goConsult = () => Taro.navigateTo({ url: '/pages/appointment/ai-assistant/index' })
const createOrderNumber = () => {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  return `PF${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
}
const createOrderTime = () => {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
}
const submitOrder = async () => {
  if (isSubmitting.value) return
  submitError.value = ''
  if (!currentPackage.value || !selectedPatient.value) {
    submitError.value = '订单信息不完整，请返回检查后重试。'
    return
  }
  isSubmitting.value = true
  view.value = 'submitting'
  await nextTick()
  try {
    await Promise.race([
      new Promise<void>(resolve => setTimeout(resolve, 1050)),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('提交超时，请稍后重试')), 15000))
    ])
    orderNumber.value = createOrderNumber()
    await dermatologyOrderRepository.saveOrder({
      orderId: orderNumber.value,
      serviceId: currentPackage.value.id,
      serviceName: currentPackage.value.name,
      area: `${selectedArea.value}院区` as '鼓楼院区' | '五四北院区',
      orderTime: createOrderTime(),
      amount: currentPackage.value.price,
      patientName: selectedPatient.value.name,
      patientCard: selectedPatient.value.card,
      patientRelation: selectedPatient.value.rel
    })
    view.value = 'success'
    scrollTop.value = 0
    nextTick(() => { Taro.pageScrollTo({ scrollTop: 0, duration: 0 }).catch(() => {}) })
  } catch (error) {
    view.value = 'confirm'
    submitError.value = error instanceof Error ? error.message : '提交失败，请检查网络后重新提交。'
  } finally {
    isSubmitting.value = false
  }
}
const toast = (text: string) => { toastText.value = text; setTimeout(() => { toastText.value = '' }, 1500) }
</script>
