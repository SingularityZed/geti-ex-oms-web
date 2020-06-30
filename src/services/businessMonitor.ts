import request from '@/utils/axiosReques';

export async function exportdepositeList(params) { // 导出押金列表
  return request.post('/business-monitor-service/v1/mgr/export/withdrawDepositExcel', params)
}

export async function exportpackageList(params) { // 导出套餐列表
  return request.post('/business-monitor-service/v1/mgr/export/payOrderExcel', params)
}

export async function getExportList(params: { pageSize?: number | undefined; current?: number | undefined; module?: number | undefined } | undefined) { // 获取导出列表
  return request.get('/business-monitor-service/v1/mgr/export', {
    params,
  });
}

export async function getCabinetRepDay(params) { // 获取电柜日报
  return request.get('/business-monitor-service/v1/mgr/cabinetRepDay', {
    params,
  });
}

export async function cabinetRepDayexport(params) { // 电柜日报导出
  return request.post('/business-monitor-service/v1/mgr/cabinetRepDay/export', params);
}

export async function cabinetRepMonthexport(params) { // 电柜月报导出
  return request.post('/business-monitor-service/v1/mgr/cabinetRepMonth/export', params)
}

export async function getCabinetRepMonth(params) { // 获取电柜月报
  return request.get('/business-monitor-service/v1/mgr/cabinetRepMonth', {
    params,
  });
}

export async function getBatteryRep(params) { // 电池报表
  return request.get('/business-monitor-service/v1/mgr/batteryRep', {
    params,
  });
}

export async function getcountBusinessInfo() { // 获取首页头部数据
  return request.get('/business-monitor-service/v1/mgr/business/countBusinessInfo');
}

export async function getcountExchangeOrderInfo() { // 获取首页最近十二月订单
  return request.get('/business-monitor-service/v1/mgr/business/countLast12MonthExchangeOrderInfo');
}

export async function getcabinetExchangeRank(params) { // 电柜换电次数排名
  return request.post('/business-monitor-service/v1/mgr/business/cabinetExchangeRank', {
    ...params,
  });
}

export async function getcountPackageInfo() { // 获取首页尾部左侧套餐收入
  return request.get('/business-monitor-service/v1/mgr/business/countPackageInfo')
}

export async function getcountPackageDIST() { // 获取首页尾部右侧套餐占比分布
  return request.get('/business-monitor-service/v1/mgr/business/countPackageDIST')
}

// 导出押金流水excel
export async function exportDepositExcelList(params) {
  return request.post("/business-monitor-service/v1/mgr/export/depositExcel", params)
}

// 导出换电订单记录Excel
export async function payOrderExcel(params) {
  return request.post("/business-monitor-service/v1/mgr/export/payOrderExcel", params)
}

// 导出换电订单记录Excel
export async function exportExchangeExcel(params) {
  return request.post("/business-monitor-service/v1/mgr/export/exchangeOrderExcel", params)
}

export async function getCabinetData(params){ // 首页电柜数据
  return request.post("/business-monitor-service/v1/mgr/business/getCabinetData",{
    ...params
  })
}

export async function getBatteryData(params){ // 首页电池数据
  return request.post("/business-monitor-service/v1/mgr/business/getBatteryData",{
    ...params
  })
}

export async function getConsumerBizDataRes(params){ // 首页用户数据详情--注册/押金用户数
  return request.post("/business-monitor-service/v1/mgr/business/getConsumerBizDataRes",{
    ...params
  })
}

export async function getConsumerBuisnessDataRes(params){ // 首页用户数据详情--套餐用户/换电用户数
  return request.post("/business-monitor-service/v1/mgr/business/getConsumerBuisnessDataRes",{
    ...params
  })
}

export async function getConsumerBuisnessMonthData(params){ // 首页用户数据详情--套餐用户/换电用户数
  return request.post("/business-monitor-service/v1/mgr/business/getConsumerBuisnessMonthData",{
    ...params
  })
}
export async function exportCabinetExcel(params) { // 导出电柜excel
  return request.post("/business-monitor-service/v1/mgr/export/cabinetExcel", params);
}

export async function getErrorExchangeData(params) { // 换电订单详情--换电故障订单分析
  return request.post("/business-monitor-service/v1/mgr/business/getErrorExchangeData", params);
}
export async function getDistanceSocData(params) { // 换电订单详情--行驶与用电量分析
  return request.post("/business-monitor-service/v1/mgr/business/getDistanceSocData", params);
}
export async function getExceptionExchangeData(params) { // 换电订单详情--换电订单数据分析
  return request.post("/business-monitor-service/v1/mgr/business/getExceptionExchangeData", params);
}
export async function getExchangeRushHourData(params) { // 换电订单详情--换电时段统计
  return request.post("/business-monitor-service/v1/mgr/business/getExchangeRushHourData", params);
}
