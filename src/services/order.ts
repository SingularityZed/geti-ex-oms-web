import request from '@/utils/axiosReques';

export async function queryExchangeOrder(params) {
  return request.get('/order-service/v1/mgr/exchangeOrder/list', {params});
}
export async function exchangeOrderDetail(id?: any) {
  return request.get(`/order-service/v1/mgr/exchangeOrder/detail/${  id}`);
}
export async function exchangebatteryTrack(id?: any) {
  return request.get(`/order-service/v1/mgr/exchangeOrder/batteryTrack/${  id}`);
}
export async function resolveExceptionBattery(params) {
  return request.put('/order-service/v1/mgr/exchangeOrder/resolveExceptionBattery', {params})
}
export async function queryConsumerInfo(params) {
  return request.get('/order-service/v1/mgr/exchangeOrder/queryConsumerInfo', {params})
}


