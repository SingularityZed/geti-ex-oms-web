export interface TableListItem {
  deviceCode: string;
  ownerId: string;
  ownerType: number;
  ownerName: string;
  ownerMobileNo: string;
  ownerChangeTime: Date;
  ownerChangeReason: number;
  userName: string;
  createTime:Date;
  updateTime:Date;
  remark: string;
  orgId: number;
  operationName: string;
  powerExchangeNetworkName: string;
}

export interface TableListParams {
    sorter?: string;
    status?: string;
    ownerChangeTimeBegin?: Date;
    ownerChangeTimeEnd?: Date;
    pageSize?: number;
    currentPage?: number;
  }
