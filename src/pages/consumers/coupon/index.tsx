import React, {useRef} from 'react';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import {TableListItem} from './data';
import {consumerCoupon} from '@/services/pay';
import {enumConverter, enums} from '@/utils/enums';

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      align: 'center',
      dataIndex: 'index',
      hideInSearch: true,
      renderText: (text, row, index) => index + 1,
    },
    {
      title: '用户手机号',
      align: 'center',
      dataIndex: 'consumerMobileNo',
      order: 10,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '用户姓名',
      align: 'center',
      dataIndex: 'consumerName',
      order: 9,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '优惠券名称',
      align: 'center',
      dataIndex: 'couponName',
      hideInSearch: true,
    },
    {
      title: '订单编号',
      align: 'center',
      dataIndex: 'orderNo',
      hideInSearch: true,
    },
    {
      title: '有效起始日期',
      align: 'center',
      dataIndex: 'validBeginTime',
      hideInSearch: true,
    },
    {
      title: '有效结束日期',
      align: 'center',
      dataIndex: 'validEndTime',
      hideInSearch: true,
    },
    {
      title: '优惠券使用状态',
      align: 'center',
      dataIndex: 'useStatus',
      valueEnum: enumConverter(enums.CouponUseStatusEnum),
      order: 8,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '优惠券使用时间',
      align: 'center',
      dataIndex: 'useTime',
      hideInSearch: true,
    },
  ];

  /**
   * 表单查询请求
   * @param params
   */
  const request = (params) => {
    return consumerCoupon(params).then((res) => {
      return {data: res.data.data, success: true, total: res.data.total};
    })
  }

  return (
    <>
      <ProTable<TableListItem>
        bordered
        options={false}
        toolBarRender={false}
        actionRef={actionRef}
        rowKey="id"
        request={request}
        columns={columns}
      />
    </>
  );
};

export default TableList;
