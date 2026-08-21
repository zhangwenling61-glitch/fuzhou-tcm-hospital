<template>
  <view
    v-if="isConsultMode"
    class="online-consult-home"
  >
    <PortalNavBar
      title=""
      :scroll-top="consultScrollTop"
      secondary
      nav-background="#ECF6E7"
    />

    <scroll-view
      class="online-consult-home__scroll"
      scroll-y
      @scroll="handleConsultScroll"
    >
      <view class="online-consult-home__hero">
        <image class="online-consult-home__banner" :src="consultBannerUrl" mode="widthFix" />
        <view class="online-consult-home__hero-copy">
          <text class="online-consult-home__hero-title">在线问诊 便捷复诊</text>
          <text class="online-consult-home__hero-subtitle">中医辨证·顺丰送药·全程可追溯</text>
        </view>
      </view>

      <view class="online-consult-home__content">
        <view class="online-consult-home__featured-grid">
          <button
            v-for="dept in featuredConsultDepartments"
            :key="dept.id"
            class="online-consult-home__featured-card"
            type="button"
            hover-class="online-consult-home__card--pressed"
            :hover-start-time="0"
            :hover-stay-time="120"
            @tap="handleConsultDeptTap(dept.name)"
          >
            <view class="online-consult-home__featured-icon-wrap">
              <image class="online-consult-home__featured-icon" :src="dept.icon" mode="aspectFit" />
            </view>
            <text class="online-consult-home__featured-name">{{ dept.name }}</text>
          </button>
        </view>

        <view class="online-consult-home__dept-grid">
          <button
            v-for="dept in regularConsultDepartments"
            :key="dept.id"
            class="online-consult-home__dept-card"
            type="button"
            hover-class="online-consult-home__card--pressed"
            :hover-start-time="0"
            :hover-stay-time="120"
            @tap="handleConsultDeptTap(dept.name)"
          >
            <view class="online-consult-home__dept-icon-wrap">
              <image class="online-consult-home__dept-icon" :src="dept.icon" mode="aspectFit" />
            </view>
            <text class="online-consult-home__dept-name">{{ dept.name }}</text>
          </button>
        </view>

        <view class="online-consult-home__notice">
          <view class="online-consult-home__notice-header">
            <image class="online-consult-home__notice-icon" :src="consultNoticeIconUrl" mode="aspectFit" />
            <text class="online-consult-home__notice-title">温馨提示</text>
          </view>
          <text class="online-consult-home__notice-text">急症、重症请直接前往线下医院急诊科；本服务仅适用于常见病与慢性病复诊。</text>
        </view>
      </view>
    </scroll-view>
  </view>

  <view
    v-else
    class="yh-secondary-page department-page"
    :class="{ 'yh-scroll-locked': isSearching }"
    :style="{ paddingTop: contentTop + 'px' }"
  >
    <PortalNavBar
      title="选择科室"
      :scroll-top="scrollTop"
      secondary
    />

    <view class="department-page__top-row">
      <view class="department-page__search-wrap" :class="{ 'is-searching': isSearching }">
        <button class="department-page__search-pill" :class="{ 'is-active': isSearching }" type="button" @tap="startSearch">
          <image class="department-page__search-icon" :src="iconSearch" mode="aspectFit" />
          <input
            v-if="isSearching"
            class="department-page__search-input"
            type="text"
            v-model="searchQuery"
            placeholder="请输入科室或医生姓名"
            confirm-type="search"
            :focus="isSearching"
            @confirm="onSearchConfirm"
            @tap.stop="() => {}"
          />
          <text v-else>搜一搜</text>
        </button>
        <text class="department-page__search-cancel" :class="{ 'is-visible': isSearching }" @tap.stop="cancelSearch">取消</text>
      </view>

      <block v-if="!isSearching">
        <view v-if="recentDoctors.length > 0" class="department-page__recent-capsule">
          <button
            class="recent-capsule__left-btn"
            type="button"
            @tap="handleDoctorTap(recentDoctors[0])"
          >
            <view class="recent-capsule__avatar">
              <image :src="recentDoctors[0].avatar" mode="aspectFill" />
            </view>
            <view class="recent-capsule__info">
              <text class="recent-capsule__name">{{ recentDoctors[0].name }}</text>
              <text class="recent-capsule__dept">{{ recentDoctors[0].department }}</text>
            </view>
          </button>
          <button
            class="recent-capsule__right-btn"
            type="button"
            @tap="handleMoreDoctors"
          >
            <view class="recent-capsule__more-text">
              <text>更多最近</text>
              <text>就诊医生</text>
            </view>
            <view class="recent-capsule__more-arrow" />
          </button>
        </view>
      </block>
    </view>

    <view
      v-if="!isSearching"
      class="department-page__ai-triage"
      @tap="handleAITriage"
    >
      <image class="ai-triage__icon" :src="iconAITriage" mode="aspectFit" />
      <swiper
        class="ai-triage__carousel"
        :vertical="true"
        :autoplay="true"
        :interval="2000"
        :circular="true"
        :duration="300"
      >
        <swiper-item v-for="(text, index) in triageTexts" :key="index" class="ai-triage__carousel-item">
          <span>{{ text }}</span>
        </swiper-item>
      </swiper>
      <view class="ai-triage__right">
        <text class="ai-triage__link">智能导诊帮助你</text>
        <view class="ai-triage__arrow" />
      </view>
    </view>

    <!-- 全屏毛玻璃搜索遮罩 (仅在激活搜索状态下显示) -->
    <view
      v-if="isSearching"
      class="department-page__search-mask"
      :style="{ paddingTop: (menuButtonInfo.bottom + 54) + 'px' }"
      @tap="cancelSearch"
      @touchmove.stop.prevent="() => {}"
    >
      <scroll-view class="search-result-page__scroll" :scroll-y="true" @tap.stop="() => {}">
        <view class="department-page__search-suggests search-result-page__content" style="padding-top: 12px; padding-bottom: 32px;">
          <template v-if="hasSearchKeyword">
            <!-- 功能 -->
            <section v-if="liveFunctionResults.length" class="search-result-page__section">
              <view class="search-result-page__section-title">功能</view>
              <view class="search-result-page__card">
                <button
                  v-for="item in liveFunctionResults"
                  :key="item.name"
                  class="search-result-page__function-item"
                  type="button"
                  @tap="handleCardClick(item.name)"
                >
                  <view class="search-result-page__function-icon-wrap">
                    <image class="search-result-page__function-icon" :src="item.icon" mode="aspectFit" />
                  </view>
                  <view class="search-result-page__function-copy">
                    <text class="search-result-page__result-name">{{ item.name }}</text>
                    <text class="search-result-page__result-desc">{{ item.desc }}</text>
                  </view>
                  <PortalRowArrow />
                </button>
              </view>
            </section>

            <!-- 医生 -->
            <section v-if="liveDoctorResults.length" class="search-result-page__section">
              <view class="search-result-page__section-title">医生</view>
              <view class="search-result-page__doctor-list">
                <button
                  v-for="doctor in liveDoctorResults"
                  :key="doctor.id"
                  class="doctor-card yh-secondary-card search-result-page__doctor-card"
                  type="button"
                  @tap="goDoctorDetail(doctor.id)"
                >
                  <view class="doctor-card__header">
                    <image class="doctor-card__avatar" :src="doctor.avatar" mode="aspectFill" />
                    <view class="doctor-card__info">
                      <view class="doctor-card__name-row">
                        <text class="doctor-card__name">{{ doctor.name }}</text>
                        <text class="doctor-card__divider">|</text>
                        <text class="doctor-card__dept">{{ doctor.department }}</text>
                      </view>
                      <view class="doctor-card__tags-row">
                        <text class="doctor-card__rank">{{ doctor.title }}</text>
                        <text
                          v-for="tag in getDoctorConsultTags(doctor)"
                          :key="tag"
                          class="doctor-card__type"
                          :class="{ 'is-purple': tag === '视频问诊', 'is-cyan': tag === '义诊咨询' }"
                        >
                          {{ tag }}
                        </text>
                      </view>
                    </view>
                  </view>

                  <view class="doctor-card__stats-row">
                    <view class="doctor-card__stat-item">
                      <image class="doctor-card__stat-icon-img" :src="statConsultIcon" mode="aspectFit" />
                      <text class="doctor-card__stat-label">问诊量</text>
                      <text class="doctor-card__stat-val">{{ doctor.visits }}</text>
                    </view>
                    <view class="doctor-card__stat-item">
                      <image class="doctor-card__stat-icon-img" :src="statScoreIcon" mode="aspectFit" />
                      <text class="doctor-card__stat-label">评分</text>
                      <text class="doctor-card__stat-val">{{ getDoctorScore(doctor) }}</text>
                    </view>
                    <view class="doctor-card__stat-item">
                      <image class="doctor-card__stat-icon-img" :src="statFollowIcon" mode="aspectFit" />
                      <text class="doctor-card__stat-label">关注</text>
                      <text class="doctor-card__stat-val">{{ doctor.follows }}</text>
                    </view>
                  </view>

                  <view class="doctor-card__message">
                    <text class="doctor-card__desc-content">
                      <text class="portal-home__expert-desc-label">擅长</text>
                      <text class="doctor-card__desc-text">{{ doctor.goodAt }}</text>
                    </text>
                  </view>
                </button>
              </view>
            </section>

            <!-- 科室 -->
            <section v-if="liveDepartmentResults.length" class="search-result-page__section">
              <view class="search-result-page__section-title">科室</view>
              <view class="search-result-page__card">
                <button
                  v-for="dept in liveDepartmentResults"
                  :key="dept.name"
                  class="search-result-page__department-item"
                  type="button"
                  @tap="goDepartment(dept.name)"
                >
                  <view class="search-result-page__function-copy">
                    <text class="search-result-page__result-name">{{ dept.name }}</text>
                    <text class="search-result-page__result-desc">{{ dept.count }} 位医生可预约</text>
                  </view>
                  <PortalRowArrow />
                </button>
              </view>
            </section>

            <view v-if="!hasLiveSearchResults" class="search-result-page__empty">
              <PortalEmptyState title="暂无相关结果" desc="换个关键词试试" />
            </view>
          </template>

          <template v-else>
            <!-- 常用科室 -->
            <view class="search-suggests__section">
              <view class="search-suggests__title">常用科室</view>
              <view class="search-suggests__tags">
                <view
                  v-for="tag in commonDepts"
                  :key="tag"
                  class="search-suggests__tag"
                  @tap="goDepartment(tag)"
                >{{ tag }}</view>
              </view>
            </view>

            <!-- 热门医生 -->
            <view class="search-suggests__section" style="margin-top: 24px;">
              <view class="search-suggests__title">热门医生</view>
              <view class="search-suggests__tags">
                <view
                  v-for="tag in hotDoctors"
                  :key="tag"
                  class="search-suggests__tag"
                  @tap="goDoctorDetailByName(tag)"
                >{{ tag }}</view>
              </view>
            </view>

            <!-- 搜索历史 -->
            <view class="search-suggests__section" style="margin-top: 24px;">
              <view class="search-suggests__title-row">
                <text class="search-suggests__title">搜索历史</text>
                <text v-if="searchHistory.length > 0" class="search-suggests__clear-btn" @tap="clearHistory">清空</text>
              </view>
              <view v-if="searchHistory.length > 0" class="search-suggests__history-list">
                <view
                  v-for="item in searchHistory"
                  :key="item"
                  class="search-suggests__history-item"
                  @tap="quickSearch(item)"
                >
                  <text class="history-item__text">{{ item }}</text>
                  <text class="history-item__del" @tap.stop="deleteHistoryItem(item)">×</text>
                </view>
              </view>
              <view v-else class="search-suggests__no-history">暂无搜索记录</view>
            </view>
          </template>
        </view>
      </scroll-view>
    </view>

    <view class="department-page__main">
      <div class="yh-secondary-tab-bar department-campus-segment">
        <div class="yh-secondary-tab-active-bg" :style="activeBgStyle"></div>
        <button class="yh-secondary-tab-item" :class="{ 'is-active': activeCampusId === 'jinshan' }" type="button" @tap="switchCampus('jinshan')">金山院区</button>
        <button class="yh-secondary-tab-item" :class="{ 'is-active': activeCampusId === 'xihong' }" type="button" @tap="switchCampus('xihong')">西洪院区</button>
      </div>

      <view class="department-page__location">
        <view class="department-page__location-icon"></view>
        <text>{{ activeCampus.address }}</text>
      </view>

      <!-- 二级科室的样式 -->
      <view v-if="!isSingleLevelTiledLayout" class="department-page__dept-panel-new">
        <scroll-view class="department-page__scroll-view" scroll-y>
          <!-- 分类下的科室网格（一排2个） -->
          <view class="department-page__dept-grid-container">
            <view
              v-for="section in departmentSections"
              :key="section.title"
              class="department-page__dept-section"
            >
              <!-- 科室选择网格 -->
              <view class="department-page__dept-grid">
                <button
                  v-for="dept in section.departments"
                  :key="dept.id"
                  class="department-page__dept-btn"
                  type="button"
                  @tap="handleDepartmentTap(dept.name)"
                >
                  <text class="department-page__dept-btn-text">{{ dept.name }}</text>
                </button>
              </view>
            </view>
          </view>
        </scroll-view>

        <!-- 保留旧版侧边栏以支持一键恢复，满足 ESLint 变量和组件引用要求 -->
        <view v-if="showOldLayout" style="display: none;">
          <scroll-view class="department-page__dept-sidebar" scroll-y>
            <button
              v-for="category in visibleCategories"
              :key="category.rowId"
              class="department-page__dept-category"
              :class="{ 'is-active': category.id === activeCategoryId }"
              type="button"
            ><text>{{ category.name }}</text></button>
          </scroll-view>
          <PortalRowArrow class="portal-row-arrow" />
        </view>
      </view>

      <!-- 一级科室的样式（使用2列胶囊网格平铺布局，参考图二的样式） -->
      <scroll-view v-else class="department-page__tiled-scroll" scroll-y>
        <view class="department-page__tiled-panel">
          <view
            v-for="category in tiledCategories"
            :key="category.id"
            class="department-page__category-section"
          >
            <!-- 科室平铺网格 -->
            <view class="department-page__tiled-grid">
              <button
                v-for="dept in category.departments"
                :key="dept.id"
                class="department-page__tiled-btn"
                type="button"
                @tap="handleDepartmentTap(dept.name)"
              >
                <text class="department-page__tiled-btn-text">{{ dept.name }}</text>
              </button>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Taro, { usePageScroll, useRouter } from '@tarojs/taro'
