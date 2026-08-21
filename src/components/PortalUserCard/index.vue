<template>
  <div
    class="portal-user-card"
    :class="[
      `is-${kind}`,
      {
        'has-todo-bar': showTodoBar,
        'has-todo-panel': showTodoPanel,
        'is-square-primary': squarePrimary
      }
    ]"
    @tap="handleCardTap"
  >
    <div class="portal-user-card__main">
      <div class="portal-user-card__patient">
        <div
          v-if="actualShowAvatar"
          class="portal-user-card__avatar-wrap"
          :class="{ 'is-clickable': showSwitch }"
          :hover-class="showSwitch ? 'is-active' : 'none'"
          @click="showSwitch ? onSwitchClick() : null"
        >
          <img
            class="portal-user-card__avatar"
            :src="activeAvatar"
            alt=""
          >
        </div>
        <div class="portal-user-card__patient-info">
          <div class="portal-user-card__patient-name">
            <span>{{ activeName }}</span>
            <span v-if="relationLabel" class="portal-user-card__relation-tag">{{ relationLabel }}</span>
            <button
              v-if="showSwitch"
              class="portal-user-card__switch"
              type="button"
              hover-class="is-active"
              @tap.stop="onSwitchClick"
            >
              <span>{{ displaySwitchText }}</span>
              <img :src="switchArrowIcon" class="portal-user-card__switch-arrow" alt="" @tap.stop="onSwitchClick">
            </button>
          </div>
          <div class="portal-user-card__insurance">
            <span v-if="showInsurance" class="portal-user-card__tag" :class="activeInsuranceTagClass">{{ displayInsuranceLabel }}</span>
            <span>{{ activeDesc }}</span>
            <view
              v-if="showEye"
              class="portal-user-card__eye-wrap"
              @tap="onEyeTap"
            >
              <img
                class="portal-user-card__eye"
                :src="isMasked ? iconEyeClosed : iconEyeOpen"
                alt="眼睛图标"
              >
            </view>
          </div>
        </div>
      </div>
      <button
        v-if="showPrimary"
        class="portal-user-card__primary"
        type="button"
        hover-class="is-active"
        @click="onPrimaryClick"
      >
        <image v-if="displayPrimaryIcon" class="portal-user-card__qr" :src="displayPrimaryIcon" mode="aspectFit" />
        <span>{{ primaryText }}</span>
      </button>
    </div>

    <div v-if="showTodoBar" class="portal-user-card__todo">
      <span>{{ todoText }}</span>
      <button class="portal-user-card__todo-btn" type="button" @click="$emit('todo-action')">
        {{ todoActionText }}<span class="portal-user-card__todo-arrow"></span>
      </button>
    </div>

    <div v-if="showTodoPanel" class="portal-user-card__todo-panel">
      <div class="portal-user-card__todo-top">
        <span class="portal-user-card__todo-count">有<em>{{ todoCount }}</em>个待办</span>
        <button class="portal-user-card__fold-btn" type="button" @click="isCollapsed = !isCollapsed">
          <span>{{ isCollapsed ? '展开卡片' : '折叠卡片' }}</span>
        </button>
        <button class="portal-user-card__todo-btn" type="button" @click="$emit('todo-action')">
          <span>{{ todoActionText }}</span><span class="portal-user-card__todo-arrow"></span>
        </button>
      </div>

      <div v-show="!isCollapsed" class="portal-user-card__todo-body">
        <div class="portal-user-card__todo-content" :class="{ 'has-rail': todoCategoryTabs.length }">
          <div v-if="todoCategoryTabs.length" class="portal-user-card__category-rail">
            <span
              v-for="tab in todoCategoryTabs"
              :key="tab.label"
              class="portal-user-card__category-tab"
              :class="{ 'is-active': tab.active }"
              @tap="handleCategoryTabClick(tab)"
            >{{ tab.label }}</span>
          </div>

          <div class="portal-user-card__todo-main">
            <!-- If category is '候诊', render queue details directly without swiper -->
            <div v-if="activeTodoCategory === '候诊'" class="portal-user-card__queue-content" :style="{ height: currentQueueContentHeight }">
              <div class="portal-user-card__queue-time">
                数据获取时间：2025/10/03 09:00:00
              </div>
              <div class="portal-user-card__queue-numbers">
                <div class="portal-user-card__queue-number-item">
                  <div class="number-val is-orange">
                    015 <span class="tag-over">已过号</span>
                  </div>
                  <div class="number-lbl">就诊号数</div>
                </div>
                <div class="portal-user-card__queue-number-item">
                  <div class="number-val is-blue">019</div>
                  <div class="number-lbl">当前号数</div>
                </div>
                <div class="portal-user-card__queue-number-item">
                  <div class="number-val is-grey">-</div>
                  <div class="number-lbl">预计等待</div>
                </div>
              </div>
              <div class="portal-user-card__queue-details">
                <div class="queue-detail-row">
                  <span class="queue-detail-key">就诊科室</span>
                  <span class="queue-detail-val">脂肪肝健康管理中心</span>
                </div>
                <div class="queue-detail-row">
                  <span class="queue-detail-key">就诊医生</span>
                  <span class="queue-detail-val">陈雨薇</span>
                </div>
                <div class="queue-detail-row">
                  <span class="queue-detail-key">预计就诊</span>
                  <span class="queue-detail-val">10:15 - 10:30</span>
                </div>
                <div class="queue-detail-row">
                  <span class="queue-detail-key">就诊地点</span>
                  <span class="queue-detail-val">门诊大楼2层203室</span>
                </div>
              </div>
              <div class="portal-user-card__queue-actions portal-user-card__actions has-three">
                <button class="portal-user-card__sub-button" type="button" @tap="handleRefreshCall">刷新叫号</button>
                <button class="portal-user-card__main-button" type="button" @tap="handleShowQrCode">就诊码</button>
                <button class="portal-user-card__extra-button" type="button" @tap="handleNavigate">院内导航</button>
              </div>
            </div>

            <!-- Otherwise, render status tabs and swiper as before -->
            <template v-else>
              <div v-if="todoStatusTabs.length > 1" class="portal-user-card__status-tabs">
                <span
                  v-for="tab in todoStatusTabs"
                  :key="tab.label"
                  class="portal-user-card__status-tab"
                  :class="{ 'is-active': tab.active, 'has-badge': tab.badge }"
                  @tap="handleStatusTabClick(tab)"
                >{{ tab.label }}</span>
              </div>

              <swiper
                :key="activeTodoCategory"
                class="portal-user-card__todo-swiper"
                :style="{ height: currentTodoSwiperHeight }"
                :current="safeCurrentTodoIndex"
                :circular="false"
                @change="handleSwiperChange"
              >
                <swiper-item v-for="todo in visibleTodoList" :key="`${getTodoCategory(todo)}-${getTodoStatus(todo)}-${getTodoOriginalIndex(todo)}`">
                  <div class="portal-user-card__todo-slide">
                    <div class="portal-user-card__detail-list">
                      <div
                        v-for="item in todo.detailList"
                        :key="item.label"
                        class="portal-user-card__detail-row"
                      >
                        <span>{{ item.label }}</span>
                        <strong :class="item.kind ? `is-${item.kind}` : ''">{{ item.value }}</strong>
                        <em v-if="item.badge">{{ item.badge }}</em>
                      </div>
                    </div>

                    <div class="portal-user-card__actions" :class="{ 'has-three': todo.extraButtonText }">
                      <button class="portal-user-card__sub-button" type="button" @click="$emit('sub-action', getTodoOriginalIndex(todo))">{{ todo.subButtonText }}</button>
                      <button class="portal-user-card__main-button" type="button" @click="$emit('main-action', getTodoOriginalIndex(todo))">{{ todo.mainButtonText }}</button>
                      <button v-if="todo.extraButtonText" class="portal-user-card__extra-button" type="button" @click="$emit('extra-action', getTodoOriginalIndex(todo))">{{ todo.extraButtonText }}</button>
                    </div>

                    <div v-if="visibleTodoList.length > 1" class="portal-user-card__dots" aria-hidden="true">
                      <i
                        v-for="(dotTodo, idx) in visibleTodoList"
                        :key="getTodoOriginalIndex(dotTodo)"
                        :class="{ 'is-active': safeCurrentTodoIndex === idx }"
                        @click="currentTodoIndex = idx"
                      ></i>
                    </div>
                  </div>
                </swiper-item>
              </swiper>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Taro from '@tarojs/taro'
