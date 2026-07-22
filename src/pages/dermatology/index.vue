<template>
  <view class="dermatology-page">
    <PortalNavBar :title="pageTitle" secondary force-dark-text />

    <scroll-view scroll-y class="dermatology-scroll">
      <view v-if="view === 'home'" class="dermatology-home">
        <view class="hero-card">
          <view class="hero-badge">🏥 福州中医院 · 皮肤科</view>
          <view class="hero-title">传承中医精髓 · 守护皮肤健康</view>
          <view class="hero-desc">福州市中医院皮肤科是福建省中医重点专科，<br>以中医特色疗法结合现代技术，为您提供专业、安心的皮肤诊疗服务。</view>
        </view>

        <view class="consult-card" @tap="goConsult">
          <view class="consult-icon">🌿</view>
          <view class="consult-copy"><view class="consult-title">在线问诊 · 辨证施治 <text>免费咨询</text></view><view class="consult-desc">脱发、痤疮、色斑、敏感肌… 在线咨询皮肤科医生，获取个性化诊疗方案</view></view>
          <view class="consult-arrow">›</view>
        </view>

        <view class="area-options"><button v-for="area in areas" :key="area" :class="['area-btn', { on: selectedArea === area }]" @tap="selectedArea = area">{{ area }}院区</button></view>
        <view class="address">📍 {{ selectedArea === '五四北' ? '五四北院区 · 福建省福州市晋安区' : '鼓楼院区 · 福建省福州市鼓楼区' }}</view>

        <view class="content-layout">
          <view class="category-list"><view class="category-title">分类</view><button v-for="cat in categories" :key="cat.id" :class="['category-btn', { active: activeCategory === cat.id }]" @tap="activeCategory = cat.id">{{ cat.name }}</button></view>
          <view class="package-list">
            <view v-for="item in filteredPackages" :key="item.id" class="package-card" @tap="openDetail(item)">
              <view class="package-visual" :class="item.cat"><text>{{ item.icon }}</text></view>
              <view class="package-body"><view class="package-name">{{ item.name }}</view><view class="package-note">{{ item.note }}</view><view class="package-desc">{{ item.desc }}</view><view class="package-foot"><text class="price">¥{{ item.price }}</text><text class="duration">{{ item.duration }}</text></view></view>
            </view>
            <view v-if="!filteredPackages.length" class="empty">当前院区暂无可用服务</view>
          </view>
        </view>
      </view>

      <view v-else-if="view === 'detail' && currentPackage" class="detail-view">
        <view class="detail-hero"><view class="detail-icon">{{ currentPackage.icon }}</view><view><view class="detail-name">{{ currentPackage.name }}</view><view class="detail-note">{{ currentPackage.note }} · {{ currentPackage.duration }}</view></view></view>
        <view class="info-card"><view class="section-title">服务介绍</view><view class="body-copy">{{ currentPackage.intro }}</view></view>
        <view class="info-card"><view class="section-title">治疗流程</view><view v-for="(step, index) in currentPackage.steps" :key="step" class="step"><text>{{ index + 1 }}</text>{{ step }}</view></view>
        <view class="info-card"><view class="section-title">购买须知</view><view class="body-copy">• 凭下单时所选就诊卡到院区就诊<br>• 治疗前请配合医生进行专业评估<br>• 如需退款请现场咨询工作人员</view></view>
        <view class="detail-bottom"><view><text>实付</text><strong>¥{{ currentPackage.price }}</strong></view><button @tap="openConfirm">立即申请</button></view>
      </view>

      <view v-else class="confirm-view"><view class="confirm-card"><view class="section-title">就诊人信息</view><view class="patient"><text class="avatar">👤</text><view><view class="patient-name">张明 <text>本人</text></view><view class="patient-card">自费卡 · **** 5678</view></view><button @tap="showPatients">切换</button></view></view><view v-if="currentPackage" class="confirm-card"><view class="section-title">服务项目</view><view class="confirm-row"><text>{{ currentPackage.name }}</text><strong>¥{{ currentPackage.price }}</strong></view></view><view class="confirm-notice">ℹ️ 本次就诊需使用患者本人的自费卡结算。如无自费卡，请先添加电子健康卡。</view><view class="confirm-bottom"><view><text>实付</text><strong>¥{{ currentPackage?.price || 0 }}</strong></view><button @tap="submitOrder">申请开单</button></view></view>
    </scroll-view>

    <button class="orders-fab" @tap="showOrders"><image :src="orderIcon" mode="aspectFit" /><text>我的订单</text></button>

    <view v-if="patientModal" class="modal-mask" @tap="patientModal = false"><view class="modal-card" @tap.stop><view class="modal-title">选择就诊卡 <text @tap="patientModal = false">×</text></view><view v-for="patient in patients" :key="patient.id" class="patient-option" @tap="selectPatient(patient)"><text>{{ patient.name }} · {{ patient.rel }}</text><small>{{ patient.card }}</small></view><view class="add-card" @tap="toast('电子健康卡添加功能建设中')">＋ 添加电子健康卡</view></view></view>
    <view v-if="toastText" class="toast">{{ toastText }}</view>
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'
import { computed, ref } from 'vue'
import PortalNavBar from '@/components/PortalNavBar/index.vue'
import orderIcon from './dermatology-order.svg'
import './index.less'

type PackageItem = { id: string; cat: string; name: string; price: number; area: string[]; note: string; desc: string; duration: string; icon: string; intro: string; steps: string[] }
const view = ref<'home' | 'detail' | 'confirm'>('home')
const activeCategory = ref('all')
const selectedArea = ref('鼓楼')
const currentPackage = ref<PackageItem | null>(null)
const patientModal = ref(false)
const toastText = ref('')
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
const pageTitle = computed(() => view.value === 'home' ? '皮肤科专科特色服务' : view.value === 'detail' ? '服务详情' : '开单确认')
const patients = [{ id: 1, name: '张明', rel: '本人', card: '自费卡 · **** 5678' }, { id: 2, name: '李芳', rel: '配偶', card: '电子健康卡 · **** 9012' }, { id: 3, name: '张小明', rel: '子女', card: '电子健康卡 · **** 3456' }]
const openDetail = (item: PackageItem) => { currentPackage.value = item; view.value = 'detail' }
const openConfirm = () => { view.value = 'confirm' }
const showPatients = () => { patientModal.value = true }
const selectPatient = (patient: typeof patients[number]) => { patientModal.value = false; toast(`已切换至${patient.name}`) }
const showOrders = () => toast('订单功能建设中')
const goConsult = () => Taro.navigateTo({ url: '/pages/appointment/ai-assistant/index' })
const submitOrder = () => toast('申请已提交，订单功能建设中')
const toast = (text: string) => { toastText.value = text; setTimeout(() => { toastText.value = '' }, 2000) }
</script>
