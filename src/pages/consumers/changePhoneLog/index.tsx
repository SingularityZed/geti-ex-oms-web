import React, { useState, useRef } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import { changePhoneLog } from "@/services/consumer.ts";
import { TableListItem } from './data';
import {enumConverter, enums} from '@/utils/enums';

const TableList: React.FC<{}> = () => {
  const [sorter, setSorter] = useState<string>('');
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '运营商',
      align: 'center',
      dataIndex: 'merchantName',
      hideInSearch: true,
    },
    {
      title: '换电网络',
      align: 'center',
      dataIndex: 'powerExchangeNetworkName',
      hideInSearch: true,
    },
    {
      title: '骑手姓名',
      align: 'center',
      dataIndex: 'consumerName',
      formItemProps:{
        allowClear: true,
        autoComplete: "off",
      }
    },
    {
      title: '旧手机号',
      align: 'center',
      dataIndex: 'oldMobileNo',
      formItemProps:{
        allowClear: true,
        autoComplete: "off",
      }
    },
    {
      title: '新手机号',
      align: 'center',
      dataIndex: 'newMobileNo',
      formItemProps:{
        allowClear: true,
        autoComplete: "off",
      }
    },
    {
      title: '换绑类型',
      align: 'center',
      dataIndex: 'changeType',
      valueEnum: enumConverter(enums.ConsumerChangePhoneType),
      hideInSearch: true,
    },
    {
      title: '换绑时间',
      align: 'center',
      dataIndex: 'changePhoneTime',
      hideInSearch: true,
    },
  ];
  return (
    <>
      <ProTable<TableListItem>
        actionRef={actionRef}
        dateFormatter="string"
        rowKey="id"
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<TableListItem>;
          if (sorterResult.field) {
            setSorter(`${sorterResult.field}_${sorterResult.order}`);
          }
        }}
        params={{
          sorter,
        }}
        bordered
        options={false}
        toolBarRender={false}
        request={(params) =>
          changePhoneLog(params).then((res) => {
            return { data: res.data.data, success: true };
          })
        }
        columns={columns}
        rowSelection={false}
      />
    </>
  );
};

export default TableList;
