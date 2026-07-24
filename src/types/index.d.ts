/**
 * 数字身份认证成功返回数据
 */
export interface IdentificationSuccessResponse {
  /**
   * 流水号,用来调用接口获取认证结果
   */
  token: string,
  /**
   * 认证应用Id
   */
  applicationId: string,
  /**
   * 认证场景Id
   */
  sceneId: string,
  /**
   * 用户微信openid
   */
  openId: string,
  /**
   * 认证结果标识
   */
  authSuccess: true
}
