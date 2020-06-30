export interface TableListItem {
  id: number;
  code: string;
  name: string;
  sort: number;
  remark: string;
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
  code: string;
  name: string;
  sort: number;
  remark: string;
}
