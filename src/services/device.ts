import request from '@/utils/axiosReques';

export async function BatteryList(params) { // 获取电池列表
  return request.get('/device-service/v1/mgr/battery', {
    params,
  });
}

export async function BatteryDetail(id?: any) { // 获取电池详情
  return request.get(`/device-service/v1/mgr/battery/${ id}`);
}

export async function BatterySoc(params: {}) { // 获取电量曲线
  return request.get('/device-service/v1/mgr/battery/batterySocCurve/',{
    params,
  });
}
export async function selectedUpgradePackage (id) { // 设置升级版为默认版本
  return request.put(`/device-service/v1/mgr/upgradePackage/selected/${id}`,{})
}
export async function batteryMap() { // 获取电池海量点
  return request.get('/device-service/v1/mgr/battery/batteryPosition', {});
}
export async function batteryRoad(params: any) { // 获取电池轨迹
  return request.post('/device-service/v1/mgr/battery/batteryTrack', {...params});
}

export async function getCabinetList(params: { pageSize?: number | undefined; current?: number | undefined; } | undefined) { // 获取电柜列表
  return request.get('/device-service/v1/mgr/cabinet', {
    params,
  });
}

export async function uploadLog(id: any) { // 下发指令上传电柜日志
  return request.put(`/device-service/v1/mgr/cabinet/log/${id}`,{})
}

export async function getUpdateready(params: { pageSize?: number | undefined; current?: number | undefined; } | undefined) { // 获取升级结果
  return request.get('device-service/v1/mgr/upgradePackage/deviceGroup/ready', {
    params,
  });
}
export async function packageList() { // 升级包list
  return request.get('device-service/v1/mgr/upgradePackage/list', {})
}
export async function upGrade(params: any) { // 设备升级
  return request.post('/device-service/v1/mgr/upgradePackage/upgrade', {
    ...params
  })
}



export async function iotDeviceImport(data: object) { // 设备导入
  return request.upload(`/device-service/v1/mgr/device/import?deviceType=${data.deviceType}&productId=${data.productId}&supplierId=${data.supplierId}`,data.file)
}

export async function iotSupplierList() { // 供应商list
  return request.get('/device-service/v1/mgr/supplier/getList', {})
}

export async function iotProductList() { // 产品类别list
  return request.get('/device-service/v1/mgr/product/getList', {})
}

export async function getIotLogs(params: { pageSize?: number | undefined; current?: number | undefined; } | undefined) { // 获取IOT日志
  return request.get('/device-service/v1/mgr/device/iot/logs', {
    params,
  });
}

export async function getPackage(params: { pageSize?: number | undefined; current?: number | undefined; } | undefined) { // 获取升级包
  return request.get('device-service/v1/mgr/upgradePackage', {
    params,
  });
}
export async function addupgradePackage(params: any) { // 新增升级包
  return request.post('/device-service/v1/mgr/upgradePackage',{
    ...params
  });
}

export async function getupdateResult(params: { pageSize?: number | undefined; current?: number | undefined; } | undefined) { // 获取升级结果
  return request.get('device-service/v1/mgr/upgradePackage/deviceGroup/finish', {
    params,
  });
}

export async function getCabinetDetail(id: any) { // 获取电柜详情
  return request.get(`/device-service/v1/mgr/cabinet/${id}`)
}


export async function getBatteryDeviceList(params) {
  params.deviceType = 1;
  return request.get('device-service/v1/mgr/productInfo/getDeviceList', {
    params,
  });
}

export async function getCabinetDeviceList(params) {
  params.deviceType = 2;
  return request.get('device-service/v1/mgr/productInfo/getDeviceList', {
    params,
  });
}


export async function getBatteryUdpList(params) { // 获取UDP上报日志列表
  return request.get('/device-service/v1/mgr/battery/udpLog', {
    params,
  });
}