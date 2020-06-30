export interface TableListItem {
  id:number;
  deviceCode: string;
  merchantName: string;
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