import { useAppStore } from '@/store'
import { AVATAR_MAP } from '@/utils/avatar'
import { maskName } from '@/utils'
import iconEyeOpen from '@/assets/images/portal/card/eye-o.png'
import iconEyeClosed from '@/assets/images/portal/card/closed-eye.png'
import iconSwitchArrow from '@/assets/images/portal/card/Union.png'
import './index.less'

import qrCodeImg from '@/assets/images/portal/card/chs.png'

type UserCardKind = 'guest' | 'boundless' | 'clinic' | 'inpatient' | 'todo'

interface DetailItem {
  label: string
  value: string
  kind?: 'blue' | 'orange'
  badge?: string
}

interface TodoTabItem {
  label: string
  active?: boolean
  disabled?: boolean
  badge?: boolean
}

interface TodoItem {
  settleTitle: string
  detailList: DetailItem[]
  subButtonText: string
  mainButtonText: string
  extraButtonText?: string
  categoryLabel?: string
  statusLabel?: string
  categoryTabs?: TodoTabItem[]
  statusTabs?: TodoTabItem[]
}

const props = withDefaults(defineProps<{
  kind?: UserCardKind
  avatar?: string
  name?: string
  relationLabel?: string
  desc?: string
  showSwitch?: boolean
  switchText?: string
  showInsurance?: boolean
  insuranceLabel?: string
  showEye?: boolean
  eyeIcon?: string
  switchArrowIcon?: string
  primaryText?: string
  primaryIcon?: string
  showPrimary?: boolean
  showTodoBar?: boolean
  todoText?: string
  todoActionText?: string
  showTodoPanel?: boolean
  todoCount?: string
  todoList?: TodoItem[]
  subButtonText?: string
  mainButtonText?: string
  showAvatar?: boolean
}>(), {
  kind: 'clinic',
  avatar: AVATAR_MAP.childMale,
  name: '许*凯',
  relationLabel: '',
  desc: 'AE****35',
  showSwitch: true,
  switchText: '切换就诊人',
  showInsurance: true,
  insuranceLabel: '医保',
  showEye: true,
  eyeIcon: undefined,
  switchArrowIcon: iconSwitchArrow,
  primaryText: '医保码',
  primaryIcon: qrCodeImg,
  showPrimary: true,
  showTodoBar: true,
  todoText: '当前暂无待办',
  todoActionText: '查看更多',
  showTodoPanel: false,
  todoCount: '3',
  showAvatar: undefined,
  todoList: () => [
    {
      settleTitle: '待就诊',
      categoryLabel: '预约',
      statusLabel: '待就诊',
      categoryTabs: [
        { label: '预约', active: true },
        { label: '候诊' },
        { label: '结算' },
        { label: '检查' },
        { label: '检验' },
        { label: '取药' }
      ],
      statusTabs: [
        { label: '待就诊(2)', active: true },
        { label: '待签到(2)', disabled: true, badge: true }
      ],
      detailList: [
        { label: '就诊科室', value: '脂肪肝健康管理中心' },
        { label: '就诊医生', value: '陈雨薇' },
        { label: '就诊时间', value: '2025/10/08 14:30  16号', badge: '5天后' },
        { label: '就诊地点', value: '金山院区门诊大楼2层203室' },
        { label: '预约单号', value: 'YY20251008001' }
      ],
      subButtonText: '取消预约',
      mainButtonText: '去医院',
      extraButtonText: '预问诊'
    },
    {
      settleTitle: '待就诊',
      categoryLabel: '预约',
      statusLabel: '待就诊',
      categoryTabs: [
        { label: '预约', active: true },
        { label: '候诊' },
        { label: '结算' },
        { label: '检查' },
        { label: '检验' },
        { label: '取药' }
      ],
      detailList: [
        { label: '就诊科室', value: '脂肪肝健康管理中心' },
        { label: '就诊医生', value: '李明' },
        { label: '就诊时间', value: '2025/10/09 09:10  8号', badge: '6天后' },
        { label: '就诊地点', value: '金山院区门诊大楼3层301室' },
        { label: '预约单号', value: 'YY20251009002' }
      ],
      subButtonText: '取消预约',
      mainButtonText: '去医院',
      extraButtonText: '预问诊'
    },
    {
      settleTitle: '待签到',
      categoryLabel: '预约',
      statusLabel: '待签到',
      categoryTabs: [
        { label: '预约', active: true },
        { label: '候诊' },
        { label: '结算' },
        { label: '检查' },
        { label: '检验' },
        { label: '取药' }
      ],
      detailList: [
        { label: '就诊科室', value: '脂肪肝健康管理中心' },
        { label: '就诊医生', value: '陈雨薇' },
        { label: '签到时间', value: '2025/10/08 14:10  16号', badge: '待签到' },
        { label: '签到地点', value: '金山院区门诊大楼2层203室' },
        { label: '就诊流水', value: 'LS20251008034' }
      ],
      subButtonText: '就诊码',
      mainButtonText: '去签到'
    },
    {
      settleTitle: '待结算',
      categoryLabel: '结算',
      statusLabel: '待结算',
      categoryTabs: [
        { label: '预约' },
        { label: '候诊' },
        { label: '结算', active: true },
        { label: '检查' },
        { label: '检验' },
        { label: '取药' }
      ],
      detailList: [
        { label: '就诊科室', value: '传统内科' },
        { label: '就诊医生', value: '张建国' },
        { label: '费用金额', value: '120.00元', kind: 'blue' },
        { label: '结算状态', value: '待结算', kind: 'orange' },
        { label: '开单时间', value: '2025/10/03 08:45' }
      ],
      subButtonText: '就诊码',
      mainButtonText: '门诊结算'
    },
    {
      settleTitle: '待检查',
      categoryLabel: '检查',
      statusLabel: '待检查',
      categoryTabs: [
        { label: '预约' },
        { label: '候诊' },
        { label: '结算' },
        { label: '检查', active: true },
        { label: '检验' },
        { label: '取药' }
      ],
      detailList: [
        { label: '检查项目', value: '皮肤镜光学检查' },
        { label: '就诊科室', value: '皮肤科' },
        { label: '开单医生', value: '李小丽' },
        { label: '检查状态', value: '待检查', kind: 'orange' },
        { label: '检查地点', value: '1号楼2层皮肤科检查室' }
      ],
      subButtonText: '就诊码',
      mainButtonText: '去检查'
    },
    {
      settleTitle: '已出报告',
      categoryLabel: '检验',
      statusLabel: '已出报告',
      categoryTabs: [
        { label: '预约' },
        { label: '候诊' },
        { label: '结算' },
        { label: '检查' },
        { label: '检验', active: true },
        { label: '取药' }
      ],
      detailList: [
        { label: '检验项目', value: '全血细胞分析+CRP' },
        { label: '就诊科室', value: '传统内科' },
        { label: '开单医生', value: '王铁柱' },
        { label: '检验状态', value: '已出报告', kind: 'blue' },
        { label: '采样时间', value: '2025/10/03 09:15' }
      ],
      subButtonText: '查看报告',
      mainButtonText: '预约复诊'
    },
    {
      settleTitle: '待取药',
      categoryLabel: '取药',
      statusLabel: '待取药',
      categoryTabs: [
        { label: '预约' },
        { label: '候诊' },
        { label: '结算' },
        { label: '检查' },
        { label: '检验' },
        { label: '取药', active: true }
      ],
      detailList: [
        { label: '取药窗口', value: '1号楼1层西药房 10号窗口' },
        { label: '就诊医生', value: '赵海平' },
        { label: '当前号数', value: '1626号', kind: 'blue' },
        { label: '排队人数', value: '10人' },
        { label: '处方单号', value: 'CF20251003009' }
      ],
      subButtonText: '就诊码',
      mainButtonText: '刷新叫号'
    }
  ],
  subButtonText: '就诊码',
  mainButtonText: '门诊结算'
})

