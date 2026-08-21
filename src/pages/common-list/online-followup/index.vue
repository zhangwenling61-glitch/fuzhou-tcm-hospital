<template>
  <div
    class="yh-secondary-page online-consult-page"
    :class="{ 'yh-scroll-locked': isPopupOpen }"
    :style="{ paddingTop: contentTop + 'px' }"
  >
    <PortalNavBar title="病情描述" :scroll-top="scrollTop" secondary force-dark-text />

    <div class="online-consult-user-card-wrap">
      <PortalUserCard
        class="online-consult-user-card"
        primary-text="问诊记录"
        primary-icon=""
        :show-todo-bar="false"
        :show-todo-panel="false"
        :show-avatar="true"
        @primary="openConsultRecord"
      />
    </div>

    <div class="yh-secondary-content online-consult-content">
      <div class="yh-secondary-section-title">问诊信息</div>
      <section class="yh-secondary-card yh-secondary-card-flow online-consult-card is-history">
        <div class="consult-info-list">
          <PortalFormRow type="key-value" label="问诊科室" :value="consultDepartmentName" />
          <PortalFormRow type="key-value" label="问诊医生" :value="consultDoctorName" />
        </div>

        <div class="yh-secondary-card-flow__divider"></div>

        <div class="consult-purpose-section">
          <span class="consult-section-title consult-required">本次咨询目的</span>
          <div class="consult-purpose-grid">
            <button
              v-for="item in purposeOptions"
              :key="item.value"
              class="consult-purpose-card"
              :class="{ 'is-active': purpose === item.value }"
              hover-class="consult-purpose-card--hover"
              type="button"
              @tap="purpose = item.value"
            >
              <span class="consult-purpose-card__title">{{ item.label }}</span>
              <span class="consult-purpose-card__desc">{{ item.desc }}</span>
            </button>
          </div>
        </div>

        <div class="yh-secondary-card-flow__divider"></div>

        <div class="consult-choice-line">
          <span class="consult-choice-line__label consult-required">过敏史</span>
          <div class="consult-radio-row">
            <button
              v-for="item in historyOptions"
              :key="'allergy-' + item.value"
              class="consult-radio"
              :class="{ 'is-checked': allergyHistory === item.value }"
              type="button"
              @tap="selectHistoryState('allergy', item.value)"
            >
              <img
                class="consult-radio__icon"
                :class="allergyHistory === item.value ? 'is-checked' : 'is-unchecked'"
                :src="allergyHistory === item.value ? iconCircleDot : iconCircle"
                alt=""
              />
              <span>{{ item.label }}</span>
            </button>
          </div>
        </div>

        <div v-if="allergyHistory === 'yes'" class="consult-history-detail">
          <div class="consult-detail-heading">
            <span>常见过敏源（可多选）</span>
            <span>点击标签即可选择</span>
          </div>
          <div class="consult-detail-tags">
            <button
              v-for="tag in allergyTags"
              :key="tag"
              class="consult-detail-tag"
              :class="{ 'is-active': selectedAllergyTags.includes(tag) }"
              type="button"
              @tap="toggleHistoryTag('allergy', tag)"
            >{{ tag }}</button>
          </div>
          <div class="consult-detail-label">其他<span>（未列出的过敏源请手动补充）</span></div>
          <div class="consult-input-box is-detail">
            <textarea
              v-model="allergyText"
              class="consult-textarea is-detail"
              maxlength="200"
              placeholder="可补充说明过敏物质及过敏反应（如：青霉素 - 皮疹）"
              placeholder-class="consult-placeholder"
              :disable-default-padding="true"
              cursor-color="#457130"
              @input="syncTagsFromText('allergy', $event)"
            />
          </div>
        </div>

        <div class="yh-secondary-card-flow__divider"></div>

        <div class="consult-choice-line">
          <span class="consult-choice-line__label consult-required">既往史</span>
          <div class="consult-radio-row">
            <button
              v-for="item in historyOptions"
              :key="'disease-' + item.value"
              class="consult-radio"
              :class="{ 'is-checked': diseaseHistory === item.value }"
              type="button"
              @tap="selectHistoryState('disease', item.value)"
            >
              <img
                class="consult-radio__icon"
                :class="diseaseHistory === item.value ? 'is-checked' : 'is-unchecked'"
                :src="diseaseHistory === item.value ? iconCircleDot : iconCircle"
                alt=""
              />
              <span>{{ item.label }}</span>
            </button>
          </div>
        </div>

        <div v-if="diseaseHistory === 'yes'" class="consult-history-detail">
          <div class="consult-detail-heading">
            <span>常见既往史（可多选）</span>
            <span>点击标签即可选择</span>
          </div>
          <div class="consult-detail-tags">
            <button
              v-for="tag in diseaseTags"
              :key="tag"
              class="consult-detail-tag"
              :class="{ 'is-active': selectedDiseaseTags.includes(tag) }"
              type="button"
              @tap="toggleHistoryTag('disease', tag)"
            >{{ tag }}</button>
          </div>
          <div class="consult-detail-label">其他<span>（未列出的病史请手动补充）</span></div>
          <div class="consult-input-box is-detail disease-input-box">
            <textarea
              v-model="diseaseText"
              class="consult-textarea is-detail"
              maxlength="200"
              placeholder="可补充说明疾病及时间（如：高血压 5 年、2023 年胆囊切除术）"
              placeholder-class="consult-placeholder"
              :disable-default-padding="true"
              cursor-color="#457130"
              cursor-spacing="140"
              @input="syncTagsFromText('disease', $event)"
              @focus="handleFocus('disease')"
            />
          </div>
        </div>
      </section>

      <div class="yh-secondary-section-title">病情描述</div>
      <section class="yh-secondary-card yh-secondary-card-flow online-consult-card is-disease">
        <div class="consult-section-title-row">
          <div class="consult-description-heading">
            <span class="consult-section-title consult-required">病情描述</span>
            <span class="consult-description-hint">越详细对诊断的帮助越大</span>
          </div>
          <button class="consult-import-btn" hover-class="consult-import-btn--hover" type="button" @tap="importSymptom"><img class="consult-import-btn__icon is-blue" :src="iconFileImport" alt="" /><span>导入历史病情描述</span></button>
        </div>

        <button class="consult-example-btn" hover-class="consult-example-btn--hover" type="button" @tap="showDescriptionExample">查看示例</button>

        <div class="consult-input-box symptom-input-box">
          <textarea
            v-model="symptomText"
            class="consult-textarea"
            maxlength="200"
            placeholder="请详细描述您的症状、疾病、身体情况等，越详细越好，便于医生更准确得为您分析解答..."
            placeholder-class="consult-placeholder"
            :disable-default-padding="true"
            cursor-color="#457130"
            cursor-spacing="140"
            @focus="handleFocus('symptom')"
          />
          <span class="consult-counter">{{ symptomText.length }}/200</span>
        </div>

        <div class="consult-shortcut-wrap">
          <div class="consult-tags-row">
            <span class="consult-tags-label">可选标题</span>
            <div class="consult-tags-list">
              <button
                v-for="tag in shortcutTags"
                :key="tag.label"
                class="consult-tag-pill"
                :class="{ 'is-active': tag.active }"
                type="button"
                @tap="handleTagTap(tag)"
              >
                {{ tag.label }}
              </button>
            </div>
          </div>
        </div>

        <div class="consult-tongue-upload">
          <div class="consult-upload-label">舌像图片<span>（选填，有助于中医辨证）</span></div>
          <div class="consult-upload-row" :class="{ 'has-images': tongueImages.length > 0 }">
            <div v-for="(img, index) in tongueImages" :key="img" class="consult-upload-item">
              <img class="consult-upload-preview" :src="img" mode="aspectFill" @tap="previewTongueImage(index)" />
              <div class="consult-upload-delete" @tap.stop="deleteTongueImage(index)">
                <span class="consult-upload-delete__icon">×</span>
              </div>
            </div>
            <button v-if="tongueImages.length < 3" class="consult-upload-box" type="button" @tap="chooseTongueImage">
              <img class="consult-upload-plus is-secondary" :src="iconPlus" alt="" />
            </button>
            <p v-if="tongueImages.length === 0" class="consult-upload-desc">在自然光下拍摄舌面照片，便于医生辨证舌质、舌苔（最多上传3张，单张不超过10M）</p>
          </div>
          <p v-if="tongueImages.length > 0" class="consult-upload-desc is-bottom">在自然光下拍摄舌面照片，便于医生辨证舌质、舌苔（最多上传3张，单张不超过10M）</p>
        </div>
      </section>

      <div class="yh-secondary-section-title">复诊凭证（二选一）</div>
      <section class="yh-secondary-card yh-secondary-card-flow online-consult-card is-proof">
        <div class="consult-certificate-tabs">
          <button
            v-for="item in certificateOptions"
            :key="item.value"
            class="consult-certificate-tab"
            :class="{ 'is-active': certificateType === item.value }"
            type="button"
            @tap="certificateType = item.value"
          >
            <img class="consult-radio__icon" :src="certificateType === item.value ? iconCircleDot : iconCircle" alt="" />
            <span>{{ item.label }}</span>
          </button>
        </div>

        <div v-if="certificateType === 'our'" class="yh-secondary-row is-key-value consult-form-row" @tap="showDiagnosisSheet = true">
          <span class="yh-secondary-row__key">院内诊断</span>
          <div class="yh-secondary-row__val consult-row-value is-placeholder" :class="{ 'has-value': Boolean(diagnosisType) }">
            <span>{{ diagnosisType || '请选择' }}</span>
          </div>
          <PortalRowArrow class="portal-row-arrow-host" />
        </div>

        <div class="consult-upload-label" :class="{ 'consult-required': certificateType === 'outside' }">
          {{ certificateType === 'our' ? '本院就诊资料' : '外院就诊资料' }}
          <span>{{ certificateType === 'our' ? '（选填）' : '（必填）' }}</span>
        </div>

        <div class="consult-upload-row" :class="{ 'has-images': proofImages.length > 0 }">
          <div
            v-for="(img, index) in proofImages"
            :key="img"
            class="consult-upload-item"
          >
            <img class="consult-upload-preview" :src="img" mode="aspectFill" @tap="previewImage(index)" />
            <div class="consult-upload-delete" @tap.stop="deleteImage(index)">
              <span class="consult-upload-delete__icon">×</span>
            </div>
          </div>
          <button
            v-if="proofImages.length < 9"
            class="consult-upload-box"
            type="button"
            @tap="chooseProofImage"
          >
            <img class="consult-upload-plus is-secondary" :src="iconPlus" alt="" />
          </button>
          <p v-if="proofImages.length === 0" class="consult-upload-desc">
            请上传历史就诊病历、报告单、处方单、检查资料、患处照片(最多上传9张，仅支持JPG/PNG格式)，照片仅自己和医生可见。
          </p>
        </div>
        <p v-if="proofImages.length > 0" class="consult-upload-desc is-bottom">
          请上传历史就诊病历、报告单、处方单、检查资料、患处照片(最多上传9张，仅支持JPG/PNG格式)，照片仅自己和医生可见。
        </p>
      </section>

      <section class="online-consult-agreement">
        <button
          class="consult-check"
          type="button"
          @tap="agreed = !agreed"
        >
          <img
            class="consult-check__icon"
            :class="agreed ? 'is-checked' : 'is-unchecked'"
            :src="agreed ? iconCheckSquare : iconSquare"
            alt=""
          />
        </button>
        <span class="consult-agreement-copy">我已阅读并同意<button class="consult-link" type="button" @tap="openProtocol">《互联网医院在线问诊知情同意书》</button>，确认所填信息真实有效。</span>
      </section>
    </div>

    <div class="fixed-bottom-bar is-transparent online-consult-bottom">
      <button
        class="btn-primary online-consult-next"
        :class="{ 'is-disabled': !canSubmit }"
        type="button"
        @tap="submitConsult"
      >下一步</button>
    </div>

    <PortalActionSheet
      :show="store.showPatientSwitcher"
      title="切换就诊人"
      :actions="store.patients.map(p => p.name)"
      :value="store.activePatient.name"
      @update:show="store.showPatientSwitcher = $event"
      @select="handleSelectPatient"
    />

    <PortalActionSheet
      :show="showDiagnosisSheet"
      title="院内诊断"
      :actions="diagnosisOptions"
      :value="diagnosisType"
      @update:show="showDiagnosisSheet = $event"
      @select="diagnosisType = $event"
    />

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Taro, { useDidShow, usePageScroll, useRouter } from '@tarojs/taro'
import { useAppStore } from '@/store'
import PortalNavBar from '@/components/PortalNavBar/index.vue'
import PortalUserCard from '@/components/PortalUserCard/index.vue'
import PortalFormRow from '@/components/PortalFormRow/index.vue'
import PortalRowArrow from '@/components/PortalRowArrow/index.vue'
import PortalActionSheet from '@/components/PortalActionSheet/index.vue'
import { getSafeMenuButtonBoundingClientRect } from '@/utils'
import { doctors } from '@/pages/appointment/mock'
import './index.less'

