// 例子，门户拉数字身份认证的工具函数
import Taro from '@tarojs/taro'
import { useAppStore } from '@/store'

/**
 * @file 用于身份验证的工具函数
 */
import globalData from '@/config/serviceConfig'

function obj2query(obj: Record<string, any> = {}) {
  return Object.keys(obj).map((key) => {
    return key + '=' + (typeof obj[key] === 'object' ? JSON.stringify(obj[key]) : obj[key])
  }).join('&')
}

export function navigateToIdentification(query: any = {}, navigationType: 'navigateTo' | 'redirectTo' | 'reLaunch' = 'navigateTo') {
  Taro[navigationType]({
    url: '/pages/identification/pages/loading/index?' + obj2query({ token: genToken(), ...query })
  })
}

const applicationId = '1729780953414504448'

export function loginByIdentification() {
  navigateToIdentification({
    sceneId: '1762052205562695680', // 仅手机号
    applicationId,
    token: genToken()
  })
}

export function addCardByIdentification(onlyChs = false, navigationType?: string) {
  navigateToIdentification({
    sceneId: onlyChs ? '1732648898377420800' : '1830920446430810112', // 1732648898377420800-医保+健康卡, 1729781037195726848-仅医保卡
    applicationId,
    token: genToken(),
    chs: {
      sourceapp: globalData.buildSourceAppId,
      cityCode: globalData.cityCode,
      channel: globalData.buildChannel,
      openType: 'getAuthCode'
    },
    phone: useAppStore().phone
  }, navigationType as any)
}

// 代亲友医保授权
export function chsAuthFamilyByIdentification(navigationType?: string) {
  navigateToIdentification({
    sceneId: '1805506206090006528', // 场景值
    applicationId,
    token: genToken(),
    chs: {
      sourceapp: globalData.buildSourceAppId,
      cityCode: globalData.cityCode,
      channel: globalData.buildChannel,
      openType: 'getAuthCode',
      relatedType: 'family'
    },
    phone: useAppStore().phone,
    authType: 'chsFamily'
  }, navigationType as any)
}

/**
 * 生成认证流水号,用于认证成功后查询信息
 */
function genToken(): string {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
}
