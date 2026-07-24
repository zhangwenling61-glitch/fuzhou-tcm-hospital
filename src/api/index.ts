import $https from '@/utils/https'

// 查询新闻资讯
export function findHealthInfo(params = { type: '14' }) {
  // 利用泛型指定返回类型, 项目中请使用真实类型, 避免使用any
  return $https<any[]>({
    method: 'post',
    params: params,
    serviceId: 'app.medical.findHealthInfo'
  })
}