import iconPlus from '@/assets/icons/record/plus.svg'
import iconFileImport from '@/assets/icons/record/file-import.svg'
import iconCircle from '@/assets/icons/record/circle.svg'
import iconCircleDot from '@/assets/icons/record/circle-dot.svg'
import iconSquare from '@/assets/icons/record/square.svg'
import iconCheckSquare from '@/assets/icons/record/check-square.svg'

const IMPORTED_SYMPTOM_KEY = 'online_consult_imported_symptom'
const store = useAppStore()
const router = useRouter()
const menuButtonInfo = getSafeMenuButtonBoundingClientRect()
const contentTop = menuButtonInfo.bottom + 16
const scrollTop = ref(0)

function readParam(name: string, fallback = '') {
  const raw = router.params[name]
  if (!raw) return fallback
  try {
    return decodeURIComponent(raw)
  } catch (e) {
    return raw
  }
}

const selectedDoctor = computed(() => {
  const doctorId = readParam('doctorId')
  return doctors.find(item => item.id === doctorId)
})
const consultDepartmentName = computed(() => readParam(
  'deptName',
  selectedDoctor.value?.clinic || selectedDoctor.value?.department || '未选择'
))
const consultDoctorName = computed(() => readParam(
  'doctorName',
  selectedDoctor.value?.name || '未选择'
))

