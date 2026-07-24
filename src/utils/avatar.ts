import { fzHomeAssets } from '@/config/remoteAssets'

/**
 * 服务器头像分类映射地址
 */
export const AVATAR_MAP = {
  // 默认头像
  default: fzHomeAssets.defaultAvatarMale,
  defaultUser: fzHomeAssets.defaultAvatarMale,
  noGender: 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E9%97%A8%E6%88%B73.0%E5%88%87%E5%9B%BE%E8%B5%84%E6%BA%90/USER/Property%201%3D%E6%97%A0%E6%80%A7%E5%88%AB.png',

  // 儿童 (0-14岁)
  childMale: fzHomeAssets.defaultAvatarMale,
  childFemale: fzHomeAssets.defaultAvatarFemale,

  // 成年 (15-60岁)
  adultMale: fzHomeAssets.defaultAvatarMale,
  adultFemale: fzHomeAssets.defaultAvatarFemale,

  // 老年 (>60岁)
  elderlyMale: fzHomeAssets.defaultAvatarMale,
  elderlyFemale: fzHomeAssets.defaultAvatarFemale,

  // 医生
  doctorMale: 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E9%97%A8%E6%88%B73.0%E5%88%87%E5%9B%BE%E8%B5%84%E6%BA%90/USER/Property%201%3D%E5%8C%BB%E7%94%9F%E7%94%B7.png',
  doctorFemale: 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E9%97%A8%E6%88%B73.0%E5%88%87%E5%9B%BE%E8%B5%84%E6%BA%90/USER/Property%201%3D%E5%8C%BB%E7%94%9F%E5%A5%B3.png',
  doctorMaleBooking: 'https://foruda.gitee.com/images/1779938882705377803/ef413559_16918445.png',
  doctorFemaleBooking: 'https://foruda.gitee.com/images/1779968199341740524/d562198e_16918445.png'
}

/**
 * 根据性别和年龄自动获取匹配的头像
 * @param gender 性别：'1'/'male'/'男' ｜ '2'/'female'/'女'
 * @param age 年龄数值或年龄段：'child' | 'adult' | 'elderly'
 */
export function getAvatarByGenderAndAge(gender: string | number, age: number | string): string {
  const genderStr = String(gender).toLowerCase()
  const isFemale = genderStr === '2' || genderStr === 'female' || genderStr === '女'
  const isMale = genderStr === '1' || genderStr === 'male' || genderStr === '男'

  let ageGroup = 'adult'
  if (typeof age === 'number') {
    if (age <= 14) {
      ageGroup = 'child'
    } else if (age >= 60) {
      ageGroup = 'elderly'
    } else {
      ageGroup = 'adult'
    }
  } else if (typeof age === 'string') {
    const ageStr = age.toLowerCase()
    if (ageStr.includes('child') || ageStr.includes('儿童') || ageStr.includes('少儿') || ageStr.includes('boy') || ageStr.includes('girl')) {
      ageGroup = 'child'
    } else if (ageStr.includes('elder') || ageStr.includes('old') || ageStr.includes('老年') || ageStr.includes('老人')) {
      ageGroup = 'elderly'
    }
  }

  if (ageGroup === 'child') {
    return isFemale ? AVATAR_MAP.childFemale : AVATAR_MAP.childMale
  } else if (ageGroup === 'elderly') {
    return isFemale ? AVATAR_MAP.elderlyFemale : AVATAR_MAP.elderlyMale
  } else {
    if (isFemale) return AVATAR_MAP.adultFemale
    if (isMale) return AVATAR_MAP.adultMale
    return AVATAR_MAP.defaultUser
  }
}