const emit = defineEmits([
  'switch-patient',
  'toggle-mask',
  'primary',
  'todo-action',
  'sub-action',
  'main-action',
  'extra-action'
])

const store = useAppStore()
const activePatient = computed(() => store.activePatient)

const actualShowAvatar = computed(() => {
  return true
})

const squarePrimary = computed(() => false)

// Global mask toggle state proxy
const isMasked = computed({
  get() {
    return store.isMaskedGlobal
  },
  set(val) {
    store.isMaskedGlobal = val
  }
})

// Removed circular watcher on props.eyeIcon to prevent reactivity stalls and circular dependencies.

// An explicitly empty icon hides the CHS mark for text-only primary actions.
const displayPrimaryIcon = computed(() => props.primaryIcon === '' ? '' : props.primaryIcon)

const isAnonymous = computed(() => props.kind === 'guest' || props.kind === 'boundless')

const activeName = computed(() => {
  const rawName = isAnonymous.value ? (props.name || '上午好') : activePatient.value.name
  if (isMasked.value && rawName !== '上午好') {
    return maskName(rawName)
  }
  return rawName
})
const activeAvatar = computed(() => isAnonymous.value ? (props.avatar || AVATAR_MAP.noGender) : activePatient.value.avatar)
const activeInsuranceLabel = computed(() => isAnonymous.value ? (props.insuranceLabel || '自费') : (activePatient.value.insuranceLabel || '医保'))
const displayInsuranceLabel = computed(() => {
  const label = activeInsuranceLabel.value
  if (label === '健康卡' || label === '电子健康卡') {
    return '健康卡'
  }
  if (label === '社保卡' || label === '医保卡' || label === '医保') {
    return '医保'
  }
  if (label === '就诊卡') {
    return '就诊卡'
  }
  if (label === '就诊卡自费卡' || label === '就诊卡(自费)' || label === '自费') {
    return '自费'
  }
  return label
})
const activeInsuranceTagClass = computed(() => {
  const label = activeInsuranceLabel.value
  if (label === '健康卡' || label === '电子健康卡') {
    return 'is-health'
  }
  if (label === '就诊卡' || label === '就诊卡自费卡' || label === '就诊卡(自费)' || label === '自费') {
    return 'is-zifei'
  }
  return 'is-yibao'
})
const displaySwitchText = computed(() => {
  if (actualShowAvatar.value && props.switchText === '切换就诊人') {
    return '切换'
  }
  return props.switchText
})