type HistoryValue = 'unknown' | 'none' | 'yes'
type HistoryKind = 'allergy' | 'disease'
type CertificateType = 'our' | 'outside'

const historyOptions = [
  { label: '不清楚', value: 'unknown' },
  { label: '无', value: 'none' },
  { label: '有', value: 'yes' }
] as const

const purposeOptions = [
  { label: '在线复诊', desc: '送药到家', value: 'online_revisit' },
  { label: '线上开单', desc: '线下检查', value: 'offline' },
  { label: '报告解读', desc: '看不懂找医生', value: 'report' },
  { label: '慢病续方', desc: '复诊续处方', value: 'chronic' }
] as const

type PurposeValue = typeof purposeOptions[number]['value']

const purposeAliases: Record<string, PurposeValue> = {
  复诊开药: 'online_revisit',
  在线复诊: 'online_revisit',
  开检查检验: 'offline',
  线上开单: 'offline',
  报告解读: 'report',
  慢病续方: 'chronic'
}

const allergyTags = ['青霉素', '头孢类', '磺胺类', '阿司匹林', '海鲜', '鱼虾', '牛奶', '鸡蛋', '花粉', '尘螨', '酒精', '芒果', '坚果', '大豆', '小麦麸质']
const diseaseTags = ['高血压', '糖尿病', '冠心病', '脑卒中', '哮喘', '慢性胃炎', '肝炎', '结核', '肿瘤', '手术史', '骨折外伤', '输血史', '妊娠', '精神疾病', '甲状腺疾病']
const certificateOptions = [
  { label: '本院复诊', value: 'our' },
  { label: '外院复诊', value: 'outside' }
] as const
const diagnosisOptions = ['慢性乙型肝炎', '脂肪肝', '肝功能异常', '肝胆术后复诊']

