import React, { useState, useRef } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import { querySystemLog } from '@/services/manager.ts';
import { TableListItem } from './data';

const TableList: React.FC<{}> = () => {
  const [sorter, setSorter] = useState<string>('');
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      align: 'center',
      renderText: (val: string, record, index) => `${index + 1}`,
    },
    {
      title: '操作人',
      align: 'center',
      dataIndex: 'username',
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '操作描述',
      align: 'center',
      dataIndex: 'operation',
      hideInSearch: true,
    },
    {
      title: '耗时',
      align: 'center',
      dataIndex: 'time',
      hideInSearch: true,
    },
    {
      title: '执行方法',
      align: 'center',
      dataIndex: 'method',
      hideInSearch: true,
      ellipsis: true,
      onCell: () => {
        return {
          style: {
            maxWidth: 150,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            cursor: 'pointer',
          },
        };
      },
    },
    {
      title: '方法参数',
      align: 'center',
      dataIndex: 'params',
      hideInSearch: true,
      ellipsis: true,
      onCell: () => {
        return {
          style: {
            maxWidth: 150,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            cursor: 'pointer',
          },
        };
      },
    },
    {
      title: 'IP地址',
      align: 'center',
      dataIndex: 'ip',
      hideInSearch: true,
    },
    {
      title: '操作地点',
      align: 'center',
      dataIndex: 'location',
      hideInSearch: true,
    },
    {
      title: '操作时间',
      align: 'center',
      dataIndex: 'createTime',
      valueType: 'dateRange',
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
        dateFormatter="string"
        rowKey="id"
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<TableListItem>;
          if (sorterResult.field) {
            setSorter(`${sorterResult.field}_${sorterResult.order}`);
          }
        }}
        params={{
          sorter,
        }}
        request={(params) =>
          querySystemLog(params).then((res) => {
            return { data: res.data.rows, success: true, total: res.data.total };
          })
        }
        columns={columns}
        rowSelection={false}
      />
    </>
  );
};

export default TableList;
