import React, { useEffect, useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { queryConsumerInfo } from '@/services/order';
import { Modal } from 'antd';

interface TableListItem {}
interface CabinetusernumProps {
  minTime: string;
  maxTime: string;
  devicecode: string;
  handlereturn:()=>void;
}
const Cabinetusernum: React.FC<CabinetusernumProps> = (props) => {
  const actionRef = useRef<ActionType>();
  useEffect(() => {}, []);
  const request = (params) => {
    return queryConsumerInfo({
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
      title: '骑手姓名',
      align: 'center',
      dataIndex: 'name',
      hideInSearch: true,
    },
    {
      title: '手机号码',
      align: 'center',
      dataIndex: 'mobileNo',
      hideInSearch: true,
    },
    {
      title: '所属商户',
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
      title: '归属渠道',
      align: 'center',
      dataIndex: 'channelName',
      hideInSearch: true,
      render: (_, record) =>
      record.channelName ? (
        <span
        >
          {record.channelName}
        </span>
      ) : (
        <span>-</span>
      ),
    },
    {
      title: '渠道手机号',
      align: 'center',
      dataIndex: 'channelMobile',
      hideInSearch: true,
      render: (_, record) =>
      record.channelMobile ? (
        <span
        >
          {record.channelMobile}
        </span>
      ) : (
        <span>-</span>
      ),
    },
    {
      title: '注册时间',
      align: 'center',
      dataIndex: 'createTime',
      hideInSearch: true,
    },
  ];

  return (
    <>
      <Modal
      visible
      width="60%"
      title="换电人数详情"
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

export default Cabinetusernum;
