export interface TableListItem {
  id: number;
  title: string;
  icon: string;
  type: string;
  path: string;
  component: Date;
  permission: Date;
  order:number;
  createTime:Date;
  modifyTime:Date;
  createTimeFrom:Date;
  createTimeTo:Date;
  text:string;
  menuId:number;
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
  title: string;
  icon: string;
  type: string;
  path: string;
  component: Date;
  permission: Date;
  order:number;
  createTime:Date;
  modifyTime:Date;
  createTimeFrom:Date;
  createTimeTo:Date;
}
