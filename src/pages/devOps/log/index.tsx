import React from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { queryLogPage } from '@/services/manager';
import { TableListItem } from './data';
import moment from 'moment';

const Index: React.FC<{}> = () => {
  // 列表及搜索条件
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '操作人',
      align: 'center',
      dataIndex: 'username',
      formItemProps: {
        allowClear: true,
        autoComplete: 'off',
      },
    },
    {
      title: '操作描述',
      dataIndex: 'operation',
      align: 'center',
      valueType: 'textarea',
      formItemProps: {
        allowClear: true,
        autoComplete: 'off',
      },
    },
    {
      title: '操作内容',
      align: 'center',
      dataIndex: 'params',
      ellipsis: true,
      onCell: () => {
        return {
          style: {
            maxWidth: 300,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            cursor: 'pointer',
          },
        };
      },
      formItemProps: {
        allowClear: true,
        autoComplete: 'off',
      },
    },
    {
      title: 'ip地址',
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
    },
  ];

  const beforeSubmit = (params?: any) => {
    if (Array.isArray(params.createTime)) {
      params.createTimeFrom = moment(params.createTime[0])
        .startOf('day')
        .format('YYYY/MM/DD HH:mm:ss');
      params.createTimeTo = moment(params.createTime[1]).endOf('day').format('YYYY/MM/DD HH:mm:ss');
    }
    delete params.createTime;
    return params;
  };

  return (
    <>
      <ProTable<TableListItem>
        bordered
        options={{
          density: false,
          fullScreen: false,
          reload: false,
          setting: false,
        }}
        toolBarRender={false}
        rowKey="id"
        beforeSearchSubmit={beforeSubmit}
        columns={columns}
        request={(params) =>
          queryLogPage(params).then((res) => {
            return { data: res.data.rows, success: true, total: res.data.total };
          })
        }
      />
    </>
  );
};

export default Index;
