import React, {useRef} from 'react';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import {TableListItem} from './data';
import {getRealNameLog} from "@/services/consumer";
import {enumConverter, enums} from "@/utils/enums";

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
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
      dataIndex: 'name',
      order: 9,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      }
    },
    {
      title: '认证结果',
      dataIndex: 'success',
      valueEnum: enumConverter(enums.RealNameSuccessEnum),
      formItemProps: {
        allowClear: true,
      }
    },
    {
      title: '失败原因',
      dataIndex: 'errorCode',
      valueEnum: enumConverter(enums.RealNameCodeEnum),
      formItemProps: {
        allowClear: true,
      },
      order:8
    },
    {
      title: '失败描述',
      dataIndex: 'message',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valeType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '时间区间',
      align: 'center',
      dataIndex: 'createTime',
      valueType: 'dateTimeRange',
      hideInTable: true,
      order: 7,
    },
  ];

  /**
   * 查询表单参数预处理
   * @param params
   */
  const beforeSearchSubmit = (params) => {
    if (Array.isArray(params.createTime)) {
      params.createTimeFrom = params.createTime[0];
      params.createTimeTo = params.createTime[1];
    }
    return params;
  };

  /**
   * 表单查询请求
   * @param params
   */
  const request = (params) => {
    return getRealNameLog(params).then((res) => {
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

