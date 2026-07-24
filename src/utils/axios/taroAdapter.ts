import Taro from '@tarojs/taro'
import { AxiosPromise, AxiosRequestConfig } from 'axios'
import buildFullPath from 'axios/lib/core/buildFullPath'
import createError from 'axios/lib/core/createError'

export default function(config: AxiosRequestConfig): AxiosPromise {
  return new Promise(function(resolve, reject) {
    const { baseURL, url, timeout, headers, method = 'get', responseType, data, params } = config
    const methodUppercase = method.toUpperCase()
    const option = {
      url: buildFullPath(baseURL, url),
      method: methodUppercase as unknown as keyof Taro.request.Method,
      timeout: timeout,
      data: methodUppercase === 'GET' ? params : data,
      responseType: (responseType || '') as unknown as keyof Taro.request.ResponseType,
      header: headers || { 'content-type': 'application/json' }
    }

    Taro.request({
      ...option,
      success: ({ data, header, statusCode, errMsg }) => {
        resolve({
          data,
          status: statusCode,
          headers: header,
          config,
          statusText: errMsg
        })
      },
      fail(err) {
        console.error('[Axios Error];', err)
        reject(createError('Network Fail', config, '请求失败'))
      }
    })
  })
}
