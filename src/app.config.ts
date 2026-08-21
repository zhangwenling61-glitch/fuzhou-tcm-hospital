export default defineAppConfig({
  entryPagePath: 'pages/home/index',
  pages: [
    'pages/home/index',
    'pages/winter-summer-treatment/index'
  ],
  subPackages: [
    {
      root: 'pages/appointment',
      name: 'appointment',
      pages: [
        'department/index',
        'doctor/index',
        'detail/index',
        'confirm/index',
        'result/index',
        'my/index',
        'detail-status/index',
        'ai-assistant/index'
      ]
    },
    {
      root: 'pages/dermatology',
      name: 'dermatology',
      pages: [
        'index',
        'orders/index',
        'order-detail/index'
      ]
    },
    {
      root: 'pages/common-list',
      name: 'common-list',
      pages: [
        'protocol/index',
        'refund/index',
        'online-followup/index',
        'online-followup/date-select',
        'online-followup/history',
        'online-followup/success'
      ]
    }
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '易惠科技',
    navigationBarTextStyle: 'black'
  }
})
