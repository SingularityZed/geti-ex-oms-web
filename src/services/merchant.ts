import request from '@/utils/axiosReques';

export async function getOrganizationPage(params) {
  // 运营商组织信息分页
  return request.get('/merchant-service/v1/mgr/organization/pageList', { params });
}

export async function deleteOrganization(orgId) {
  // 删除运营商
  return request.delete(`/merchant-service/v1/mgr/organization/${orgId}`, {});
}

export async function getOrganizationInfo(orgId) {
  return request.get(`/merchant-service/v1/mgr/organization/${orgId}`);
}

export async function forbidOrganization(params) {
  // 禁用商户
  return request.put('/merchant-service/v1/mgr/organization/forbid', { params });
}

export async function enableOrganization(params) {
  // 启用商户
  return request.put('/merchant-service/v1/mgr/organization/enable', { params });
}

export async function updateOrganization(params) {
  return request.put('/merchant-service/v1/mgr/organization/edit', { params });
}

export async function addOrganization(params) {
  return request.post('/merchant-service/v1/mgr/organization/add', params);
}

export async function cabinetList(params) {
  //运营商电柜分配设备
  return request.get('/merchant-service/v1/mgr/bizCabinet/pageListFromOrg', { params });
}

export async function batteryList(params) {
  //运营商分配电池设备
  return request.get('/merchant-service/v1/mgr/bizBattery/pageListFromOrg', { params });
}

export async function assignmentCabinet(params) {
  return request.put('/merchant-service/v1/mgr/bizCabinet/assignmentCabinet', { params });
}

export async function assignmentBattery(params) {
  return request.put('/merchant-service/v1/mgr/bizBattery/assignmentBattery', { params });
}

export async function getOrganizationAll() {
  // 获取商户列表（下拉框）
  return request.get('/merchant-service/v1/mgr/organization/all');
}

export async function groupSearch(params) {
  // 群组列表
  return request.post('/merchant-service/v1/mgr/group/searchAll', params);
}

export async function queryDeposit(params) {
  return request.get('/merchant-service/v1/mgr/deposit', {
    params,
  });
}
export async function disableDeposit(params) {
  return request.put('/merchant-service/v1/mgr/deposit', {
    params,
  });
}
export async function addDeposit(params) {
  return request.post('/merchant-service/v1/mgr/deposit', params);
}

export async function pageList(params) {
  return request.get('/merchant-service/v1/mgr/bizdeviceconfig/pageList', {
    params,
  });
}

export async function update(params) {
  return request.put('/merchant-service/v1/mgr/bizdeviceconfig/update', {
    params,
  });
}

export async function deleteConfig(id) {
  return request.delete(`/merchant-service/v1/mgr/bizdeviceconfig/${id}`, {});
}
export async function addConfig(params) {
  return request.post(`/merchant-service/v1/mgr/bizdeviceconfig/add`, params);
}

export async function queryServiceOutlet(params) {
  return request.get('/merchant-service/v1/mgr/serviceOutlet', {
    params,
  });
}

export async function getDetail(id) {
  return request.get(`/merchant-service/v1/mgr/serviceOutlet/${id}`);
}

export async function updateServiceOutlet(params) {
  return request.put('/merchant-service/v1/mgr/serviceOutlet', {
    params,
  });
}

export async function addServiceOutlet(params) {
  return request.post('/merchant-service/v1/mgr/serviceOutlet', params);
}

export async function queryPackage(params) {
  return request.get('/merchant-service/v1/mgr/package', {
    params,
  });
}

export async function disablePackage(params) {
  return request.put('/merchant-service/v1/mgr/package', {
    params,
  });
}
export async function addPackage(params) {
  return request.post('/merchant-service/v1/mgr/package', params);
}
export async function setDefault(id) {
  return request.put(`/merchant-service/v1/mgr/package/setDefault/${id}`, {});
}
export async function setDiscount(params) {
  return request.put(`/merchant-service/v1/mgr/package/setDiscount`, { params });
}

export async function deleteGroup(id) {
  // 删除群组
  return request.put(`/merchant-service/v1/mgr/group/delete/${id}`, {});
}

export async function addGroup(params) {
  // 新增群组
  return request.post('/merchant-service/v1/mgr/group/新增群组信息', params);
}

export async function getGroupPackage(params) {
  // 查询可选套餐列表
  return request.post('/merchant-service/v1/mgr/package/getGroupPackage', params);
}

