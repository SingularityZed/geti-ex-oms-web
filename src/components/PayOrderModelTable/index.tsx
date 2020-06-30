import {Modal} from 'antd';
import React from 'react';
import ProTable, {ProColumns} from '@ant-design/pro-table';
import {PayOrderModelTableProps, TableListItem} from './data.d';
import {getPayOrderList} from '@/services/pay';
import {enumConverter, enums} from "@/utils/enums";

const PayOrderModelTable = (props: PayOrderModelTableProps) => {
  const {closeModel, consumerId} = props;
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
      renderText: (val: string, _, index) => `${index + 1}`,
    },
    {
      title: "订单号",
      dataIndex: "orderNo",
      hideInSearch: true,
    },
    {
      title: "交易流水号",
      dataIndex: "tradeNo",
      hideInSearch: true,
    },
    {
      title: "商户名称",
      dataIndex: "merchantName",
      hideInSearch: true,
    },
    {
      title: "业务类型",
      dataIndex: "orderType",
      valueEnum: enumConverter(enums.OrderTypeAllEnum),
      hideInSearch: true,
    },
    {
      title: "产品名称",
      dataIndex: "goodsName",
      hideInSearch: true,
    },
    {
      title: "标价金额(元)",
      dataIndex: "totalAmount",
      renderText: (val: number) => (val / 100).toFixed(2),
      hideInSearch: true,
    },
    {
      title: "应结订单金额(元)",
      dataIndex: "settlementTotalAmount",
      renderText: (val: number) => (val / 100).toFixed(2),
      hideInSearch: true,
    },
    {
      title: "优惠券支付总额(元)",
      dataIndex: "couponTotalAmount",
      renderText: (val: number) => (val / 100).toFixed(2),
      hideInSearch: true,
    },
    {
      title: "优惠券使用数量",
      dataIndex: "couponCount",
      hideInSearch: true,
    },
    {
      title: "支付状态",
      dataIndex: "orderStatus",
      valueEnum: enumConverter(enums.OrderStatusEnum),
      hideInSearch: true,
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      hideInSearch: true,
    },
    {
      title: "更新时间",
      dataIndex: "updateTime",
      hideInSearch: true,
    }
  ];

  /**
   * 查询表单参数预处理
   * @param params
   */
  const beforeSearchSubmit = (params) => {
    if (Array.isArray(params.dateTimeRange)) {
      params.startTime = params.dateTimeRange[0].replaceAll("-", "/");
      params.endTime = params.dateTimeRange[1].replaceAll("-", "/");
    }
    return params;
  }

  /**
   * 表单查询请求
   * @param params
   */
  const request = (params) => {
    return getPayOrderList(params).then((res) => {
      return {data: res.data.data, success: true, total: res.data.total};
    })
  }

  return (
    <Modal title="交易记录" onOk={closeModel} onCancel={closeModel} visible={true} width={"70%"}>
      <ProTable<TableListItem>
        bordered
        options={false}
        toolBarRender={false}
        rowKey="orderNo"
        params={{
          consumerId,
        }}
        beforeSearchSubmit={beforeSearchSubmit}
        request={request}
        columns={columns}
        pagination={{defaultPageSize: 10}}
      />
    </Modal>
  );
};
export default PayOrderModelTable;
