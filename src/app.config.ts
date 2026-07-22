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
    }
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '易惠科技',
    navigationBarTextStyle: 'black'
  }
})
