export interface TableListItem {
  id: number;
  consumerId: number;
  operation: string;
  method: string;
  params: string;
  ip: string;
  createTime: Date;
}

export interface TableListParams {
  sorter?: string;
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
}
export interface BasicListItemDataType {
  id: number;
  consumerId: number;
  operation: string;
  method: string;
  params: string;
  ip: string;
  createTime: Date;
}
