import React, { useEffect, useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { queryExchangeOrder } from '@/services/order';
import { Modal } from 'antd';
import { enumConverter, enums } from '@/utils/enums';

interface TableListItem {}
interface CabinetordernumProps {
  minTime: string;
  maxTime: string;
  devicecode: string;
  handlereturn:()=>void;
}
const Cabinetordernum: React.FC<CabinetordernumProps> = (props) => {
  const actionRef = useRef<ActionType>();
  useEffect(() => {}, []);
  const request = (params) => {
    return queryExchangeOrder({
      ...params,
      minTime: props.minTime,
      maxTime: props.maxTime,
      cabinetDeviceCode: props.devicecode,
    }).then((res) => {
      return { data: res.data.data, success: true, total: res.data.total };
    });
  };
  // 列表及搜索条件
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'no',
      renderText: (val: string, _, index) => `${index + 1}`,
      hideInSearch: true,
    },
    {
      title: '订单号',
      align: 'center',
      dataIndex: 'exchangeOrderId',
      hideInSearch: true,
    },
    {
      title: '骑手姓名',
      align: 'center',
      dataIndex: 'consumerName',
      hideInSearch: true,
    },
    {
      title: '手机号码',
      align: 'center',
      dataIndex: 'mobileNo',
      hideInSearch: true,
    },
    {
      title: '归还电池',
      align: 'center',
      dataIndex: 'returnBatteryCode',
      hideInSearch: true,
    },
    {
      title: '借出电池',
      align: 'center',
      dataIndex: 'borrowBatteryCode',
      hideInSearch: true,
    },
    {
      title: "订单状态",
      dataIndex: "status",
      valueEnum: enumConverter(enums.ExchangeOrderStatusEnum),
      hideInSearch: true
    },
    {
      title: "业务标识",
      dataIndex: "bizField",
      valueEnum: enumConverter(enums.bizField),
      hideInSearch: true
    },
    {
      title: '换电完成时间',
      align: 'center',
      dataIndex: 'completeTime',
      hideInSearch: true,
    },
  ];

  return (
    <>
      <Modal
      visible
      width="60%"
      title="换电订单详情"
      onOk={props.handlereturn}
      onCancel={props.handlereturn}>
        <ProTable<TableListItem>
          bordered
          options={false}
          actionRef={actionRef}
          rowKey="deviceCode"
          toolBarRender={false}
          columns={columns}
          request={request}
          search={false}
        />
      </Modal>
    </>
  );
};

export default Cabinetordernum;
