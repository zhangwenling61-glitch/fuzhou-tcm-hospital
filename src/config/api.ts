let globalData

if (process.env.TARO_ENV === 'h5') {
  globalData = window.YHSERVICECONFIG
} else {
  globalData = require('./serviceConfig').default
}

// 请求地址
const base = globalData.base

// 完整请求地址
const url = ''

// 数据传输类配置
const contentType = 'application/json' // form提交数据：application/x-www-form-urlencoded

// token校验
const tokenCheck = false

// 统一请求配置
const responseConfig = {
  // 响应代码
  code: 'respCode',
  // 响应数据
  data: 'param',
  // 错误提示信息
  msg: 'respMsg',
  // 加密数据
  encode: 'encData',
  // 签名数据
  signData: 'signData',
  // 响应是否是成功的
  isOK: function(response) {
    return response instanceof Object && response['respCode'] === '000000'
  },
  // tokenCheck为true时，token验证不通过时返回的异常码， 出现这种情况情况下将直接执行回调errorCallBack
  errorCodes: [500023],
  errorCallback: function() {
    // token过期后,自定义处理,或返回错误
  }
}

// 提示语
const waitTips = '敬请期待'

export default {
  base,
  url,
  contentType,
  tokenCheck,
  responseConfig,
  waitTips
}
