import { AVATAR_MAP } from '@/utils/avatar'

export const historyDoctors = [
  {
    id: 'song-yuanlin',
    name: '宋元林',
    level: '主任医师',
    dept: '非病毒性肝病科',
    avatar: AVATAR_MAP.doctorMale,
    desc: '门急诊部主任，脂肪肝慢病健康管理中心学术带头人。从事中医及中西医结合临床与研究工作三十余年，具有极其丰富的临床诊疗经验。',
    stats: {
      volume: 1286,
      score: 98,
      follow: 3420
    },
    tags: ['图文咨询', '视频问诊', '义诊咨询']
  },
  {
    id: 'zhang-doctor',
    name: '张丽华',
    level: '主任医师',
    dept: '慢性肝病科',
    avatar: AVATAR_MAP.doctorFemale,
    desc: '从事中医内科及慢病健康管理临床工作二十余年，积累了极其丰富的临床实践经验，深研中医经典医籍，推崇“辨证求因”施治原则。',
    stats: {
      volume: 946,
      score: 96,
      follow: 2188
    },
    tags: ['图文咨询', '视频问诊']
  }
]
