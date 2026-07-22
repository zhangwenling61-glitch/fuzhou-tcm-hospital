const PATIENT_MANAGEMENT_COS_BASE = 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E9%97%A8%E6%88%B73.0%E5%88%87%E5%9B%BE%E8%B5%84%E6%BA%90/%E5%B0%B1%E8%AF%8A%E4%BA%BA%E7%AE%A1%E7%90%86/patient-management'
const FZ_HOME_COS_BASE = 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E7%A6%8F%E5%B7%9E%E4%B8%AD%E5%8C%BB%E9%99%A2/%E9%A6%96%E9%A1%B5'

export const patientManagementAssets = {
  socialCard: `${PATIENT_MANAGEMENT_COS_BASE}/social-card.svg`,
  healthCard: `${PATIENT_MANAGEMENT_COS_BASE}/health-card.svg`,
  visitCard: `${PATIENT_MANAGEMENT_COS_BASE}/visit-card.svg`,
  actionRefresh: `${PATIENT_MANAGEMENT_COS_BASE}/action-refresh.svg`,
  actionAdd: `${PATIENT_MANAGEMENT_COS_BASE}/action-add.svg`,
  actionDelete: `${PATIENT_MANAGEMENT_COS_BASE}/action-delete.svg`,
  actionUnlink: `${PATIENT_MANAGEMENT_COS_BASE}/action-unlink.svg`,
  check: `${PATIENT_MANAGEMENT_COS_BASE}/check.svg`
}

export const fzHomeAssets = {
  defaultAvatarMale: `${FZ_HOME_COS_BASE}/%E5%A4%B4%E5%83%8F%E9%BB%98%E8%AE%A4%E7%94%B7.png`,
  defaultAvatarFemale: `${FZ_HOME_COS_BASE}/%E5%A4%B4%E5%83%8F%E9%BB%98%E8%AE%A4%E5%A5%B3.png`,
  searchIcon: `${FZ_HOME_COS_BASE}/%E6%90%9C%E7%B4%A2.png`
}
