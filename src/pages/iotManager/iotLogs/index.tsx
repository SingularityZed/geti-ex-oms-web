import React, { useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Tooltip, Tag, Button } from 'antd';
import { TableListItem } from './data';
import { enumConverter, enums } from '../../../utils/enums';
import { getIotLogs } from '@/services/device';
import moment from 'moment';
const dateFormat = 'YYYY/MM/DD HH:mm:ss';

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [detailsVisible] = useState<boolean>(false);
  const [dataSource, setdataSource] = useState<any>([]);
  const [flag, setflag] = useState<boolean>(false);
  const startTime =  new Date(new Date() - 1000 * 60 * 60 * 24 * 2);
  const endTime  = new Date();
  const  getFormatDate = (time) => {
    let date = new Date(time);
    let Str = date.getFullYear() + '-' +
      ((date.getMonth() + 1).toString().length === 1 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-' +
      (date.getDate().toString().length === 1 ? '0' + date.getDate() : date.getDate())
    +
    (date.getHours().toString().length==1?'0'+date.getHours():date.getHours() )+ ':' +
    (date.getMinutes().toString().length==1?'0'+date.getMinutes():date.getMinutes())+ ':' +
    (date.getSeconds().toString().length==1?'0'+date.getSeconds():date.getSeconds());
    return Str;
  }
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      renderText: (text, row, index) => index + 1,
    },
    {
      title: '设备号或imei号',
      dataIndex: 'deviceCode',
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
      order:5
    },
    {
      title: '设备类型',
      dataIndex: 'deviceType',
      valueEnum: enumConverter([
        { text: '电池', value: 'battery' },
        { text: '电柜', value: 'cabinet' },
      ]),
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
      order:2
    },
    {
      title: '消息topic',
      dataIndex: 'topic',
      valueEnum: enumConverter(enums.topicEnums),
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
      order:3,
    },
    {
      title: '时间区间',
      align: 'center',
      dataIndex: 'dateTimeRange',
      valueType: 'dateTimeRange',
      hideInTable: true,
      hideInSearch: false,
      initialValue:[moment(getFormatDate(startTime), dateFormat), moment(getFormatDate(endTime), dateFormat)],
      order:4
    },
    {
      title: '是否成功',
      dataIndex: 'success',
      valueEnum: {
        0: {
          text: '否',
          success: 'false',
        },
        1: {
          text: '是',
          success: 'true',
        },
      },
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
      order:1,
    },
    {
      title: '时间',
      dataIndex: 'time',
      hideInSearch: true,
    },
    {
      title: '原消息内容',
      dataIndex: 'source',
      hideInSearch: true,
      render: (_, record) => (
        <>
          <Tooltip placement="top" title={record.source}>
            <Tag color="#2db7f5">查看详细内容</Tag>
          </Tooltip>
        </>
      ),
    },
    {
      title: '转换后的消息内容',
      dataIndex: 'target',
      hideInSearch: true,
      render: (_, record) => (
        <>
          <Tooltip placement="top" title={record.target}>
            <Tag color="#2db7f5">查看详细内容</Tag>
          </Tooltip>
        </>
      ),
    },
  ];
  const beforeSearchSubmit = (params) => {
    if (Array.isArray(params.dateTimeRange)) {
      params.createTimeFrom = params.dateTimeRange[0];
      params.createTimeTo = params.dateTimeRange[1];
    }
    else{
      params.createTimeFrom = moment(getFormatDate(startTime), dateFormat)
      params.createTimeTo = moment(getFormatDate(endTime), dateFormat)
    }
    return params;
  };

  return (
    <>
      {!detailsVisible && (
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
          dataSource={dataSource}
          beforeSearchSubmit={beforeSearchSubmit}
          request={(params) => {
            if (!flag) {
              setflag(true);
              return new Promise(params).then((res) => {
                return { data: [], success: true, total: 0 };
              });
            }
            return getIotLogs(params).then((res) => {
              return { data: res.data.data, success: true, total: res.data.total };
            });
          }}
          columns={columns}
        />
      )}
    </>
  );
};

export default TableList;
