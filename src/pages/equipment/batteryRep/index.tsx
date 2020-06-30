import React, {useRef} from 'react';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import moment from 'moment';
import {getBatteryRep} from "@/services/businessMonitor";

interface TableListItem {
}

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef();

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '时间区间',
      align: 'center',
      dataIndex: 'dateTimeRange',
      valueType: 'dateRange',
      hideInTable: true,
      order: 9,
    },
    {
      title: '序号',
      align: 'center',
      dataIndex: 'index',
      hideInSearch: true,
      renderText: (text, row, index) => index + 1,
    },
    {
      title: '电池设备号',
      dataIndex: 'deviceCode',
      order: 10,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '注册日期',
      dataIndex: 'registerTime',
      hideInSearch: true,
    },
    {
      title: '累计储能(Kw/H)',
      dataIndex: 'totalSoc',
      hideInSearch: true,
      renderText: (text, row, index) => row.totalSoc ? (row.totalSoc * 0.012).toFixed(2) : '0',
    },
    {
      title: '累计行驶里程(KM)',
      dataIndex: 'totalDistance',
      hideInSearch: true,
    },
    {
      title: '累计上报数据量(条)',
      dataIndex: 'totalMsg',
      hideInSearch: true,
    },
    {
      title: '近30天储能(Kw/H)',
      dataIndex: 'recentSoc',
      hideInSearch: true,
      renderText: (text, row, index) => row.recentSoc ? (row.recentSoc * 0.012).toFixed(2) : '0',
    },
    {
      title: '近30天行驶里程(KM)',
      dataIndex: 'recentDistance',
      hideInSearch: true,
    },
    {
      title: '近30天上报数据量(条)',
      dataIndex: 'recentMsg',
      hideInSearch: true,
    }
  ];

  /**
   * 查询表单参数预处理
   * @param params
   */
  const beforeSearchSubmit = (params) => {
    if (Array.isArray(params.dateTimeRange)) {
      params.registerTimeStart = moment(params.dateTimeRange[0]).format('YYYYMMDD');
      params.registerTimeEnd = moment(params.dateTimeRange[1]).format('YYYYMMDD');
    }
    return params;
  };

  /**
   * 表单查询请求
   * @param params
   */
  const request = (params) => {
    let req = {...params}
    delete req.dateTimeRange
    return getBatteryRep(req).then((res) => {
      return {data: res.data.data, success: true, total: res.data.total};
    }).catch(error => {
    })
  }

  return (
    <>
      <ProTable<TableListItem>
        bordered
        options={false}
        toolBarRender={false}
        actionRef={actionRef}
        formRef={formRef}
        rowKey={(record, index) => index}
        beforeSearchSubmit={beforeSearchSubmit}
        request={request}
        columns={columns}
      />
    </>
  );
};

export default TableList;
