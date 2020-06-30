import request from '@/utils/axiosReques';

export async function getConsumerList(params) {
  return request.get('/consumer-service/v1/mgr/consumer', {params});
}

export async function bindGroup(params) { // 用户绑定群组
  return request.post('/consumer-service/v1/mgr/consumer/bindGroup', params)
}

export async function getConsumerDetail(consumerId) { // 获取用户详情
  return request.get(`/consumer-service/v1/mgr/consumer/${consumerId}`, {})
}

export async function directional(consumerId) { // 设为定向用户
  return request.put(`/consumer-service/v1/mgr/consumer/${consumerId}/directional`, {})
}

export async function normal(consumerId) { // 设为定向用户
  return request.put(`/consumer-service/v1/mgr/consumer/${consumerId}/normal`, {})
}

export async function refreshToken(consumerId) { // 刷新token
  return request.get(`/consumer-service/v1/mgr/consumer/delToken/${consumerId}`)
}

export async function disableUserDetailState(consumerId) { // 用户禁用
  return request.put(`/consumer-service/v1/mgr/consumer/${consumerId}/disable`,{})
}

export async function enableUserDetailState(consumerId) { // 用户启用
  return request.put(`/consumer-service/v1/mgr/consumer/${consumerId}/enable`,{})
}

export async function unbindingBattery(consumerId) { // 退用户电池
  return request.put(`/consumer-service/v1/mgr/consumer/${consumerId}/unbindingBattery`, {})
}

export async function getFeedBack(params) { // 用户反馈
  return request.get('/consumer-service/v1/mgr/feedback', {params})
}

export async function hasDealFeedBack(id, response) { // 用户反馈已解决
  return request.put(`/consumer-service/v1/mgr/feedback/${id}/hasDeal?response=${response}`, {})
}

export async function getRight(mobileNo) { // 账户权益查询
  return request.put(`/consumer-service/v1/mgr/consumer/getRight/${mobileNo}`, {})
}

export async function rightTransfer(params) { // 账户权益转移
  return request.put('/consumer-service/v1/mgr/consumer/rightTransfer', {params})
}

export async function querySendDetail(params) { // 查询短信模板列表
  return request.post('/consumer-service/v1/mgr/consumer/querySendDetail', params)
}

export async function subList(params) { // 代缴用户查询
  return request.get('/consumer-service/v1/mgr/consumer/subList', {params})
}

export async function getGroupUser(params) { // 查看群组内的用户
  return request.get('/consumer-service/v1/mgr/pageList', {params})
}

export async function deleteGroupUser(id) { // 删除群组内的用户
  return request.post(`/consumer-service/v1/mgr/consumer/withdrawGroup/${id}`,{})
}

export async function channelConsumerList (params) { // 获取渠道用户列表
  return request.get('/consumer-service/v1/mgr/channel/consumer', {params})
}

export async function exportConsumerExcel(params) { // 导出骑手信息
  return request.post("/business-monitor-service/v1/mgr/export/mgr/exportConsumerExcel", params)
}

export async function changePhoneLog (params) { // 骑手手机号换绑记录
  return request.get('/consumer-service/v1/mgr/consumerLog/phoneLog', {params})
}

export async function getBindingBatteryLog(params) {
  return request.get('/consumer-service/v1/mgr/bindingBatteryLog', {params});
}

export async function getRealNameLog(params) {
  return request.get('/consumer-service/v1/mgr/realName', {params});
}
