<template>
  <div class="yh-secondary-page followup-date-page doctor-home-page" :style="{ paddingTop: contentTop + 'px' }">
    <PortalNavBar title="选择复诊时间" :scroll-top="scrollTop" secondary force-dark-text />

    <view class="doctor-home-page__header followup-date-header">
      <view class="doctor-home-page__profile doctor-card yh-secondary-card">
        <view class="doctor-card__header">
          <image class="doctor-card__avatar" :src="doctor.avatar" :alt="doctor.name" mode="aspectFill" />
          <view class="doctor-card__info">
            <view class="doctor-card__name-row">
              <text class="doctor-card__name">{{ doctor.name }}</text>
              <text class="doctor-card__divider">|</text>
              <view class="doctor-card__dept-follow">
                <text class="doctor-card__dept">{{ deptName }}</text>
                <view
                  class="doctor-card__follow-btn"
                  :class="{ 'is-active': followed }"
                  @tap.stop="followed = !followed"
                >
                  <view v-if="!followed" class="doctor-card__follow-plus" />
                  <text>{{ followed ? '已关注' : '关注' }}</text>
                </view>
              </view>
            </view>
            <view class="doctor-card__tags-row">
              <text class="doctor-card__rank">{{ doctor.title }}</text>
              <text class="doctor-card__type">图文咨询</text>
              <text class="doctor-card__type is-purple">视频问诊</text>
              <text class="doctor-card__type is-cyan">义诊咨询</text>
            </view>
          </view>
        </view>

        <view class="doctor-card__stats-row">
          <view class="doctor-card__stat-item">
            <image class="doctor-card__stat-icon-img" src="https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E9%97%A8%E6%88%B73.0%E5%88%87%E5%9B%BE%E8%B5%84%E6%BA%90/%E9%97%A8%E6%88%B7%E9%A6%96%E9%A1%B5/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%E5%A4%B9/stat_follow.png" mode="aspectFit" />
            <text class="doctor-card__stat-label">问诊量</text>
            <text class="doctor-card__stat-val">{{ doctor.visits || 890 }}</text>
          </view>
          <view class="doctor-card__stat-item">
            <image class="doctor-card__stat-icon-img" src="https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E9%97%A8%E6%88%B73.0%E5%88%87%E5%9B%BE%E8%B5%84%E6%BA%90/%E9%97%A8%E6%88%B7%E9%A6%96%E9%A1%B5/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%E5%A4%B9/stat_score.png" mode="aspectFit" />
            <text class="doctor-card__stat-label">评分</text>
            <text class="doctor-card__stat-val">99</text>
          </view>
          <view class="doctor-card__stat-item">
            <image class="doctor-card__stat-icon-img" src="https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E9%97%A8%E6%88%B73.0%E5%88%87%E5%9B%BE%E8%B5%84%E6%BA%90/%E9%97%A8%E6%88%B7%E9%A6%96%E9%A1%B5/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%E5%A4%B9/stat_volume.png" mode="aspectFit" />
            <text class="doctor-card__stat-label">关注</text>
            <text class="doctor-card__stat-val">{{ doctor.follows || 1850 }}</text>
          </view>
        </view>

        <view class="doctor-card__message">
          <view class="doctor-card__desc-content">
            <text class="portal-home__expert-desc-label">擅长</text>
            <text class="doctor-card__desc-text">{{ doctor.goodAt }}</text>
          </view>
        </view>
      </view>

      <view class="doctor-home-page__date-tabs-wrap">
        <view class="doctor-home-page__date-tabs">
          <view
            v-for="item in displayDateTabs"
            :key="item.id"
            class="doctor-home-page__date-tab"
            :class="{ 'doctor-home-page__date-tab--active': selectedDateId === item.id }"
            @tap="selectDate(item.id)"
          >
            <text class="doctor-home-page__date-week">{{ item.week }}</text>
            <text class="doctor-home-page__date-value">{{ item.date }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="doctor-home-page__main followup-date-main">

      <view
        class="doctor-home-page__schedule-panel"
        :class="{ 'is-active-card': !activeSlot || (!activeSlot.includes('conditioning') && !activeSlot.includes('rehab')) }"
      >
        <view class="doctor-home-page__dept-card">
          <view class="doctor-home-page__dept-head">
            <text>{{ deptName }}</text>
            <view class="doctor-home-page__dept-meta">
              <view>
                <text>诊查费</text>
                <text>{{ servicePrice || doctor?.consultPrice || '¥18.00' }}</text>
              </view>
            </view>
          </view>

          <view class="doctor-home-page__dept-slots">
            <view
              v-for="slot in departmentSlots"
              :key="slot.id"
              class="doctor-home-page__dept-slot"
              :class="{
                'doctor-home-page__dept-slot--active': activeSlot === slot.id,
                'doctor-home-page__dept-slot--disabled': slot.full
              }"
              :hover-class="slot.full ? 'none' : 'doctor-home-page__dept-slot--hover'"
              :hover-stay-time="150"
              @tap="selectSlot(slot)"
            >
              <text class="dept-slot-label">{{ formatSlotLabel(slot) }}</text>
            </view>
          </view>
        </view>

        <view
          v-if="!activeSlot || (!activeSlot.includes('conditioning') && !activeSlot.includes('rehab'))"
          class="doctor-home-page__collapsible-body doctor-home-page__collapsible-body--expanded"
        >
          <view class="doctor-home-page__time-slots">
            <view
              v-for="slot in timeSlots"
              :key="slot.id"
              class="doctor-home-page__time-slot"
              :class="{
                'doctor-home-page__time-slot--active': selectedTime?.id === slot.id,
                'doctor-home-page__time-slot--disabled': slot.booked
              }"
              :hover-class="slot.booked ? 'none' : 'doctor-home-page__time-slot--hover'"
              :hover-stay-time="150"
              @tap="selectTime(slot)"
            >
              <text class="time-slot-no">{{ slot.no }}</text>
              <text class="time-slot-time">{{ slot.time }}</text>
            </view>
          </view>
        </view>
      </view>

      <view v-if="hasScheduleSwitch" class="doctor-home-page__switch-card" @tap="toggleOtherDepartments">
        <text>展示本院区其他科室排班</text>
        <view
          class="appointment-mini-switch"
          :class="{ 'appointment-mini-switch--off': !showOtherDepartments }"
        />
      </view>

      <view
        v-if="showOtherDepartments"
        class="doctor-home-page__collapsed-list doctor-home-page__collapsed-list--enter"
      >
        <view
          v-for="dept in extraDepartments"
          :key="dept.id"
          class="doctor-home-page__schedule-panel"
          :class="{ 'is-active-card': activeSlot.includes(dept.id) }"
        >
          <view class="doctor-home-page__dept-card doctor-home-page__dept-card--extra doctor-home-page__dept-card--expanded">
            <view class="doctor-home-page__dept-head">
              <text>{{ dept.name }}</text>
              <view class="doctor-home-page__dept-meta">
                <view>
                  <text>诊查费</text>
                  <text>{{ dept.price }}</text>
                </view>
              </view>
            </view>

            <view class="doctor-home-page__dept-slots">
              <view
                v-for="slot in dept.slots"
                :key="dept.id + slot.id"
                class="doctor-home-page__dept-slot"
                :class="{
                  'doctor-home-page__dept-slot--active': activeSlot === slot.id,
                  'doctor-home-page__dept-slot--disabled': slot.full
                }"
                :hover-class="slot.full ? 'none' : 'doctor-home-page__dept-slot--hover'"
                :hover-stay-time="150"
                @tap="selectSlot(slot)"
              >
                <text class="dept-slot-label">{{ formatSlotLabel(slot) }}</text>
              </view>
            </view>
          </view>

          <view
            v-if="activeSlot.includes(dept.id)"
            class="doctor-home-page__collapsible-body doctor-home-page__collapsible-body--expanded"
          >
            <view class="doctor-home-page__time-slots">
              <view
                v-for="slot in timeSlots"
                :key="slot.id"
                class="doctor-home-page__time-slot"
                :class="{
                  'doctor-home-page__time-slot--active': selectedTime?.id === slot.id,
                  'doctor-home-page__time-slot--disabled': slot.booked
                }"
                :hover-class="slot.booked ? 'none' : 'doctor-home-page__time-slot--hover'"
                :hover-stay-time="150"
                @tap="selectTime(slot)"
              >
                <text class="time-slot-no">{{ slot.no }}</text>
                <text class="time-slot-time">{{ slot.time }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

    </view>

    <view class="doctor-home-page__fixed">
      <view class="doctor-home-page__fixed-info">
        <view>
          <text>复诊时间</text>
          <text>{{ selectedAppointmentDate }}</text>
        </view>
        <view>
          <text>诊查费</text>
          <text>{{ feeText }}</text>
        </view>
      </view>
      <view class="doctor-home-page__submit" @tap="goNext">
        <text>下一步</text>
      </view>
    </view>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Taro, { usePageScroll, useRouter, useDidShow } from '@tarojs/taro'
import PortalNavBar from '@/components/PortalNavBar/index.vue'
import { getSafeMenuButtonBoundingClientRect } from '@/utils'
import { useAppStore } from '@/store'
import {
  dateTabs,
  doctors,
  generateDynamicTimeSlots,
  getSessionRemainingCount,
  createRandom,
  getDoctorDepartments
} from '@/pages/appointment/mock'
import './date-select.less'

const router = useRouter()
const menuButtonInfo = getSafeMenuButtonBoundingClientRect()
const contentTop = menuButtonInfo.bottom + 16
const scrollTop = ref(0)

usePageScroll(({ scrollTop: pageScrollTop }) => {
  scrollTop.value = pageScrollTop
})

function readParam(name: string, fallback = '') {
  const raw = router.params[name]
  if (!raw) return fallback
  try {
    return decodeURIComponent(raw)
  } catch (e) {
    return raw
  }
}

const doctorId = computed(() => {
  const id = readParam('doctorId', doctors[0]?.id || '')
  return id === 'doc-yang-xuecheng' ? 'song-yuanlin' : id
})
const doctor = computed(() => doctors.find(item => item.id === doctorId.value) || doctors[0])
const deptName = computed(() => readParam('deptName', doctor.value?.department || '非病毒性肝病科'))
const serviceName = computed(() => readParam('serviceName', '在线复诊'))
const servicePrice = computed(() => readParam('servicePrice', '¥18.00'))
const feeText = computed(() => {
  if (activeSlot.value) {
    if (activeSlot.value.includes('rehab')) return '¥50.00'
    if (activeSlot.value.includes('conditioning')) return '¥30.00'
  }
  return servicePrice.value || doctor.value?.consultPrice || '¥18.00'
})
const followed = ref(false)
const departmentId = computed(() => readParam('departmentId', 'classic'))

const store = useAppStore()

useDidShow(() => {
  store.syncFromStorage()
})

const showOtherDepartments = computed({
  get: () => !!store.showOtherDeptsMap[doctorId.value],
  set: (val) => {
    store.showOtherDeptsMap[doctorId.value] = val
    store.saveToStorage()
  }
})

function toggleOtherDepartments() {
  showOtherDepartments.value = !showOtherDepartments.value
}

if (departmentId.value && departmentId.value !== 'classic') {
  showOtherDepartments.value = true
}

const displayDateTabs = dateTabs.filter(item => item.id !== 'all')
const selectedDateId = ref(readParam('dateId', displayDateTabs[0]?.id || '05-26'))
const activeSlot = ref('')
const activeTimeId = ref('')

const hasScheduleSwitch = computed(() => {
  const dept = deptName.value
  const dateId = selectedDateId.value

  let list = doctors.map(d => {
    return {
      ...d,
      department: dept,
      clinic: dept
    }
  })

  list = list.filter(d => d.remain > 0)

  if (dateId && dateId !== 'all') {
    const rng = createRandom(`${dept}-${dateId}`)
    const shuffled = rng.shuffle(list)
    const count = rng.nextInt(5, 8)
    list = shuffled.slice(0, count)
  }

  if (list.length === 0) return false

  const switchRng = createRandom(`${dept}-${dateId}-switch`)
  const indices = Array.from({ length: list.length }, (_, i) => i)
  const shuffledIndices = switchRng.shuffle(indices)
  const selectedIndices = shuffledIndices.slice(0, Math.min(3, list.length))
  const selectedIds = selectedIndices.map(index => list[index].id)

  return selectedIds.includes(doctorId.value)
})

const extraDepartments = computed(() => {
  if (!hasScheduleSwitch.value) return []

  const campus = doctor.value?.campus || '金山院区'
  const list = getDoctorDepartments(doctor.value, campus)
  return list.filter(d => d.id !== 'classic').map(d => {
    const dateTab = displayDateTabs.find(t => t.id === selectedDateId.value) || displayDateTabs[0]
    const dateStr = dateTab.date

    const amRemain = getSessionRemainingCount(doctorId.value, campus, d.id, dateStr, 'am')
    const pmRemain = getSessionRemainingCount(doctorId.value, campus, d.id, dateStr, 'pm')

    const campusPrefix = campus === '西洪院区' ? 'xihong-' : ''
    const amId = `${doctorId.value}-${campusPrefix}${d.id}-${dateStr}-am`
    const pmId = `${doctorId.value}-${campusPrefix}${d.id}-${dateStr}-pm`

    return {
      id: d.id,
      name: d.name,
      price: d.id === 'rehab' ? '¥50.00' : '¥30.00',
      remain: amRemain + pmRemain,
      slots: [
        {
          id: amId,
          time: '上午',
          price: amRemain === 0 ? '已约满' : `余${amRemain}`,
          full: amRemain === 0
        },
        {
          id: pmId,
          time: '下午',
          price: pmRemain === 0 ? '已约满' : `余${pmRemain}`,
          full: pmRemain === 0
        }
      ]
    }
  })
})

function getDateSlot(period: 'am' | 'pm') {
  const date = selectedDate.value || displayDateTabs[0]
  const campus = doctor.value?.campus || '金山院区'
  const remain = getSessionRemainingCount(doctorId.value, campus, departmentId.value, date.date, period)
  const campusPrefix = campus === '西洪院区' ? 'xihong-' : ''
  let deptPrefix = ''
  if (departmentId.value === 'conditioning') {
    deptPrefix = 'conditioning-'
  } else if (departmentId.value === 'rehab') {
    deptPrefix = 'rehab-'
  }
  const slotId = `${doctorId.value}-${campusPrefix}${deptPrefix}${date.date}-${period}`
  return {
    id: slotId,
    time: `${date.date} ${date.week} ${period === 'am' ? '上午' : '下午'}`,
    price: remain === 0 ? '已约满' : `剩余${remain}`,
    full: remain === 0
  }
}

const departmentSlots = computed(() => [getDateSlot('am'), getDateSlot('pm')])

const timeSlots = computed(() => {
  const slot = activeSlot.value || departmentSlots.value.find(item => !item.full)?.id || departmentSlots.value[0]?.id || ''
  let deptId = departmentId.value
  if (slot.includes('rehab')) {
    deptId = 'rehab'
  } else if (slot.includes('conditioning')) {
    deptId = 'conditioning'
  } else if (slot.includes('classic')) {
    deptId = 'classic'
  }
  return generateDynamicTimeSlots(slot, doctor.value?.campus === '西洪院区', deptId)
})

const selectedDate = computed(() => {
  return displayDateTabs.find(item => item.id === selectedDateId.value) || displayDateTabs[0]
})

const selectedTime = computed(() => {
  return timeSlots.value.find(item => item.id === activeTimeId.value) || timeSlots.value.find(item => !item.booked) || timeSlots.value[0]
})

const selectedAppointmentTime = computed(() => {
  const allSlots = [
    ...departmentSlots.value,
    ...(extraDepartments.value.reduce<any[]>((arr, dept) => arr.concat(dept.slots), []))
  ]
  const session = allSlots.find(item => item.id === activeSlot.value) || departmentSlots.value.find(item => !item.full) || departmentSlots.value[0]
  if (!session || !selectedTime.value) return ''

  let timeLabel = session.time
  if (!timeLabel.includes('05-') && !timeLabel.includes('06-')) {
    const dateTab = displayDateTabs.find(t => t.id === selectedDateId.value) || displayDateTabs[0]
    timeLabel = `${dateTab.date} ${dateTab.week} ${session.time}`
  }
  return `${timeLabel} ${selectedTime.value.time}`
})

const selectedAppointmentDate = computed(() => {
  const allSlots = [
    ...departmentSlots.value,
    ...(extraDepartments.value.reduce<any[]>((arr, dept) => arr.concat(dept.slots), []))
  ]
  const session = allSlots.find(item => item.id === activeSlot.value) || departmentSlots.value.find(item => !item.full) || departmentSlots.value[0]
  if (!session) return ''

  let timeLabel = session.time
  if (!timeLabel.includes('05-') && !timeLabel.includes('06-')) {
    const dateTab = displayDateTabs.find(t => t.id === selectedDateId.value) || displayDateTabs[0]
    timeLabel = `${dateTab.date} ${dateTab.week} ${session.time}`
  }
  return timeLabel
})

function formatSlotLabel(slot: any) {
  const period = slot.time.includes('上午') ? '上午' : '下午'
  if (slot.full || slot.price === '已约满') return `${period}(已约满)`
  const match = slot.price.match(/\d+/)
  return `${period}(剩余${match ? match[0] : slot.price})`
}

function selectDate(dateId: string) {
  selectedDateId.value = dateId
  let nextSlot = null
  if (activeSlot.value) {
    const deptId = activeSlot.value.includes('rehab') ? 'rehab' : (activeSlot.value.includes('conditioning') ? 'conditioning' : 'classic')
    const campus = doctor.value?.campus || '金山院区'
    const dateTab = displayDateTabs.find(t => t.id === dateId) || displayDateTabs[0]

    const period = activeSlot.value.endsWith('-pm') ? 'pm' : 'am'
    const remain = getSessionRemainingCount(doctorId.value, campus, deptId, dateTab.date, period)
    if (remain > 0) {
      const campusPrefix = campus === '西洪院区' ? 'xihong-' : ''
      const deptPrefix = deptId === 'classic' ? '' : `${deptId}-`
      nextSlot = { id: `${doctorId.value}-${campusPrefix}${deptPrefix}${dateTab.date}-${period}` }
    }
  }

  if (!nextSlot) {
    nextSlot = departmentSlots.value.find(item => !item.full) || departmentSlots.value[0]
  }
  activeSlot.value = nextSlot?.id || ''
  activeTimeId.value = ''
}

function selectSlot(slot: any) {
  if (slot.full) {
    Taro.showToast({ title: '该时段已约满', icon: 'none' })
    return
  }
  activeSlot.value = slot.id
  activeTimeId.value = ''
  scrollToActiveSlot()
}

function scrollToActiveSlot() {
  setTimeout(() => {
    const query = Taro.createSelectorQuery()
    query.select('.is-active-card').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec((res) => {
      if (res && res[0] && res[1]) {
        const cardRect = res[0]
        const scrollInfo = res[1]
        const systemInfo = Taro.getSystemInfoSync()
        const windowHeight = systemInfo.windowHeight
        const navHeight = menuButtonInfo.bottom + 8 // top nav height

        const visibleHeight = windowHeight - navHeight
        const cardHeight = cardRect.height
        const absoluteTop = cardRect.top + scrollInfo.scrollTop

        let targetScrollTop = absoluteTop - navHeight
        if (visibleHeight > cardHeight) {
          // Center the card vertically in the remaining space below the navigation bar
          targetScrollTop = absoluteTop - navHeight - (visibleHeight - cardHeight) / 2
        }

        Taro.pageScrollTo({
          scrollTop: Math.max(0, targetScrollTop),
          duration: 300
        })
      } else {
        Taro.pageScrollTo({
          selector: '.is-active-card',
          duration: 300,
          offsetTop: -90
        })
      }
    })
  }, 120)
}

function selectTime(slot: any) {
  if (slot.booked) {
    Taro.showToast({ title: '该号源已被预约', icon: 'none' })
    return
  }
  activeTimeId.value = slot.id
}

selectDate(selectedDateId.value)

const initialSlotId = readParam('slotId', '')
if (initialSlotId) {
  const allSlots = [
    ...departmentSlots.value,
    ...(extraDepartments.value.reduce<any[]>((arr, dept) => arr.concat(dept.slots), []))
  ]
  const matchingSlot = allSlots.find(item => item.id === initialSlotId)
  if (matchingSlot && !matchingSlot.full) {
    activeSlot.value = initialSlotId
  }
}

if (initialSlotId || (departmentId.value && departmentId.value !== 'classic')) {
  scrollToActiveSlot()
}

function goNext() {
  let selectedDeptId = departmentId.value
  if (activeSlot.value.includes('rehab')) {
    selectedDeptId = 'rehab'
  } else if (activeSlot.value.includes('conditioning')) {
    selectedDeptId = 'conditioning'
  } else if (activeSlot.value.includes('classic')) {
    selectedDeptId = 'classic'
  }

  let selectedDeptName = deptName.value
  if (selectedDeptId !== 'classic') {
    const list = getDoctorDepartments(doctor.value, doctor.value?.campus || '金山院区')
    const matched = list.find(d => d.id === selectedDeptId)
    if (matched) {
      selectedDeptName = matched.name
    }
  }

  const query = [
    `appointmentTime=${encodeURIComponent(selectedAppointmentTime.value)}`,
    `doctorId=${encodeURIComponent(doctorId.value)}`,
    `doctorName=${encodeURIComponent(doctor.value?.name || '')}`,
    `deptName=${encodeURIComponent(selectedDeptName)}`,
    `serviceName=${encodeURIComponent(serviceName.value)}`,
    `servicePrice=${encodeURIComponent(feeText.value)}`
  ].join('&')

  Taro.navigateTo({
    url: `/pages/common-list/online-followup/index?${query}`,
    fail(err) {
      console.error('navigateTo online followup failed, pages:', getCurrentPages().length, err)
    }
  })
}
</script>
