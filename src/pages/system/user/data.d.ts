export interface TableListItem {
  userId: number;
  username: string;
  orgName: string;
  mobile: string;
  status: string;
  isApplets:number;
  createTime: Date;
  lastLoginTime: Date;
  createTimeFrom:Date;
  createTimeTo:Date;
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
  userId: number;
  username: string;
  orgName: string;
  mobile: string;
  status: string;
  isApplets:number;
  createTime: Date;
  lastLoginTime: Date;
  createTimeFrom:Date;
  createTimeTo:Date;
}
export const columns: ProColumns<TableListItem>[] = [
  {
    title: '角色名称',
    align: 'center',
    dataIndex: 'roleName',
  },
  {
    title: '角色描述',
    align: 'center',
    dataIndex: 'remark',
    valueType: 'textarea',
    hideInSearch: true,
  },
  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'createTime',
    valueType: 'dateRange',
    hideInSearch: true,
    hideInForm: true,
  },
  {
    title: '修改时间',
    align: 'center',
    dataIndex: 'modifyTime',
    valueType: 'dateRange',
    hideInSearch: true,
    hideInForm: true,
  },

];