const purpose = ref<PurposeValue>('online_revisit')
const allergyHistory = ref<HistoryValue>('unknown')
const allergyText = ref('')
const selectedAllergyTags = ref<string[]>([])
const diseaseHistory = ref<HistoryValue>('unknown')
const diseaseText = ref('')
const selectedDiseaseTags = ref<string[]>([])
const symptomText = ref('')
const HEADERS = ['症状：', '检查情况：', '用药情况：']
const certificateType = ref<CertificateType>('our')
const diagnosisType = ref('')
const agreed = ref(false)
const showDiagnosisSheet = ref(false)
const tongueImages = ref<string[]>([])
const proofImages = ref<string[]>([])

const actualSymptomCount = computed(() => {
  let text = symptomText.value
  HEADERS.forEach(header => {
    text = text.replace(new RegExp(header, 'g'), '')
  })
  return text.trim().length
})

const shortcutTags = computed(() => [
  { label: '症状', value: '症状：', active: symptomText.value.includes('症状：') },
  { label: '检查情况', value: '检查情况：', active: symptomText.value.includes('检查情况：') },
  { label: '用药情况', value: '用药情况：', active: symptomText.value.includes('用药情况：') }
])

const handleTagTap = (tag: { label: string; value: string; active: boolean }) => {
  const valueToInsert = tag.value
  if (symptomText.value.includes(valueToInsert)) {
    symptomText.value = symptomText.value.replace(valueToInsert, '').trim()
  } else {
    if (symptomText.value.length === 0) {
      symptomText.value = valueToInsert
    } else {
      symptomText.value = symptomText.value + '\n' + valueToInsert
    }
  }
}

