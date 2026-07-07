import './style.css'
import { gsap } from 'gsap'

function render() {
  const fullText = "点击进入 “福州市中医院互联网医院”小程序"
  document.querySelector('#app').innerHTML = `
    <div class="banner-container">
      <!-- Background hills -->
      <img src="/assets/bg.png" class="banner-bg-hills" alt="Background">

      <!-- Title Elements -->
      <div class="line line-left"></div>
      <div class="line line-right"></div>
      <p class="hospital-name">福州市中医院</p>
      <div class="title-container">
        <img src="/assets/title_hospital.svg" class="title-hospital" alt="互联网医院">
      </div>

      <!-- IP Character -->
      <img src="/assets/ip.png" class="ip-character" alt="IP Character">

      <!-- Clouds -->
      <img src="/assets/cloud.png" class="cloud cloud-1" alt="Cloud">
      <img src="/assets/cloud.png" class="cloud cloud-2" alt="Cloud">
      <img src="/assets/cloud.png" class="cloud cloud-3" alt="Cloud">

      <!-- Service Icons -->
      <div class="service-container">
        <!-- 预约挂号 -->
        <div class="service-item">
          <div class="icon-wrapper">
            <img src="/assets/icon1_bg.svg" class="icon1-bg" alt="">
            <img src="/assets/icon1_fg.svg" class="icon1-fg" alt="">
          </div>
          <p class="service-name">预约挂号</p>
        </div>

        <!-- 在线问诊 -->
        <div class="service-item">
          <div class="icon-wrapper">
            <img src="/assets/icon2.svg" class="icon2" alt="">
          </div>
          <p class="service-name">在线问诊</p>
        </div>

        <!-- 复诊续方 -->
        <div class="service-item">
          <div class="icon-wrapper">
            <img src="/assets/icon3.svg" class="icon3" alt="">
          </div>
          <p class="service-name">复诊续方</p>
        </div>

        <!-- 便捷配药 -->
        <div class="service-item">
          <div class="icon-wrapper">
            <img src="/assets/icon4_bg.svg" class="icon4-bg" alt="">
            <div class="icon-mask-container" style="-webkit-mask-image: url('/assets/icon4_mask.svg'); mask-image: url('/assets/icon4_mask.svg');">
              <img src="/assets/icon4_fg.svg" class="icon4-fg" alt="">
            </div>
          </div>
          <p class="service-name">便捷配药</p>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="bottom-bar">
        <img src="/assets/bottom_bar.svg" class="bottom-bar-bg" alt="">
        <p class="bottom-bar-text" data-text="${fullText}">
          <span class="text-light">点击进入</span>
          <span class="text-dark"> “福州市中医院互联网医院”小程序</span>
        </p>
      </div>
    </div>
  `

  handleResize()
  initAnimations()
}

function initAnimations() {
  // IP Character bobbing
  gsap.to('.ip-character', {
    y: -12,
    duration: 3,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true
  })

  // Cloud 1 floating + breathing + swaying
  gsap.to('.cloud-1', {
    x: 20,
    y: 10,
    scale: 1.05,
    rotation: 2,
    duration: 6,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true
  })

  // Cloud 2 floating + breathing + swaying
  gsap.to('.cloud-2', {
    x: -15,
    y: -15,
    scale: 0.95,
    rotation: -2,
    duration: 8,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    delay: 1
  })

  // Cloud 3 floating + breathing + swaying
  gsap.to('.cloud-3', {
    x: 10,
    y: 15,
    scale: 1.1,
    rotation: 1.5,
    duration: 5,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    delay: 0.5
  })

  // Icons sequential pulse (Moderately speeded up)
  gsap.to('.service-item', {
    scale: 1.05,
    duration: 0.5,
    ease: 'sine.inOut',
    stagger: {
      each: 0.25,
      repeat: -1,
      yoyo: true,
      repeatDelay: 0.8
    }
  })
  // Bottom bar floating (bobbing)
  gsap.to('.bottom-bar', {
    y: -10,
    duration: 3,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true
  })
}

function handleResize() {
  const container = document.querySelector('.banner-container')
  if (!container) return

  const designWidth = 1080
  const designHeight = 844
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  const scaleX = viewportWidth / designWidth
  const scaleY = viewportHeight / designHeight
  const scale = Math.min(scaleX, scaleY, 1)

  container.style.transform = `scale(${scale}) translateX(-50%)`
  container.style.left = '50%'
  
  const app = document.querySelector('#app')
  app.style.width = `${designWidth * scale}px`
  app.style.height = `${designHeight * scale}px`
}

window.addEventListener('resize', handleResize)
render()
