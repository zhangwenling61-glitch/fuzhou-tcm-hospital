<template>
  <div class="yh-secondary-page protocol-page" :style="{ paddingTop: contentTop + 'px' }">
    <PortalNavBar title="用户协议" :scroll-top="scrollTop" secondary />

    <div class="yh-secondary-content protocol-content">
      <div class="yh-secondary-card doc-card">
        <h2 class="doc-title">互联网医院患者服务协议</h2>
        <p class="update-time">发布及生效日期：2026年01月01日</p>

        <div class="doc-body">
          <h3>一、总则</h3>
          <p>欢迎您使用本院“孟超肝胆智慧医院”移动应用及互联网诊疗服务（以下简称“本服务”）。本服务协议（以下简称“协议”）是您与福建医科大学孟超肝胆医院（以下简称“本院”）就诊疗预约、网络问诊、病历档案管理、处方续方、送药配送及电子支付等相关事宜所达成的具有法律效力的约定。</p>
          <p>在注册、登录并使用本服务前，请您务必仔细阅读、充分理解本协议各项条款内容。<strong>当您勾选并同意本协议，或进入注册使用流程时，即视为您已完全知悉并同意本协议的全部条款。</strong></p>

          <h3>二、服务内容与就诊规则</h3>
          <p>1. 本院通过移动客户端为您提供线上图文问诊、视频问诊、复诊处方开具、线下门诊挂号预约、报告单查询、就诊结算缴费及健康科普资讯等相关大健康与医疗业务功能。</p>
          <p>2. <strong>实名认证红线：</strong>为了保证医疗卫生安全与处方开具的法律责任追溯，使用本服务进行挂号及在线诊疗时，您必须提供本人真实且有效的身份证明及社会保障卡信息进行实名绑定。严禁以虚假身份注册或冒用他人医保卡就诊。如有违反，本院有权立即终止您的服务并保留移送司法机关的权力。</p>
          <p>3. <strong>急危重症特别声明：</strong>在线诊疗、互联网医院复诊服务仅适用于慢性病、常见病的复诊咨询与病情跟踪。<strong>若您或被接诊人处于急危重症状态（如剧烈腹痛、大出血、呼吸困难、意识不清等），请立即前往线下三甲医院急诊就医，切勿使用在线问诊以免延误病情。</strong></p>

          <h3>三、权利与义务</h3>
          <p>1. 用户应当妥善保管本人的账号及支付密码，通过该账号进行的一切挂号、问诊、支付操作均视为用户本人的行为，由用户承担全部法律责任。</p>
          <p>2. 医生在问诊中所提供的解答、用药指导和处方开具是基于用户在线上提供的图文病史叙述及检查报告。用户必须确保提供的数据、影像、病历描述的真实性与准确性。</p>

          <h3>四、免责条款</h3>
          <p>对于因通信网络故障、系统升级维护、服务器物理损坏、不可抗力事件（如台风、地震、流行疫病等引发的公共设施停摆）导致的问诊中断、通知延误、服务暂停等情况，本院在法律允许的范围内免于承担赔偿责任，但将竭尽全力第一时间进行系统抢修以保障用户的切身医疗权益。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePageScroll } from '@tarojs/taro'
import PortalNavBar from '@/components/PortalNavBar/index.vue'
import { getSafeMenuButtonBoundingClientRect } from '@/utils'
import './index.less'

const menuButtonInfo = getSafeMenuButtonBoundingClientRect()
const contentTop = menuButtonInfo.bottom + 16

const scrollTop = ref(0)
usePageScroll((res) => {
  scrollTop.value = res.scrollTop
})
</script>
