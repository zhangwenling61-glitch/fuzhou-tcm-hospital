/**
 * 小程序配置文件, H5配置前往: public/static/js/serviceConfig.js
 */

const EnvMap = {
  development: {
    base: 'http://mstpay.com:1811/uec-portal-web-jkyl/web/unifyapi'
  },
  production: {
    base: ''
  }
}

export default {
  base: EnvMap[process.env.NODE_ENV as string].base,
  appId: '',
  buildSourceAppId: '',
  cityCode: '',
  buildChannel: '',
  hospName: '某某某大学附属医院',
  h5Url: 'https://3code.udplat.com/ehcweb2/index.html' // webview地址
}
