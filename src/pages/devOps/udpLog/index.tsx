import React from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { getBatteryUdpList } from '@/services/device';
import { TableListItem } from './data';
import moment from 'moment';

const Index: React.FC<{}> = () => {
  // 列表及搜索条件
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '设备号',
      align: 'center',
      dataIndex: 'deviceCode',
      formItemProps: {
        allowClear: true,
        autoComplete: 'off',
      },
    },
    {
      title: '电量',
      align: 'center',
      dataIndex: 'soc',
      hideInSearch: true,
    },
    {
      title: 'imei号',
      align: 'center',
      dataIndex: 'imei',
      hideInSearch: true,
    },
    {
      title: 'iccid',
      align: 'center',
      dataIndex: 'iccid',
      hideInSearch: true,
    },
    {
      title: '阿里云密钥',
      align: 'center',
      dataIndex: 'aliyunKey',
      hideInSearch: true,
    },
    {
      title: '信号强度',
      align: 'center',
      dataIndex: 'signalStrength',
      hideInSearch: true,
    },
    {
      title: '纬度',
      align: 'center',
      dataIndex: 'latitude',
      hideInSearch: true,
    },
    {
      title: '经度',
      align: 'center',
      dataIndex: 'longitude',
      hideInSearch: true,
    },
    {
      title: 'UDP数据消息',
      align: 'center',
      dataIndex: 'receiveData',
      hideInSearch: true,
      ellipsis: true,
      onCell: () => {
        return {
          style: {
            maxWidth: 300,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            cursor: 'pointer',
          },
        };
      },
      formItemProps: {
        allowClear: true,
        autoComplete: 'off',
      },
    },
    {
      title: '接收时间',
      align: 'center',
      dataIndex: 'receiveTime',
      valueType: 'dateTimeRange',
    },
  ];

  const beforeSubmit = (params?: any) => {
    if (Array.isArray(params.receiveTime)) {
      params.receiveStartTime = moment(params.receiveTime[0]).format('YYYY/MM/DD HH:mm:ss');
      params.receiveEndTime = moment(params.receiveTime[1]).format('YYYY/MM/DD HH:mm:ss');
    }
    delete params.receiveTime;
    return params;
  };

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
        toolBarRender={false}
        rowKey="id"
        beforeSearchSubmit={beforeSubmit}
        columns={columns}
        request={(params) =>
          getBatteryUdpList(params).then((res) => {
            return { data: res.data.data, success: true, total: res.data.total };
          })
        }
      />
    </>
  );
};

export default Index;