const activeDesc = computed(() => {
  if (isAnonymous.value) {
    return props.desc || ''
  }
  const card = activePatient.value.cardNo
  if (isMasked.value) {
    if (card.length === 9) {
      return card.slice(0, 2) + '*'.repeat(card.length - 4) + card.slice(-2)
    }
    if (card.startsWith('AE')) {
      return 'AE' + '*'.repeat(card.length - 4) + card.slice(-2)
    }
    return card.slice(0, 1) + '*'.repeat(card.length - 2) + card.slice(-1)
  }
  return card
})

const onSwitchClick = () => {
  // store.showPatientSwitcher = true // 现在不做切换用户展示，隐藏2级弹窗
  emit('switch-patient')
}

const onPrimaryClick = () => {
  emit('primary')
}

const onEyeTap = (e?: any) => {
  console.log('[TAP LOG] onEyeTap start - isMasked before:', isMasked.value)
  isMasked.value = !isMasked.value
  console.log('[TAP LOG] onEyeTap end - isMasked after:', isMasked.value)
  emit('toggle-mask', isMasked.value)
}

const handleCardTap = (e?: any) => {
  console.log('[TAP LOG] 2. Patient card container (PortalUserCard) received tap, target id/class:', e?.target?.id || e?.target?.className)
}

