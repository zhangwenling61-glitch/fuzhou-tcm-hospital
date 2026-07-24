import Axios from './axios'
import { useAppStore } from '../store/index'
import api from '../config/api'
import Taro from '@tarojs/taro'
import { AxiosRequestConfig, Method } from 'axios'

interface RequestConfig extends AxiosRequestConfig {
  showErrMsg: boolean
}

// 全局请求接口配置信息
export const service = Axios.create({
  baseURL: api.base,
  timeout: 60 * 1000,
  headers: {
    'Content-Type': api.contentType
  }
})

// Request拦截器
service.interceptors.request.use(
  config => {
    // 注入token - 在拦截器函数内获取 store 实例
    const appStore = useAppStore()
    if (appStore.token) {
      config.data['sessionId'] = appStore.token
    }
    if (config.method === 'post') {
      config.data['appId'] = '1EP2NRQPH0007D13A8C000007EFE0741'
      config.data['deviceId'] = 'gh_aa0b4605baf1'
      config.data['version'] = 'v.1.0.0'
      config.data['timestamp'] = Date.now().toString()
      config.data['encryptType'] = 'DES'
      config.data['signType'] = 'MD5'
      config.data['sign'] = '58E40DCEA527333B9E7C3CCD1A08979F'
      config.data['termType'] = 'WX'
    }
    if (config.method === 'get') {
      if (appStore.token) {
        config.params['token'] = appStore.token
      }
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

const { isOK, msg, code, data, errorCodes, errorCallback } = api.responseConfig

// Response拦截器
service.interceptors.response.use(
  response => {
    // 处理关闭loading
    Taro.hideLoading()
    // axios默认请求判断状态
    if (response.status === 200) {
      // 成功过滤处理，返回数据对象，属性信息走配置文件的配置
      if (!isOK(response.data) || errorCodes.indexOf(response.data[code]) >= 0) {
        // 请求出错，统一处理
        if ((response.config as RequestConfig).showErrMsg) {
          Taro.showToast({ title: `${response.data[msg] || '请求数据出错'}`, icon: 'none' })
          setTimeout(() => {
            if (errorCodes.includes(response.data[code])) {
              errorCallback()
            }
          }, 1200)
        }
        return Promise.reject(response.data)
      } else {
        try {
          return Promise.resolve(response.data[data])
        } catch (error) {
          return Promise.reject(error)
        }
      }
    } else {
      return Promise.reject(response.data[data])
    }
  },
  error => {
    // 处理关闭loading
    Taro.hideLoading()
    if (error.response) {
      // 处理错误状态码
      switch (error.response.status) {
        case 401:
          break
        default:
          break
      }
      return Promise.reject(error.response.data)
    }
    return Promise.reject(error)
  }
)

// 包装https请求方法，做统一的请求控制
export default async function https<T>({
  url = api.url,
  isLoading = true,
  method = 'POST',
  transType = '',
  showErrMsg = true,
  params = {},
  serviceId
}: {
  url?: string
  isLoading?: boolean
  method?: string
  transType?: string
  showErrMsg?: boolean
  params?: Record<string, any>
  serviceId?: string
}): Promise<T> {
  if (isLoading) {
    Taro.showLoading({ title: '数据处理中...' })
  }
  const _axiosConfig = {
    method: method as Method,
    params: {},
    data: {},
    url: url,
    showErrMsg
  }

  if (method.toUpperCase() === 'GET') {
    _axiosConfig['params'] = params
  } else {
    _axiosConfig['data']['transType'] = transType
    _axiosConfig['data']['param'] = params
    _axiosConfig['data']['serviceId'] = serviceId
  }

  try {
    return service(_axiosConfig) as unknown as Promise<T>
  } catch (err) {
    Taro.hideLoading()
    return Promise.reject(err)
  }
}
