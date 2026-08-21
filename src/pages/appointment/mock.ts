import { AVATAR_MAP } from '@/utils/avatar'

export const routeMap = {
  department: '/pages/appointment/department/index',
  doctor: '/pages/appointment/doctor/index',
  detail: '/pages/appointment/detail/index',
  confirm: '/pages/appointment/confirm/index',
  result: '/pages/appointment/result/index',
  my: '/pages/appointment/my/index',
  home: '/pages/home/index'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const avatarMap = {
  doctorMan: AVATAR_MAP.doctorMale,
  doctorWoman: AVATAR_MAP.doctorFemale,
  user: 'https://foruda.gitee.com/images/1779939037698922393/695edf87_16918445.png'
}

export const dateTabs = [
  { id: 'all', week: '全部', date: '' },
  { id: '05-26', week: '周二', date: '05-26' },
  { id: '05-27', week: '周三', date: '05-27' },
  { id: '05-28', week: '周四', date: '05-28' },
  { id: '05-29', week: '周五', date: '05-29' },
  { id: '05-30', week: '周六', date: '05-30' }
]

// Deterministic pseudo-random number generator
export function createRandom(seedStr: string) {
  let h = 0
  for (let i = 0; i < seedStr.length; i++) {
    h = seedStr.charCodeAt(i) + ((h << 5) - h)
  }
  return {
    next() {
      h = (h * 1664525 + 1013904223) | 0
      return (h >>> 0) / 0xffffffff
    },
    nextInt(min: number, max: number) {
      return Math.floor(this.next() * (max - min + 1)) + min
    },
    pick<T>(arr: T[]): T {
      return arr[this.nextInt(0, arr.length - 1)]
    },
    shuffle<T>(arr: T[]): T[] {
      const copy = [...arr]
      for (let i = copy.length - 1; i > 0; i--) {
        const j = this.nextInt(0, i)
        const temp = copy[i]
        copy[i] = copy[j]
        copy[j] = temp
      }
      return copy
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FAMILY_NAMES = ['张', '王', '李', '刘', '赵', '陈', '杨', '黄', '吴', '周', '徐', '孙', '马', '朱', '胡', '郭', '何', '高', '林', '郑', '梁', '谢', '宋', '唐', '许', '韩', '邓', '曹', '彭', '曾']
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MALE_GIVENS = ['志强', '建国', '国庆', '伟德', '启铭', '学城', '峥茗', '毅达', '明杰', '智轩', '建明', '元林', '子豪', '宇轩', '博涛', '泽洋', '天宇', '皓轩', '致远', '俊杰', '雨泽', '烨磊', '晟睿', '文博', '明阳', '鸿涛']
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FEMALE_GIVENS = ['丽华', '明娜', '小青', '妮可', '晓雯', '淑文', '美玲', '雅琴', '雪梅', '雨婷', '梦琪', '欣怡', '佳莹', '思涵', '梓萱', '诗涵', '海燕', '丽娟', '晓婷', '雅雯', '梦瑶', '雪怡', '欣蕾', '钰晴', '佩仪']

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const INTRO_TEMPLATES = [
  '从事{dept}临床工作{years}年，在{tag1}、{tag2}及{tag3}的诊治与系统调理方面积累了极其丰富的临床经验。',
  '现任{dept}核心专家。主张以患者为中心，深研学术理论，推崇个体化精准医疗方案，在{tag1}和{tag2}的临床实践中取得了突出成果。',
  '主要从事{dept}慢病健康管理与临床工作。倡导“治未病”理念与心身共治的综合干预模式，对{tag1}、{tag2}有深入独到的见解。',
  '具有二十余年丰富的{dept}诊疗实践。医术精湛、工作热忱，对{tag1}、{tag2}及{tag3}的规范化诊疗具有深厚的学术造诣，深受患者信赖。'
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TAGS_POOL: Record<string, string[]> = {
  '非病毒性肝病科': ['脂肪肝慢病', '酒精性肝病', '药物性肝损伤', '肝脏健康评估'],
  '重症肝病科': ['重症肝炎', '人工肝支持', '肝硬化腹水', '肝衰竭抢救'],
  '慢性肝病科': ['慢性乙肝诊疗', '丙肝规范化治疗', '自身免疫性肝病', '肝硬化管理'],
  '代谢性肝病科': ['糖尿病合并肝病', '高脂血症脂肪肝', '肥胖相关肝损伤', '代谢调理'],
  '心血管内科': ['高血压规范治疗', '冠心病介入', '心律失常调理', '心衰健康管理'],
  '妊娠及中毒性肝病科': ['妊娠期肝脏损伤', '中毒性肝损害', '妊娠期急性脂肪肝', '药物及毒物性肝病'],
  '肿瘤科': ['实体肿瘤化疗', '靶向免疫治疗', '肿瘤安宁疗护', '规范化多学科'],
  '放疗科': ['精确放射治疗', '三维适形放疗', '调强放疗', '肿瘤合并放疗'],
  '介入科': ['血管微创介入', '肝癌栓塞治疗', '下肢静脉介入', '微创栓塞止血'],
  '感染一科': ['不明原因发热', '重症感染救治', '耐药菌感染', '呼吸道传染'],
  '感染二科': ['真菌严重感染', '肠道感染防治', '公共卫生防御', '系统感染规范'],
  '口腔科': ['数字化种植牙', '牙齿美学正畸', '牙体牙髓治疗', '牙周病规范化']
}

const ALL_DEPARTMENTS = [
  '非病毒性肝病科', '重症肝病科', '慢性肝病科', '代谢性肝病科',
  '心血管内科', '妊娠及中毒性肝病科',
  '肿瘤科', '放疗科', '介入科',
  '感染一科', '感染二科', '口腔科'
]

export const doctors: any[] = []

const staticDoctors = [
  {
    id: 'song-yuanlin',
    name: '宋元林',
    title: '主任医师',
    gender: 'male',
    department: '非病毒性肝病科',
    clinic: '非病毒性肝病科',
    hospital: '福州市第一总医院',
    campus: '金山院区',
    address: '福州市仓山区建新镇金塘路66号',
    avatar: AVATAR_MAP.doctorMale,
    tags: ['慢性肝病诊疗', '肝功能异常', '调理各类肝炎诊治'],
    goodAt: '门急诊部主任，脂肪肝慢病健康管理中心学术带头人。从事中医及中西医结合临床与研究工作三十余年，具有极其丰富的临床诊疗经验。',
    score: '4.9',
    visits: '1286',
    follows: '3420',
    consultPrice: '50元',
    remain: 29
  },
  {
    id: 'zhang-doctor',
    name: '张丽华',
    title: '主任医师',
    gender: 'female',
    department: '慢性肝病科',
    clinic: '慢性肝病科',
    hospital: '福州市第一总医院',
    campus: '西洪院区',
    address: '福州市鼓楼区西洪路312号',
    avatar: AVATAR_MAP.doctorFemale,
    tags: ['慢性病调理', '呼吸系统调理', '脾胃调理'],
    goodAt: '从事中医内科及慢病健康管理临床工作二十余年，积累了极其丰富的临床实践经验，深研中医经典医籍，推崇“辨证求因”施治原则。',
    score: '4.8',
    visits: '946',
    follows: '2188',
    consultPrice: '40元',
    remain: 17
  },
  {
    id: 'recent-zhang',
    name: '张明娜',
    title: '主任医师',
    gender: 'female',
    department: '重症肝病科',
    clinic: '重症肝病科',
    hospital: '福州市第一总医院',
    campus: '金山院区',
    address: '福州市仓山区建新镇金塘路66号',
    avatar: AVATAR_MAP.doctorFemale,
    tags: ['面部皮炎诊疗', '湿疹荨麻疹', '皮肤抗衰管理'],
    goodAt: '从事皮肤科临床工作十余年，在色素性皮肤病、湿疹、荨麻疹及皮肤屏障修复领域经验丰富。',
    score: '4.8',
    visits: '1152',
    follows: '2860',
    consultPrice: '40元',
    remain: 15
  },
  {
    id: 'recent-li',
    name: '李启铭',
    title: '副主任医师',
    gender: 'male',
    department: '代谢性肝病科',
    clinic: '代谢性肝病科',
    hospital: '福州市第一总医院',
    campus: '金山院区',
    address: '福州市仓山区建新镇金塘路66号',
    avatar: AVATAR_MAP.doctorMale,
    tags: ['肝胆肿瘤微创', '胆囊结石诊治', '脂肪肝慢病调理'],
    goodAt: '从事肝胆外科临床与慢病健康管理工作十五年，擅长各类肝胆胰腺系统疾病 of 微创手术及综合诊疗。',
    score: '4.9',
    visits: '1432',
    follows: '3120',
    consultPrice: '35元',
    remain: 22
  },
  {
    id: 'doc-wang-jianguo',
    name: '王建国',
    title: '主任医师',
    gender: 'male',
    department: '心血管内科',
    clinic: '心血管内科',
    hospital: '福州市第一总医院',
    campus: '西洪院区',
    address: '福州市鼓楼区西洪路312号',
    avatar: AVATAR_MAP.doctorMale,
    tags: ['颈椎病康复', '关节退行性变', '运动损伤调理'],
    goodAt: '骨伤康复专家，擅长颈肩腰腿痛及各类骨关节退行性病变的中医保守治疗与康复训练。',
    score: '4.8',
    visits: '1024',
    follows: '2290',
    consultPrice: '50元',
    remain: 19
  },
  {
    id: 'doc-zhao-zhiyuan',
    name: '赵志远',
    title: '副主任医师',
    gender: 'male',
    department: '妊娠及中毒性肝病科',
    clinic: '妊娠及中毒性肝病科',
    hospital: '福州市第一总医院',
    campus: '金山院区',
    address: '福州市仓山区建新镇金塘路66号',
    avatar: AVATAR_MAP.doctorMale,
    tags: ['冠心病规范管理', '高血压中医调理', '心衰健康指导'],
    goodAt: '心血管慢病学术骨干，主张以中西医结合方式调理高血压、冠心病等慢性代谢性疾病。',
    score: '4.7',
    visits: '890',
    follows: '1850',
    consultPrice: '35元',
    remain: 12
  },
  {
    id: 'doc-yang-xuecheng',
    name: '杨学城',
    title: '主任医师',
    gender: 'male',
    department: '肿瘤科',
    clinic: '肿瘤科',
    hospital: '福州市第一总医院',
    campus: '西洪院区',
    address: '福州市鼓楼区西洪路312号',
    avatar: AVATAR_MAP.doctorMale,
    tags: ['消化道溃疡诊治', '慢性胃炎调理', '无痛胃肠镜筛查'],
    goodAt: '消化内窥镜中心负责人，从事消化系统疾病诊疗工作二十五年，具有极高学术声誉。',
    score: '4.9',
    visits: '1680',
    follows: '3980',
    consultPrice: '50元',
    remain: 25
  },
  {
    id: 'doc-yan-xiaoqing',
    name: '颜小青',
    title: '副主任医师',
    gender: 'female',
    department: '放疗科',
    clinic: '放疗科',
    hospital: '福州市第一总医院',
    campus: '金山院区',
    address: '福州市仓山区建新镇金塘路66号',
    avatar: AVATAR_MAP.doctorFemale,
    tags: ['小儿脾胃调理', '儿童发育评估', '小儿呼吸道防治'],
    goodAt: '小儿呼吸与脾胃调理专家，深受广大家长的信赖，擅长采用温和疗法调理儿童体质。',
    score: '4.8',
    visits: '1310',
    follows: '2740',
    consultPrice: '35元',
    remain: 18
  },
  {
    id: 'doc-li-siyu',
    name: '李思雨',
    title: '主治医师',
    gender: 'female',
    department: '介入科',
    clinic: '介入科',
    hospital: '福州市第一总医院',
    campus: '金山院区',
    address: '福州市仓山区建新镇金塘路66号',
    avatar: AVATAR_MAP.doctorFemale,
    tags: ['过敏性鼻炎调理', '慢性咽喉炎防治', '声嘶与耳鸣康复'],
    goodAt: '五官科核心骨干，擅长中西医结合调理过敏性鼻炎、慢性咽炎，提供精准个体化诊疗方案。',
    score: '4.7',
    visits: '720',
    follows: '1430',
    consultPrice: '25元',
    remain: 11
  },
  {
    id: 'doc-zhou-meixian',
    name: '周梅仙',
    title: '主任医师',
    gender: 'female',
    department: '口腔科',
    clinic: '口腔科',
    hospital: '福州市第一总医院',
    campus: '西洪院区',
    address: '福州市鼓楼区西洪路312号',
    avatar: AVATAR_MAP.doctorFemale,
    tags: ['妇科经带调理', '孕前体质调治', '更年期综合征管理'],
    goodAt: '中医妇科专家，从事妇科临床工作近三十年，对女性经期调理、备孕及更年期调养见解独到。',
    score: '4.9',
    visits: '1540',
    follows: '3200',
    consultPrice: '50元',
    remain: 21
  }
]

doctors.push(...staticDoctors)

export function getDoctorById(id: string) {
  return doctors.find(d => d.id === id)
}

function getDoctorSchedule(doctor: any, campus: string, deptType: string) {
  let baseSchedule = []
  if (campus === '西洪院区') {
    if (deptType === 'conditioning') baseSchedule = xihongConditioningSchedule
    else if (deptType === 'rehab') baseSchedule = xihongRehabSchedule
    else baseSchedule = xihongDepartmentSchedule
  } else {
    if (deptType === 'conditioning') baseSchedule = conditioningSchedule
    else if (deptType === 'rehab') baseSchedule = rehabSchedule
    else baseSchedule = departmentSchedule
  }

  return baseSchedule.map(group => {
    const orderedItems = group.items.map(item => ({ ...item }))
    return {
      ...group,
      items: orderedItems.map(item => ({
        ...item,
        id: `${doctor.id}-${item.id}`
      }))
    }
  })
}

export function getDoctorDepartments(doctor: any, campus: string) {
  const primaryDeptName = doctor.clinic || doctor.department || '非病毒性肝病科'
  const otherDepts = ALL_DEPARTMENTS.filter(d => d !== primaryDeptName)

  let idx1 = 0
  let idx2 = 1
  if (doctor.id) {
    let hash = 0
    for (let i = 0; i < doctor.id.length; i++) {
      hash = doctor.id.charCodeAt(i) + ((hash << 5) - hash)
    }
    idx1 = Math.abs(hash) % otherDepts.length
    idx2 = (idx1 + 1) % otherDepts.length
  }

  const secondDeptName = otherDepts[idx1]
  const thirdDeptName = otherDepts[idx2]

  return [
    { id: 'classic', name: primaryDeptName, schedule: getDoctorSchedule(doctor, campus, 'classic') },
    { id: 'conditioning', name: secondDeptName, schedule: getDoctorSchedule(doctor, campus, 'conditioning') },
    { id: 'rehab', name: thirdDeptName, schedule: getDoctorSchedule(doctor, campus, 'rehab') }
  ]
}

export function getSessionRemainingCount(doctorId: string, campus: string, deptId: string, dateStr: string, period: 'am' | 'pm') {
  const seed = `${doctorId}-${campus}-${deptId}-${dateStr}`
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }
  hash = Math.abs(hash)

  const pattern = hash % 4
  if (period === 'am') {
    if (pattern === 0) return 0
    if (pattern === 1) return (hash % 8) + 1
    if (pattern === 2) return (hash % 6) + 3
    return (hash % 5) + 4
  } else {
    if (pattern === 0) return (hash % 8) + 1
    if (pattern === 1) return 0
    if (pattern === 2) return (hash % 6) + 2
    return (hash % 5) + 3
  }
}

export function parseSlotId(slotId: string, defaultDoctorId = 'song-yuanlin') {
  if (!slotId) {
    return {
      doctorId: defaultDoctorId,
      campus: '金山院区',
      deptId: 'classic',
      dateStr: '05-27',
      period: 'am'
    }
  }

  const period = slotId.endsWith('-am') ? 'am' : slotId.endsWith('-pm') ? 'pm' : 'am'
  const cleanId = slotId.slice(0, -3) // Remove -am or -pm

  const dateMatch = cleanId.match(/(\d{2}-\d{2})$/)
  const dateStr = dateMatch ? dateMatch[1] : '05-27'

  const isXihong = slotId.includes('xihong-')
  const campus = isXihong ? '西洪院区' : '金山院区'

  let deptId = 'classic'
  if (slotId.includes('conditioning-')) {
    deptId = 'conditioning'
  } else if (slotId.includes('rehab-')) {
    deptId = 'rehab'
  }

  let doctorId = defaultDoctorId
  const docIdEndIndex = slotId.search(/-(?:xihong-|conditioning-|rehab-|\d{2}-\d{2})/)
  if (docIdEndIndex !== -1) {
    doctorId = slotId.substring(0, docIdEndIndex)
  } else {
    const parts = slotId.split('-')
    if (parts.length > 2) {
      doctorId = parts[0]
    }
  }

  return {
    doctorId,
    campus,
    deptId,
    dateStr,
    period
  }
}

export function getAvailableIndices(doctorId: string, campus: string, deptId: string, dateStr: string, period: string, remain: number) {
  const seed = `${doctorId}-${campus}-${deptId}-${dateStr}-${period}-slots`
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }
  hash = Math.abs(hash)

  const indices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  for (let i = indices.length - 1; i > 0; i--) {
    const j = (hash + i) % (i + 1)
    const temp = indices[i]
    indices[i] = indices[j]
    indices[j] = temp
    hash = (hash * 31 + 17) % 1000000
  }

  const availableSet = new Set(indices.slice(0, remain))
  return availableSet
}

export function generateDynamicTimeSlots(dateId: string, isXihong: boolean, deptSeed: string) {
  if (!dateId) return []

  const parsed = parseSlotId(dateId)
  const targetDeptId = deptSeed === 'conditioning' ? 'conditioning' : deptSeed === 'rehab' ? 'rehab' : 'classic'

  const remain = getSessionRemainingCount(parsed.doctorId, parsed.campus, targetDeptId, parsed.dateStr, parsed.period)
  const availableSet = getAvailableIndices(parsed.doctorId, parsed.campus, targetDeptId, parsed.dateStr, parsed.period, remain)

  const cleanDateId = dateId.replace('conditioning-', '').replace('rehab-', '')
  const key = `${cleanDateId}-${targetDeptId}`
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash)
  }

  const startHour = parsed.period === 'pm' ? 14 : (parsed.campus === '西洪院区' ? 9 : 8)
  const startMinute = parsed.period === 'pm' ? 0 : (parsed.campus === '西洪院区' ? 0 : 30)

  const offsetMinutes = Math.abs(hash) % 15
  const startNumber = (Math.abs(hash) % 15) + 1

  const list = []

  for (let i = 0; i < 10; i++) {
    const totalMinutes = startMinute + offsetMinutes + i * 6
    const hr = startHour + Math.floor(totalMinutes / 60)
    const min = totalMinutes % 60
    const timeStr = `${String(hr).padStart(2, '0')}:${String(min).padStart(2, '0')}`
    const num = startNumber + i

    list.push({
      id: `${targetDeptId}-${parsed.dateStr}-${parsed.period}-time-${i}`,
      no: `${num}号`,
      time: timeStr,
      booked: !availableSet.has(i)
    })
  }
  return list
}

export const campusTabs = ['金山院区', '西洪院区']

const departmentSchedule = [
  {
    id: 'am',
    period: '上午',
    items: [
      { id: '05-26-am', time: '05-26 周二 上午', price: '已约满', active: false, full: true },
      { id: '05-27-am', time: '05-27 周三 上午', price: '余6', active: true },
      { id: '05-28-am', time: '05-28 周四 上午', price: '余12', active: false }
    ]
  },
  {
    id: 'pm',
    period: '下午',
    items: [
      { id: '05-29-pm', time: '05-29 周五 下午', price: '余3', active: false },
      { id: '05-30-am', time: '05-30 周六 上午', price: '余8', active: false },
      { id: '06-01-pm', time: '06-01 周一 下午', price: '余5', active: false }
    ]
  }
]

const conditioningSchedule = [
  {
    id: 'am',
    period: '上午',
    items: [
      { id: 'conditioning-05-26-am', time: '05-26 周二 上午', price: '余4', active: false },
      { id: 'conditioning-05-27-am', time: '05-27 周三 上午', price: '已约满', active: false, full: true },
      { id: 'conditioning-05-28-am', time: '05-28 周四 上午', price: '余15', active: false }
    ]
  },
  {
    id: 'pm',
    period: '下午',
    items: [
      { id: 'conditioning-05-29-pm', time: '05-29 周五 下午', price: '已约满', active: false, full: true },
      { id: 'conditioning-05-30-am', time: '05-30 周六 上午', price: '余9', active: false },
      { id: 'conditioning-06-01-pm', time: '06-01 周一 下午', price: '余2', active: false }
    ]
  }
]

const rehabSchedule = [
  {
    id: 'am',
    period: '上午',
    items: [
      { id: 'rehab-05-26-am', time: '05-26 周二 上午', price: '已约满', active: false, full: true },
      { id: 'rehab-05-27-am', time: '05-27 周三 上午', price: '余3', active: false },
      { id: 'rehab-05-28-am', time: '05-28 周四 上午', price: '已约满', active: false, full: true }
    ]
  },
  {
    id: 'pm',
    period: '下午',
    items: [
      { id: 'rehab-05-29-pm', time: '05-29 周五 下午', price: '余6', active: false },
      { id: 'rehab-05-30-am', time: '05-30 周六 上午', price: '余18', active: false },
      { id: 'rehab-06-01-pm', time: '06-01 周一 下午', price: '已约满', active: false, full: true }
    ]
  }
]

const xihongDepartmentSchedule = [
  {
    id: 'am',
    period: '上午',
    items: [
      { id: 'xihong-05-26-am', time: '05-26 周二 上午', price: '余5', active: false },
      { id: 'xihong-05-27-am', time: '05-27 周三 上午', price: '已约满', active: false, full: true },
      { id: 'xihong-05-28-am', time: '05-28 周四 上午', price: '余8', active: false }
    ]
  },
  {
    id: 'pm',
    period: '下午',
    items: [
      { id: 'xihong-05-29-pm', time: '05-29 周五 下午', price: '余11', active: false },
      { id: 'xihong-05-30-pm', time: '05-30 周六 下午', price: '余2', active: false },
      { id: 'xihong-06-01-pm', time: '06-01 周一 下午', price: '已约满', active: false, full: true }
    ]
  }
]

const xihongConditioningSchedule = [
  {
    id: 'am',
    period: '上午',
    items: [
      { id: 'xihong-cond-05-26-am', time: '05-26 周二 上午', price: '已约满', active: false, full: true },
      { id: 'xihong-cond-05-27-am', time: '05-27 周三 上午', price: '余4', active: false },
      { id: 'xihong-cond-05-28-am', time: '05-28 周四 上午', price: '余9', active: false }
    ]
  },
  {
    id: 'pm',
    period: '下午',
    items: [
      { id: 'xihong-cond-05-29-pm', time: '05-29 周五 下午', price: '余7', active: false },
      { id: 'xihong-cond-05-30-pm', time: '05-30 周六 下午', price: '已约满', active: false, full: true },
      { id: 'xihong-cond-06-01-pm', time: '06-01 周一 下午', price: '余15', active: false }
    ]
  }
]

const xihongRehabSchedule = [
  {
    id: 'am',
    period: '上午',
    items: [
      { id: 'xihong-rehab-05-26-am', time: '05-26 周二 上午', price: '余8', active: false },
      { id: 'xihong-rehab-05-27-am', time: '05-27 周三 上午', price: '已约满', active: false, full: true },
      { id: 'xihong-rehab-05-28-am', time: '05-28 周四 上午', price: '余3', active: false }
    ]
  },
  {
    id: 'pm',
    period: '下午',
    items: [
      { id: 'xihong-rehab-05-29-pm', time: '05-29 周五 下午', price: '已约满', active: false, full: true },
      { id: 'xihong-rehab-05-30-pm', time: '05-30 周六 下午', price: '余12', active: false },
      { id: 'xihong-rehab-06-01-pm', time: '06-01 周一 下午', price: '余6', active: false }
    ]
  }
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const timeSlots = [
  { id: 'time-1', no: '7号', time: '08:30' },
  { id: 'time-2', no: '8号', time: '08:36' },
  { id: 'time-3', no: '9号', time: '08:42' },
  { id: 'time-4', no: '10号', time: '08:48' },
  { id: 'time-5', no: '11号', time: '08:54' },
  { id: 'time-6', no: '12号', time: '09:00' },
  { id: 'time-7', no: '13号', time: '09:06' },
  { id: 'time-8', no: '14号', time: '09:12' },
  { id: 'time-9', no: '15号', time: '09:18' },
  { id: 'time-10', no: '16号', time: '09:24' }
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const xihongTimeSlots = [
  { id: 'xihong-time-1', no: '1号', time: '09:00' },
  { id: 'xihong-time-2', no: '2号', time: '09:06' },
  { id: 'xihong-time-3', no: '3号', time: '09:12' },
  { id: 'xihong-time-4', no: '4号', time: '09:18' },
  { id: 'xihong-time-5', no: '5号', time: '09:24' },
  { id: 'xihong-time-6', no: '6号', time: '09:30' },
  { id: 'xihong-time-7', no: '7号', time: '09:36' },
  { id: 'xihong-time-8', no: '8号', time: '09:42' },
  { id: 'xihong-time-9', no: '9号', time: '09:48' },
  { id: 'xihong-time-10', no: '10号', time: '09:54' }
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const appointmentRows = [
  { label: '就诊院区', value: '福州市第一总医院-金山院区' },
  { label: '就诊时间', value: '2026/05/27 08:30' },
  { label: '诊查费', value: '50.00元', primary: true }
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const patientRows = [
  { label: '就诊人', value: '孔晓雯', arrow: true },
  { label: '手机号', value: '13556667892', arrow: true }
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const resultRows = [
  { label: '院区地址', value: '地址导航', primary: true },
  { label: '预约科室', value: '非病毒性肝病科' },
  { label: '预约时间', value: '2026/05/27 08:30', primary: true },
  { label: '预约序号', value: '7号' },
  { label: '诊查费', value: '50.00元' },
  { label: '诊室位置', value: '门诊楼三楼', primary: true },
  { label: '就诊人', value: '孔*雯' }
]

export const noticeItems = [
  '请在就诊时间前5分钟提前到院取号。',
  '如需取消预约，请在就诊前通过我的预约办理。',
  '医保结算以医院现场实际规则为准。'
]

export const myAppointments = [
  {
    id: 'a1',
    status: '待签到',
    statusType: 'warning',
    department: '非病毒性肝病科',
    doctor: '宋元林',
    doctorAvatar: AVATAR_MAP.doctorMale,
    doctorId: 'song-yuanlin',
    departmentId: 'non_viral_liver',
    time: '2026/05/27 08:30',
    no: '7号',
    campus: '金山院区',
    campusId: 'jinshan',
    campusAddress: '福州市仓山区建新镇金塘路66号',
    latitude: 26.0288,
    longitude: 119.2472,
    room: '门诊楼三楼 302诊室',
    hasIndoorNavigation: true,
    hasOnlineHospital: false,
    patient: '孔*雯',
    actions: ['温馨提示', '线上取号']
  },
  {
    id: 'a2',
    status: '待就诊',
    statusType: 'success',
    department: '慢性肝病科',
    doctor: '张丽华',
    doctorAvatar: AVATAR_MAP.doctorFemale,
    doctorId: 'zhang-doctor',
    departmentId: 'chronic_liver',
    time: '2026/05/29 14:20',
    no: '18号',
    campus: '西洪院区',
    campusId: 'xihong',
    campusAddress: '福州市鼓楼区西洪路312号',
    latitude: 26.0912,
    longitude: 119.2806,
    room: '门诊楼二楼 218诊室',
    hasIndoorNavigation: true,
    hasOnlineHospital: false,
    patient: '孔*雯',
    actions: ['温馨提示', '取消预约', '诊前信息收集']
  },
  {
    id: 'a3',
    status: '已就诊',
    statusType: 'default',
    department: '重症肝病科',
    doctor: '张明娜',
    doctorAvatar: AVATAR_MAP.doctorFemale,
    doctorId: 'recent-zhang',
    departmentId: 'severe_liver',
    time: '2026/04/30 09:10',
    no: '11号',
    campus: '金山院区',
    campusId: 'jinshan',
    campusAddress: '福州市仓山区建新镇金塘路66号',
    latitude: 26.0288,
    longitude: 119.2472,
    room: '门诊楼四楼 406诊室',
    hasIndoorNavigation: true,
    hasOnlineHospital: true,
    patient: '孔*雯',
    actions: ['温馨提示', '在线复诊', '再次预约']
  },
  {
    id: 'a4',
    status: '已取消',
    statusType: 'cancelled',
    department: '重症肝病科',
    doctor: '张明娜',
    doctorAvatar: AVATAR_MAP.doctorFemale,
    doctorId: 'recent-zhang',
    departmentId: 'severe_liver',
    time: '2026/05/28 10:30',
    no: '15号',
    campus: '金山院区',
    campusId: 'jinshan',
    campusAddress: '福州市仓山区建新镇金塘路66号',
    latitude: 26.0288,
    longitude: 119.2472,
    room: '门诊楼三楼 304诊室',
    hasIndoorNavigation: true,
    hasOnlineHospital: false,
    patient: '陈*玲 (D54***93)',
    actions: ['再次预约']
  },
  {
    id: 'a5',
    status: '已停诊',
    statusType: 'stopped',
    department: '重症肝病科',
    doctor: '张明娜',
    doctorAvatar: AVATAR_MAP.doctorFemale,
    doctorId: 'recent-zhang',
    departmentId: 'severe_liver',
    time: '2026/05/28 10:30',
    no: '15号',
    campus: '金山院区',
    campusId: 'jinshan',
    campusAddress: '福州市仓山区建新镇金塘路66号',
    latitude: 26.0288,
    longitude: 119.2472,
    room: '门诊楼三楼 304诊室',
    hasIndoorNavigation: false,
    hasOnlineHospital: false,
    patient: '陈*玲 (D54***93)',
    actions: ['再次预约']
  }
]

// ── Unified mapping list to synchronize list/famous doctors with booking flow ──
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FAMOUS_DEPT_MAPPING = [
  { dept: '呼吸内科门诊', isMale: true, avatar: AVATAR_MAP.doctorMale },
  { dept: '耳鼻喉科门诊', isMale: false, avatar: AVATAR_MAP.doctorFemale },
  { dept: '消化内科门诊', isMale: true, avatar: AVATAR_MAP.doctorMale },
  { dept: '呼吸内科门诊', isMale: false, avatar: AVATAR_MAP.doctorFemale, skipCount: 1 },
  { dept: '心血管内科门诊', isMale: true, avatar: AVATAR_MAP.doctorMale },
  { dept: '普通儿科门诊', isMale: false, avatar: AVATAR_MAP.doctorFemale },
  { dept: '骨科门诊', isMale: true, avatar: AVATAR_MAP.doctorMale },
  { dept: '妇科常规门诊', isMale: false, avatar: AVATAR_MAP.doctorFemale },
  { dept: '神经内科门诊', isMale: true, avatar: AVATAR_MAP.doctorMale },
  { dept: '内分泌科门诊', isMale: true, avatar: AVATAR_MAP.doctorMale },
  { dept: '皮肤病普通门诊', isMale: false, avatar: AVATAR_MAP.doctorFemale },
  { dept: '肾脏内科门诊', isMale: true, avatar: AVATAR_MAP.doctorMale }
]

export const famousDoctorsList = doctors.map((doc) => {
  const isMale = doc.gender === 'male'
  const tags = isMale ? ['图文咨询', '视频问诊', '义诊咨询'] : ['图文咨询', '视频问诊']
  return {
    id: doc.id,
    name: doc.name,
    level: doc.title,
    dept: doc.department.replace('门诊', ''),
    avatar: isMale ? AVATAR_MAP.doctorMale : AVATAR_MAP.doctorFemale,
    desc: doc.goodAt,
    stats: {
      volume: parseInt(doc.visits, 10) || 120,
      score: Math.round(parseFloat(doc.score) * 20) || 98,
      follow: parseInt(doc.follows, 10) || 600
    },
    tags: tags
  }
})
