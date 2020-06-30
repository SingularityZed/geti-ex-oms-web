import React, { useRef } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { TableListItem } from './data';
import { queryTradeLog } from '@/services/pay.ts';
import { enumConverter, enums } from '../../../../src/utils/enums';
import moment from "moment";

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();

  const beforeSubmit = (params) => {
    if (Array.isArray(params.createTime)) {
      params.createTimeFrom = moment(params.createTime[0]).startOf('day').format("YYYY/MM/DD HH:mm:ss");
      params.createTimeTo = moment(params.createTime[1]).endOf('day').format("YYYY/MM/DD HH:mm:ss");
    }
    return params;
  }

  const request = (params) => {
    return queryTradeLog(params).then((res) => {
      return { data: res.data.data, success: true, total: res.data.total };
    })
  }

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      align: 'center',
      renderText: (val: string, record, index) => `${index + 1}`,
    },
    {
      title: '用户订单号',
      align: 'center',
      dataIndex: 'tradeNo',
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '用户名',
      align: 'center',
      dataIndex: 'consumerName',
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '交易金额(元)',
      align: 'center',
      dataIndex: 'tradeAmount',
      hideInSearch: true,
      renderText: (val: number) => `${(val / 100).toFixed(2)}`,
    },
    {
      title: '支付方式',
      align: 'center',
      dataIndex: 'payType',
      valueEnum: enumConverter(enums.PayTypeEnum),
      formItemProps: {
        allowClear: true,
      },
    },
    {
      title: '业务类型',
      align: 'center',
      dataIndex: 'tradeType',
      valueEnum: enumConverter(enums.TradeTypeEnum),
      formItemProps: {
        allowClear: true,
      },
    },
    {
      title: '订单状态',
      align: 'center',
      dataIndex: 'tradeStatus',
      hideInSearch: true,
      valueEnum: enumConverter(enums.TradeStatusEnums),
    },
    {
      title: '时间区间',
      align: 'center',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      hideInForm: true,
      hideInTable: true,
    },
    {
      title: '数据创建时间戳',
      align: 'center',
      dataIndex: 'createTime',
      hideInSearch: true,
      valueType: 'dateTime',
    },
    {
      title: '数据更新时间戳',
      align: 'center',
      dataIndex: 'updateTime',
      hideInSearch: true,
    },
  ];

  return (
    <>
      <ProTable<TableListItem>
        bordered
        options={false}
        toolBarRender={false}
        actionRef={actionRef}
        rowKey="id"
        beforeSearchSubmit={beforeSubmit}
        request={request}
        columns={columns}
      />
    </>
  );
};

export default TableList;
