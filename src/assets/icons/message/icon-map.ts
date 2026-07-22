/**
 * 消息中心 — 通知类图标映射
 *
 * 图标来源：Lucide Static v1.16.0（白色线性 SVG，stroke="currentColor"）
 * 展示方式：全局 .yh-secondary-row__icon 蓝色圆底 + 白色 SVG
 *
 * 颜色序列规则：蓝 → 青 → 橙 → 循环（映射到不同消息类型色调）
 */

import visitFlow          from './visit-flow.svg'
import inquiry            from './inquiry.svg'
import systemMessage      from './system-message.svg'
import orderNotice        from './order-notice.svg'
import exam               from './exam.svg'
import prescription       from './prescription.svg'
import renewPrescription  from './renew-prescription.svg'
import prescriptionRefund from './prescription-refund.svg'
import vitalSign          from './vital-sign.svg'
import settlementRemind   from './settlement-remind.svg'
import announcement       from './announcement.svg'
import reportNotice       from './report-notice.svg'
import medicineMessage    from './medicine-message.svg'
import visitRemind        from './visit-remind.svg'
import appointment        from './appointment.svg'
import settlementMessage  from './settlement-message.svg'
import medicalTech        from './medical-tech.svg'
import hospitalMessage    from './hospital-message.svg'
import pickupRemind       from './pickup-remind.svg'
import fundChange         from './fund-change.svg'
import operationNotice    from './operation-notice.svg'
import onlineConsult      from './online-consult.svg'

export interface MessageIcon {
  name: string
  icon: string
  desc: string
}

/**
 * 22 个通知类型图标（顺序即渲染顺序）
 */
export const messageIcons: MessageIcon[] = [
  { name: '就诊流程',       icon: visitFlow,          desc: '已预约了 2024/06/29 10:00' },
  { name: '问诊咨询',       icon: inquiry,            desc: '咨询订单支付成功通知' },
  { name: '系统消息',       icon: systemMessage,      desc: '系统信息通知' },
  { name: '订单通知',       icon: orderNotice,        desc: '订单消息通知' },
  { name: '检查检验',       icon: exam,               desc: '检查检验消息通知' },
  { name: '处方消息',       icon: prescription,       desc: '处方消息通知' },
  { name: '续方申请',       icon: renewPrescription,  desc: '续方申请消息通知' },
  { name: '处方退单消息',    icon: prescriptionRefund, desc: '处方退单消息通知' },
  { name: '体征异常',       icon: vitalSign,          desc: '体征异常预警通知' },
  { name: '结算提醒',       icon: settlementRemind,   desc: '结算批量消息通知' },
  { name: '公告消息',       icon: announcement,       desc: '公告消息通知' },
  { name: '报告单通知',     icon: reportNotice,       desc: '报告单消息通知' },
  { name: '处方消息',       icon: medicineMessage,    desc: '处方消息通知' },
  { name: '就诊提醒',       icon: visitRemind,        desc: '就诊提醒通知' },
  { name: '预约挂号',       icon: appointment,        desc: '预约挂号消息通知' },
  { name: '结算消息',       icon: settlementMessage,  desc: '结算消息通知' },
  { name: '医技消息',       icon: medicalTech,        desc: '医技消息通知' },
  { name: '住院消息',       icon: hospitalMessage,    desc: '住院消息通知' },
  { name: '取药提醒',       icon: pickupRemind,       desc: '取药提醒通知' },
  { name: '资金账户变更消息', icon: fundChange,        desc: '资金账户变更消息通知' },
  { name: '运营类通知消息',  icon: operationNotice,    desc: '运营类通知消息通知' },
  { name: '在线问诊消息',   icon: onlineConsult,      desc: '在线问诊消息通知' },
]

export default messageIcons
