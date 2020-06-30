import React, { useState, useRef } from 'react';
import {  PlusOutlined } from '@ant-design/icons';
import { Button,   message  } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import { queryDict,addDict } from "@/services/manager.ts";
import { TableListItem } from './data';

import CreateForm from './components/CreateForm';


/**
 * 新增字典
 * @param fields
 */
const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在新增');
  try {
    await addDict({ ...fields });
    hide();
    message.success('新增成功');
    return true;
  } catch (error) {
    hide();
    message.error('新增失败请重试！');
    return false;
  }
};


const TableList: React.FC<{}> = () => {
  const [sorter, setSorter] = useState<string>('');
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      align: 'center',
      renderText: (val: string, record, index) => `${index + 1}`,
    },
    {
      title: '字典编码',
      align: 'center',
      dataIndex: 'code',
    },
    {
      title: '字典名称',
      align: 'center',
      dataIndex: 'name',
    },
    {
      title: '排序',
      align: 'center',
      dataIndex: 'sort',
      hideInSearch: true,
    },
    {
      title: '备注',
      align: 'center',
      dataIndex: 'remark',
      hideInSearch: true,
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a>查看</a>
          <a>修改字典</a>
          <a>删除</a>
        </>
      ),
    },
  ];
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
        headerTitle="查询表格"
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
        toolBarRender={(action, { selectedRows }) => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={(params) =>
          queryDict(params).then((res) => {
            return { data: res.data.data, success: true };
          })
        }
        columns={columns}
        rowSelection={false}
      />
      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible} usage={true}>
        <ProTable<TableListItem, TableListItem>
          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="key"
          type="form"
          columns={columns}
          rowSelection={{}}
        />
      </CreateForm>

    </>
  );
};

export default TableList;
