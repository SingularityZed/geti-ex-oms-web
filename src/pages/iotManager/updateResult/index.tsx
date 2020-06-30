import React, { useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Modal, message } from 'antd';
import { TableListItem } from './data';
import { enumConverter, enums } from '../../../utils/enums';
import { getupdateResult } from '@/services/device';

const { confirm } = Modal;
const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      renderText: (text, row, index) => index + 1,
    },
    {
      title: '换电柜编号',
      dataIndex: 'deviceCode',
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      hideInSearch: true,
    },
    {
      title: '产品类型',
      dataIndex: 'productType',
      valueEnum: enumConverter(enums.ProductType),
      formItemProps: {
        allowClear: true,
      },
    },
    {
      title: '版本号',
      dataIndex: 'version',
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '版本名称',
      dataIndex: 'versionName',
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '升级结果',
      dataIndex: 'upgradeResult',
      valueEnum: enumConverter(enums.upgradeResultEnums),
      formItemProps: {
        allowClear: true,
      },
    },
    {
      title: '升级包类型',
      dataIndex: 'upgradePackageType',
      valueEnum: enumConverter(enums.upgradePackageType),
      formItemProps: {
        allowClear: true,
      },
    },
    {
      title: '失败原因',
      dataIndex: 'failedReason',
      hideInSearch: true,
    },
    {
      title: '升级时间',
      dataIndex: 'upgradeTime',
      hideInSearch: true,
    },
  ];

  return (
    <>
      <>
        <ProTable<TableListItem>
          bordered
          options={{
            density: false,
            fullScreen: false,
            reload: false,
            setting: false,
          }}
          toolBarRender={false}
          actionRef={actionRef}
          rowKey="deviceCode"
          request={(params) => {
            return getupdateResult(params).then((res) => {
              return { data: res.data.data, success: true, total: res.data.total };
            });
          }}
          columns={columns}
        />
      </>
    </>
  );
};

export default TableList;
