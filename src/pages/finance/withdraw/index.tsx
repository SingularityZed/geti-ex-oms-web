import React, {useRef, useState, useEffect} from 'react';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import {TableListItem} from './data';
import { getwithdraw } from '@/services/pay';
import { getuserName } from '@/services/manager';

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [usernameoption,setusernameoption] = useState<any>([])
  useEffect(() => {
    // 获取操作人集合
    getuserName().then((res) => {
        let obj = {}
        res.data.data.forEach(item => {
          obj[item.userId] = item.realName;
        })
        setusernameoption(obj)
      }
    )
  }, []);
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      align: 'center',
      renderText: (text, row, index) => index + 1,
    },
    {
      title: '操作人',
      dataIndex: 'userName',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '操作人',
      dataIndex: 'userId',
      valueEnum: usernameoption,
      hideInTable: true,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '提现描述',
      dataIndex: 'description',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '提现订单号',
      dataIndex: 'orderNo',
      align: 'center',
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '提现金额（元）',
      dataIndex: 'withdrawAmount',
      renderText: (text, row, index) => (text / 100).toFixed(2),
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      hideInSearch: true,
    },
  ];

  return (
    <>
      <ProTable<TableListItem>
        bordered
        options={{
          density: false,
          fullScreen: false,
          reload: false,
          setting: false,
        }}
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={false}
        request={(params) => {
          return getwithdraw(params).then((res) => {
            return {data: res.data.data, success: true, total: res.data.total};
          })
        }
        }
        columns={columns}
      />
    </>
  );
};

export default TableList;
