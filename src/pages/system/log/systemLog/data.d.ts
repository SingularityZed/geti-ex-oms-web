export interface TableListItem {
  id: number;
  username: string;
  operation: string;
  time: number;
  method: string;
  params: string;
  ip: string;
  location: string;
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
  username: string;
  operation: string;
  time: number;
  method: string;
  params: string;
  ip: string;
  location: string;
  createTime: Date;
}