import PortalNavBar from '@/components/PortalNavBar/index.vue'
import PortalRowArrow from '@/components/PortalRowArrow/index.vue'
import PortalEmptyState from '@/components/PortalEmptyState/index.vue'
import { getSafeMenuButtonBoundingClientRect } from '@/utils'
import { routeMap } from '../mock'
import { fuzzySearchMatch } from '@/utils/searchMatcher'
import { doctors as appointmentDoctors, createRandom, dateTabs } from '@/pages/appointment/mock'

import tileIconFourRegister from '@/assets/images/门户首页/瓷片区/孟超专用4个/预约挂号icon.png'
import tileIconFourConsult from '@/assets/images/门户首页/瓷片区/孟超专用4个/在线复诊icon.png'
import tileIconFourPay from '@/assets/images/门户首页/瓷片区/孟超专用4个/结算服务icon.png'
import tileIconFourReport from '@/assets/images/门户首页/瓷片区/孟超专用4个/报告查询icon.png'
import iconMenzhenJilu from '@/assets/images/门户首页/金刚区/双色线性/门诊记录.svg'
import iconYuanneiDaohang from '@/assets/images/门户首页/金刚区/双色线性/院内导航.svg'
import iconKeshiJieshao from '@/assets/images/门户首页/金刚区/双色线性/科室介绍.svg'
import iconYishengJieshao from '@/assets/images/门户首页/金刚区/双色线性/医生介绍.svg'
import iconPeiyaoJilu from '@/assets/images/门户首页/金刚区/双色线性/配药记录.svg'
import iconZhuyuanJilu from '@/assets/images/门户首页/金刚区/双色线性/住院记录.svg'
import iconDianzifapiao from '@/assets/images/门户首页/金刚区/双色线性/电子发票.svg'
import iconZhenhouZice from '@/assets/images/门户首页/金刚区/双色线性/智能随访.svg'
import iconJiankangTijian from '@/assets/images/门户首页/金刚区/双色线性/健康体检.svg'
import './index.less'

