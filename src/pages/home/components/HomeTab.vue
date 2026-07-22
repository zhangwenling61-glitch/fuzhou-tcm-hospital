<template>
  <div
    class="tabview-home"
    :class="{ 'is-searching-active': isSearching, 'yh-scroll-locked': store.showPatientSwitcher }"
    style="padding-top: 0;"
  >

    <!-- ── 首页主体 ── -->
    <!-- 顶部固定导航栏及医院品牌 (始终显示，悬浮置顶) -->
    <div
      class="portal-home__fixed-nav-bar"
      :class="{ 'is-scrolled': isNavScrolled }"
      :style="{ height: (menuButtonInfo.bottom + 20) + 'px' }"
    >
      <div class="portal-home__fixed-nav-bar-bg"></div>
      <div class="portal-home__fixed-branding" :style="{ top: menuButtonInfo.top + 'px', height: menuButtonInfo.height + 'px' }">
        <img class="portal-home__fixed-logo-img" :src="hospitalLogo" alt="医院Logo">
        <span class="portal-home__fixed-hospital-title">福州市中医院<span>互联网医院</span></span>
      </div>
    </div>

    <!-- 顶部品牌与个人卡片容器 (在正常文档流中随页面滚动) -->
    <div class="portal-home__header" :style="{ paddingTop: menuButtonInfo.bottom + 'px' }">
      <!-- Ginkgo Leaves Background Container -->
      <div class="portal-home__header-bg">
        <div
          v-for="leaf in headerGinkgoLeaves"
          :key="leaf.id"
          class="portal-home__header-leaf"
          :style="{
            left: leaf.left,
            top: leaf.top,
            width: leaf.size,
            height: leaf.size,
            transform: leaf.rotate
          }"
        >
          <img
            class="portal-home__header-leaf-img"
            :src="headerGinkgoLeaf"
            alt=""
            :style="{
              animationDelay: leaf.delay,
              animationDuration: leaf.duration
            }"
          >
        </div>
      </div>

      <!-- 搜索框 -->
      <div class="portal-home__search-wrap" :class="{ 'is-searching': isSearching }">
        <div class="portal-home__search-bar" :class="{ 'is-active': isSearching }" @tap="startSearch">
          <img class="portal-home__search-icon" :src="iconSearch" alt="搜索">
          <input
            v-if="isSearching"
            class="portal-home__search-input"
            type="text"
            v-model="searchQuery"
            placeholder="搜一搜"
            confirm-type="search"
            :focus="isSearching"
            @confirm="onSearchConfirm"
            @tap.stop="() => {}"
          />
          <div v-else class="portal-home__search-placeholder">
            <strong class="portal-home__search-prefix">搜一搜</strong>
            <swiper
              class="portal-home__search-carousel"
              :vertical="true"
              :autoplay="true"
              :interval="2000"
              :circular="true"
              :duration="300"
            >
              <swiper-item v-for="(text, index) in searchPlaceholders" :key="index" class="portal-home__search-carousel-item">
                <span>{{ text }}</span>
              </swiper-item>
            </swiper>
          </div>
        </div>
        <span class="portal-home__search-cancel" :class="{ 'is-visible': isSearching }" @tap.stop="cancelSearch">取消</span>
      </div>

      <!-- 用户信息卡片 (Directly Inlined for Native Reactivity and Event Reliability) -->
      <div class="portal-home__user-card-wrap">
        <div class="portal-user-card is-clinic" @tap="handleCardTap">
          <div class="portal-user-card__main">
            <div class="portal-user-card__patient">
              <!-- Avatar Wrap -->
              <div
                class="portal-user-card__avatar-wrap is-clickable"
                hover-class="is-active"
                @tap="handleSwitchPatient"
              >
                <img
                  class="portal-user-card__avatar"
                  :src="activePatientAvatar"
                  alt=""
                />
              </div>
              <!-- Patient Info -->
              <div class="portal-user-card__patient-info">
                <div class="portal-user-card__patient-name">
                  <span>{{ activePatientName }}</span>
                  <button
                    class="portal-user-card__switch"
                    type="button"
                    hover-class="is-active"
                    @touchstart.stop
                    @tap.stop="handleSwitchPatient"
                  >
                    <span>切换</span>
                    <img :src="iconSwitchArrow" class="portal-user-card__switch-arrow" alt="" />
                  </button>
                </div>
                <div class="portal-user-card__insurance">
                  <span class="portal-user-card__tag" :class="activeInsuranceTagClass">{{ displayInsuranceLabel }}</span>
                  <span>{{ activePatientDesc }}</span>
                  <div
                    class="portal-user-card__eye-wrap"
                    @tap.stop="toggleInsuranceMask"
                  >
                    <img
                      class="portal-user-card__eye"
                      :src="isInsuranceMasked ? iconEyeClosed : iconEyeOpen"
                      alt="眼睛图标"
                    />
                  </div>
                </div>
              </div>
            </div>
            <button class="portal-user-card__primary" type="button" hover-class="is-active" @tap="handlePrimaryClick">
              <image class="portal-user-card__qr" :src="qrCodeImg" mode="aspectFit" />
              <span>医保码</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="yh-secondary-content portal-home__content">
      <!-- 1. Cloned Full Combo Module -->
      <div class="portal-home__combo">
        <!-- Tiles -->
        <div v-if="activeTileLayout === 'four-tiles'" class="portal-home__tiles-four">
          <div class="portal-home__tile-four portal-home__tile-four--register" @tap="handleCardClick('预约挂号')">
            <image class="portal-home__tile-four-title" :src="tileTitleFourRegister" mode="aspectFit" />
            <div class="portal-home__tile-four-icon-wrap tile-bounce-common" style="animation-delay: 0s;">
              <image class="portal-home__tile-four-icon" :src="tileIconFourRegister" mode="aspectFit" />
              <image class="portal-home__icon-sweep tile-sweep-common" :src="tileIconFourRegister" mode="aspectFit" style="animation-delay: 0s;" />
            </div>
          </div>
          <div class="portal-home__tile-four portal-home__tile-four--pay" @tap="handleCardClick('结算服务')">
            <image class="portal-home__tile-four-title" :src="tileTitleFourPay" mode="aspectFit" />
            <div class="portal-home__tile-four-icon-wrap tile-bounce-common" style="animation-delay: 3s;">
              <image class="portal-home__tile-four-icon" :src="tileIconFourPay" mode="aspectFit" />
              <image class="portal-home__icon-sweep tile-sweep-common" :src="tileIconFourPay" mode="aspectFit" style="animation-delay: 3s;" />
            </div>
          </div>
          <div class="portal-home__tile-four portal-home__tile-four--consult" @tap="handleCardClick('在线复诊')">
            <image class="portal-home__tile-four-title" :src="tileTitleFourConsult" mode="aspectFit" />
            <div class="portal-home__tile-four-icon-wrap tile-bounce-common" style="animation-delay: 6s;">
              <image class="portal-home__tile-four-icon" :src="tileIconFourConsult" mode="aspectFit" />
              <image class="portal-home__icon-sweep tile-sweep-common" :src="tileIconFourConsult" mode="aspectFit" style="animation-delay: 6s;" />
            </div>
          </div>
          <div class="portal-home__tile-four portal-home__tile-four--report" @tap="handleCardClick('报告查询')">
            <image class="portal-home__tile-four-title" :src="tileTitleFourReport" mode="aspectFit" />
            <div class="portal-home__tile-four-icon-wrap tile-bounce-common" style="animation-delay: 9s;">
              <image class="portal-home__tile-four-icon" :src="tileIconFourReport" mode="aspectFit" />
              <image class="portal-home__icon-sweep tile-sweep-common" :src="tileIconFourReport" mode="aspectFit" style="animation-delay: 9s;" />
            </div>
          </div>
        </div>

        <div v-else-if="activeTileLayout === 'three-tiles'" class="portal-home__tiles">
          <div class="portal-home__tile portal-home__tile--register" @tap="handleCardClick('快速复诊')">
            <img class="portal-home__tile-title-img portal-home__tile-title-img--register" :src="tileTitleRegister" alt="快速复诊">
            <div class="portal-home__tile-action">
              <span>去问诊</span>
            </div>
            <div class="portal-home__tile-img portal-home__tile-img--register">
              <div class="portal-home__tile-img-motion tile-bounce-common" style="animation-delay: 0s;">
                <img class="portal-home__tile-img-inner" :src="tileIconRegister" alt="">
                <img class="portal-home__icon-sweep tile-sweep-common" :src="tileIconRegister" style="animation-delay: 0s;" alt="">
              </div>
            </div>
          </div>
          <div class="portal-home__tile portal-home__tile--pay" @tap="handleCardClick('续方申请')">
            <img class="portal-home__tile-title-img portal-home__tile-title-img--small" :src="tileTitlePay" alt="续方申请">
            <div class="portal-home__tile-img portal-home__tile-img--pay">
              <div class="portal-home__tile-img-motion tile-bounce-common" style="animation-delay: 4s;">
                <img class="portal-home__tile-img-inner" :src="tileIconPay" alt="">
                <img class="portal-home__icon-sweep tile-sweep-common" :src="tileIconPay" style="animation-delay: 4s;" alt="">
              </div>
            </div>
          </div>
          <div class="portal-home__tile portal-home__tile--report" @tap="handleCardClick('预约挂号')">
            <img class="portal-home__tile-title-img portal-home__tile-title-img--small" :src="tileTitleReport" alt="预约挂号">
            <div class="portal-home__tile-img portal-home__tile-img--report">
              <div class="portal-home__tile-img-motion tile-bounce-common" style="animation-delay: 8s;">
                <img class="portal-home__tile-img-inner" :src="tileIconReport" alt="">
                <img class="portal-home__icon-sweep tile-sweep-common" :src="tileIconReport" style="animation-delay: 8s;" alt="">
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="activeTileLayout === 'three-tiles-light'" class="portal-home__tiles-light">
          <button
            v-for="tile in primaryActionTiles"
            :key="tile.name"
            class="portal-home__tile-light"
            type="button"
            hover-class="is-active"
            @tap="handleCardClick(tile.name)"
          >
            <span class="portal-home__tile-light-icon-wrap">
              <image class="portal-home__tile-light-icon" :src="tile.icon" mode="aspectFit" />
              <span v-if="tile.badge" class="portal-home__tile-light-badge">{{ tile.badge }}</span>
            </span>
            <span class="portal-home__tile-light-label">{{ tile.name }}</span>
          </button>
        </div>

        <!-- Shortcut Icons Row -->
        <div class="portal-home__tile-row">
          <button
            v-for="item in quickTiles"
            :key="item.name"
            :class="['portal-home__tile-service', item.className]"
            type="button"
            hover-class="is-active"
            @tap="handleCardClick(item.name)"
          >
            <span class="portal-home__tile-service-copy">
              <span class="portal-home__tile-service-name">{{ item.name }}</span>
              <span class="portal-home__tile-service-desc">
                <template v-if="item.desc.includes('|')">
                  {{ item.desc.split('|')[0].trim() }}<span class="portal-home__tile-desc-separator"></span>{{ item.desc.split('|')[1].trim() }}
                </template>
                <template v-else>
                  {{ item.desc }}
                </template>
              </span>
            </span>
            <div class="portal-home__tile-service-icon-wrapper">
              <image class="portal-home__tile-service-icon" :src="item.icon" mode="aspectFit" />
              <image class="portal-home__tile-service-icon-sweep" :src="item.icon" mode="aspectFit" />
            </div>
          </button>
        </div>

      </div>

      <!-- 特色专科服务 -->
      <section class="portal-home__specialty is-variable-specialty">
        <div class="portal-home__specialty-title">
          <div class="portal-home__specialty-heading yh-portal-section-heading">专科特色服务</div>
          <div class="portal-home__specialty-more" @tap="handleMoreClick('特色科室')">查看更多</div>
        </div>
        <!-- ── 首页 (变量版本) 的左图右列布局 ── -->
        <div class="variable-specialty-container">
          <!-- 左侧三伏灸活动 Banner -->
          <div class="variable-specialty-banner" @tap="handleSpecialtyBannerClick(0)">
            <image class="banner-bg-img" :src="variableBannerUrl" mode="aspectFill" />
            <div class="variable-specialty-banner-cta">点击预约</div>
          </div>

          <!-- 右侧 4 个特色专科项 -->
          <div class="variable-specialty-list">
            <div
              v-for="item in variableSpecialtyItems"
              :key="item.name"
              class="variable-specialty-item"
              hover-class="is-active"
              @tap="handleCardClick(item.name)"
            >
              <!-- Card Background Cut Image -->
              <image class="item-bg-img" :src="item.icon" mode="scaleToFill" />
              <div class="item-text-group">
                <span class="item-title">{{ item.name }}</span>
                <span class="item-subtitle" :style="{ color: item.subtitleColor }">
                  <template v-if="item.desc.includes('|')">
                    {{ item.desc.split('|')[0].trim() }}<span class="portal-home__tile-desc-separator"></span>{{ item.desc.split('|')[1].trim() }}
                  </template>
                  <template v-else>
                    {{ item.desc }}
                  </template>
                </span>
              </div>
            </div>
          </div>
        </div>

      </section>

      <!-- 金刚区服务分类平铺模块 -->
      <div class="portal-home__services-flat">
        <div
          v-for="tab in serviceTabs"
          :key="tab.title"
          class="portal-home__service-flat-card"
        >
          <div class="portal-home__service-flat-header">
            <div class="portal-home__service-flat-title yh-portal-section-heading">{{ tab.title }}</div>
          </div>
          <div class="portal-home__service-flat-grid">
            <button
              v-for="item in tab.items"
              :key="item.name"
              class="portal-home__service-flat-item"
              type="button"
              hover-class="is-active"
              @tap="handleCardClick(item.name, tab.title)"
            >
              <div class="portal-home__service-flat-icon-wrapper">
                <img class="portal-home__service-flat-icon" :src="item.icon" alt="">
              </div>
              <span class="portal-home__service-flat-name">{{ item.name }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 健康科普 Module -->
      <section class="portal-home__module">
        <div class="portal-home__module-title">
          <div class="portal-home__module-heading">健康科普</div>
          <div class="portal-home__module-more" @tap="handleMoreClick('健康科普')">查看更多</div>
        </div>
        <div class="portal-home__article-card">
          <div class="portal-home__article-list">
            <div
              v-for="article in articles"
              :key="article.title"
              class="portal-home__article"
              @tap="handleArticleClick(article)"
            >
              <div class="portal-home__article-text">
                <div class="portal-home__article-title">{{ article.title }}</div>
                <span>{{ article.date }}</span>
              </div>
              <img class="portal-home__article-img" :src="article.image" mode="aspectFill" alt="">
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- ── 3. 消息 & 4. 我的 已被首页布局合并 ── -->

    <!-- 全屏毛玻璃搜索遮罩 (仅在激活搜索状态下显示) -->
    <div v-if="isSearching"
         class="portal-home__search-mask"
         :style="{ paddingTop: (menuButtonInfo.bottom + 52) + 'px' }"
         @tap="cancelSearch"
         @touchmove.stop.prevent="() => {}">
      <scroll-view
        class="search-result-page__scroll"
        :scroll-y="hasSearchKeyword"
        :enhanced="true"
        :bounces="false"
        @tap.stop="() => {}"
      >
        <div class="portal-home__search-suggests search-result-page__content" style="padding-top: 12px;">
          <template v-if="hasSearchKeyword">
            <section v-if="liveFunctionResults.length" class="search-result-page__section">
              <div class="search-result-page__section-title">功能</div>
              <div class="search-result-page__card">
                <button
                  v-for="item in liveFunctionResults"
                  :key="item.name"
                  class="search-result-page__function-item"
                  type="button"
                  @tap="handleCardClick(item.name)"
                >
                  <div class="search-result-page__function-icon-wrap">
                    <img class="search-result-page__function-icon" :src="item.icon" alt="">
                  </div>
                  <div class="search-result-page__function-copy">
                    <span class="search-result-page__result-name">{{ item.name }}</span>
                    <span class="search-result-page__result-desc">{{ item.desc }}</span>
                  </div>
                  <PortalRowArrow />
                </button>
              </div>
            </section>

            <section v-if="liveDoctorResults.length" class="search-result-page__section">
              <div class="search-result-page__section-title">医生</div>
              <div class="search-result-page__doctor-list">
                <button
                  v-for="doctor in liveDoctorResults"
                  :key="doctor.id"
                  class="doctor-card yh-secondary-card search-result-page__doctor-card"
                  type="button"
                  @tap="goDoctorDetail(doctor.id)"
                >
                  <div class="doctor-card__header">
                    <img class="doctor-card__avatar" :src="doctor.avatar" :alt="doctor.name" />
                    <div class="doctor-card__info">
                      <div class="doctor-card__name-row">
                        <span class="doctor-card__name">{{ doctor.name }}</span>
                        <span class="doctor-card__divider">|</span>
                        <span class="doctor-card__dept">{{ doctor.department }}</span>
                      </div>
                      <div class="doctor-card__tags-row">
                        <span class="doctor-card__rank">{{ doctor.title }}</span>
                        <span
                          v-for="tag in getDoctorConsultTags(doctor)"
                          :key="tag"
                          class="doctor-card__type"
                          :class="{ 'is-purple': tag === '视频问诊', 'is-cyan': tag === '义诊咨询' }"
                        >
                          {{ tag }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="doctor-card__stats-row">
                    <div class="doctor-card__stat-item">
                      <img class="doctor-card__stat-icon-img" :src="statConsultIcon" alt="" />
                      <span class="doctor-card__stat-label">问诊量</span>
                      <span class="doctor-card__stat-val">{{ doctor.visits }}</span>
                    </div>
                    <div class="doctor-card__stat-item">
                      <img class="doctor-card__stat-icon-img" :src="statScoreIcon" alt="" />
                      <span class="doctor-card__stat-label">评分</span>
                      <span class="doctor-card__stat-val">{{ getDoctorScore(doctor) }}</span>
                    </div>
                    <div class="doctor-card__stat-item">
                      <img class="doctor-card__stat-icon-img" :src="statFollowIcon" alt="" />
                      <span class="doctor-card__stat-label">关注</span>
                      <span class="doctor-card__stat-val">{{ doctor.follows }}</span>
                    </div>
                  </div>

                  <div class="doctor-card__message">
                    <span v-if="(doctor.goodAt || '').length + 2 > 50" class="doctor-card__desc-float-spacer" />
                    <span class="doctor-card__desc-content">
                      <span class="portal-home__expert-desc-label">擅长</span>
                      <span class="doctor-card__desc-text">{{ doctor.goodAt }}</span>
                    </span>
                  </div>
                </button>
              </div>
            </section>

            <section v-if="liveDepartmentResults.length" class="search-result-page__section">
              <div class="search-result-page__section-title">科室</div>
              <div class="search-result-page__card">
                <button
                  v-for="dept in liveDepartmentResults"
                  :key="dept.name"
                  class="search-result-page__department-item"
                  type="button"
                  @tap="goDepartment(dept.name)"
                >
                  <div class="search-result-page__function-copy">
                    <span class="search-result-page__result-name">{{ dept.name }}</span>
                    <span class="search-result-page__result-desc">{{ dept.count }} 位医生可预约 or 问诊</span>
                  </div>
                  <PortalRowArrow />
                </button>
              </div>
            </section>

            <div v-if="!hasLiveSearchResults" class="search-result-page__empty">
              <PortalEmptyState title="暂无相关结果" desc="换个关键词试试" />
            </div>
          </template>

          <template v-else>
            <!-- 热门功能 -->
            <div class="search-suggests__section">
              <div class="search-suggests__title">热门功能</div>
              <div class="search-suggests__tags search-suggests__tags--grid4">
                <span
                  v-for="tag in hotFeatures"
                  :key="tag"
                  class="search-suggests__tag"
                  @tap="handleCardClick(tag)"
                >{{ tag }}</span>
              </div>
            </div>

            <!-- 常用科室 -->
            <div class="search-suggests__section" style="margin-top: 24px;">
              <div class="search-suggests__title">常用科室</div>
              <div class="search-suggests__tags">
                <span
                  v-for="tag in commonDepts"
                  :key="tag"
                  class="search-suggests__tag"
                  @tap="goDepartment(tag)"
                >{{ tag }}</span>
              </div>
            </div>

            <!-- 热门医生 -->
            <div class="search-suggests__section" style="margin-top: 24px;">
              <div class="search-suggests__title">热门医生</div>
              <div class="search-suggests__tags">
                <span
                  v-for="tag in hotDoctors"
                  :key="tag"
                  class="search-suggests__tag"
                  @tap="goDoctorDetailByName(tag)"
                >{{ tag }}</span>
              </div>
            </div>

            <!-- 搜索历史 -->
            <div class="search-suggests__section" style="margin-top: 24px;">
              <div class="search-suggests__title-row">
                <span class="search-suggests__title">搜索历史</span>
                <span v-if="searchHistory.length > 0" class="search-suggests__clear-btn" @tap="clearHistory">清空</span>
              </div>
              <div v-if="searchHistory.length > 0" class="search-suggests__history-list">
                <div
                  v-for="item in searchHistory"
                  :key="item"
                  class="search-suggests__history-item"
                  @tap="quickSearch(item)"
                >
                  <span class="history-item__text">{{ item }}</span>
                  <span class="history-item__del" @tap.stop="deleteHistoryItem(item)">×</span>
                </div>
              </div>
              <div v-else class="search-suggests__no-history">暂无搜索记录</div>
            </div>
          </template>
        </div>
      </scroll-view>
    </div>

    <!-- Global Patient Switcher ActionSheet popup placed at page root level -->
    <PortalActionSheet
      v-if="!isWeapp"
      :show="store.showPatientSwitcher"
      title="切换就诊人"
      :actions="store.patients.map(p => p.name)"
      :value="store.activePatient.name"
      @update:show="store.showPatientSwitcher = $event"
      @select="handleSelectPatient"
    />
    <!-- Doctor Introduction Details Popup -->
    <PortalInspectionNoticePopup
      v-if="showIntroDialog"
      :title="dialogTitle"
      :items="dialogMessage"
      @confirm="showIntroDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import Taro, { useDidShow, usePageScroll, useDidHide } from '@tarojs/taro'
import { ref, computed, watch, onMounted, onUnmounted, PropType } from 'vue'
import { useAppStore } from '@/store'
import PortalActionSheet from '@/components/PortalActionSheet/index.vue'
import PortalRowArrow from '@/components/PortalRowArrow/index.vue'
import PortalEmptyState from '@/components/PortalEmptyState/index.vue'

import PortalInspectionNoticePopup from '@/components/PortalInspectionNoticePopup/index.vue'
import { getSafeMenuButtonBoundingClientRect, getRouteUrl, maskName } from '@/utils'
import { fuzzySearchMatch } from '@/utils/searchMatcher'
import { doctors as appointmentDoctors, createRandom, dateTabs } from '@/pages/home/mock'
import { fzHomeAssets } from '@/config/remoteAssets'
import qrCodeImg from '@/assets/images/portal/card/chs.png'
import iconSwitchArrow from '@/assets/images/portal/card/Union.png'
import '@/components/PortalUserCard/index.less'

import iconEyeOpen from '@/assets/images/portal/card/eye-o.png'
import iconEyeClosed from '@/assets/images/portal/card/closed-eye.png'
import headerGinkgoLeaf from '@/assets/images/门户首页/header-ginkgo-leaf.png'

import deptSkinIcon from '@/assets/images/科室/基础/皮肤科.svg'
import deptErkeIcon from '@/assets/images/科室/基础/儿科.svg'
import deptYankeIcon from '@/assets/images/科室/基础/眼科.svg'
import deptGukeIcon from '@/assets/images/科室/基础/骨科.svg'
import deptFuchankeIcon from '@/assets/images/科室/基础/妇产科.svg'
import deptXinneikeIcon from '@/assets/images/科室/基础/心脏内科.svg'
import deptXiaohuakeIcon from '@/assets/images/科室/专门/消化科.svg'
import deptZhenjiukeIcon from '@/assets/images/科室/专门/针灸科.svg'
const iconSearch = fzHomeAssets.searchIcon

// ---- 金刚区双色线性 SVG 图标静态导入 ----
import iconYuyueGuahao from '@/assets/images/门户首页/金刚区/双色线性/预约挂号.svg'
import iconMenzhenJiesuan from '@/assets/images/门户首页/金刚区/双色线性/门诊结算.svg'
import iconPaiduiJiaohao from '@/assets/images/门户首页/金刚区/双色线性/排队叫号.svg'
import iconMenzhenBaogao from '@/assets/images/门户首页/金刚区/双色线性/门诊报告.svg'
import iconMenzhenJilu from '@/assets/images/门户首页/金刚区/双色线性/门诊记录.svg'
import iconQuyaoPingzheng from '@/assets/images/门户首页/金刚区/双色线性/取药凭证.svg'
import iconGengduo from '@/assets/images/门户首页/金刚区/双色线性/更多.svg'
import iconYunJiaopian from '@/assets/images/门户首页/金刚区/双色线性/云胶片.svg'

import iconZhuyuanChongzhi from '@/assets/images/门户首页/金刚区/双色线性/住院充值.svg'
import iconZhuyuanJilu from '@/assets/images/门户首页/金刚区/双色线性/住院记录.svg'
import iconZhuyuanBaogao from '@/assets/images/门户首页/金刚区/双色线性/住院报告.svg'
import iconChongzhiJilu from '@/assets/images/门户首页/金刚区/双色线性/充值记录.svg'
import iconZhuyuanRiqingdan from '@/assets/images/门户首页/金刚区/双色线性/住院日清单.svg'
import iconZhuyuanJiesuan from '@/assets/images/门户首页/金刚区/双色线性/住院结算.svg'

import iconJiankangTijian from '@/assets/images/门户首页/金刚区/双色线性/健康体检.svg'
import iconYiganZice from '@/assets/images/门户首页/金刚区/双色线性/乙肝自测.svg'
import iconBmiZice from '@/assets/images/门户首页/金刚区/双色线性/BMI自测.svg'
import iconZhenhouZice from '@/assets/images/门户首页/金刚区/双色线性/智能随访.svg'
import iconGanaipinggu from '@/assets/images/门户首页/金刚区/双色线性/肝癌风险评估.svg'
import iconZhongyiTizhi from '@/assets/images/门户首页/金刚区/双色线性/中医体质辨识.svg'
import iconPeiyaoJilu from '@/assets/images/门户首页/金刚区/双色线性/配药记录.svg'

import iconYuanneiDaohang from '@/assets/images/门户首页/金刚区/双色线性/院内导航.svg'
import iconLaiyuanDaohang from '@/assets/images/门户首页/金刚区/双色线性/来院导航.svg'
import iconDianzifapiao from '@/assets/images/门户首页/金刚区/双色线性/电子发票.svg'
import iconYiyuanJieshao from '@/assets/images/门户首页/金刚区/双色线性/医院介绍.svg'
import iconKeshiJieshao from '@/assets/images/门户首页/金刚区/双色线性/科室介绍.svg'
import iconYishengJieshao from '@/assets/images/门户首页/金刚区/双色线性/医生介绍.svg'
import iconZhuyishixiang from '@/assets/images/门户首页/金刚区/双色线性/注意事项.svg'
import iconBinglifuyin from '@/assets/images/门户首页/金刚区/双色线性/病历复印.svg'
import iconJiankangGuanli from '@/assets/images/门户首页/金刚区/双色线性/健康管理.svg'
import iconYijianFankui from '@/assets/images/门户首页/金刚区/双色线性/意见反馈.svg'
import iconManyiduPingjia from '@/assets/images/门户首页/金刚区/双色线性/满意度评价.svg'
import iconYonghuHuaxiang from '@/assets/images/门户首页/金刚区/双色线性/用户画像.svg'
import iconYibaoPingzheng from '@/assets/images/门户首页/金刚区/双色线性/医保电子凭证.svg'
import iconHuliShangmen from '@/assets/images/门户首页/金刚区/双色线性/护理上门.svg'

// 新增导入的 SVG 图标
import iconHuizhenQiandao from '@/assets/images/门户首页/金刚区/双色线性/回诊签到.svg'
import iconMenzhenChongzhi from '@/assets/images/门户首页/金刚区/双色线性/门诊充值.svg'
import iconYujiaojinTuikuan from '@/assets/images/门户首页/金刚区/双色线性/预交金退款.svg'
import iconXinyongJiuyi from '@/assets/images/门户首页/金刚区/双色线性/信用就医.svg'
import iconBaogaoChaxun from '@/assets/images/门户首页/金刚区/双色线性/报告查询.svg'
import iconJianchaYuyue from '@/assets/images/门户首页/金刚区/双色线性/检查预约.svg'
import iconKaisuChuyuan from '@/assets/images/门户首页/金刚区/双色线性/快速出院.svg'
import iconZizhuRuyuan from '@/assets/images/门户首页/金刚区/双色线性/自助入院.svg'
import iconBianminJisong from '@/assets/images/门户首页/金刚区/双色线性/便民寄送.svg'
import iconDizhiGuanli from '@/assets/images/门户首页/金刚区/双色线性/地址管理.svg'
import iconJiesuanJilu from '@/assets/images/门户首页/金刚区/双色线性/结算记录.svg'
import iconJiuyiZhinan from '@/assets/images/门户首页/金刚区/双色线性/就医指南.svg'
import iconTingcheYuyue from '@/assets/images/门户首页/金刚区/双色线性/停车预约.svg'
import iconZhinengKefu from '@/assets/images/门户首页/金刚区/双色线性/智能客服.svg'

import './HomeTab.less'
import '@/pages/appointment/ai-assistant/index.less'

const props = defineProps({
  visible: {
    type: Boolean,
    default: true
  },
  pageVisible: {
    type: Boolean,
    default: true
  },
  scrollTop: {
    type: Number,
    default: 0
  },
  activeTab: {
    type: String as PropType<'home' | 'message' | 'user' | 'ai'>,
    default: 'home'
  }
})

const isWeapp = process.env.TARO_ENV === 'weapp'
const store = useAppStore()

const headerGinkgoLeaves = [
  { id: 'leaf-1', left: '20px', top: '26px', size: '52px', rotate: 'rotate(-18deg)', delay: '-0.4s', duration: '5.1s' },
  { id: 'leaf-2', left: '118px', top: '50px', size: '46px', rotate: 'rotate(16deg)', delay: '-1.6s', duration: '5.8s' },
  { id: 'leaf-3', left: '226px', top: '28px', size: '54px', rotate: 'rotate(-28deg)', delay: '-3.2s', duration: '5.3s' },
  { id: 'leaf-4', left: '342px', top: '54px', size: '46px', rotate: 'rotate(24deg)', delay: '-4.1s', duration: '4.9s' },
  { id: 'leaf-5', left: '458px', top: '30px', size: '52px', rotate: 'rotate(-20deg)', delay: '-2.2s', duration: '5.6s' },
  { id: 'leaf-6', left: '574px', top: '54px', size: '48px', rotate: 'rotate(18deg)', delay: '-0.9s', duration: '5.5s' },
  { id: 'leaf-7', left: '690px', top: '30px', size: '54px', rotate: 'rotate(-12deg)', delay: '-2.8s', duration: '5s' },

  { id: 'leaf-8', left: '-14px', top: '100px', size: '58px', rotate: 'rotate(30deg)', delay: '-4.7s', duration: '5.9s' },
  { id: 'leaf-9', left: '92px', top: '128px', size: '48px', rotate: 'rotate(-10deg)', delay: '-1.2s', duration: '5.4s' },
  { id: 'leaf-10', left: '204px', top: '104px', size: '52px', rotate: 'rotate(26deg)', delay: '-2.5s', duration: '5.7s' },
  { id: 'leaf-11', left: '318px', top: '132px', size: '46px', rotate: 'rotate(-16deg)', delay: '-1.7s', duration: '5.6s' },
  { id: 'leaf-12', left: '432px', top: '104px', size: '56px', rotate: 'rotate(18deg)', delay: '-3.8s', duration: '5.5s' },
  { id: 'leaf-13', left: '552px', top: '132px', size: '48px', rotate: 'rotate(-30deg)', delay: '-4.6s', duration: '5.7s' },
  { id: 'leaf-14', left: '670px', top: '106px', size: '56px', rotate: 'rotate(22deg)', delay: '-3.4s', duration: '5.1s' },

  { id: 'leaf-15', left: '22px', top: '182px', size: '54px', rotate: 'rotate(-30deg)', delay: '-0.8s', duration: '5.4s' },
  { id: 'leaf-16', left: '136px', top: '212px', size: '46px', rotate: 'rotate(28deg)', delay: '-2.6s', duration: '5.6s' },
  { id: 'leaf-17', left: '252px', top: '184px', size: '56px', rotate: 'rotate(-20deg)', delay: '-1.4s', duration: '5.2s' },
  { id: 'leaf-18', left: '374px', top: '214px', size: '48px', rotate: 'rotate(36deg)', delay: '-3.1s', duration: '5.7s' },
  { id: 'leaf-19', left: '496px', top: '184px', size: '54px', rotate: 'rotate(-18deg)', delay: '-0.2s', duration: '5.2s' },
  { id: 'leaf-20', left: '608px', top: '214px', size: '48px', rotate: 'rotate(18deg)', delay: '-1.9s', duration: '5.5s' },
  { id: 'leaf-21', left: '704px', top: '184px', size: '58px', rotate: 'rotate(-26deg)', delay: '-3.6s', duration: '5.8s' },

  { id: 'leaf-22', left: '-18px', top: '286px', size: '56px', rotate: 'rotate(14deg)', delay: '-2.1s', duration: '5.1s' },
  { id: 'leaf-23', left: '96px', top: '316px', size: '48px', rotate: 'rotate(-24deg)', delay: '-3.9s', duration: '5.4s' },
  { id: 'leaf-24', left: '216px', top: '286px', size: '54px', rotate: 'rotate(26deg)', delay: '-0.7s', duration: '5.7s' },
  { id: 'leaf-25', left: '336px', top: '316px', size: '46px', rotate: 'rotate(-18deg)', delay: '-2.4s', duration: '5s' },
  { id: 'leaf-26', left: '458px', top: '286px', size: '56px', rotate: 'rotate(30deg)', delay: '-4.4s', duration: '5.6s' },
  { id: 'leaf-27', left: '584px', top: '316px', size: '48px', rotate: 'rotate(-28deg)', delay: '-1.1s', duration: '5.3s' },
  { id: 'leaf-28', left: '690px', top: '292px', size: '58px', rotate: 'rotate(20deg)', delay: '-3.3s', duration: '5.9s' }
]

// ---- 搜索框全屏毛玻璃与发光交互逻辑 ----
const isSearching = ref(false)
const searchQuery = ref('')
const searchHistory = ref<string[]>([])

const emit = defineEmits(['tab-change'])

const activePortalTab = computed({
  get() {
    return props.activeTab
  },
  set(val) {
    emit('tab-change', val)
  }
})
const isAiMounted = ref(false)
const lastActiveNormalTab = ref<'home'>('home')

const handleSelectPatient = (name: string) => {
  const target = store.patients.find(p => p.name === name)
  if (target) {
    store.switchPatient(target.id)
  }
  store.showPatientSwitcher = false
}

// local reactive masking state for patient medical insurance card
const isInsuranceMasked = ref(true)

const activePatientName = computed(() => {
  const rawName = store.activePatient.name
  if (isInsuranceMasked.value) {
    return maskName(rawName)
  }
  return rawName
})

const activePatientAvatar = computed(() => store.activePatient.avatar)

const activeInsuranceLabel = computed(() => store.activePatient.insuranceLabel || '医保')

const displayInsuranceLabel = computed(() => {
  const label = activeInsuranceLabel.value
  if (label === '健康卡' || label === '电子健康卡') return '健康卡'
  if (label === '社保卡' || label === '医保卡' || label === '医保') return '医保'
  if (label === '就诊卡') return '就诊卡'
  if (label === '就诊卡自费卡' || label === '就诊卡(自费)' || label === '自费') return '自费'
  return label
})

const activeInsuranceTagClass = computed(() => {
  const label = activeInsuranceLabel.value
  if (label === '健康卡' || label === '电子健康卡') return 'is-health'
  if (label === '就诊卡' || label === '就诊卡自费卡' || label === '就诊卡(自费)' || label === '自费') return 'is-zifei'
  return 'is-yibao'
})

const activePatientDesc = computed(() => {
  const card = store.activePatient.cardNo
  if (isInsuranceMasked.value) {
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

const handleSwitchPatient = () => {
  console.log('[TAP LOG] handleSwitchPatient triggered')
  store.showPatientSwitcher = true
}

const handlePrimaryClick = () => {
  console.log('[TAP LOG] handlePrimaryClick triggered')
  Taro.showModal({
    title: '健康码',
    content: '请在医院终端或人工窗口出示您的电子健康卡二维码。',
    showCancel: false,
    confirmText: '确定'
  })
}

const toggleInsuranceMask = (e?: any) => {
  console.log('[TAP LOG] toggleInsuranceMask start - isInsuranceMasked before:', isInsuranceMasked.value)
  isInsuranceMasked.value = !isInsuranceMasked.value
  console.log('[TAP LOG] toggleInsuranceMask end - isInsuranceMasked after:', isInsuranceMasked.value)
}

const handleCardTap = (e?: any) => {
  console.log('[TAP LOG] handleCardTap (Patient Card) received tap, target class:', e?.target?.className)
}

const navScrollTop = ref(0)
const isNavScrolled = ref(false)

const showIntroDialog = ref(false)
const dialogTitle = ref('')
const dialogMessage = ref<string[]>([])

// Scroll logic encapsulator
const handleScroll = (scrollTopVal: number) => {
  const next = scrollTopVal || 0
  const scrolled = next > 0
  if (isNavScrolled.value !== scrolled) {
    isNavScrolled.value = scrolled
    if (!isWeapp || props.visible) {
      Taro.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: scrolled ? '#ffffff' : '#DAF1CF'
      }).catch(() => {})
    }
  }
  navScrollTop.value = next
}

// Watch scrollTop passed from the Host page (WeChat)
watch(() => props.scrollTop, (newVal) => {
  if (isWeapp && props.visible) {
    handleScroll(newVal || 0)
  }
}, { immediate: true })

// Native scroll listener for Alipay/H5
if (!isWeapp) {
  usePageScroll((res) => {
    handleScroll(res.scrollTop || 0)
  })
}

// Emulate visibility didShow/didHide hooks
const handleTabShow = () => {
  console.log('[Home Tab] handleTabShow')
  store.syncFromStorage()
  isSearching.value = false
  searchQuery.value = ''
  store.isSearchingGlobal = false
  Taro.eventCenter.trigger('tabbar-bubble-control', 'start')
  const scrolled = isNavScrolled.value
  Taro.setNavigationBarColor({
    frontColor: '#000000',
    backgroundColor: scrolled ? '#ffffff' : '#DAF1CF'
  }).catch(() => {})
}

const handleTabHide = () => {
  console.log('[Home Tab] handleTabHide')
  isSearching.value = false
  Taro.eventCenter.trigger('tabbar-bubble-control', 'stop')
}

const isTabActive = computed(() => {
  if (isWeapp) {
    return props.visible && props.pageVisible
  }
  return true
})

watch(isTabActive, (active) => {
  if (isWeapp) {
    if (active) {
      handleTabShow()
    } else {
      handleTabHide()
    }
  }
}, { immediate: true })

if (!isWeapp) {
  useDidShow(() => {
    handleTabShow()
  })
  useDidHide(() => {
    handleTabHide()
  })
}

// Feature Toggle: Set to 'four-tiles' for the new 4-tile layout, 'three-tiles' for the old solid 3-tile layout, or 'three-tiles-light' for the light 3-tile layout
const activeTileLayout = ref<'four-tiles' | 'three-tiles' | 'three-tiles-light'>('three-tiles-light')

import tileTitleFourRegister from '@/assets/images/门户首页/瓷片区/孟超专用4个/预约挂号.png'
import tileIconFourRegister from '@/assets/images/门户首页/瓷片区/孟超专用4个/预约挂号icon.png'
import tileTitleFourPay from '@/assets/images/门户首页/瓷片区/孟超专用4个/结算服务.png'
import tileIconFourPay from '@/assets/images/门户首页/瓷片区/孟超专用4个/结算服务icon.png'
import tileTitleFourConsult from '@/assets/images/门户首页/瓷片区/孟超专用4个/在线复诊.png'
import tileIconFourConsult from '@/assets/images/门户首页/瓷片区/孟超专用4个/在线复诊icon.png'
import tileTitleFourReport from '@/assets/images/门户首页/瓷片区/孟超专用4个/报告查询.png'
import tileIconFourReport from '@/assets/images/门户首页/瓷片区/孟超专用4个/报告查询icon.png'

// Card static images
const fzHomeAsset = (name: string) => `https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E7%A6%8F%E5%B7%9E%E4%B8%AD%E5%8C%BB%E9%99%A2/%E9%A6%96%E9%A1%B5/${encodeURIComponent(name)}`
const fzHomeTitleAsset = (name: string) => `https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E7%A6%8F%E5%B7%9E%E4%B8%AD%E5%8C%BB%E9%99%A2/%E9%A6%96%E9%A1%B5/%E7%99%BD%E5%AD%97%E6%A0%87%E9%A2%98/${encodeURIComponent(name)}`

const hospitalLogo = fzHomeAsset('福州中医院logo.png')
const tileTitleRegister = fzHomeTitleAsset('快速复诊.png')
const tileTitlePay = fzHomeTitleAsset('续方申请.png')
const tileTitleReport = fzHomeTitleAsset('预约挂号.png')
const tileIconOnline = fzHomeAsset('在线问诊.png')
const tileIconRegister = fzHomeAsset('快速复诊.png')
const tileIconPay = fzHomeAsset('续方申请.png')
const tileIconReport = fzHomeAsset('预约挂号.png')
const tileIconPrescription = fzHomeAsset('我的处方.png')

const primaryActionTiles = [
  { name: '在线问诊', icon: tileIconOnline, badge: '医保' },
  { name: '续方申请', icon: tileIconPay },
  { name: '预约挂号', icon: tileIconReport },
  { name: '我的处方', icon: tileIconPrescription }
]

// Shortcut Buttons Data (Internet Hospital Tiles)
const quickTiles = [
  { name: '院内制剂', desc: '百年传承 | 经典良方', icon: fzHomeAsset('院内制剂.png'), className: 'portal-home__tile-service--preparation' },
  { name: '药膳茶饮', desc: '药食同源 | 养生有方', icon: fzHomeAsset('药膳茶饮.png'), className: 'portal-home__tile-service--tea' },
  { name: '外治良方', desc: '贴敷熏洗 | 绿色疗法', icon: fzHomeAsset('外治良方.png'), className: 'portal-home__tile-service--therapy' },
  { name: '三伏灸', desc: '冬病夏治 | 限时开放', icon: fzHomeAsset('健康商城.png'), className: 'portal-home__tile-service--mall' }
]

// Article static images
const articleSummerImg = fzHomeAsset('article_tcm_summer_simple.jpg')
const articleSpleenImg = fzHomeAsset('article_tcm_spleen_simple.jpg')
const articleMoxaImg = fzHomeAsset('article_tcm_moxa_simple.jpg')
const articleSanfutieImg = fzHomeAsset('article_tcm_sanfutie_better.jpg')
const articleAcupointImg = fzHomeAsset('article_tcm_acupoint_simple.jpg')

// ---- 金刚区平铺网格数据配置 ----
const serviceTabs = ref([
  {
    title: '门诊服务',
    items: [
      { name: '预约挂号', icon: iconYuyueGuahao },
      { name: '签到叫号', icon: iconHuizhenQiandao },
      { name: '门诊结算', icon: iconMenzhenJiesuan },
      { name: '预交金退款', icon: iconYujiaojinTuikuan },
      { name: '门诊充值', icon: iconMenzhenChongzhi },
      { name: '信用就医', icon: iconXinyongJiuyi },
      { name: '报告查询', icon: iconBaogaoChaxun },
      { name: '云胶片', icon: iconYunJiaopian },
      { name: '门诊记录', icon: iconMenzhenJilu },
      { name: '检查预约', icon: iconJianchaYuyue }
    ]
  },
  {
    title: '住院服务',
    items: [
      { name: '住院充值', icon: iconZhuyuanChongzhi },
      { name: '住院记录', icon: iconZhuyuanJilu },
      { name: '住院日清单', icon: iconZhuyuanRiqingdan }
    ]
  },
  {
    title: '便民服务',
    items: [
      { name: '医院介绍', icon: iconYiyuanJieshao },
      { name: '来院导航', icon: iconLaiyuanDaohang },
      { name: '健康管理中心', icon: iconJiankangGuanli },
      { name: '院长信箱', icon: iconYijianFankui },
      { name: '便民邮寄', icon: iconBianminJisong },
      { name: '电子锦旗', icon: iconManyiduPingjia },
      { name: '表扬信', icon: iconYijianFankui },
      { name: '患者签名', icon: iconYonghuHuaxiang },
      { name: '体检服务', icon: iconJiankangTijian },
      { name: '电子票据', icon: iconDianzifapiao },
      { name: '就医指南', icon: iconJiuyiZhinan },
      { name: '医保电子凭证', icon: iconYibaoPingzheng },
      { name: '护理上门', icon: iconHuliShangmen }
    ]
  }
])

const menuButtonInfo = getSafeMenuButtonBoundingClientRect()

watch(isSearching, (val) => {
  store.isSearchingGlobal = val
})

onMounted(() => {
  Taro.eventCenter.on('switchTab', (tab: 'home' | 'message' | 'user') => {
    activePortalTab.value = tab
  })
})

onUnmounted(() => {
  Taro.eventCenter.off('switchTab')
  store.isSearchingGlobal = false
})

// 4套滚动推荐文案（间隔2秒循环播放，长文案单行省略）
const searchPlaceholders = [
  '想要查找的功能服务、科室和医生等信息',
  '在线问诊、续方申请、预约挂号一站办理',
  '热门科室推荐及名医专家介绍实时更新',
  '门诊缴费、住院充值与检查检验报告查询'
]

const commonDepts = ['非病毒性肝病科', '重症肝病科', '慢性肝病科', '代谢性肝病科', '心血管内科', '妊娠及中毒性肝病科']
const hotDoctors = ['张明娜', '李启铭', '宋元林', '周梅仙', '杨学城', '颜小青']
const hotFeatures = ['预约挂号', '检查预约', '门诊结算', '报告查询', '云胶片', '门诊记录', '来院导航', '医保电子凭证']

const statConsultIcon = 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E9%97%A8%E6%88%B73.0%E5%88%87%E5%9B%BE%E8%B5%84%E6%BA%90/%E9%97%A8%E6%88%B7%E9%A6%96%E9%A1%B5/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%E5%A4%B9/stat_volume.png'
const statScoreIcon = 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E9%97%A8%E6%88%B73.0%E5%88%87%E5%9B%BE%E8%B5%84%E6%BA%90/%E9%97%A8%E6%88%B7%E9%A6%96%E9%A1%B5/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%E5%A4%B9/stat_score.png'
const statFollowIcon = 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E9%97%A8%E6%88%B73.0%E5%88%87%E5%9B%BE%E8%B5%84%E6%BA%90/%E9%97%A8%E6%88%B7%E9%A6%96%E9%A1%B5/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%E5%A4%B9/stat_follow.png'
const shortcutSigninIcon = 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E9%97%A8%E6%88%B73.0%E5%88%87%E5%9B%BE%E8%B5%84%E6%BA%90/%E9%97%A8%E6%88%B7%E9%A6%96%E9%A1%B5/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%E5%A4%B9/shortcut_signin.png'

const functionCatalog = [
  { name: '预约挂号', desc: '选择科室、医生与号源时间', route: '/pages/appointment/department/index', icon: tileIconFourRegister, keywords: ['预约', '挂号', '门诊预约', '医生预约'] },
  { name: '在线复诊', desc: '选择医生并预约线上复诊时间', route: '/pages/appointment/department/index?mode=consult', icon: tileIconFourConsult, keywords: ['在线复诊', '复诊', '线上复诊', '问诊'] },
  { name: '门诊结算', desc: '查询并缴纳门诊待缴费用', route: '/pages/common-list/settlement-payment/index', icon: tileIconFourPay, keywords: ['缴费', '结算', '门诊缴费', '费用'] },
  { name: '门诊充值', desc: '在线办理门诊预存充值', route: '/pages/common-list/recharge-record/index', icon: iconMenzhenChongzhi, keywords: ['充值', '门诊充值'] },
  { name: '预交金退款', desc: '办理门诊预交金退款申请', route: '/pages/common-list/refund/index', icon: iconYujiaojinTuikuan, keywords: ['退款', '预交金退款'] },
  { name: '信用就医', desc: '查看信用就医签约与服务', route: '/pages/common-list/credit-medical/index', icon: iconXinyongJiuyi, keywords: ['信用就医', '信用'] },
  { name: '检查预约', desc: '预约检查检验项目与时间', route: '/pages/common-list/check-appointment/index', icon: iconJianchaYuyue, keywords: ['检查预约', '检查', '检验预约', '医技预约'] },
  { name: '报告查询', desc: '查看检查、检验与门诊报告', route: '/pages/common-list/report-list/index', icon: tileIconFourReport, keywords: ['报告', '检查', '检验', '报告查询'] },
  { name: '云胶片', desc: '查看影像胶片和检查资料', route: '/pages/common-list/cloud-film/index', icon: iconYunJiaopian, keywords: ['云胶片', '胶片', '影像'] },
  { name: '门诊取号', desc: '查看预约并进行门诊取号', route: '/pages/common-list/appointment-signin/index', icon: shortcutSigninIcon, keywords: ['取号', '签到', '门诊取号'] },
  { name: '就诊记录', desc: '查看历史门诊就诊记录', route: '/pages/common-list/clinic-record/index', icon: iconMenzhenJilu, keywords: ['记录', '就诊记录', '门诊记录'] },
  { name: '住院充值', desc: '办理住院预交金充值', route: '/pages/common-list/inpatient-recharge/index', icon: iconZhuyuanChongzhi, keywords: ['住院充值', '住院缴费'] },
  { name: '住院记录', desc: '查看住院信息、费用与清单', route: '/pages/common-list/inpatient-record/index', icon: iconZhuyuanJilu, keywords: ['住院', '住院记录', '住院费用'] },
  { name: '住院日清单', desc: '查看住院每日费用清单', route: '/pages/common-list/inpatient-daily-list/index', icon: iconZhuyuanRiqingdan, keywords: ['住院日清单', '住院清单', '费用清单'] },
  { name: '来院导航', desc: '查看院区地址与导航路线', route: '/pages/common-list/navigation/index', icon: iconLaiyuanDaohang, keywords: ['导航', '地址', '来院导航', '路线'] },
  { name: '科室介绍', desc: '了解医院科室与特色专科', route: '/pages/common-list/dept-intro/index', icon: iconKeshiJieshao, keywords: ['科室介绍', '科室', '专科'] },
  { name: '医生介绍', desc: '了解专家医生与擅长方向', route: '/pages/common-list/doctor-intro/index', icon: iconYishengJieshao, keywords: ['医生介绍', '医生', '专家'] },
  { name: '医院介绍', desc: '了解医院概况与院区信息', route: '/pages/common-list/hospital-intro/index', icon: iconYiyuanJieshao, keywords: ['医院介绍', '医院'] },
  { name: '健康管理中心', desc: '查看健康管理服务', route: '/pages/common-list/health-management/index', icon: iconJiankangGuanli, keywords: ['健康管理中心', '健康管理'] },
  { name: '院长信箱', desc: '提交意见建议与反馈', route: '/pages/common-list/dean-mailbox/index', icon: iconYijianFankui, keywords: ['院长信箱', '信箱', '反馈'] },
  { name: '便民邮寄', desc: '办理材料邮寄服务', route: '/pages/common-list/convenient-mail/index', icon: iconBianminJisong, keywords: ['便民邮寄', '便民寄送', '邮寄'] },
  { name: '电子锦旗', desc: '提交电子锦旗与感谢', route: '/pages/common-list/e-pennant/index', icon: iconManyiduPingjia, keywords: ['电子锦旗', '锦旗'] },
  { name: '表扬信', desc: '提交表扬与感谢信息', route: '/pages/common-list/praise-letter/index', icon: iconYijianFankui, keywords: ['表扬信', '表扬'] },
  { name: '患者签名', desc: '查看或完成患者签名', route: '/pages/common-list/patient-signature/index', icon: iconYonghuHuaxiang, keywords: ['患者签名', '签名'] },
  { name: '体检服务', desc: '查看体检服务与预约', route: '/pages/common-list/health-exam/index', icon: iconJiankangTijian, keywords: ['体检服务', '健康体检', '体检'] },
  { name: '电子票据', desc: '查看电子发票与票据', route: '/pages/common-list/invoice/index', icon: iconDianzifapiao, keywords: ['电子票据', '发票', '票据'] },
  { name: '医保电子凭证', desc: '查看医保电子凭证服务', route: '/pages/common-list/medical-insurance-voucher/index', icon: iconYibaoPingzheng, keywords: ['医保电子凭证', '医保凭证'] },
  { name: '护理上门', desc: '预约护理上门服务', route: '/pages/common-list/home-nursing/index', icon: iconHuliShangmen, keywords: ['护理上门', '护理'] },
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
  return doctor.gender === 'male' ? ['图文咨询', '视频问诊', '义诊咨询'] : ['图文咨询', '视频问诊']
}

const getDoctorScore = (doctor: any) => {
  return Math.round((Number.parseFloat(doctor.score) || 4.9) * 20)
}

const goDoctorDetail = (doctorId: string) => {
  Taro.navigateTo({
    url: `/pages/appointment/detail/index?doctorId=${encodeURIComponent(doctorId)}`
  })
}

const goDepartment = (name: string) => {
  Taro.navigateTo({
    url: `/pages/appointment/doctor/index?department=${encodeURIComponent(name)}`
  })
}

// 从本地持久化存储加载真实的搜索历史，并限制展示前 8 条
try {
  const localHistory = Taro.getStorageSync('portal_search_history')
  if (localHistory && Array.isArray(localHistory)) {
    searchHistory.value = localHistory.slice(0, 8)
  } else {
    searchHistory.value = []
  }
} catch (e) {
  console.error('Failed to init search history:', e)
}

const startSearch = () => {
  isSearching.value = true
}

const cancelSearch = () => {
  isSearching.value = false
  searchQuery.value = ''
  store.isSearchingGlobal = false
}

// 往本地持久化存储写入一条真实的搜索记录（置顶、唯一、最多 8 条）
const addToHistory = (kw: string) => {
  if (!kw || !kw.trim()) return
  const query = kw.trim()
  let list = [...searchHistory.value]
  // 保持唯一性：过滤掉已有的同名项
  list = list.filter(item => item !== query)
  // 置顶加入最前部
  list.unshift(query)
  // 限制最多保留 8 条记录
  if (list.length > 8) {
    list = list.slice(0, 8)
  }
  searchHistory.value = list
  try {
    Taro.setStorageSync('portal_search_history', list)
  } catch (e) {
    console.error('Failed to save search history:', e)
  }
}

const goSearchResult = (kw: string) => {
  const query = kw.trim()
  if (!query) return
  searchQuery.value = query
  Taro.navigateTo({
    url: getRouteUrl(`/pages/common-list/search-result/index?keyword=${encodeURIComponent(query)}`),
    fail(err) {
      console.error('navigateTo search result failed, pages:', getCurrentPages().length, getCurrentPages().map(page => page.route), err)
    }
  })
}

const quickSearch = (kw: string) => {
  addToHistory(kw)
  goSearchResult(kw)
}

const goDoctorDetailByName = (name: string) => {
  const doctor = allSearchDoctors.value.find(d => d.name === name)
  if (doctor && doctor.id) {
    goDoctorDetail(doctor.id)
  } else {
    quickSearch(name)
  }
}

const onSearchConfirm = () => {
  const query = searchQuery.value.trim()
  if (!query) return
  addToHistory(query)
  goSearchResult(query)
}

const deleteHistoryItem = (item: string) => {
  const list = searchHistory.value.filter(h => h !== item)
  searchHistory.value = list
  try {
    Taro.setStorageSync('portal_search_history', list)
  } catch (e) {
    console.error('Failed to delete history item:', e)
  }
}

const clearHistory = () => {
  searchHistory.value = []
  try {
    Taro.setStorageSync('portal_search_history', [])
    Taro.showToast({
      title: '已清空历史记录',
      icon: 'none'
    })
  } catch (e) {
    console.error('Failed to clear search history:', e)
  }
}

// Specialty Departments Data
const departments = [
  { id: 'skin', name: '皮肤科', icon: deptSkinIcon },
  { id: 'pediatrics', name: '儿科', icon: deptErkeIcon },
  { id: 'ophthalmology', name: '眼科', icon: deptYankeIcon },
  { id: 'orthopedics', name: '骨科', icon: deptGukeIcon },
  { id: 'obgyn', name: '妇产科', icon: deptFuchankeIcon },
  { id: 'cardiology', name: '心脏内科', icon: deptXinneikeIcon },
  { id: 'gastroenterology', name: '消化科', icon: deptXiaohuakeIcon },
  { id: 'acupuncture', name: '针灸科', icon: deptZhenjiukeIcon }
]

// Health Articles Data
const articles = [
  {
    title: '夏季养生重在养心，中医教你如何防暑降温',
    date: '2026年6月25日',
    image: articleSummerImg
  },
  {
    title: '脾胃虚弱怎么调理？试试这几款经典食疗药膳',
    date: '2026年6月18日',
    image: articleSpleenImg
  },
  {
    title: '天天艾灸真的好吗？中医详解艾灸的正确打开方式',
    date: '2026年6月10日',
    image: articleMoxaImg
  },
  {
    title: '冬病夏治正当时，三伏贴防病保健全攻略',
    date: '2026年6月2日',
    image: articleSanfutieImg
  },
  {
    title: '神奇的穴位按摩：按压这三个穴位能有效缓解疲劳',
    date: '2026年5月20日',
    image: articleAcupointImg
  }
]

const handleCardClick = (name: string, categoryTitle?: string) => {
  if (name === '智能导诊' || name === '智能客服') {
    Taro.navigateTo({
      url: '/pages/appointment/ai-assistant/index',
      fail(err) {
        console.error('Navigate to AI assistant page failed', err)
      }
    })
    cancelSearch()
    return
  }

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
    Taro.navigateTo({ url: `/pages/common-list/all-services/index?category=${cat}` })
    return
  }

  const routesMap: Record<string, string> = {
    '在线问诊': '/pages/appointment/department/index?mode=consult',
    '预约挂号': '/pages/appointment/department/index',
    '去预约': '/pages/appointment/department/index',
    '快速复诊': '/pages/appointment/department/index?mode=consult',
    '在线复诊': '/pages/appointment/department/index?mode=consult',
    '续方申请': '/pages/common-list/medication-refill/index',
    '中药续方': '/pages/common-list/medication-refill/index',
    '结算服务': '/pages/common-list/settlement-payment/index',
    '报告查询': '/pages/common-list/report-list/index',
    '我的处方': '/pages/common-list/prescription-record/index',
    '云胶片': '/pages/common-list/cloud-film/index',
    '门诊签到': '/pages/common-list/appointment-signin/index',
    '签到叫号': '/pages/common-list/appointment-signin/index',
    '检查开单': '/pages/common-list/self-order/index',
    '检查预约': '/pages/common-list/check-appointment/index',
    '医技预约': '/pages/common-list/check-appointment/index',
    '候诊叫号': '/pages/common-list/clinic-queue/index',
    '排队叫号': '/pages/common-list/clinic-queue/index',
    '取药信息': '/pages/common-list/pickup-medicine/index',
    '院内导航': '/pages/common-list/navigation/index',
    '电子票夹': '/pages/common-list/invoice/index',
    '电子票据': '/pages/common-list/invoice/index',
    '医院介绍': '/pages/common-list/hospital-intro/index',
    '健康管理中心': '/pages/common-list/health-management/index',
    '院长信箱': '/pages/common-list/dean-mailbox/index',
    '便民邮寄': '/pages/common-list/convenient-mail/index',
    '电子锦旗': '/pages/common-list/e-pennant/index',
    '表扬信': '/pages/common-list/praise-letter/index',
    '患者签名': '/pages/common-list/patient-signature/index',
    '医保电子凭证': '/pages/common-list/medical-insurance-voucher/index',
    '护理上门': '/pages/common-list/home-nursing/index',
    '来院导航': '/pages/common-list/navigation/index',
    '科室介绍': '/pages/common-list/dept-intro/index',
    '医生介绍': '/pages/common-list/doctor-intro/index',
    '就诊须知': '/pages/common-list/medical-guide/index',
    '病理复印': '/pages/common-list/pathology/index',
    '充值记录': '/pages/common-list/recharge-record/index',
    '门诊充值': '/pages/common-list/recharge-record/index',
    '预交金退款': '/pages/common-list/refund/index',
    '信用就医': '/pages/common-list/credit-medical/index',
    '住院充值': '/pages/common-list/inpatient-recharge/index',
    '住院记录': '/pages/common-list/inpatient-record/index',
    '住院日清单': '/pages/common-list/inpatient-daily-list/index',
    '住院清单': '/pages/common-list/inpatient-daily-list/index',
    '开药记录': '/pages/common-list/prescription-record/index',
    '健康体检': '/pages/common-list/health-exam/index',
    '体检服务': '/pages/common-list/health-exam/index',
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
    '自助开单': '/pages/common-list/self-order/index',
    '在线续方': '/pages/common-list/medication-refill/index',
    '三伏灸': '/pages/winter-summer-treatment/index'
  }

  if (routesMap[name]) {
    Taro.navigateTo({
      url: routesMap[name],
      fail(err) {
        console.error('navigateTo fail', err, 'current page stack:', getCurrentPages().length)
      }
    })
    return
  }

  const isDept = departments.some(d => d.name === name)
  if (isDept) {
    Taro.navigateTo({
      url: `/pages/appointment/doctor/index?department=${encodeURIComponent(name)}`
    })
    return
  }
}

const handleMoreClick = (name: string) => {
  if (name === '健康科普') {
    Taro.navigateTo({ url: '/pages/common-list/article-list/index' })
  } else if (name === '特色科室') {
    Taro.navigateTo({ url: '/pages/common-list/dept-intro/index' })
  } else if (name === '名医专家') {
    Taro.navigateTo({ url: '/pages/common-list/famous-doctor/index' })
  } else if (name === '历史就诊医生') {
    Taro.navigateTo({ url: '/pages/common-list/my-doctor/index' })
  } else {
    Taro.showToast({
      title: `查看更多: ${name}`,
      icon: 'none'
    })
  }
}

const handleArticleClick = (item: any) => {
  const index = articles.indexOf(item)
  Taro.navigateTo({
    url: `/pages/common-list/article-detail/index?id=${index >= 0 ? index : 0}`
  })
}

const handleSpecialtyBannerClick = (index: number) => {
  if (index === 0) {
    Taro.navigateTo({
      url: '/pages/winter-summer-treatment/index',
      fail(err) {
        console.error('Navigate to winter summer treatment page failed:', err)
      }
    })
  } else {
    Taro.navigateTo({
      url: '/pages/common-list/article-detail/index?id=0',
      fail(err) {
        console.error('Navigate to Summer health article failed:', err)
      }
    })
  }
}

const variableBannerUrl = 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E7%A6%8F%E5%B7%9E%E4%B8%AD%E5%8C%BB%E9%99%A2/%E9%A6%96%E9%A1%B5/%E5%8F%98%E9%87%8F%E7%89%88%E6%9C%AC/banner.png?v=20260630'
const variableSpecialtyItems = [
  { name: '皮肤科', desc: '中西医结合祛痘淡斑', icon: 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E7%A6%8F%E5%B7%9E%E4%B8%AD%E5%8C%BB%E9%99%A2/%E9%A6%96%E9%A1%B5/%E5%8F%98%E9%87%8F%E7%89%88%E6%9C%AC/%E7%9A%AE%E8%82%A4%E7%A7%91.png?v=20260626-2', subtitleColor: '#197dba' },
  { name: '减重科', desc: '中医调理科学减重', icon: 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E7%A6%8F%E5%B7%9E%E4%B8%AD%E5%8C%BB%E9%99%A2/%E9%A6%96%E9%A1%B5/%E5%8F%98%E9%87%8F%E7%89%88%E6%9C%AC/%E5%87%8F%E9%87%8D%E7%A7%91.png', subtitleColor: '#1a838a' },
  { name: '中医治未病科', desc: '未病先防体质调理', icon: 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E7%A6%8F%E5%B7%9E%E4%B8%AD%E5%8C%BB%E9%99%A2/%E9%A6%96%E9%A1%B5/%E5%8F%98%E9%87%8F%E7%89%88%E6%9C%AC/%E4%B8%AD%E5%8C%BB%E7%A7%91.png', subtitleColor: '#e95568' }
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const variableServiceTabs = computed(() => {
  return serviceTabs.value.filter(tab => tab.title !== '门诊服务')
})

// ---- AI Assistant Inline Logic ----
const isRecording = ref(false)
const isCancelState = ref(false)
const startY = ref(0)

interface BubbleItem {
  id: number
  text: string
  isLeaving?: boolean
  slotIndex: number // 1 to 8
  action?: () => void
}

const bubblePool = [
  {
    id: 1,
    text: '我要去预约挂号，帮我跳转 to 挂号页面',
    action: () => {
      Taro.navigateTo({
        url: '/pages/appointment/department/index',
        fail(err) {
          console.error(`Navigate to /pages/appointment/department/index failed. Page stack: ${Taro.getCurrentPages().length}`, err)
        }
      })
    }
  },
  {
    id: 2,
    text: '我要去结算，你帮我跳转 to 结算页面',
    action: () => {
      Taro.navigateTo({
        url: '/pages/common-list/settlement-payment/index',
        fail(err) {
          console.error(`Navigate to /pages/common-list/settlement-payment/index failed. Page stack: ${Taro.getCurrentPages().length}`, err)
          Taro.navigateTo({
            url: '/pages/common-list/settle-record/index',
            fail(fallbackErr) {
              console.error(`Navigate to fallback /pages/common-list/settle-record/index failed. Page stack: ${Taro.getCurrentPages().length}`, fallbackErr)
            }
          })
        }
      })
    }
  },
  {
    id: 3,
    text: '我想在手机上配药，帮我跳转 to 配药页面',
    action: () => {
      Taro.navigateTo({
        url: '/pages/common-list/medication-refill/index',
        fail(err) {
          console.error(`Navigate to /pages/common-list/medication-refill/index failed. Page stack: ${Taro.getCurrentPages().length}`, err)
        }
      })
    }
  },
  {
    id: 4,
    text: '我看完医生要取药，帮我打开取药页面',
    action: () => {
      Taro.navigateTo({
        url: '/pages/common-list/pickup-medicine/index',
        fail(err) {
          console.error(`Navigate to /pages/common-list/pickup-medicine/index failed. Page stack: ${Taro.getCurrentPages().length}`, err)
        }
      })
    }
  },
  {
    id: 5,
    text: '我的体检报告出来了，我想查询一下报告',
    action: () => {
      Taro.navigateTo({
        url: '/pages/common-list/report-list/index',
        fail(err) {
          console.error(`Navigate to /pages/common-list/report-list/index failed. Page stack: ${Taro.getCurrentPages().length}`, err)
        }
      })
    }
  },
  {
    id: 6,
    text: '我已经到医院了，帮我办理门诊签到',
    action: () => {
      Taro.navigateTo({
        url: '/pages/common-list/appointment-signin/index',
        fail(err) {
          console.error(`Navigate to /pages/common-list/appointment-signin/index failed. Page stack: ${Taro.getCurrentPages().length}`, err)
        }
      })
    }
  },
  {
    id: 7,
    text: '我想开具检查单，帮我打开检查开单页面',
    action: () => {
      Taro.navigateTo({
        url: '/pages/common-list/self-order/index',
        fail(err) {
          console.error(`Navigate to /pages/common-list/self-order/index failed. Page stack: ${Taro.getCurrentPages().length}`, err)
        }
      })
    }
  },
  {
    id: 8,
    text: '我想申请在线复诊，帮我选择复诊科室',
    action: () => {
      Taro.navigateTo({
        url: '/pages/appointment/department/index?mode=consult',
        fail(err) {
          console.error(`Navigate to /pages/appointment/department/index?mode=consult failed. Page stack: ${Taro.getCurrentPages().length}`, err)
        }
      })
    }
  }
]

const displayBubbles = ref<BubbleItem[]>([])
let bubbleCounter = 1
let aiTimer: any = null

function initDisplayBubbles() {
  const list: BubbleItem[] = []
  for (let i = 0; i < 8; i++) {
    const poolItem = bubblePool[i % bubblePool.length]
    list.push({
      id: bubbleCounter++,
      text: poolItem.text,
      slotIndex: i + 1,
      action: poolItem.action
    })
  }
  displayBubbles.value = list
}

function startScrollLoop() {
  aiTimer = setInterval(() => {
    scrollOneStep()
  }, 2000)
}

function scrollOneStep() {
  if (displayBubbles.value.length < 8) return

  displayBubbles.value[0].isLeaving = true

  for (let i = 0; i < displayBubbles.value.length; i++) {
    displayBubbles.value[i].slotIndex = i
  }

  setTimeout(() => {
    const leavingItem = displayBubbles.value.shift()
    if (leavingItem) {
      leavingItem.isLeaving = false

      const poolIndex = (bubbleCounter - 1) % bubblePool.length
      const poolItem = bubblePool[poolIndex]
      const newItem: BubbleItem = {
        id: bubbleCounter++,
        text: poolItem.text,
        slotIndex: 8,
        action: poolItem.action
      }
      displayBubbles.value.push(newItem)
    }

    for (let i = 0; i < displayBubbles.value.length; i++) {
      displayBubbles.value[i].slotIndex = i + 1
    }
  }, 600)
}

function handleBubbleTap(item: BubbleItem) {
  Taro.vibrateShort({ type: 'light' }).catch(() => {})
  if (item.action) {
    item.action()
  } else {
    Taro.showToast({
      title: `咨询“${item.text.slice(0, 8)}...”功能建设中`,
      icon: 'none'
    })
  }
}

function handleSpeakStart(e: any) {
  isRecording.value = true
  isCancelState.value = false
  if (e.touches && e.touches[0]) {
    startY.value = e.touches[0].clientY
  }
  Taro.vibrateShort({ type: 'medium' }).catch(() => {})
}

function handleSpeakMove(e: any) {
  if (!isRecording.value) return
  if (e.touches && e.touches[0]) {
    const currentY = e.touches[0].clientY
    const deltaY = startY.value - currentY
    if (deltaY > 60) {
      if (!isCancelState.value) {
        isCancelState.value = true
        Taro.vibrateShort({ type: 'light' }).catch(() => {})
      }
    } else {
      if (isCancelState.value) {
        isCancelState.value = false
      }
    }
  }
}

function handleSpeakEnd() {
  if (!isRecording.value) return
  isRecording.value = false
  if (isCancelState.value) {
    isCancelState.value = false
    Taro.showToast({
      title: '已取消发送',
      icon: 'none',
      duration: 1000
    })
  } else {
    Taro.showToast({
      title: '语音发送成功',
      icon: 'success',
      duration: 1000
    })
  }
}

const handleAiBack = () => {
  Taro.vibrateShort({ type: 'light' }).catch(() => {})
  isAiMounted.value = false
  setTimeout(() => {
    activePortalTab.value = lastActiveNormalTab.value
  }, 230)
  return true
}

watch(activePortalTab, (newVal, oldVal) => {
  if (newVal === 'ai') {
    if (oldVal === 'home') {
      lastActiveNormalTab.value = oldVal
    }
    initDisplayBubbles()
    if (aiTimer) clearInterval(aiTimer)
    startScrollLoop()
    isAiMounted.value = false
    Taro.nextTick(() => {
      setTimeout(() => {
        isAiMounted.value = true
      }, 50)
    })
  } else {
    if (newVal === 'home') {
      lastActiveNormalTab.value = newVal
    }
    if (aiTimer) {
      clearInterval(aiTimer)
      aiTimer = null
    }
  }
})

</script>