const isCollapsed = ref(false)
const currentTodoIndex = ref(0)
const safeCurrentTodoIndex = computed(() => {
  const len = visibleTodoList.value.length
  if (len === 0) return 0
  return Math.min(Math.max(0, currentTodoIndex.value), len - 1)
})

const handleRefreshCall = () => {
  Taro.showToast({
    title: '叫号已更新！当前为 019号',
    icon: 'none'
  })
}

const handleNavigate = () => {
  Taro.navigateTo({
    url: '/pages/common-list/navigation/index'
  })
}

const handleShowQrCode = () => {
  Taro.showModal({
    title: '就诊码',
    content: '请向诊室护士出示此二维码进行就诊登记。',
    showCancel: false,
    confirmText: '确定'
  })
}

const activeTodoCategory = ref('')
const activeTodoStatus = ref('')

const normalizeStatusLabel = (label?: string) => {
  return (label || '').replace(/\(\d+\)$/, '')
}

const getTodoCategory = (todo: TodoItem) => {
  return todo.categoryLabel || todo.categoryTabs?.find(tab => tab.active)?.label || todo.categoryTabs?.[0]?.label || ''
}

const getTodoStatus = (todo: TodoItem) => {
  return todo.statusLabel || normalizeStatusLabel(todo.statusTabs?.find(tab => tab.active)?.label) || todo.settleTitle
}