const splitDetailText = (value: string) => value
  .split(/[、，,\n]/)
  .map(item => item.trim())
  .filter(Boolean)

const selectHistoryState = (kind: HistoryKind, value: HistoryValue) => {
  if (kind === 'allergy') {
    allergyHistory.value = value
    if (value !== 'yes') {
      allergyText.value = ''
      selectedAllergyTags.value = []
    }
    return
  }

  diseaseHistory.value = value
  if (value !== 'yes') {
    diseaseText.value = ''
    selectedDiseaseTags.value = []
  }
}

const toggleHistoryTag = (kind: HistoryKind, tag: string) => {
  const allTags = kind === 'allergy' ? allergyTags : diseaseTags
  const selected = kind === 'allergy' ? selectedAllergyTags : selectedDiseaseTags
  const detailText = kind === 'allergy' ? allergyText : diseaseText
  const nextSelected = selected.value.includes(tag)
    ? selected.value.filter(item => item !== tag)
    : [...selected.value, tag]
  const customParts = splitDetailText(detailText.value).filter(item => !allTags.includes(item))

  selected.value = nextSelected
  detailText.value = [...nextSelected, ...customParts].join('、')
}

const syncTagsFromText = (kind: HistoryKind, event: any) => {
  const value = event?.detail?.value ?? ''
  const allTags = kind === 'allergy' ? allergyTags : diseaseTags
  const entered = splitDetailText(value)

  if (kind === 'allergy') {
    allergyText.value = value
    selectedAllergyTags.value = allTags.filter(tag => entered.includes(tag))
    return
  }

  diseaseText.value = value
  selectedDiseaseTags.value = allTags.filter(tag => entered.includes(tag))
}

useDidShow(() => {
  const imported = Taro.getStorageSync(IMPORTED_SYMPTOM_KEY)
  if (!imported || typeof imported !== 'object') return

  const payload = imported as {
    symptomText?: string
    allergyText?: string
    diseaseText?: string
    selectedAllergyTags?: string[]
    selectedDiseaseTags?: string[]
    diseaseHistory?: HistoryValue
    allergyHistory?: HistoryValue
    purpose?: string
  }

  if (payload.symptomText) symptomText.value = payload.symptomText.slice(0, 200)
  if (payload.allergyText) allergyText.value = payload.allergyText.slice(0, 200)
  if (payload.diseaseText) diseaseText.value = payload.diseaseText.slice(0, 200)
  if (payload.selectedAllergyTags) selectedAllergyTags.value = payload.selectedAllergyTags.filter(tag => allergyTags.includes(tag))
  if (payload.selectedDiseaseTags) selectedDiseaseTags.value = payload.selectedDiseaseTags.filter(tag => diseaseTags.includes(tag))
  if (payload.diseaseHistory) diseaseHistory.value = payload.diseaseHistory
  if (payload.allergyHistory) allergyHistory.value = payload.allergyHistory
  if (payload.purpose && purposeAliases[payload.purpose]) purpose.value = purposeAliases[payload.purpose]
  Taro.removeStorageSync(IMPORTED_SYMPTOM_KEY)
})

const isPopupOpen = computed(() => store.showPatientSwitcher || showDiagnosisSheet.value)

usePageScroll((res) => {
  scrollTop.value = res.scrollTop
})

const handleFocus = (type: 'disease' | 'symptom') => {
  setTimeout(() => {
    const selector = type === 'disease' ? '.disease-input-box' : '.symptom-input-box'
    Taro.createSelectorQuery()
      .select(selector)
      .boundingClientRect((rect) => {
        if (rect) {
          const navBottom = menuButtonInfo.bottom + 16
          const targetScrollTop = scrollTop.value + rect.top - navBottom - 12
          Taro.pageScrollTo({
            scrollTop: Math.max(0, targetScrollTop),
            duration: 250
          })
        }
      })
      .exec()
  }, 150)
}

const consultCardNo = computed(() => {
  const raw = store.activePatient?.cardNo || 'D12345678'
  return raw.startsWith('AE') ? raw.replace('AE', 'D') : raw
})

const canSubmit = computed(() => {
  if (!purpose.value) return false
  if (actualSymptomCount.value < 10) return false
  if (certificateType.value === 'outside' && proofImages.value.length === 0) return false
  if (!agreed.value) return false
  return true
})

const openConsultRecord = () => {
  Taro.showToast({ title: '暂无信息', icon: 'none' })
}

