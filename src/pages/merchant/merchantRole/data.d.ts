export interface TableListItem {
  roleId: number;
  roleName: string;
  merchantId: string;
  operationName: string;
  remark: string;
  createTime: Date;
  modifyTime: Date;
  createTimeFrom:Date;
  createTimeTo:Date;
  createTime:Date;
  assignType:number;
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
  roleId: number;
  roleName: string;
  merchantId: string;
  operationName: string;
  remark: string;
  createTime: Date;
  modifyTime: Date;
  createTimeFrom:Date;
  createTimeTo:Date;
  assignType:number;
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
