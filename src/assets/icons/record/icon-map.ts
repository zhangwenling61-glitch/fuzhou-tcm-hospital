/**
 * 个人中心 — 记录类图标映射
 *
 * 背景图（文件夹 PNG）：src/assets/images/个人中心/
 *   - 青.png  (青绿渐变)
 *   - 紫.png  (紫色渐变)
 *   - 蓝.png  (蓝色渐变)
 *
 * 前景图（白色线性 SVG）：src/assets/icons/record/
 *
 * 颜色序列规则：青 → 紫 → 蓝 → 循环
 */

// ── 背景 PNG ──────────────────────────────────────────────
import bgQing from '@/assets/images/个人中心/青.png'
import bgZi   from '@/assets/images/个人中心/紫.png'
import bgLan  from '@/assets/images/个人中心/蓝.png'

// ── 前景白色 SVG ──────────────────────────────────────────
import appointmentRecord  from './appointment_record.svg'
import rechargeRecord     from './recharge_record.svg'
import settlementRecord   from './settlement_record.svg'
import outpatientRecord   from './outpatient_record.svg'
import inpatientRecord    from './inpatient_record.svg'
import consultationRecord from './consultation_record.svg'
import drugOrder          from './drug_order.svg'
import report             from './report.svg'
import prescriptionRecord from './prescription_record.svg'
import pickupRecord       from './pickup_record.svg'
import outpatientReport   from './outpatient_report.svg'
import inpatientReport    from './report.svg'          // 住院报告复用 file-text
import myDoctor           from './my_doctor.svg'
import creditMedical      from './credit_medical.svg'
import general            from './general.svg'

// ── 颜色序列（青→紫→蓝 循环） ────────────────────────────
const SEQ = [bgQing, bgZi, bgLan] as const
type BgColor = typeof SEQ[number]

export interface RecordIcon {
  name: string
  icon: string   // 前景白色 SVG
  bg: BgColor    // 背景 PNG（文件夹色彩）
}

/**
 * 16 个记录类图标（顺序即渲染顺序，颜色按 青→紫→蓝 自动循环）
 */
export const recordIcons: RecordIcon[] = [
  { name: '预约记录', icon: appointmentRecord,  bg: bgQing },  // 1 青
  { name: '充值记录', icon: rechargeRecord,     bg: bgZi   },  // 2 紫
  { name: '结算记录', icon: settlementRecord,   bg: bgLan  },  // 3 蓝
  { name: '门诊记录', icon: outpatientRecord,   bg: bgQing },  // 4 青
  { name: '住院记录', icon: inpatientRecord,    bg: bgZi   },  // 5 紫
  { name: '问诊记录', icon: consultationRecord, bg: bgLan  },  // 6 蓝
  { name: '购药订单', icon: drugOrder,          bg: bgQing },  // 7 青
  { name: '配药申请', icon: report,             bg: bgZi   },  // 8 紫
  { name: '开药记录', icon: prescriptionRecord, bg: bgLan  },  // 9 蓝
  { name: '取药记录', icon: pickupRecord,       bg: bgQing },  // 10 青
  { name: '门诊报告', icon: outpatientReport,   bg: bgZi   },  // 11 紫
  { name: '住院报告', icon: inpatientReport,    bg: bgLan  },  // 12 蓝
  { name: '我的医生', icon: myDoctor,           bg: bgQing },  // 13 青
  { name: '信用就医', icon: creditMedical,      bg: bgZi   },  // 14 紫
  { name: '通用图标', icon: general,            bg: bgLan  },  // 15 蓝（补全）
  { name: '通用图标', icon: general,            bg: bgQing },  // 16 青（补全）
]

/** 按名称查找（返回第一个匹配项） */
export function getRecordIcon(name: string): RecordIcon | undefined {
  return recordIcons.find(item => item.name === name)
}

export default recordIcons