const todoCategoryOrder = computed(() => {
  const labels: string[] = []
  props.todoList.forEach((todo) => {
    todo.categoryTabs?.forEach((tab) => {
      if (tab.label && !labels.includes(tab.label)) {
        labels.push(tab.label)
      }
    })
    const label = getTodoCategory(todo)
    if (label && !labels.includes(label)) {
      labels.push(label)
    }
  })
  return labels
})

const todoCategoryTabs = computed<TodoTabItem[]>(() => {
  return todoCategoryOrder.value.map(label => ({
    label,
    active: label === activeTodoCategory.value
  }))
})

const activeCategoryTodoList = computed(() => {
  if (!activeTodoCategory.value) {
    return props.todoList
  }
  return props.todoList.filter(todo => getTodoCategory(todo) === activeTodoCategory.value)
})

const todoStatusOrder = computed(() => {
  const labels: string[] = []
  activeCategoryTodoList.value.forEach((todo) => {
    const label = getTodoStatus(todo)
    if (label && !labels.includes(label)) {
      labels.push(label)
    }
  })
  return labels
})

const todoStatusTabs = computed<TodoTabItem[]>(() => {
  return todoStatusOrder.value.map((label) => {
    const count = activeCategoryTodoList.value.filter(todo => getTodoStatus(todo) === label).length
    return {
      label: `${label}(${count})`,
      active: label === activeTodoStatus.value,
      badge: label === '待签到'
    }
  })
})

const visibleTodoList = computed(() => {
  if (!activeTodoStatus.value) {
    return activeCategoryTodoList.value
  }
  return activeCategoryTodoList.value.filter(todo => getTodoStatus(todo) === activeTodoStatus.value)
})

const getTodoOriginalIndex = (todo: TodoItem) => {
  const index = props.todoList.indexOf(todo)
  return index > -1 ? index : safeCurrentTodoIndex.value
}

const currentTodoSwiperHeight = computed(() => {
  if (todoStatusTabs.value.length > 1) {
    return Taro.pxTransform(540)
  }
  return Taro.pxTransform(628)
})

const currentQueueContentHeight = computed(() => {
  return Taro.pxTransform(628)
})

watch(todoStatusOrder, (labels) => {
  if (!labels.includes(activeTodoStatus.value)) {
    activeTodoStatus.value = labels[0] || ''
  }
  currentTodoIndex.value = 0
}, { immediate: true })

watch(todoCategoryOrder, (labels) => {
  if (!labels.includes(activeTodoCategory.value)) {
    activeTodoCategory.value = labels.find(label => props.todoList.some(todo => getTodoCategory(todo) === label)) || labels[0] || ''
  }
  currentTodoIndex.value = 0
}, { immediate: true })

watch(visibleTodoList, (list) => {
  if (currentTodoIndex.value >= list.length) {
    currentTodoIndex.value = 0
  }
})

const handleCategoryTabClick = (tab: TodoTabItem) => {
  activeTodoCategory.value = tab.label
  currentTodoIndex.value = 0
}

const handleStatusTabClick = (tab: TodoTabItem) => {
  activeTodoStatus.value = normalizeStatusLabel(tab.label)
  currentTodoIndex.value = 0
}

const handleSwiperChange = (e: any) => {
  if (e.detail.source === 'touch') {
    currentTodoIndex.value = e.detail.current
  }
}

</script>
