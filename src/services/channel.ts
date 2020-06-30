import request from '@/utils/axiosReques';

export async function channelApplylist(params) {
  return request.get('/channel-manager-service/v1/mgr/apply', {params})
}
export async function channelPassApply(params) {
  return request.put('/channel-manager-service/v1/mgr/apply/pass', {params})
}
export async function channelRejectApply(params) {
  return request.put('/channel-manager-service/v1/mgr/apply/reject', {params})
}
export async function channelList (params) { // 查询渠道信息列表
  return request.get('/channel-manager-service/v1/mgr/channel/entity/list', {params})
}
export async function channelAdd (params) { // 手动新增渠道信息
  return request.post('/channel-manager-service/v1/mgr/channel/entity/add', params)
}

export async function channelEdit (params) {
  return request.put('/channel-manager-service/v1/mgr/channel/entity/update', {params})
}

export async function channelResetPassword (params) {
  return request.put('/channel-manager-service/v1/mgr/channel/entity/resetPassword', {params})
}

export async function channelProfitList (params) { // 渠道分润列表
  return request.get('/channel-manager-service/v1/mgr/shareBenefitLog', {params})
}

export async function channelWithdrawList (params) { // 提现列表
  return request.get('/channel-manager-service/v1/mgr/withdrawLogs', {params})
}

export async function channelWithdrawConfirm (params) {
  return request.put('/channel-manager-service/v1/mgr/withdrawConfirm/' + params)
}

export async function channelDetail (params) { // 获取渠道详情
  return request.get(`/channel-manager-service/v1/mgr/channel/entity/${params}`)
}