const router = useRouter()
function getRouteUrl(url: string): string {
  if (router.params.mode === 'consult') {
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}mode=consult`
  }
  return url
}

import iconSearch from '@/assets/images/门户首页/导航栏/搜索.png'
import iconAITriage from '@/assets/images/科室/智能导诊.png'
import { AVATAR_MAP } from '@/utils/avatar'

const doctorAvatarFemale = AVATAR_MAP.doctorFemale
const doctorAvatarMale = AVATAR_MAP.doctorMale

type ConsultDepartment = {
  id: string
  name: string
  icon: string
}

type Campus = {
  id: string
  name: string
  address: string
}

type RecentDoctor = {
  id: string
  name: string
  department: string
  avatar: string
}

type DepartmentCategory = {
  id: string
  name: string
  departments: Array<{
    id: string
    name: string
  }>
}

const menuButtonInfo = getSafeMenuButtonBoundingClientRect()
const contentTop = menuButtonInfo.bottom + 16
const scrollTop = ref(0)
const consultScrollTop = ref(0)
const isConsultMode = computed(() => router.params.mode === 'consult')

const consultBannerUrl = 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E7%A6%8F%E5%B7%9E%E4%B8%AD%E5%8C%BB%E9%99%A2/%E5%9C%A8%E7%BA%BF%E9%97%AE%E8%AF%8A/%E5%9C%A8%E7%BA%BF%E9%97%AE%E8%AF%8Abanner.png?v=202608201905'
const consultNoticeIconUrl = 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E7%A6%8F%E5%B7%9E%E4%B8%AD%E5%8C%BB%E9%99%A2/%E5%9C%A8%E7%BA%BF%E9%97%AE%E8%AF%8A/%E6%B8%A9%E9%A6%A8%E6%8F%90%E7%A4%BA.png'
const consultDeptIconBaseUrl = 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E7%A6%8F%E5%B7%9E%E4%B8%AD%E5%8C%BB%E9%99%A2/%E5%9C%A8%E7%BA%BF%E9%97%AE%E8%AF%8A/%E7%A7%91%E5%AE%A4%E5%9B%BE%E6%A0%87'
const consultDeptIconVersion = '20260821091931'
const getConsultDeptIconUrl = (filename: string) => `${consultDeptIconBaseUrl}/${filename}.png?v=${consultDeptIconVersion}`
const consultDepartments: ConsultDepartment[] = [
  { id: 'internal', name: '内科', icon: getConsultDeptIconUrl('neike') },
  { id: 'surgery', name: '外科', icon: getConsultDeptIconUrl('waike') },
  { id: 'orthopedics', name: '骨科', icon: getConsultDeptIconUrl('guke') },
  { id: 'gynecology', name: '妇科', icon: getConsultDeptIconUrl('fuke') },
  { id: 'pediatrics', name: '儿科', icon: getConsultDeptIconUrl('erke') },
  { id: 'ophthalmology', name: '眼科', icon: getConsultDeptIconUrl('yanke') },
  { id: 'ent', name: '耳鼻喉科', icon: getConsultDeptIconUrl('erbihouke') },
  { id: 'acupuncture', name: '针灸科', icon: getConsultDeptIconUrl('zhenjiuke') },
  { id: 'tuina', name: '推拿科', icon: getConsultDeptIconUrl('tuinake') },
  { id: 'rehabilitation', name: '康复科', icon: getConsultDeptIconUrl('kangfuke') },
  { id: 'general-1', name: '通用科室', icon: getConsultDeptIconUrl('tongyongke') },
  { id: 'general-2', name: '通用科室', icon: getConsultDeptIconUrl('tongyongke') },
  { id: 'general-3', name: '通用科室', icon: getConsultDeptIconUrl('tongyongke') },
  { id: 'general-4', name: '通用科室', icon: getConsultDeptIconUrl('tongyongke') }
]
const featuredConsultDepartments = consultDepartments.slice(0, 2)
const regularConsultDepartments = consultDepartments.slice(2)

const campuses: Campus[] = [
  {
    id: 'jinshan',
    name: '金山院区',
    address: '福州市仓山区建新镇金塘路66号'
  },
  {
    id: 'xihong',
    name: '西洪院区',
    address: '福州市鼓楼区西洪路312号'
  }
]

const recentDoctors: RecentDoctor[] = [
  {
    id: 'recent-zhang',
    name: '张明娜',
    department: '重症肝病科',
    avatar: doctorAvatarFemale
  },
  {
    id: 'recent-li',
    name: '李启铭',
    department: '代谢性肝病科',
    avatar: doctorAvatarMale
  }
]

const jinshanCategories: DepartmentCategory[] = [
  {
    id: 'key',
    name: '重点科室',
    departments: [
      { id: 'tumor', name: '肿瘤科' },
      { id: 'radiotherapy', name: '放疗科' },
      { id: 'intervention', name: '介入科' },
      { id: 'infection-1', name: '感染一科' },
      { id: 'infection-2', name: '感染二科' },
      { id: 'stomatology', name: '口腔科' }
    ]
  },
  {
    id: 'internal',
    name: '内科系统',
    departments: [
      { id: 'non_viral_liver', name: '非病毒性肝病科' },
      { id: 'severe_liver', name: '重症肝病科' },
      { id: 'chronic_liver', name: '慢性肝病科' },
      { id: 'metabolic_liver', name: '代谢性肝病科' },
      { id: 'cardiology', name: '心血管内科' },
      { id: 'endocrine', name: '妊娠及中毒性肝病科' }
    ]
  }
]

const xihongCategories: DepartmentCategory[] = [
  {
    id: 'key',
    name: '重点科室',
    departments: [
      { id: 'tumor', name: '肿瘤科' },
      { id: 'radiotherapy', name: '放疗科' },
      { id: 'intervention', name: '介入科' },
      { id: 'infection-1', name: '感染一科' },
      { id: 'infection-2', name: '感染二科' },
      { id: 'stomatology', name: '口腔科' }
    ]
  },
  {
    id: 'internal',
    name: '内科系统',
    departments: [
      { id: 'non_viral_liver', name: '非病毒性肝病科' },
      { id: 'severe_liver', name: '重症肝病科' },
      { id: 'chronic_liver', name: '慢性肝病科' },
      { id: 'metabolic_liver', name: '代谢性肝病科' },
      { id: 'cardiology', name: '心血管内科' },
      { id: 'endocrine', name: '妊娠及中毒性肝病科' }
    ]
  }
]

const activeCampusId = ref(campuses[0].id)
const activeCategoryId = ref(jinshanCategories[0].id)
const showOldLayout = ref(false)

const jinshanTiledCategories = [
  {
    id: 'tiled_internal',
    name: '内科系统',
    departments: [
      { id: 'tiled_non_viral', name: '非病毒性肝病科' },
      { id: 'tiled_severe_liver', name: '重症肝病科' },
      { id: 'tiled_chronic_liver', name: '慢性肝病科' },
      { id: 'tiled_metabolic_liver', name: '代谢性肝病科' },
      { id: 'tiled_cardio', name: '心血管内科' },
      { id: 'tiled_endocrine', name: '妊娠及中毒性肝病科' }
    ]
  },
  {
    id: 'tiled_special',
    name: '特色专科',
    departments: [
      { id: 'tiled_tumor', name: '肿瘤科' },
      { id: 'tiled_radiotherapy', name: '放疗科' },
      { id: 'tiled_intervention', name: '介入科' },
      { id: 'tiled_infection_1', name: '感染一科' },
      { id: 'tiled_infection_2', name: '感染二科' },
      { id: 'tiled_stomatology', name: '口腔科' }
    ]
  }
]

const xihongTiledCategories = [
  {
    id: 'tiled_internal',
    name: '内科系统',
    departments: [
      { id: 'tiled_non_viral', name: '非病毒性肝病科' },
      { id: 'tiled_severe_liver', name: '重症肝病科' },
      { id: 'tiled_chronic_liver', name: '慢性肝病科' },
      { id: 'tiled_metabolic_liver', name: '代谢性肝病科' },
      { id: 'tiled_cardio', name: '心血管内科' },
      { id: 'tiled_endocrine', name: '妊娠及中毒性肝病科' }
    ]
  },
  {
    id: 'tiled_special',
    name: '特色专科',
    departments: [
      { id: 'tiled_tumor', name: '肿瘤科' },
      { id: 'tiled_radiotherapy', name: '放疗科' },
      { id: 'tiled_intervention', name: '介入科' },
      { id: 'tiled_infection_1', name: '感染一科' },
      { id: 'tiled_infection_2', name: '感染二科' },
      { id: 'tiled_stomatology', name: '口腔科' }
    ]
  }
]

const isSingleLevelTiledLayout = ref(false)

const tiledCategories = computed(() => {
  const isXihong = activeCampusId.value === 'xihong'
  const categories = isXihong ? xihongTiledCategories : jinshanTiledCategories
  if (isXihong) {
    const shuffledSpecialDepts = [
      { id: 'tiled_intervention', name: '介入科' },
      { id: 'tiled_stomatology', name: '口腔科' },
      { id: 'tiled_radiotherapy', name: '放疗科' },
      { id: 'tiled_infection_1', name: '感染一科' },
      { id: 'tiled_tumor', name: '肿瘤科' },
      { id: 'tiled_infection_2', name: '感染二科' }
    ]

    const shuffledInternalDepts = [
      { id: 'tiled_cardio', name: '心血管内科' },
      { id: 'tiled_metabolic_liver', name: '代谢性肝病科' },
      { id: 'tiled_non_viral', name: '非病毒性肝病科' },
      { id: 'tiled_endocrine', name: '妊娠及中毒性肝病科' },
      { id: 'tiled_severe_liver', name: '重症肝病科' },
      { id: 'tiled_chronic_liver', name: '慢性肝病科' }
    ]

    return [
      {
        id: 'tiled_special',
        name: '特色专科',
        departments: shuffledSpecialDepts
      },
      {
        id: 'tiled_internal',
        name: '内科系统',
        departments: shuffledInternalDepts
      }
    ]
  }

  return categories
})

const activeBgStyle = computed(() => {
  const widthStr = `calc((100% - ${Taro.pxTransform(24)}) / 2)`
  const leftStr = activeCampusId.value === 'jinshan' ? Taro.pxTransform(8) : `calc(50% + ${Taro.pxTransform(4)})`
  return {
    width: widthStr,
    left: leftStr
  }
})

const activeCampus = computed(() => {
  return campuses.find(item => item.id === activeCampusId.value) || campuses[0]
})

function switchCampus(campusId: string) {
  activeCampusId.value = campusId
  const currentCategories = campusId === 'jinshan' ? jinshanCategories : xihongCategories
  activeCategoryId.value = currentCategories[0].id
}

const visibleCategories = computed(() => {
  const currentCategories = activeCampusId.value === 'jinshan' ? jinshanCategories : xihongCategories
  return currentCategories.map(item => ({ ...item, rowId: item.id }))
})

const departmentSections = computed(() => {
  const isXihong = activeCampusId.value === 'xihong'
  const currentCategories = isXihong ? xihongCategories : jinshanCategories
  const keyCategory = currentCategories.find(item => item.id === 'key')
  let specialDepts = [...(keyCategory?.departments || [])]

  let internalDepts = [
    { id: 'non_viral_liver', name: '非病毒性肝病科' },
    { id: 'severe_liver', name: '重症肝病科' },
    { id: 'chronic_liver', name: '慢性肝病科' },
    { id: 'metabolic_liver', name: '代谢性肝病科' },
    { id: 'cardiovascular_internal', name: '心血管内科' },
    { id: 'endocrine_metabolic_center', name: '妊娠及中毒性肝病科' }
  ]

  if (isXihong) {
    // Reorder/shuffle lists for Xihong
    const specialShuffled = [
      specialDepts.find(d => d.id === 'intervention'),
      specialDepts.find(d => d.id === 'stomatology'),
      specialDepts.find(d => d.id === 'radiotherapy'),
      specialDepts.find(d => d.id === 'infection-1'),
      specialDepts.find(d => d.id === 'tumor'),
      specialDepts.find(d => d.id === 'infection-2')
    ].filter(Boolean) as Array<{ id: string, name: string }>
    if (specialShuffled.length === specialDepts.length) {
      specialDepts = specialShuffled
    }

    internalDepts = [
      { id: 'cardiovascular_internal', name: '心血管内科' },
      { id: 'metabolic_liver', name: '代谢性肝病科' },
      { id: 'non_viral_liver', name: '非病毒性肝病科' },
      { id: 'endocrine_metabolic_center', name: '妊娠及中毒性肝病科' },
      { id: 'severe_liver', name: '重症肝病科' },
      { id: 'chronic_liver', name: '慢性肝病科' }
    ]

    return [
      {
        title: '特色专科',
        departments: specialDepts
      },
      {
        title: '内科系统',
        departments: internalDepts
      }
    ]
  }

  return [
    {
      title: '内科系统',
      departments: internalDepts
    },
    {
      title: '特色专科',
      departments: specialDepts
    }
  ]
})

usePageScroll(({ scrollTop: pageScrollTop }) => {
  scrollTop.value = pageScrollTop
})

const isSearching = ref(false)
const searchQuery = ref('')
const searchHistory = ref<string[]>([])
const commonDepts = ['非病毒性肝病科', '重症肝病科', '慢性肝病科', '代谢性肝病科', '心血管内科', '妊娠及中毒性肝病科']
// Replace placeholder names '杨峥茗' & '张妮可' with actual active doctors '宋元林' & '周梅仙'
const hotDoctors = ['张明娜', '李启铭', '宋元林', '周梅仙', '杨学城', '颜小青']

// ---- Search Matching Computed & Helpers ----
const shortcutSigninIcon = 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E9%97%A8%E6%88%B73.0%E5%88%87%E5%9B%BE%E8%B5%84%E6%BA%90/%E9%97%A8%E6%88%B7%E9%A6%96%E9%A1%B5/%E9%A6%96%E9%A1%B55%E4%B8%AA%E6%AF%9B%E7%8E%BB%E7%92%83%E5%88%87%E5%9B%BE/%E9%97%A8%E8%AF%8A%E7%AD%BE%E5%88%B0.png'
const statConsultIcon = 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E9%97%A8%E6%88%B73.0%E5%88%87%E5%9B%BE%E8%B5%84%E6%BA%90/%E9%97%A8%E6%88%B7%E9%A6%96%E9%A1%B5/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%E5%A4%B9/stat_volume.png'
const statScoreIcon = 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E9%97%A8%E6%88%B73.0%E5%88%87%E5%9B%BE%E8%B5%84%E6%BA%90/%E9%97%A8%E6%88%B7%E9%A6%96%E9%A1%B5/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%E5%A4%B9/stat_score.png'
const statFollowIcon = 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E9%97%A8%E6%88%B73.0%E5%88%87%E5%9B%BE%E8%B5%84%E6%BA%90/%E9%97%A8%E6%88%B7%E9%A6%96%E9%A1%B5/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%E5%A4%B9/stat_follow.png'

const functionCatalog = [
  { name: '预约挂号', desc: '选择科室、医生与号源时间', route: '/pages/appointment/department/index', icon: tileIconFourRegister, keywords: ['预约', '挂号', '门诊预约', '医生预约'] },
  { name: '在线复诊', desc: '选择医生并预约线上复诊时间', route: '/pages/appointment/department/index?mode=consult', icon: tileIconFourConsult, keywords: ['在线复诊', '复诊', '线上复诊', '问诊'] },
  { name: '门诊结算', desc: '查询并缴纳门诊待缴费用', route: '/pages/common-list/settlement-payment/index', icon: tileIconFourPay, keywords: ['缴费', '结算', '门诊缴费', '费用'] },
  { name: '报告查询', desc: '查看检查、检验与门诊报告', route: '/pages/common-list/report-list/index', icon: tileIconFourReport, keywords: ['报告', '检查', '检验', '报告查询'] },
  { name: '门诊取号', desc: '查看预约并进行门诊取号', route: '/pages/common-list/appointment-signin/index', icon: shortcutSigninIcon, keywords: ['取号', '签到', '门诊取号'] },
  { name: '就诊记录', desc: '查看历史门诊就诊记录', route: '/pages/common-list/clinic-record/index', icon: iconMenzhenJilu, keywords: ['记录', '就诊记录', '门诊记录'] },
  { name: '院内导航', desc: '查看院区地址与导航路线', route: '/pages/common-list/navigation/index', icon: iconYuanneiDaohang, keywords: ['导航', '地址', '院内导航', '路线'] },
  { name: '科室介绍', desc: '了解医院科室与特色专科', route: '/pages/common-list/dept-intro/index', icon: iconKeshiJieshao, keywords: ['科室介绍', '科室', '专科'] },
  { name: '医生介绍', desc: '了解专家医生与擅长方向', route: '/pages/common-list/doctor-intro/index', icon: iconYishengJieshao, keywords: ['医生介绍', '医生', '专家'] },
  { name: '便捷配药', desc: '线上提交配药申请与配送信息', route: '/pages/common-list/medication-refill/index', icon: iconPeiyaoJilu, keywords: ['配药', '药品配送', '慢病续方', '在线配药'] },
  { name: '住院记录', desc: '查看住院信息、费用与清单', route: '/pages/common-list/inpatient-record/index', icon: iconZhuyuanJilu, keywords: ['住院', '住院记录', '住院费用'] },
  { name: '电子票夹', desc: '查看电子发票与票据', route: '/pages/common-list/invoice/index', icon: iconDianzifapiao, keywords: ['发票', '票据', '电子票夹'] },
  { name: '智能导诊', desc: '根据症状推荐就诊科室', route: '/pages/appointment/ai-assistant/index', icon: iconZhenhouZice, keywords: ['导诊', '智能导诊', '症状'] },
  { name: '健康档案', desc: '查看个人健康档案资料', route: '/pages/common-list/health-archive/index', icon: iconJiankangTijian, keywords: ['健康档案', '档案'] }
]

const uniqueList = (list: string[]) => Array.from(new Set(list.filter(Boolean)))

const allSearchDepartments = computed(() => uniqueList([
  ...commonDepts,
  ...appointmentDoctors.map(doctor => doctor.department || doctor.clinic || '')
]))

const allSearchDoctors = computed(() => {
  const doctorMap = new Map<string, any>()
  appointmentDoctors.forEach((doctor) => {
    doctorMap.set(doctor.name, doctor)
  })
  hotDoctors.forEach((name) => {
    if (!doctorMap.has(name)) {
      doctorMap.set(name, { name })
    }
  })
  return Array.from(doctorMap.values())
})

const searchKeyword = computed(() => searchQuery.value.trim())
const hasSearchKeyword = computed(() => searchKeyword.value.length > 0)

const liveFunctionResults = computed(() => {
  if (!hasSearchKeyword.value) return []
  return functionCatalog
    .filter(item => fuzzySearchMatch(searchKeyword.value, [item.name, item.desc, ...item.keywords]))
    .slice(0, 4)
})

const liveDoctorResults = computed(() => {
  if (!hasSearchKeyword.value) return []
  return allSearchDoctors.value
    .filter(doctor => fuzzySearchMatch(searchKeyword.value, [
      doctor.name,
      doctor.title,
      doctor.department,
      doctor.clinic,
      doctor.goodAt
    ]))
    .slice(0, 8)
})

const defaultAvailableDateId = dateTabs.find(t => t.id !== 'all')?.id || dateTabs[0].id
const availableDoctors = computed(() => appointmentDoctors.filter(doctor => doctor.remain > 0))

const getDepartmentAvailableCount = (deptName: string) => {
  const rng = createRandom(`${deptName || 'default'}-${defaultAvailableDateId}`)
  const list = rng.shuffle(availableDoctors.value)
  return list.slice(0, Math.min(rng.nextInt(5, 8), list.length)).length
}

const liveDepartmentResults = computed(() => {
  if (!hasSearchKeyword.value) return []
  return allSearchDepartments.value
    .filter(dept => fuzzySearchMatch(searchKeyword.value, [dept]))
    .slice(0, 8)
    .map(name => ({
      name,
      count: getDepartmentAvailableCount(name)
    }))
})

const hasLiveSearchResults = computed(() => {
  return liveFunctionResults.value.length > 0 ||
    liveDoctorResults.value.length > 0 ||
    liveDepartmentResults.value.length > 0
})

const getDoctorConsultTags = (doctor: any) => {
  return doctor.gender === 'female' ? ['图文咨询', '视频问诊', '义诊咨询'] : ['图文咨询', '视频问诊']
}

const getDoctorScore = (doctor: any) => {
  return Math.round((parseFloat(doctor.score) || 4.9) * 20)
}

const goDoctorDetail = (doctorId: string) => {
  Taro.navigateTo({
    url: getRouteUrl(`${routeMap.detail}?doctorId=${encodeURIComponent(doctorId)}`),
    fail(err) {
      console.error('navigateTo doctor detail failed, pages:', getCurrentPages().length, err)
    }
  })
}

const goDepartment = (name: string) => {
  handleDepartmentTap(name)
}

const handleCardClick = (name: string, categoryTitle?: string) => {
  if (name === '信用就医') {
    Taro.showToast({
      title: `${name}暂未开放`,
      icon: 'none'
    })
    return
  }

  if (name === '更多服务') {
    const catMap: Record<string, string> = {
      '门诊服务': 'outpatient',
      '住院服务': 'inpatient',
      '健康服务': 'health',
      '便民服务': 'convenience'
    }
    const cat = categoryTitle && catMap[categoryTitle] ? catMap[categoryTitle] : 'outpatient'
    Taro.navigateTo({
      url: getRouteUrl(`/pages/common-list/all-services/index?category=${cat}`),
      fail(err) {
        console.error('navigateTo all services failed, pages:', getCurrentPages().length, err)
      }
    })
    return
  }

  const routesMap: Record<string, string> = {
    '预约挂号': '/pages/appointment/department/index',
    '去预约': '/pages/appointment/department/index',
    '在线复诊': '/pages/appointment/department/index?mode=consult',
    '结算服务': '/pages/common-list/settlement-payment/index',
    '报告查询': '/pages/common-list/report-list/index',
    '门诊签到': '/pages/common-list/appointment-signin/index',
    '检查开单': '/pages/common-list/self-order/index',
    '候诊叫号': '/pages/common-list/clinic-queue/index',
    '排队叫号': '/pages/common-list/clinic-queue/index',
    '取药信息': '/pages/common-list/pickup-medicine/index',
    '院内导航': '/pages/common-list/navigation/index',
    '电子票夹': '/pages/common-list/invoice/index',
    '医院介绍': '/pages/common-list/hospital-intro/index',
    '科室介绍': '/pages/common-list/dept-intro/index',
    '医生介绍': '/pages/common-list/doctor-intro/index',
    '就诊须知': '/pages/common-list/medical-guide/index',
    '病理复印': '/pages/common-list/pathology/index',
    '充值记录': '/pages/common-list/recharge-record/index',
    '住院充值': '/pages/common-list/inpatient-recharge/index',
    '住院记录': '/pages/common-list/inpatient-record/index',
    '开药记录': '/pages/common-list/prescription-record/index',
    '健康体检': '/pages/common-list/health-exam/index',
    '乙肝自测': '/pages/common-list/hbv-test/index',
    'BMI自测': '/pages/common-list/bmi-test/index',
    '诊后自测': '/pages/common-list/followup-test/index',
    '肝癌评估': '/pages/common-list/liver-cancer-eval/index',
    '中医体质辨识': '/pages/common-list/tcm-ident/index',
    '报告单': '/pages/common-list/report-list/index',
    '门诊报告': '/pages/common-list/report-list/index',
    '住院报告': '/pages/common-list/report-list/index',
    '更多服务': '/pages/common-list/index',
    '结算缴费': '/pages/common-list/settlement-payment/index',
    '门诊结算': '/pages/common-list/settlement-payment/index',
    '便捷配药': '/pages/common-list/medication-refill/index',
    '慢病续方': '/pages/common-list/medication-refill/index',
    '门诊服务': '/pages/common-list/index',
    '门诊记录': '/pages/common-list/clinic-record/index',
    '就诊记录': '/pages/common-list/clinic-record/index',
    '看病指引': '/pages/common-list/medical-guide/index',
    '住院服务': '/pages/common-list/inpatient-record/index',
    '专科服务': '/pages/common-list/dept-intro/index',
    '其他服务': '/pages/common-list/index',
    '住院费用': '/pages/common-list/inpatient-inquiry/index?mode=bill',
    '住院信息': '/pages/common-list/inpatient-inquiry/index?mode=info',
    '线上问诊': '/pages/appointment/department/index?mode=consult',
    '自助开单': '/pages/common-list/self-order/index'
  }

  if (routesMap[name]) {
    Taro.navigateTo({
      url: getRouteUrl(routesMap[name]),
      fail(err) {
        console.error('navigateTo fail', err, 'current page stack:', getCurrentPages().length)
      }
    })
    return
  }

  const isDept = departmentSections.value.some(sec => sec.departments.some(d => d.name === name))
  if (isDept) {
    handleDepartmentTap(name)
    return
  }
}

function initSearchHistory() {
  try {
    const localHistory = Taro.getStorageSync('portal_search_history')
    if (localHistory && Array.isArray(localHistory)) {
      searchHistory.value = localHistory.slice(0, 8)
    }
  } catch (e) {
    console.error('Failed to init search history:', e)
  }
}

initSearchHistory()

function startSearch() {
  isSearching.value = true
}

function cancelSearch() {
  isSearching.value = false
  searchQuery.value = ''
}

function saveSearchHistory(kw: string) {
  let list = [...searchHistory.value]
  const idx = list.indexOf(kw)
  if (idx >= 0) {
    list.splice(idx, 1)
  }
  list.unshift(kw)
  list = list.slice(0, 8)
  searchHistory.value = list
  try {
    Taro.setStorageSync('portal_search_history', list)
  } catch (e) {
    console.error('Failed to save search history:', e)
  }
}

function quickSearch(kw: string) {
  saveSearchHistory(kw)
  searchQuery.value = kw
  Taro.navigateTo({
    url: getRouteUrl(`/pages/common-list/search-result/index?keyword=${encodeURIComponent(kw)}`),
    fail(err) {
      console.error('navigateTo search result failed, pages:', getCurrentPages().length, getCurrentPages().map(page => page.route), err)
    }
  })
}

function goDoctorDetailByName(name: string) {
  const doctor = allSearchDoctors.value.find(d => d.name === name)
  if (doctor && doctor.id) {
    goDoctorDetail(doctor.id)
  } else {
    quickSearch(name)
  }
}

function onSearchConfirm() {
  const query = searchQuery.value.trim()
  if (!query) return
  saveSearchHistory(query)
  Taro.navigateTo({
    url: getRouteUrl(`/pages/common-list/search-result/index?keyword=${encodeURIComponent(query)}`),
    fail(err) {
      console.error('navigateTo search result failed, pages:', getCurrentPages().length, getCurrentPages().map(page => page.route), err)
    }
  })
}

function clearHistory() {
  searchHistory.value = []
  try {
    Taro.removeStorageSync('portal_search_history')
  } catch (e) {
    console.error('Failed to clear search history:', e)
  }
}

function deleteHistoryItem(kw: string) {
  const list = searchHistory.value.filter(item => item !== kw)
  searchHistory.value = list
  try {
    Taro.setStorageSync('portal_search_history', list)
  } catch (e) {
    console.error('Failed to delete search history item:', e)
  }
}

function handleMoreDoctors() {
  Taro.navigateTo({ url: getRouteUrl('/pages/common-list/my-doctor/index') })
}

function handleDoctorTap(doctor: RecentDoctor) {
  Taro.navigateTo({ url: getRouteUrl(`${routeMap.detail}?doctorId=${encodeURIComponent(doctor.id)}`) })
}

function handleDepartmentTap(name: string) {
  Taro.navigateTo({ url: getRouteUrl(`${routeMap.doctor}?department=${encodeURIComponent(name)}`) })
}

function handleConsultScroll(event: any) {
  consultScrollTop.value = event?.detail?.scrollTop || 0
}

function handleConsultDeptTap(name: string) {
  handleDepartmentTap(name)
}

const triageTexts = [
  '不知道挂哪个科室？',
  '头痛流涕，该挂什么科？',
  '胃胀不舒服，该看哪位医生？',
  '体检报告异常，要挂哪个科？',
  '咳嗽好几天了，挂呼吸内科吗？'
]

function handleAITriage() {
  Taro.vibrateShort({ type: 'light' }).catch(() => {})
  Taro.navigateTo({
    url: '/pages/appointment/ai-assistant/index',
    fail(err) {
      console.error('navigateTo ai-assistant fail, pages:', getCurrentPages().length, err)
    }
  })
}
</script>
