import React, { useEffect, useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { queryCabinetBusinessPage } from '@/services/merchant';
import { enumConverter, enums } from '@/utils/enums';
import moment from 'moment';
import Cabinetordernum from './components/cabinetordernum';
import Cabinetusernum from './components/cabinetusernum';
import { message } from 'antd';

interface TableListItem {}

const Index: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  useEffect(() => {}, []);
  const [minTime, setminTime] = useState<string>('');
  const [maxTime, setmaxTime] = useState<string>('');
  const [devicecode, setdevicecode] = useState<string>('');
  const [isFirst,setisFirst] = useState<boolean>(true)
  const [ordervisible, setordervisible] = useState<boolean>(false);
  const [uservisible, setuservisible] = useState<boolean>(false);
  const request = (params) => {
    console.log(params);
    if (params.maxTime && params.minTime) {
      return queryCabinetBusinessPage(params).then((res) => {
        return { data: res.data.data, success: true, total: res.data.total };
      });
    }
    if(!isFirst){
      message.error('时间区间必填！')
    }
    setisFirst(false)
    return new Promise(params).then((res) => {
      return { data: [], success: true, total: 0 };
    });
  };
  // 列表及搜索条件
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      align: 'center',
      dataIndex: 'index',
      hideInSearch: true,
      renderText: (val: string, _, index) => `${index + 1}`,
    },
    {
      title: '设备编号',
      align: 'center',
      dataIndex: 'deviceCode',
      hideInSearch: true,
    },
    {
      title: '电柜名称',
      dataIndex: 'cabinetName',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '所属商户',
      align: 'center',
      dataIndex: 'merchantName',
      hideInSearch: true,
    },
    {
      title: '换电人数',
      align: 'center',
      dataIndex: 'exchangeUserCount',
      hideInSearch: true,
      render: (_, record) =>
        record.exchangeUserCount ? (
          <a
            onClick={() => {
              setdevicecode(record.deviceCode);
              setuservisible(true);
            }}
          >
            {record.exchangeUserCount}
          </a>
        ) : (
          <span>0</span>
        ),
    },
    {
      title: '换电订单',
      align: 'center',
      dataIndex: 'exchangeOrderCount',
      hideInSearch: true,
      render: (_, record) =>
        record.exchangeOrderCount ? (
          <a
            onClick={() => {
              setdevicecode(record.deviceCode);
              setordervisible(true);
            }}
          >
            {record.exchangeOrderCount}
          </a>
        ) : (
          <span>0</span>
        ),
    },
    {
      title: '注册人数',
      align: 'center',
      dataIndex: 'regUserCount',
      hideInSearch: true,
    },
    {
      title: '绑定用户名',
      align: 'center',
      dataIndex: 'userName',
      formItemProps: {
        allowClear: true,
        autoComplete: 'off',
      },
    },
    {
      title: '姓名',
      align: 'center',
      dataIndex: 'realName',
      hideInSearch: true,
    },
    {
      title: '电话',
      align: 'center',
      dataIndex: 'mobileNo',
      formItemProps: {
        allowClear: true,
        autoComplete: 'off',
      },
    },
    {
      title: '绑定关系类型',
      align: 'center',
      dataIndex: 'bindType',
      valueEnum: enumConverter(enums.BindType),
      formItemProps: {
        allowClear: true,
      },
      hideInSearch: true,
    },
    {
      title: '时间区间',
      align: 'center',
      dataIndex: 'dateTimeRange',
      valueType: 'dateRange',
      hideInForm: true,
      hideInTable: true,
    },
  ];
  const beforeSearchSubmit = (params) => {
    if (Array.isArray(params.dateTimeRange)) {
      params.minTime = moment(params.dateTimeRange[0]).startOf('day').format('YYYY-MM-DD');
      setminTime(params.minTime);
      params.maxTime = moment(params.dateTimeRange[1]).endOf('day').format('YYYY-MM-DD');
      setmaxTime(params.maxTime);
    }
    return params;
  };

  return (
    <>
      <ProTable<TableListItem>
        bordered
        options={false}
        actionRef={actionRef}
        rowKey="deviceCode"
        toolBarRender={false}
        columns={columns}
        beforeSearchSubmit={beforeSearchSubmit}
        request={request}
      />
      {ordervisible && (
        <Cabinetordernum
          minTime={minTime}
          maxTime={maxTime}
          devicecode={devicecode}
          handlereturn={() => setordervisible(false)}
        />
      )}
      {uservisible && (
        <Cabinetusernum
          minTime={minTime}
          maxTime={maxTime}
          devicecode={devicecode}
          handlereturn={() => setuservisible(false)}
        />
      )}
    </>
  );
};

export default Index;
