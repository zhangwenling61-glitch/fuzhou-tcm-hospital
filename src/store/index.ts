import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import Taro from '@tarojs/taro'
import { fzHomeAssets } from '@/config/remoteAssets'

export const useAppStore = defineStore(
  'app',
  () => {
    const token = ref('')
    const openId = ref('')
    const authState = ref('')
    const userInfo = ref<Record<string, unknown>>({})
    const phone = computed(() => {
      const value = userInfo.value.phone
      return typeof value === 'string' ? value : ''
    })
    const agreement = ref(false)
    const isMaskedGlobal = ref(true) // Default to true for desensitization

    watch(isMaskedGlobal, () => {
      saveToStorage()
    })

    // Global selected patient state management with credentials list
    const patients = ref([
      {
        id: 'p_adult_female',
        name: '孔晓雯',
        cardNo: 'DG4456786',
        avatar: fzHomeAssets.defaultAvatarFemale,
        gender: 'female',
        ageGroup: 'adult',
        insuranceLabel: '社保卡',
        relation: '亲友',
        credentials: [
          { id: 'social', title: '社保卡', cardNo: 'DG4456786' },
          { id: 'health', title: '电子健康卡', cardNo: 'D510100482' }
        ]
      },
      {
        id: 'p_adult_male',
        name: '许小凯',
        cardNo: 'DG4456788',
        avatar: fzHomeAssets.defaultAvatarMale,
        gender: 'male',
        ageGroup: 'adult',
        insuranceLabel: '社保卡',
        relation: '本人',
        credentials: [
          { id: 'social', title: '社保卡', cardNo: 'DG4456788' },
          { id: 'health', title: '电子健康卡', cardNo: 'D510100482' }
        ]
      }
    ])

    const activePatientId = ref(Taro.getStorageSync('active_patient_id') || 'p_adult_male')
    const showPatientSwitcher = ref(false)
    const showNoAvatarGlobal = ref(false)
    const activeCardMap = ref<Record<string, string>>({})
    const showOtherDeptsGlobal = ref(false)
    const showOtherDeptsMap = ref<Record<string, boolean>>({})
    const isSearchingGlobal = ref(false)

    const activePatient = computed(() => {
      const p = patients.value.find(p => p.id === activePatientId.value) || patients.value[0]
      if (p) {
        const activeCardId = activeCardMap.value[p.id] || Taro.getStorageSync(`active_card_${p.id}`) || (p.credentials && p.credentials[0]?.id)
        const activeCard = p.credentials?.find(c => c.id === activeCardId) || p.credentials?.[0]
        return {
          ...p,
          cardNo: activeCard ? activeCard.cardNo : p.cardNo,
          insuranceLabel: activeCard ? activeCard.title : p.insuranceLabel
        }
      }
      return p
    })

    function switchPatient(id: string) {
      if (patients.value.some(p => p.id === id)) {
        activePatientId.value = id
        Taro.setStorageSync('active_patient_id', id)
        saveToStorage()
      }
    }

    function updateActiveCard(patientId: string, cardId: string) {
      activeCardMap.value[patientId] = cardId
      Taro.setStorageSync(`active_card_${patientId}`, cardId)

      // Sync property to raw patient object for backward compatibility
      const p = patients.value.find(item => item.id === patientId)
      if (p) {
        const activeCard = p.credentials?.find(c => c.id === cardId) || p.credentials?.[0]
        if (activeCard) {
          p.cardNo = activeCard.cardNo
          p.insuranceLabel = activeCard.title
        }
      }
      saveToStorage()
    }

    function setActivePatientCard(patientId: string, cardId: string) {
      const p = patients.value.find(item => item.id === patientId)
      if (!p) return

      activePatientId.value = patientId
      activeCardMap.value[patientId] = cardId

      const activeCard = p.credentials?.find(c => c.id === cardId) || p.credentials?.[0]
      if (activeCard) {
        p.cardNo = activeCard.cardNo
        p.insuranceLabel = activeCard.title
      }

      Taro.setStorageSync('active_patient_id', patientId)
      Taro.setStorageSync(`active_card_${patientId}`, cardId)
      saveToStorage()
    }

    // Migrate/correct persisted store data to ensure relations and default cards match new requirements
    const migrateStoreState = () => {
      const male = patients.value.find(p => p.id === 'p_adult_male')
      if (male) {
        male.relation = '本人'
        male.avatar = fzHomeAssets.defaultAvatarMale
        if (!male.credentials.some(c => c.id === 'social')) {
          male.credentials.unshift({
            id: 'social',
            title: '社保卡',
            cardNo: 'DG4456788'
          })
        } else {
          const sc = male.credentials.find(c => c.id === 'social')
          if (sc) sc.cardNo = 'DG4456788'
        }
        const hc = male.credentials.find(c => c.id === 'health')
        if (hc) hc.cardNo = 'D510100482'
      }

      const female = patients.value.find(p => p.id === 'p_adult_female')
      if (female) {
        female.relation = '亲友'
        female.avatar = fzHomeAssets.defaultAvatarFemale
      }

      if (!patients.value.some(p => p.id === activePatientId.value)) {
        const fallback = patients.value[0]?.id || 'p_adult_male'
        activePatientId.value = fallback
        Taro.setStorageSync('active_patient_id', fallback)
      }
      if (!Taro.getStorageSync('active_card_p_adult_male')) {
        activeCardMap.value['p_adult_male'] = 'social'
        Taro.setStorageSync('active_card_p_adult_male', 'social')
      }
      saveToStorage()
    }

    // Sync all patients' initial cardNo and insuranceLabel based on stored selections
    const initPatientCardsSync = () => {
      patients.value.forEach(p => {
        const activeCardId = Taro.getStorageSync(`active_card_${p.id}`) || (p.credentials && p.credentials[0]?.id)
        if (activeCardId) {
          activeCardMap.value[p.id] = activeCardId
          const activeCard = p.credentials?.find(c => c.id === activeCardId) || p.credentials?.[0]
          if (activeCard) {
            p.cardNo = activeCard.cardNo
            p.insuranceLabel = activeCard.title
          }
        }
      })
    }

    migrateStoreState()
    initPatientCardsSync()

    function setToken(val: string) {
      token.value = val
    }

    function setOpenId(val: string) {
      openId.value = val
    }

    function setAuthState(val: string) {
      authState.value = val
    }

    function setUserInfo(val: Record<string, unknown>) {
      userInfo.value = val
    }

    function setAgreement(val: boolean) {
      agreement.value = val
    }

    const appointmentsList = ref<any[]>([])

    function initAppointments(defaults: any[]) {
      if (appointmentsList.value.length === 0) {
        appointmentsList.value = [...defaults]
      }
    }

    function addAppointment(appointment: any, defaults: any[]) {
      appointmentsList.value = [appointment, ...appointmentsList.value]
      if (appointmentsList.value.length > 20) {
        appointmentsList.value = [...defaults]
      }
      saveToStorage()
    }

    function deletePatient(id: string) {
      patients.value = patients.value.filter(p => p.id !== id)
      if (activePatientId.value === id) {
        const fallback = patients.value[0]?.id || 'p_adult_male'
        activePatientId.value = fallback
        Taro.setStorageSync('active_patient_id', fallback)
      }
      saveToStorage()
    }

    function addPatient(patient: any) {
      const newPatient = {
        ...patient,
        credentials: [
          { id: 'visit', title: '就诊卡', cardNo: patient.cardNo }
        ]
      }
      patients.value.push(newPatient)
      saveToStorage()
    }

    function cancelAppointment(id: string) {
      appointmentsList.value = appointmentsList.value.filter(item => item.id !== id)
      saveToStorage()
    }

    function saveToStorage() {
      try {
        const data = {
          token: token.value,
          openId: openId.value,
          authState: authState.value,
          userInfo: userInfo.value,
          activePatientId: activePatientId.value,
          appointmentsList: appointmentsList.value,
          showNoAvatarGlobal: showNoAvatarGlobal.value,
          patients: patients.value,
          activeCardMap: activeCardMap.value,
          isMaskedGlobal: isMaskedGlobal.value
        }
        Taro.setStorageSync('app', JSON.stringify(data))
        Taro.setStorageSync('active_patient_id', activePatientId.value)
        console.log('[Store] saveToStorage - saved successfully:', JSON.stringify(data))
      } catch (e) {
        console.error('Failed to save store to storage:', e)
      }
    }

    function syncFromStorage() {
      try {
        const saved = Taro.getStorageSync('app')
        console.log('[Store] syncFromStorage - raw saved:', saved)
        if (saved) {
          const parsed = typeof saved === 'string' ? JSON.parse(saved) : saved
          console.log('[Store] syncFromStorage - parsed activePatientId:', parsed.activePatientId)
          if (parsed.activePatientId) {
            activePatientId.value = parsed.activePatientId
          }
          if (parsed.activeCardMap) {
            activeCardMap.value = parsed.activeCardMap
          }
          if (parsed.showNoAvatarGlobal !== undefined) {
            showNoAvatarGlobal.value = parsed.showNoAvatarGlobal
          }
          if (parsed.patients) {
            patients.value = parsed.patients.filter((p: any) => ['p_adult_female', 'p_adult_male'].includes(p.id))
          }
          if (parsed.appointmentsList) {
            appointmentsList.value = parsed.appointmentsList
          }
          if (parsed.isMaskedGlobal !== undefined) {
            isMaskedGlobal.value = parsed.isMaskedGlobal
          }
        } else {
          const savedId = Taro.getStorageSync('active_patient_id')
          if (savedId) {
            activePatientId.value = savedId
          }
        }
        const savedActivePatientId = Taro.getStorageSync('active_patient_id')
        if (savedActivePatientId && patients.value.some(p => p.id === savedActivePatientId)) {
          activePatientId.value = savedActivePatientId
        }
        patients.value.forEach(p => {
          const savedActiveCardId = Taro.getStorageSync(`active_card_${p.id}`)
          if (savedActiveCardId) {
            activeCardMap.value[p.id] = savedActiveCardId
          }
        })
        migrateStoreState()
        initPatientCardsSync()
      } catch (e) {
        console.error('Failed to sync store from storage:', e)
      }
    }

    return {
      token,
      openId,
      authState,
      userInfo,
      phone,
      agreement,
      patients,
      activePatientId,
      showPatientSwitcher,
      activePatient,
      switchPatient,
      updateActiveCard,
      setActivePatientCard,
      activeCardMap,
      isMaskedGlobal,
      setToken,
      setOpenId,
      setAuthState,
      setUserInfo,
      setAgreement,
      appointmentsList,
      initAppointments,
      addAppointment,
      cancelAppointment,
      deletePatient,
      addPatient,
      showNoAvatarGlobal,
      showOtherDeptsGlobal,
      showOtherDeptsMap,
      isSearchingGlobal,
      syncFromStorage,
      saveToStorage
    }
  },
  {
    persist: {
      pick: ['token', 'openId', 'authState', 'userInfo', 'activePatientId', 'appointmentsList', 'showNoAvatarGlobal', 'patients', 'activeCardMap', 'isMaskedGlobal']
    }
  }
)