const handleSelectPatient = (name: string) => {
  const patient = store.patients.find(item => item.name === name)
  if (patient) {
    store.switchPatient(patient.id)
  }
}

const importSymptom = () => {
  Taro.navigateTo({
    url: '/pages/common-list/online-followup/history',
    fail(err) {
      console.error('navigateTo online consult history fail:', err, 'Current depth:', Taro.getCurrentPages().length)
    }
  })
}

const showDescriptionExample = () => {
  Taro.showModal({
    title: '病情描述示例',
    content: '症状：近一周反复胃胀，饭后加重，伴嗳气、口苦。\n检查情况：暂未检查。\n用药情况：自行服用胃药两天，症状无明显改善。',
    showCancel: false,
    confirmText: '知道了'
  })
}

const chooseImages = (target: 'tongue' | 'proof') => {
  const images = target === 'tongue' ? tongueImages : proofImages
  const maxCount = target === 'tongue' ? 3 : 9
  const count = maxCount - images.value.length
  if (count <= 0) {
    Taro.showToast({ title: `最多只能上传${maxCount}张图片`, icon: 'none' })
    return
  }

  Taro.chooseImage({
    count,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const paths = res.tempFilePaths.filter((_, index) => {
        if (target !== 'tongue') return true
        const size = res.tempFiles?.[index]?.size || 0
        return size === 0 || size <= 10 * 1024 * 1024
      })
      if (paths.length < res.tempFilePaths.length) {
        Taro.showToast({ title: '舌像图片单张不能超过10M', icon: 'none' })
      }
      images.value = [...images.value, ...paths]
    },
    fail: (err) => {
      console.log('chooseImage fail', err)
    }
  })
}

const chooseTongueImage = () => chooseImages('tongue')
const chooseProofImage = () => {
  chooseImages('proof')
}

const deleteTongueImage = (index: number) => tongueImages.value.splice(index, 1)
const deleteImage = (index: number) => {
  proofImages.value.splice(index, 1)
}

const previewTongueImage = (index: number) => {
  Taro.previewImage({
    current: tongueImages.value[index],
    urls: tongueImages.value
  })
}

const previewImage = (index: number) => {
  Taro.previewImage({
    current: proofImages.value[index],
    urls: proofImages.value
  })
}

const openProtocol = () => {
  Taro.navigateTo({
    url: '/pages/common-list/protocol/index',
    fail(err) {
      console.error('navigateTo protocol fail:', err, 'Current depth:', Taro.getCurrentPages().length)
    }
  })
}

const submitConsult = () => {
  if (!purpose.value) {
    Taro.showToast({ title: '请选择本次咨询目的', icon: 'none' })
    return
  }
  if (actualSymptomCount.value < 10) {
    Taro.showToast({ title: '请描述您的症状（最少10个字）', icon: 'none' })
    return
  }
  if (certificateType.value === 'outside' && proofImages.value.length === 0) {
    Taro.showToast({ title: '请上传外院就诊资料', icon: 'none' })
    return
  }
  if (!agreed.value) {
    Taro.showToast({ title: '请先阅读并同意知情同意书', icon: 'none' })
    return
  }

  const purposeItem = purposeOptions.find(item => item.value === purpose.value)
  const now = new Date()
  const orderNo = `WZ${[
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0')
  ].join('')}`

  Taro.setStorageSync('online_consult_disease_form', {
    orderNo,
    patientId: store.activePatient.id,
    patientName: store.activePatient.name,
    cardNo: consultCardNo.value,
    departmentName: consultDepartmentName.value,
    doctorName: consultDoctorName.value,
    purpose: purpose.value,
    purposeLabel: purposeItem?.label || '',
    allergyHistory: allergyHistory.value,
    allergyText: allergyText.value.trim(),
    selectedAllergyTags: selectedAllergyTags.value,
    diseaseHistory: diseaseHistory.value,
    diseaseText: diseaseText.value.trim(),
    selectedDiseaseTags: selectedDiseaseTags.value,
    symptomText: symptomText.value.trim(),
    expectedFee: '¥20.00',
    status: '待医生接诊',
    tongueImages: tongueImages.value,
    certificateType: certificateType.value,
    diagnosisType: diagnosisType.value,
    proofImages: proofImages.value
  })

  Taro.redirectTo({
    url: '/pages/common-list/online-followup/success',
    fail(err) {
      console.error('redirectTo online consult success fail:', err, 'Current depth:', Taro.getCurrentPages().length)
    }
  })
}
</script>
