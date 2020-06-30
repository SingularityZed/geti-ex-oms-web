import request from '@/utils/axiosReques';

export async function getdepositeAmount() {
  return request.get('/pay-service/v1/mgr/pay/getDepositAmount')
}

export async function getdepositeList(params: { pageSize?: number | undefined; current?: number | undefined; } | undefined) { // 获取押金列表
  return request.get('pay-service/v1/mgr/pay/depositList', {
    params,
  });
}

export async function getPackagelist(params: { pageSize?: number | undefined; current?: number | undefined; } | undefined) { // 获取套餐列表
  return request.get('/pay-service/v1/mgr/pay/packageList', {
    params,
  });
}

export async function getPackageAmount() { // 获取套餐头部数据
  return request.get('/pay-service/v1/mgr/pay/getPackageAmount')
}

export async function getsubstitute(params: { pageSize?: number | undefined; current?: number | undefined; } | undefined) { // 获取代缴提现记录列表
  return request.get('pay-service/v1/mgr/refundBatch', {
    params,
  });
}

export async function refundBatchpaid(id: any) { // 同意代缴提现
  return request.put(`pay-service/v1/mgr/refundBatch/${id}/paid`, {});
}

export async function refundBatchcancel(id: any) { // 拒绝代缴提现
  return request.put(`pay-service/v1/mgr/refundBatch/${id}/cancel`, {});
}

export async function refundBatchdetail(id: any) { // 代缴提现订单详情
  return request.get(`/pay-service/v1/mgr/refundBatch/${id}/detail`, {});
}

export async function getwithdraw(params: { pageSize?: number | undefined; current?: number | undefined; } | undefined) { // 获取提现列表
  return request.get('/pay-service/v1/mgr/withdrawLog', {
    params,
  });
}

export async function refund(consumerId) { // 退押金
  return request.put(`/pay-service/v1/mgr/pay/depositRefund/${consumerId}`, {})
}

export async function consumerCoupon(params) { // 查询用户优惠券
  return request.get('/pay-service/v1/mgr/consumerCoupon', {params})
}

export async function refundPage(params) { // 查询退押金申请
  return request.get('/pay-service/v1/mgr/pay/refund', {params})
}

export async function getRefundDetail(refundId) { //退款详情
  return request.get(`/pay-service/v1/mgr/pay/refund/${refundId}`)
}

export async function confirmRefundResult(refundTradeNo) { //微信退款确认
  return request.put(`/pay-service/v1/mgr/pay/refund/confirmRefundResult?tradeNo=${refundTradeNo}`)
}

export async function subDeposit(params) { // 押金代缴生成支付二维码
  return request.post('/pay-service/v1/mgr/pay/subDeposit', params)
}

export async function subDepositQuery(params) { // 押金代缴支付结果查询
  return request.get('/pay-service/v1/mgr/pay/subDepositQuery', {params})
}

export async function subPackage(params) { // 套餐代缴生成支付二维码
  return request.post('/pay-service/v1/mgr/pay/subPackage', params)
}

export async function refundBatch(params) { // 代缴提现
  return request.post('/pay-service/v1/mgr/refundBatch', params)
}

export async function getPayOrderList(params) {
  return request.get('/pay-service/v1/mgr/pay/order', {params})
}

export async function queryDepositOrder(params) {
  return request.get('/pay-service/v1/mgr/pay/order', {params});
}

export async function queryOrder(params) {
  return request.get('/pay-service/v1/mgr/pay/order', {params});
}

export async function queryTradeLog(params) {
  return request.get('/pay-service/v1/mgr/pay/tradeLog', {
    params,
  });
}

export async function depositRefund(refundNo) { // 退用户押金
  return request.put(`/pay-service/v1/mgr/pay/refund/confirm/${refundNo}`, {})
}

export async function canceldepositRefund(refundNo) { // 取消用户退押金
  return request.put(`/pay-service/v1/mgr/pay/refund/cancel/${refundNo}`, {})
}
