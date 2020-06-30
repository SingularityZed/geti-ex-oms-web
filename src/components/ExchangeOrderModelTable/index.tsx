import {Modal} from 'antd';
import React from 'react';
import ProTable, {ProColumns} from '@ant-design/pro-table';
import {ExchangeOrderModelTableProps, TableListItem} from './data.d';
import {queryExchangeOrder} from '@/services/order';
import {enumConverter, enums} from "@/utils/enums";
import moment from "moment";

const ExchangeOrderModelTable = (props: ExchangeOrderModelTableProps) => {
  const {closeModel, cabinetDeviceCode, batteryDeviceCode, mobileNo} = props;
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '时间区间',
      align: 'center',
      dataIndex: "dateTimeRange",
      valueType: 'dateRange',
      hideInForm: true,
      hideInTable: true,
      order: 2
    },
    {
      title: '序号',
      dataIndex: "no",
      renderText: (val: string, _, index) => `${index + 1}`,
    },
    {
      title: "订单号",
      dataIndex: "exchangeOrderId",
      hideInSearch: true,
    },
    {
      title: "点位名称",
      dataIndex: "cabinetName",
      hideInSearch: true,
    },
    {
      title: "骑手手机号",
      dataIndex: "mobileNo",
      hideInSearch: true,
    },
    {
      title: "换电柜编号",
      dataIndex: "cabinetDeviceCode",
      hideInSearch: true,
    },
    {
      title: "归还电池",
      hideInSearch: true,
      dataIndex: "returnInfo",
      children: [
        {
          title: "编号",
          dataIndex: "returnBatteryCode"
        },
        {
          title: "电量",
          dataIndex: "returnBatterySoc"
        }
      ]
    },
    {
      title: "借出电池",
      hideInSearch: true,
      dataIndex: "borrowInfo",
      children: [
        {
          title: "编号",
          dataIndex: "borrowBatteryCode"
        },
        {
          title: "电量",
          dataIndex: "borrowBatterySoc"
        }
      ]
    },
    {
      title: "订单状态",
      dataIndex: "status",
      valueEnum: enumConverter(enums.ExchangeOrderStatusEnum),
      hideInSearch: true
    },
    {
      title: "异常原因",
      dataIndex: "resultCodeName",
      renderText: (text, row, index) => (row.status == 2 ? "" : text),
      hideInSearch: true
    },
    {
      title: "换电类型",
      dataIndex: "exchangeType",
      valueEnum: enumConverter(enums.ExchangeType),
      hideInSearch: true
    },
    {
      title: "业务标识",
      dataIndex: "bizField",
      valueEnum: enumConverter(enums.bizField),
      hideInSearch: true
    },
    {
      title: "完成时间",
      dataIndex: "completeTime",
      hideInSearch: true
    }
  ];

  /**
   * 查询表单参数预处理
   * @param params
   */
  const beforeSearchSubmit = (params) => {
    if (Array.isArray(params.dateTimeRange)) {
      params.startTime = moment(params.dateTimeRange[0]).startOf('day').format("YYYY/MM/DD HH:mm:ss");
      params.endTime = moment(params.dateTimeRange[1]).endOf('day').format("YYYY/MM/DD HH:mm:ss");
    }
    return params;
  }

  /**
   * 表单查询请求
   * @param params
   */
  const request = (params) => {
    if (params.mobileNo === undefined) {
      params.mobileNo = null
    }
    if (params.cabinetDeviceCode === undefined) {
      params.cabinetDeviceCode = null
    }
    if (params.batteryDeviceCode === undefined) {
      params.batteryDeviceCode = null
    }
    return queryExchangeOrder(params).then((res) => {
      return {data: res.data.data, success: true, total: res.data.total};
    })
  }

  return (
    <Modal title="换电记录" onOk={closeModel} onCancel={closeModel} visible={true} width={"70%"}>
      <ProTable<TableListItem>
        bordered
        options={false}
        toolBarRender={false}
        rowKey="exchangeOrderId"
        params={{
          cabinetDeviceCode,
          batteryDeviceCode,
          mobileNo
        }}
        beforeSearchSubmit={beforeSearchSubmit}
        request={request}
        columns={columns}
        pagination={{defaultPageSize: 10}}
      />
    </Modal>
  );
};
export default ExchangeOrderModelTable;
