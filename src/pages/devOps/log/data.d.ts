export interface TableListItem {
  id: number;
  username: string;
  operation: string;
  ip: string;
  location: string;
  createTime:Date;
}

export interface TableListParams {
    pageSize?: number;
    currentPage?: number;
  }
