<template>
  <view
    class="yh-secondary-page appointment-flow-page doctor-list-page"
    :class="{ 'is-consult': isConsultMode }"
    :style="{ paddingTop: contentTop + 'px' }"
  >
    <PortalNavBar :title="pageTitle" :scroll-top="scrollTop" secondary />

    <view class="appointment-page-header doctor-list-page__header">
      <view v-if="isSticky" class="doctor-list-page__date-tabs-placeholder" />
      <view
        class="doctor-list-page__date-tabs-wrap"
        :class="{ 'is-sticky': isSticky }"
        :style="stickyStyle"
      >
        <view class="doctor-list-page__date-tabs">
          <view
            v-for="item in displayedDateTabs"
            :key="item.id"
            class="doctor-list-page__date-tab"
            :class="{ 'doctor-list-page__date-tab--active': item.id === activeDateId }"
            @tap="handleDateTabTap(item.id)"
          >
            <text v-if="item.id === 'all' || !isSticky" class="doctor-list-page__date-week">{{ item.week }}</text>
            <text v-if="item.date" class="doctor-list-page__date-value">{{ item.date }}</text>
          </view>
        </view>
      </view>

      <view class="doctor-list-page__filter" @tap="showOnlyAvailable = !showOnlyAvailable">
        <text>只显示当前科室有号的医生</text>
        <view
          class="appointment-mini-switch"
          :class="{ 'appointment-mini-switch--off': !showOnlyAvailable }"
        />
      </view>
    </view>

    <view class="yh-secondary-content appointment-content doctor-list-page__content">
      <view class="doctor-list-page__cards">
        <view
          v-for="doctor in filteredDoctors"
          :key="doctor.id"
          class="appointment-card doctor-list-page__card"
          hover-class="doctor-list-page__card--pressed"
          :hover-start-time="0"
          :hover-stay-time="100"
          @tap="goDetail(doctor)"
        >
          <view class="doctor-card__header">
            <image class="doctor-card__avatar" :src="doctor.avatar" :alt="doctor.name" mode="aspectFit" />
            <view class="doctor-card__info">
              <view class="doctor-card__name-row">
                <text class="doctor-card__name">{{ doctor.name }}</text>
                <text class="doctor-card__divider">|</text>
                <text class="doctor-card__dept">{{ doctor.department }}</text>
              </view>
              <view class="doctor-card__tags-row">
                <text class="doctor-card__rank">{{ doctor.title }}</text>
                <text
                  v-for="tag in (doctor.gender === 'male' ? ['图文咨询', '视频问诊', '义诊咨询'] : ['图文咨询', '视频问诊'])"
                  :key="tag"
                  class="doctor-card__type"
                  :class="{ 'is-purple': tag === '视频问诊', 'is-cyan': tag === '义诊咨询' }"
                >
                  {{ tag }}
                </text>
              </view>
            </view>
          </view>

          <!-- Statistics Row -->
          <view v-if="isConsultMode" class="doctor-card__stats-row">
            <view class="doctor-card__stat-item">
              <image class="doctor-card__stat-icon-img" :src="statFollowIcon" mode="aspectFit" />
              <text class="doctor-card__stat-label">问诊量</text>
              <text class="doctor-card__stat-val">{{ doctor.visits }}</text>
            </view>
            <view class="doctor-card__stat-item">
              <image class="doctor-card__stat-icon-img" :src="statScoreIcon" mode="aspectFit" />
              <text class="doctor-card__stat-label">评分</text>
              <text class="doctor-card__stat-val">99</text>
            </view>
            <view class="doctor-card__stat-item">
              <image class="doctor-card__stat-icon-img" :src="statConsultIcon" mode="aspectFit" />
              <text class="doctor-card__stat-label">关注</text>
              <text class="doctor-card__stat-val">{{ doctor.follows }}</text>
            </view>
          </view>

          <view class="doctor-card__message">
            <view v-if="(doctor.goodAt || '').length + 2 > 50" class="doctor-card__desc-float-spacer" />
            <text v-if="(doctor.goodAt || '').length + 2 > 50" class="doctor-card__desc-detail-btn" @tap.stop="showDoctorIntro(doctor)">详情</text>
            <view class="doctor-card__desc-content">
              <text class="portal-home__expert-desc-label">擅长</text>
              <text class="doctor-card__desc-text">{{ doctor.goodAt }}</text>
            </view>
          </view>

          <view v-if="!isConsultMode" class="doctor-list-page__schedule-card">
            <view class="doctor-list-page__dept">
              <view v-if="hasSwitch(doctor.id)" class="doctor-list-page__switch-card">
                <text>展示本院区其他科室排班</text>
                <view
                  class="appointment-mini-switch"
                  :class="{ 'appointment-mini-switch--off': !isAllDepartmentsVisible(doctor.id) }"
                  @tap.stop="toggleAllDepartments(doctor.id)"
                />
              </view>
              <view
                v-for="department in getVisibleDepartments(doctor.id)"
                :key="doctor.id + department.id"
                class="doctor-list-page__department"
              >
                <view v-if="hasSwitch(doctor.id) && isAllDepartmentsVisible(doctor.id)" class="doctor-list-page__dept-title">
                  <text>{{ department.name }}</text>
                </view>

                <view
                  v-for="group in getDeptSchedule(doctor.id, department)"
                  :key="doctor.id + department.id + group.id"
                  class="doctor-list-page__slot-row"
                  :class="{ 'doctor-list-page__slot-row--two-cols': activeDateId !== 'all' }"
                >
                  <view
                    v-for="slot in group.items"
                    :key="doctor.id + department.id + slot.id"
                    class="appointment-chip"
                    :class="{
                      'appointment-chip--active': isSlotActive(doctor.id, department.id, slot),
                      'appointment-chip--disabled': slot.full
                    }"
                    :hover-class="slot.full ? 'none' : 'appointment-chip--hover'"
                    :hover-stay-time="150"
                    @tap.stop="handleScheduleTap(doctor.id, department.id, slot)"
                  >
                    <text class="appointment-chip-label">{{ formatSlotLabel(slot) }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <PortalInspectionNoticePopup
      v-if="showIntroDialog"
      theme="green"
      :title="dialogTitle"
      :items="dialogMessage"
      @confirm="showIntroDialog = false"
    />
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Taro, { usePageScroll, useDidShow } from '@tarojs/taro'
import PortalNavBar from '@/components/PortalNavBar/index.vue'
import PortalInspectionNoticePopup from '@/components/PortalInspectionNoticePopup/index.vue'
import { getSafeMenuButtonBoundingClientRect } from '@/utils'
import { useAppStore } from '@/store'

const store = useAppStore()

useDidShow(() => {
  store.syncFromStorage()
})

function getRouteUrl(url: string): string {
  const routerParams = Taro.getCurrentInstance().router?.params
  if (routerParams?.mode === 'consult') {
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}mode=consult`
  }
  return url
}

import {
  campusTabs,
  dateTabs,
  doctors,
  routeMap,
  getDoctorDepartments as getDoctorDeptSchedule,
  createRandom,
  getSessionRemainingCount
} from '../mock'
import '../common.less'
import './index.less'

const statConsultIcon = 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E9%97%A8%E6%88%B73.0%E5%88%87%E5%9B%BE%E8%B5%84%E6%BA%90/%E9%97%A8%E6%88%B7%E9%A6%96%E9%A1%B5/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%E5%A4%B9/stat_volume.png'
const statScoreIcon = 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E9%97%A8%E6%88%B73.0%E5%88%87%E5%9B%BE%E8%B5%84%E6%BA%90/%E9%97%A8%E6%88%B7%E9%A6%96%E9%A1%B5/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%E5%A4%B9/stat_score.png'
const statFollowIcon = 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E9%97%A8%E6%88%B73.0%E5%88%87%E5%9B%BE%E8%B5%84%E6%BA%90/%E9%97%A8%E6%88%B7%E9%A6%96%E9%A1%B5/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%E5%A4%B9/stat_follow.png'

const menuButtonInfo = getSafeMenuButtonBoundingClientRect()
const contentTop = menuButtonInfo.bottom + 16
const scrollTop = ref(0)

const pageTitle = computed(() => {
  const routerParams = Taro.getCurrentInstance().router?.params
  const dept = routerParams?.department
  if (!dept) return '非病毒性肝病科'
  try {
    return decodeURIComponent(dept)
  } catch (e) {
    return dept
  }
})

const isConsultMode = computed(() => {
  const routerParams = Taro.getCurrentInstance().router?.params
  return routerParams?.mode === 'consult'
})

const showOnlyAvailable = ref(true)

const displayedDateTabs = computed(() => dateTabs.filter(t => t.id !== 'all'))
const activeDateId = ref(dateTabs.find(t => t.id !== 'all')?.id || dateTabs[0].id)

const filteredDoctors = computed(() => {
  const dept = pageTitle.value
  const queryParams = Taro.getCurrentInstance().router?.params
  const searchKw = queryParams?.search ? decodeURIComponent(queryParams.search) : ''

  // All 10 doctors are present in any department, dynamically mapped
  let list = doctors.map(d => {
    return {
      ...d,
      department: dept || d.department,
      clinic: dept || d.clinic
    }
  })

  if (searchKw) {
    list = list.filter(d => d.name.includes(searchKw) || d.department.includes(searchKw))
  }

  if (showOnlyAvailable.value) {
    list = list.filter(doctor => doctor.remain > 0)
  }

  if (activeDateId.value !== 'all') {
    const rng = createRandom(`${dept || 'default'}-${activeDateId.value}`)
    const shuffled = rng.shuffle(list)
    // Dynamic selection of 5 to 8 doctors
    const count = rng.nextInt(5, 8)
    list = shuffled.slice(0, count)
  }

  return list
})

const doctorsWithSwitch = computed(() => {
  const list = filteredDoctors.value
  if (list.length === 0) return new Set<string>()

  const dept = pageTitle.value
  const dateId = activeDateId.value
  const rng = createRandom(`${dept || 'default'}-${dateId}-switch`)

  const indices = Array.from({ length: list.length }, (_, i) => i)
  const shuffledIndices = rng.shuffle(indices)

  const selectedIndices = shuffledIndices.slice(0, Math.min(3, list.length))
  const ids = selectedIndices.map(index => list[index].id)
  return new Set(ids)
})

function hasSwitch(doctorId: string) {
  return doctorsWithSwitch.value.has(doctorId)
}
function getDoctorDepartments(doctorId: string) {
  const doc = filteredDoctors.value.find(d => d.id === doctorId) || doctors.find(d => d.id === doctorId)
  const selectedCampus = getSelectedCampus(doctorId)
  if (doc) {
    return getDoctorDeptSchedule(doc, selectedCampus)
  }
  return []
}

function handleDateTabTap(id: string) {
  if (activeDateId.value === id) return
  activeDateId.value = id
}

usePageScroll(({ scrollTop: pageScrollTop }) => {
  scrollTop.value = pageScrollTop
})

const isSticky = computed(() => scrollTop.value > 16)
const stickyStyle = computed(() => {
  if (!isSticky.value) return {}
  return {
    position: 'fixed',
    top: (menuButtonInfo.bottom + 8) + 'px',
    left: 0,
    right: 0,
    padding: `${Taro.pxTransform(16)} 0`,
    background: 'transparent',
    zIndex: 99,
    boxSizing: 'border-box'
  }
})

function getSelectedCampus(doctorId: string) {
  return doctors.find(doctor => doctor.id === doctorId)?.campus || campusTabs[0]
}

function isAllDepartmentsVisible(doctorId: string) {
  return !!store.showOtherDeptsMap[doctorId]
}

function toggleAllDepartments(doctorId: string) {
  store.showOtherDeptsMap[doctorId] = !store.showOtherDeptsMap[doctorId]
  store.saveToStorage()
}

function getVisibleDepartments(doctorId: string) {
  const depts = getDoctorDepartments(doctorId)
  if (hasSwitch(doctorId) && isAllDepartmentsVisible(doctorId)) {
    return depts
  }

  return depts.slice(0, 1)
}

function getDeptSchedule(doctorId: string, department: any) {
  if (activeDateId.value === 'all') {
    return department.schedule
  }

  const dateTab = dateTabs.find(t => t.id === activeDateId.value)
  if (!dateTab) return []

  const dateStr = dateTab.date
  const weekStr = dateTab.week

  let deptPrefix = ''
  if (department.id === 'conditioning') {
    deptPrefix = 'conditioning-'
  } else if (department.id === 'rehab') {
    deptPrefix = 'rehab-'
  }

  const selectedCampus = getSelectedCampus(doctorId)
  const isXihong = selectedCampus === '西洪院区'
  const campusPrefix = isXihong ? 'xihong-' : ''

  const amBaseId = `${campusPrefix}${deptPrefix}${dateStr}-am`
  const pmBaseId = `${campusPrefix}${deptPrefix}${dateStr}-pm`

  const amSlotId = `${doctorId}-${amBaseId}`
  const pmSlotId = `${doctorId}-${pmBaseId}`

  const amRemain = getSessionRemainingCount(doctorId, selectedCampus, department.id, dateStr, 'am')
  const pmRemain = getSessionRemainingCount(doctorId, selectedCampus, department.id, dateStr, 'pm')

  const morningSlot = {
    id: amSlotId,
    time: `${dateStr} ${weekStr} 上午`,
    price: amRemain === 0 ? '已约满' : `余${amRemain}`,
    full: amRemain === 0
  }

  const afternoonSlot = {
    id: pmSlotId,
    time: `${dateStr} ${weekStr} 下午`,
    price: pmRemain === 0 ? '已约满' : `余${pmRemain}`,
    full: pmRemain === 0
  }

  return [
    {
      id: 'active-date-slots',
      period: '号源',
      items: [morningSlot, afternoonSlot]
    }
  ]
}

function formatSlotLabel(slot: any) {
  const isMorning = slot.time.includes('上午')
  const period = isMorning ? '上午' : '下午'

  if (slot.full || slot.price === '已约满') {
    return `${period}(已约满)`
  }

  const match = slot.price.match(/\d+/)
  const count = match ? match[0] : ''
  if (count) {
    return `${period}(剩余${count})`
  }

  return `${period}(${slot.price})`
}

function isSlotActive(
  doctorId: string,
  departmentId: string,
  slot: any
) {
  if (activeDateId.value === 'all') {
    return slot.active
  }
  return slot.id.includes(activeDateId.value)
}

function handleScheduleTap(
  doctorId: string,
  departmentId: string,
  slot: any
) {
  if (slot.full) {
    Taro.showToast({
      title: '该号源已约满',
      icon: 'none'
    })
    return
  }

  if (isConsultMode.value) {
    const doc = doctors.find(d => d.id === doctorId)
    if (doc) {
      const depts = getDoctorDepartments(doctorId)
      const dept = depts.find(d => d.id === departmentId)
      const deptName = dept ? dept.name : pageTitle.value
      goConsult(doc, slot.id, departmentId, deptName)
    }
    return
  }

  const selectedCampus = getSelectedCampus(doctorId)
  const query = [
    'mode=register',
    `doctorId=${encodeURIComponent(doctorId)}`,
    `departmentId=${encodeURIComponent(departmentId)}`,
    `slotId=${encodeURIComponent(slot.id)}`,
    `campus=${encodeURIComponent(selectedCampus)}`,
    `deptName=${encodeURIComponent(pageTitle.value)}`,
    `dateId=${encodeURIComponent(activeDateId.value)}`
  ].join('&')

  Taro.navigateTo({ url: getRouteUrl(`${routeMap.detail}?${query}`) })
}

function goDetail(doctor: typeof doctors[number]) {
  if (isConsultMode.value) {
    goConsult(doctor)
    return
  }

  const selectedCampus = getSelectedCampus(doctor.id)
  const dateId = activeDateId.value
  let targetSlotId = ''
  let targetDeptId = 'classic'

  if (dateId !== 'all') {
    const primaryDepts = getDoctorDepartments(doctor.id)
    let found = false

    // Check primary department slots first
    const primaryDept = primaryDepts.find(d => d.id === 'classic')
    if (primaryDept) {
      const slots = primaryDept.schedule.reduce<any[]>((items, group) => items.concat(group.items), [])
      const matched = slots.find(s => s.id.includes(dateId) && !s.full)
      if (matched) {
        targetSlotId = matched.id
        targetDeptId = 'classic'
        found = true
      }
    }

    // If not found in primary, search other departments only if the switch is ON
    if (!found && isAllDepartmentsVisible(doctor.id)) {
      for (const dept of primaryDepts) {
        if (dept.id === 'classic') continue
        const slots = dept.schedule.reduce<any[]>((items, group) => items.concat(group.items), [])
        const matched = slots.find(s => s.id.includes(dateId) && !s.full)
        if (matched) {
          targetSlotId = matched.id
          targetDeptId = dept.id
          found = true
          break
        }
      }
    }
  }

  const queryParts = [
    'mode=register',
    `doctorId=${encodeURIComponent(doctor.id)}`,
    `campus=${encodeURIComponent(selectedCampus)}`,
    `deptName=${encodeURIComponent(pageTitle.value)}`,
    `dateId=${encodeURIComponent(activeDateId.value)}`
  ]

  if (targetSlotId) {
    queryParts.push(`slotId=${encodeURIComponent(targetSlotId)}`)
  }
  if (targetDeptId && targetDeptId !== 'classic') {
    queryParts.push(`departmentId=${encodeURIComponent(targetDeptId)}`)
  }

  Taro.navigateTo({ url: getRouteUrl(`${routeMap.detail}?${queryParts.join('&')}`) })
}

function goConsult(doctor: typeof doctors[number], slotId = '', departmentId = '', deptName = '') {
  const selectedCampus = getSelectedCampus(doctor.id)
  const queryParts = [
    'source=online-consult',
    `doctorId=${encodeURIComponent(doctor.id)}`,
    `doctorName=${encodeURIComponent(doctor.name)}`,
    `campus=${encodeURIComponent(selectedCampus)}`,
    `deptName=${encodeURIComponent(deptName || pageTitle.value)}`,
    `dateId=${encodeURIComponent(activeDateId.value)}`,
    `serviceName=${encodeURIComponent('图文问诊')}`,
    `servicePrice=${encodeURIComponent('免费')}`
  ]
  if (slotId) {
    queryParts.push(`slotId=${encodeURIComponent(slotId)}`)
  }
  if (departmentId && departmentId !== 'classic') {
    queryParts.push(`departmentId=${encodeURIComponent(departmentId)}`)
  }

  Taro.navigateTo({
    url: `/pages/common-list/online-followup/index?${queryParts.join('&')}`,
    fail(err) {
      console.error('navigateTo online followup failed, pages:', getCurrentPages().length, err)
    }
  })
}

const showIntroDialog = ref(false)
const dialogTitle = ref('')
const dialogMessage = ref<string[]>([])

function showDoctorIntro(doc: typeof doctors[number]) {
  dialogTitle.value = `${doc.name} 详细介绍`
  if (doc.id === 'song-yuanlin') {
    dialogMessage.value = [
      '宋医生，主任医师，医学博士，博导。现任门急诊部主任，脂肪肝慢病健康管理中心学术带带人。从事相关临床与研究工作三十余年，具有极其丰富的临床诊疗经验。',
      '他擅长运用先进理论辨证施治，尤其在<strong>慢性肝病诊疗</strong>、<strong>肝功能异常</strong>、<strong>调理各类肝炎诊治</strong>及其并发症的诊疗防治方面造诣深厚。',
      '宋医生主张“防治并重、综合调理”的健康管理理念，强调通过调节人体脏腑功能以达到扶正祛邪的效果。他曾主持并参与多项国家级及省部级科研课题，在国内外核心期刊发表学术论文四十余篇，并在业内享有极高的学术声誉与患者口碑。他治学严谨，对待患者耐心细致，深受广大患者的信赖与好评。'
    ]
  } else if (doc.id === 'recent-zhang') {
    dialogMessage.value = [
      '张医生，主任医师，教授，医学硕士，现任皮肤科核心专家。从事皮肤科临床工作十余年，在色素性皮肤病、湿疹、荨麻疹及皮肤屏障修复领域积累了极其丰富的临床经验。',
      '在学术上，她擅长针对<strong>面部皮炎诊疗</strong>、<strong>湿疹荨麻疹</strong>、<strong>皮肤抗衰管理</strong>等进行系统性中西医结合调理与治疗，取得了显著的临床疗效。',
      '张医生特别关注皮肤慢病患者的长期健康管理，倡导“内外兼治”与“科学护肤”的综合干预模式，为患者量身定制护肤、饮食和生活作息的多维度方案。'
    ]
  } else if (doc.id === 'recent-li') {
    dialogMessage.value = [
      '李医生，副主任医师，医学硕士，现任重症肝病科核心专家。从事肝胆外科临床与慢病健康管理工作十五年，擅长各类肝胆胰腺系统疾病的微创手术及综合诊疗。',
      '在学术上，他擅长针对<strong>肝胆肿瘤微创</strong>、<strong>胆囊结石诊治</strong>、<strong>脂肪肝慢病调理</strong>等进行系统性诊疗，取得了显著的临床疗效。',
      '李医生推崇以患者为中心的多学科综合诊疗模式，特别关注重症肝病患者的术后康复与长期随访调理，积累了极佳的患者口碑。'
    ]
  } else {
    const name = doc.name || '医生'
    const title = doc.title || '医师'
    const genderWord = doc.gender === 'female' ? '她' : '他'
    const dept = doc.clinic || doc.department || '本科室'
    const tags = doc.tags && doc.tags.length > 0 ? doc.tags : ['临床诊疗', '健康管理', '慢病调理']
    const tagListHtml = tags.map((t: string) => `<strong>${t}</strong>`).join('、')

    dialogMessage.value = [
      `${name}，${title}，现任本专科核心专家。从事${dept}及慢病健康管理临床工作多年，具有极其丰富的临床诊疗与实践经验。${genderWord}深研临床医学，主张“以患者为中心”的施治原则。`,
      `在学术与临床上，${genderWord}擅长针对${tagListHtml}等进行系统性调理与治疗，取得了显著的疗效。`,
      `${name}医生特别关注患者的长期健康管理，倡导“防重于治”与“身心共治”的综合干预模式，根据患者体质提供饮食、运动和日常调养的多维度方案。${genderWord}治学严谨，对待患者耐心细致，深受广大患者的信赖与好评。`
    ]
  }
  showIntroDialog.value = true
}

</script>
