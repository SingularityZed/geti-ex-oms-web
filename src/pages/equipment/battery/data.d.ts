export interface TableListItem {
  id: number;
  deviceCode: string;
  orgId: number;
  deviceSpecification: string;
  ownerId: string;
  ownerType: number;
  ownerName: string;
  ownerMobileNo: number;
  ownerChangeReason: number;
  ownerChangeTime: Date;
  cabinetDeviceCode: string;
  cabinetChangeTime: Date;
  dischargeStatus: number;
  operatingStatus: number;
  province: string;
  city: string;
  area: string;
  soc: number;
  isOnline: number;
  exchangeEnable: number;
  chargeStatus: number;
  batteryExceptionCode: string;
  createTime: Date;
  updateTime: Date;
  isDeleted: Boolean;
  createUser: string;
  updateUser: string;
  remark: string;
  operationName: string;
  forbidReason: string;
  powerExchangeNetworkName: string;
  healthCodeColor: number;
}

export interface ExchangeTableListItem {
  exchangeOrderId: string;
  mobileNo: string;
  resultCode: string;
  resultCodeName: string;
  cabinetName: string;
  cabinetDeviceCode: string;
  startTime: Date;
  completeTime: Date;
  status: number;
  returnBatteryCode: string;
  returnBatterySoc: number;
  borrowBatteryCode: string;
  borrowBatterySoc: number;
  deviceSpecification: string;
  exchangeType: number;
  bizField: string;
  createTime: Date;
}

export interface TableListParams {
  startTime: Date| undefined;
  endTime: Date| undefined;
  batteryDeviceCode?: string| undefined;
  pageSize?: number| undefined;
  currentPage?: number| undefined;
}
