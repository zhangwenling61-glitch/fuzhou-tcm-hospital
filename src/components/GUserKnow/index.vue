<template>
  <div v-if="modelValue" class="g-popup-component">
    <div class="protocol-dialog">
      <div class="header">个人信息保护指引</div>
      <div class="section">
        <p>欢迎您使用医院线上门户！</p>
        <div class="p-content">为了更好的保护您的权益,请您在使用我们的产品服务之前,仔细阅读我们的<div class="link" @click="toPage('userAgreement')">《用户服务协议》</div>及<div class="link" @click="toPage('userSecretPolicy')">《用户隐私协议》</div>,以帮助您更好的了解我们对于您的个人信息的保护情况，尤其是以下条款:</div>
        <p>1.我们收集、使用、存储和共享您的个人信息的情况,及您所享有的相关权利;</p>
        <p>2.我们的产品请求与个人信息相关的设备权限的相关信息;</p>
        <p>3.我们的产品接入的第三方SDK的相关信息;</p>
        <p>4.我们的限制责任、免责条款。</p>
        <p>若您对以上内容(包括我们的协议)有任何疑问的，您可以通过电话联系我们;若同意以上内容,请点击"同意",开始使用我们的产品及服务。</p>
      </div>
      <div class="footer-fill" />
      <div class="footer">
        <button class="btn plain" @click="cancel">暂不使用</button>
        <button class="btn" open-type="agreePrivacyAuthorization" @agreeprivacyauthorization="confirm">同意</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Taro from '@tarojs/taro'
import './index.less'

defineProps<{
  position?: string
  height?: string
}>()

const emit = defineEmits<{
  submit: [value: boolean]
}>()

const modelValue = defineModel<boolean>({ default: false })

onMounted(() => {
  if (process.env.NODE_ENV === 'production') {
    getPrivacy()
  }
})

function getPrivacy() {
  // @ts-ignore
  if (Taro.getPrivacySetting) {
    Taro.getPrivacySetting({
      success: (res: any) => {
        console.log('getPrivacySetting', res)
        if (res.needAuthorization) {
          modelValue.value = true
        } else {
          close()
        }
      },
      fail: (err: any) => {
        console.log('getPrivacySetting err', err)
        modelValue.value = true
      }
    })
  } else {
    close()
  }
}

function cancel() {
  close()
  emit('submit', false)
}

function confirm() {
  close()
  emit('submit', true)
}

function close() {
  modelValue.value = false
}

function toPage(name: string) {
  Taro.navigateTo({ url: '/pages/' + name + '/index' })
}
</script>
