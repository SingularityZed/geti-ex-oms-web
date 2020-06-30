import { Modal, Button, Tag, Tooltip, Divider } from 'antd';
import React, { useState, useRef } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { TableListItem } from './data.d';
import { getExportList } from '@/services/businessMonitor';
const ExportTable = (props: TableListItem) => {
  const {cancel,module} = props;
  const [visible] =useState<boolean>(true);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      align: 'center',
      renderText: (val: string, _, index) => `${index + 1}`,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '导出模块',
      dataIndex: 'module',
      hideInSearch: true,
      align: 'center',
      renderText: (val) => {
        switch (val) {
          case 1:
            return '换电订单';
          case 2:
            return '押金订单';
          case 3:
            return '套餐订单';
          case 4:
            return '电柜导出';
          case 5:
            return '骑手列表';
          case 6:
            return '押金流水';
          case 7:
            return '电柜日报导出';
          case 8:
            return '电柜月报导出';
          default:
            return '';
        }
      },
    },
    {
      title: '数据时间范畴',
      dataIndex: 'dateRange',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '导出条件',
      dataIndex: 'exportParam',
      hideInSearch: true,
      align: 'center',
      render: (_, record) => (
        <>
        <Tooltip placement="top" title={record.exportParam}>
          <Tag color="#2db7f5">查看详细</Tag>
        </Tooltip>
        </>
      ),
    },
    {
      title: '运营商',
      dataIndex: 'merchantName',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '导出时间',
      dataIndex: 'createTime',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          {(record.status===3)&&<a
            href={record.exportHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            下载
          </a>}
          {(record.status===1)&&<a
          >
            处理中
          </a>}
          {(record.status===2)&&
          <Tooltip placement="top" title={record.remark}>
            <Tag
            color="red"
            >
              失败
            </Tag>
          </Tooltip>}
        </>
      ),
    },
  ];
  return (
    <Modal title="导出记录/下载"
           onOk={() => actionRef.current.reload()}
           okText={"刷新"}
           onCancel={cancel}
           cancelText={"关闭"}
           visible={visible} width={1200}>
       <ProTable<TableListItem>
        bordered
        options={false}
        toolBarRender={false}
        rowKey="id"
        search={false}
        actionRef={actionRef}
        params = {{
          module
        }}
        request={(params) => {
          return getExportList(params).then((res) => {
            return {data: res.data.data, success: true, total: res.data.total};
          })
        }
        }
        pagination={{defaultPageSize: 10}}
        columns={columns}
      />
    </Modal>
  );
};
export default ExportTable;
