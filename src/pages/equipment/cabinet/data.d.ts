export interface TableListItem {
  id:number;
  deviceCode: string;
  operationName: string;
  batchNo: string;
  merchantId: number;
  merchantName: string;
  city: string;
  address: string;
  operator: string;
  installTime:Date;
}

export interface TableListParams {
    pageSize?: number;
    pageNum?: number;
  }
