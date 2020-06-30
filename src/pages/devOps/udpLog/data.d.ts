export interface TableListItem {
  id: number;
  deviceCode: string;
  aliyunKey: string;
  soc: number;
  signalStrength: number;
  imei: string;
  iccid: string;
  locationType: string;
  latType: string;
  lngType: string;
  latitude: string;
  longitude: string;
  receiveData: string;
  receiveTime:Date;
}

export interface TableListParams {
    pageSize?: number;
    currentPage?: number;
  }
