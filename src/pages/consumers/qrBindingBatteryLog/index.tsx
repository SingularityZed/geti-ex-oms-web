import React, {useRef} from 'react';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import {TableListItem} from './data';
import {getBindingBatteryLog} from "@/services/consumer";

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '领取电池时间',
      dataIndex: 'dateRange',
      valueType: 'dateRange',
      hideInTable: true,
      order: 6,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      }
    },
    {
      title: '序号',
      dataIndex: 'index',
      hideInSearch: true,
      renderText: (text, row, index) => index + 1,
    },
    {
      title: '手机号码',
      dataIndex: 'mobileNo',
      order: 10,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      }
    },
    {
      title: '姓名',
      dataIndex: 'consumerName',
      hideInSearch: true,
    },
    {
      title: '运营商',
      dataIndex: 'merchantName',
      hideInSearch: true,
    },
    {
      title: '电柜编号',
      dataIndex: 'cabinetDeviceCode',
      order: 9,
      formItemProps: {
        autoComplete: "off",
        allowClear: true
      }
    },
    {
      title: '电柜名称',
      dataIndex: 'cabinetName',
      order: 7,
      formItemProps: {
        autoComplete: "off",
        allowClear: true
      }
    },
    {
      title: '电池编号',
      dataIndex: 'batteryDeviceCode',
      order: 8,
      formItemProps: {
        autoComplete: "off",
        allowClear: true
      }
    },
    {
      title: '隔口号',
      dataIndex: 'gridId',
      hideInSearch: true,
      renderText: (text) => (text === undefined || text == null) ? '-' : text + 1,
    },
    {
      title: '是否成功',
      dataIndex: 'success',
      hideInSearch: true,
      renderText: (text) => text === true ? '是' : '否',
    },
    {
      title: '领取时间',
      dataIndex: 'createTime',
      hideInSearch: true,
    },
  ];

  /**
   * 查询表单参数预处理
   * @param params
   */
  const beforeSearchSubmit = (params) => {
    if (Array.isArray(params.dateRange)) {
      params.createTimeFrom = params.dateRange[0];
      params.createTimeTo = params.dateRange[1];
    }
    return params;
  };

  /**
   * 表单查询请求
   * @param params
   */
  const request = (params) => {
    return getBindingBatteryLog(params).then((res) => {
      return {data: res.data.data, success: true, total: res.data.total};
    });
  };

  return (
    <>
      <ProTable<TableListItem>
        actionRef={actionRef}
        rowKey="id"
        bordered
        options={false}
        toolBarRender={false}
        request={request}
        beforeSearchSubmit={beforeSearchSubmit}
        columns={columns}
        rowSelection={false}
      />
    </>
  );
};

export default TableList;

