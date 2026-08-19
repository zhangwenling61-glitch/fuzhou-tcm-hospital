export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/winter-summer-treatment/index'
  ],
  subPackages: [
    {
      root: 'pages/appointment',
      name: 'appointment',
      pages: [
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
        'refund/index'
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
