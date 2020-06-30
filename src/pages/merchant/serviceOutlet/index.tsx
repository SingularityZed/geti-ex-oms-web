import React, { useEffect, useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { queryServiceOutlet } from '@/services/merchant';
import { Button, Space } from 'antd';
import { enums, getEnumText } from '@/utils/enums';
import { PlusOutlined } from '@ant-design/icons/lib';
import Create from '@/pages/merchant/serviceOutlet/components/Create';
import Edit from '@/pages/merchant/serviceOutlet/components/Edit';
import { buttons, hasAuthority } from '@/utils/buttons';
import { TableListItem } from './data';
import SearchFormOption from '@/components/SearchFormOption';

const Index: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [record, setRecord] = useState<object>();
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);

  const reduce = (previousValue, currentValue, currentIndex, array) => {
    return (
      previousValue +
      getEnumText(enums.ServiceItemEnum, currentValue) +
      (currentIndex == array.length - 1 ? '' : ',')
    );
  };

  /**
   * 页面初始化加载数据
   */
  useEffect(() => {
    actionRef.current.reload();
  }, [editVisible, addModalVisible]);

  // 列表及搜索条件
  const columns: ProColumns[] = [
    {
      title: '序号',
      dataIndex: 'index',
      hideInSearch: true,
      align: 'center',
      renderText: (val: string, _, index) => `${index + 1}`,
    },
    {
      title: '服务网点名称',
      align: 'center',
      dataIndex: 'serviceOutletName',
      hideInSearch: false,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '网点功能',
      dataIndex: 'serviceItem',
      align: 'center',
      hideInSearch: true,
      renderText: (val) => {
        if (val) {
          return (val || '')
            .split(',')
            .map((_val) => Number(_val))
            .reduce(reduce, '');
        }
        return '';
      },
    },
    {
      title: '服务时间',
      align: 'center',
      dataIndex: 'serviceHours',
      hideInSearch: false,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '详细地址',
      align: 'center',
      dataIndex: 'address',
      hideInSearch: false,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '电话',
      align: 'center',
      dataIndex: 'telephone',
      hideInSearch: false,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Space>
            {hasAuthority(buttons.merchant.serviceOutlet.index.edit) && (
              <a onClick={editOnClick.bind(_, record)}>编辑</a>
            )}
          </Space>
        </>
      ),
    },
  ];

  /**
   * 编辑 按钮点击事件
   */
  const editOnClick = (record) => {
    setRecord(record);
    setEditVisible(true);
  };
  /**
   * 编辑 modal 取消按钮点击事件
   */
  const editModalOnCancel = () => {
    setEditVisible(false);
  };

  function addOnClick() {
    setAddModalVisible(true);
  }
  const addModalOnCancel = () => {
    setAddModalVisible(false);
  };

  const optionButtons = hasAuthority(buttons.merchant.serviceOutlet.index.add)
    ? [
        {
          text: '新建',
          onClick: addOnClick,
        },
      ]
    : [];

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
        actionRef={actionRef}
        rowKey="id"
        beforeSearchSubmit={(params) => {
          return params;
        }}
        toolBarRender={false}
        search={{
          optionRender: (searchConfig, props) => (
            <SearchFormOption
              searchConfig={searchConfig}
              {...props}
              optionButtons={optionButtons}
            />
          ),
        }}
        columns={columns}
        request={(params) =>
          queryServiceOutlet(params).then((res) => {
            return { data: res.data.data, success: true, total: res.data.total };
          })
        }
      />

      {addModalVisible && <Create handleModelClose={addModalOnCancel} />}
      {editVisible && <Edit record={record} handleReturn={editModalOnCancel} />}
    </>
  );
};

export default Index;
