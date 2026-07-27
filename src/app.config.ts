export default defineAppConfig({
  pages: [
    'pages/dermatology/index',
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
        'orders/index',
        'order-detail/index'
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