export async function getQrcode(params) {
  return request.post('/merchant-service/v1/mgr/organization/qrCode', params);
}

export async function queryList(params) {
  return request.get('/merchant-service/v1/mgr/maintainCabinetInstall/list', {
    params,
  });
}

export async function getMaintainCabinetInstall(id?: any) {
  return request.get(`/merchant-service/v1/mgr/maintainCabinetInstall/${id}`);
}

export async function queryBatteryFaultHistory(params) {
  return request.get('/merchant-service/v1/mgr/maintainBatteryFaultRecord/list', {
    params,
  });
}
export async function queryCabinetFaultHistory(params) {
  return request.get('/merchant-service/v1/mgr/maintainCabinetFaultRecord/list', {
    params,
  });
}

export async function getOwnChangeLog(params) {
  return request.get('/merchant-service/v1/mgr/bizBattery/ownChangeLog', {
    params,
  });
}

export async function queryBizBatteryList(params) {
  return request.get('/merchant-service/v1/mgr/bizBattery/pageList', {
    params,
  });
}

export async function getBatteryDetail(id?: any) {
  return request.get(`/merchant-service/v1/mgr/bizBattery/${id}`);
}

export async function getBatteryFaultRecord(deviceCode?: any) {
  return request.get(
    `/merchant-service/v1/mgr/maintainBatteryFaultRecord/getByCode?deviceCode=${deviceCode}`,
  );
}

export async function changeExchangeEnable(params) {
  return request.put('/merchant-service/v1/mgr/bizBattery/changeExchangeEnable', {
    params,
  });
}

export async function queryBizCabinetList(params) {
  return request.get('/merchant-service/v1/mgr/bizCabinet/pageList', {
    params,
  });
}
export async function getCabinetDetail(id?: any) {
  return request.get(`/merchant-service/v1/mgr/bizCabinet/${id}`);
}
export async function entryMaintenance(params) {
  return request.put('/merchant-service/v1/mgr/bizCabinet/maintain', {
    params,
  });
}
export async function edit(params) {
  return request.put('/merchant-service/v1/mgr/bizCabinet/edit', {
    params,
  });
}
export async function changeCabinet(params) {
  return request.put('/merchant-service/v1/mgr/bizCabinet/changeCabinet', {
    params,
  });
}
export async function openGrid(params) {
  return request.put(`/merchant-service/v1/mgr/bizCabinet/open`, {
    params,
  });
}
export async function changeGridForbid(params) {
  return request.put(`/merchant-service/v1/mgr/bizCabinet/change`, {
    params,
  });
}

export async function getCabinetFaultRecord(deviceCode?: any) {
  return request.get(
    `/merchant-service/v1/mgr/maintainCabinetFaultRecord/getByCode?faultType=1&deviceCode=${deviceCode}`,
  );
}

export async function batchAddDevice(params) {
  return request.post('/merchant-service/v1/mgr/bizBattery/addBatch', params);
}

export async function batchAddCabinetDevice(params) {
  return request.put('/merchant-service/v1/mgr/bizCabinet/addBatch', { params });
}

export async function repairedBattery(params) {
  return request.put('/merchant-service/v1/mgr/maintainBatteryRepair/repaired', { params });
}

export async function changeDischargeEnable(params) {
  return request.put('/merchant-service/v1/mgr/bizBattery/changeDischargeEnable', { params });
}
export async function changeOperatingStatus(params) {
  return request.put('/merchant-service/v1/mgr/bizBattery/changeOperatingStatus', { params });
}
export async function getqueryPage(params) {
  return request.get('/merchant-service/v1/mgr/cabinetBind/queryPage', { params });
}
export async function getqueryToAddCabinet(params) {
  return request.get('/merchant-service/v1/mgr/cabinetBind/queryToAddCabinet', { params });
}
export async function removeBind(id) {
  return request.get(`/merchant-service/v1/mgr/cabinetBind/removeBind/${id}`);
}
export async function addBatch(params) {
  return request.put('/merchant-service/v1/mgr/cabinetBind/addBatch',{params});
}
export async function getqueryCabinetPage(params) {
  return request.get('/merchant-service/v1/mgr/cabinetBind/queryCabinetPage',{params});
}
export async function queryCabinetBusinessPage(params) { // 柜效查询
  return request.get('/merchant-service/v1/mgr/cabinetBind/queryCabinetBusinessPage',{params});
}

