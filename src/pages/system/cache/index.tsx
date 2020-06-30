import React, {useRef, useState} from 'react';
import {message, Modal, Space} from 'antd';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import {getEnumTypes, refreshEnum,} from '@/services/manager.ts';

import {buttons, hasAuthority} from '@/utils/buttons';
import SearchFormOption from '@/components/SearchFormOption';
import Details from "@/pages/system/cache/components/Details";
import AddEnumType from "@/pages/system/cache/components/AddEnumType";
import EditEnumType from "@/pages/system/cache/components/EditEnumType";
import {ExclamationCircleOutlined} from "@ant-design/icons/lib";

interface TableListItem {
}

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const {confirm} = Modal;
  // const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [detailProps, setDetailProps] = useState({});
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [selectEnumType, setSelectEnumType] = useState({});

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      align: 'center',
      dataIndex: 'index',
      hideInSearch: true,
      renderText: (text, row, index) => index + 1,
    },
    {
      title: '枚举类型码',
      align: 'center',
      dataIndex: 'code',
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '枚举类型名称',
      align: 'center',
      dataIndex: 'name',
      hideInSearch: true,
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Space>
            {hasAuthority(buttons.manager.enumCache.index.update) && (
              <a onClick={editButtonOnClick.bind(_, record)}>编辑</a>
            )}
            <a onClick={detailButtonOnClick.bind(_, record)}>详情</a>
          </Space>
        </>
      ),
    },
  ];


  /**
   * 刷新枚举缓存
   */
  const refreshButtonOnClick = () => {
    confirm({
      title: '刷新枚举缓存?',
      icon: <ExclamationCircleOutlined/>,
      onOk: refreshModelOnOk
    })
  };
  const refreshModelOnOk = () => {
    refreshEnum().then((res) => {
      message.success(res.data.message);
    });
  }
  const detailButtonOnClick = (record) => {
    // setSelectEnumType(record);
    // setDetailVisible(true);
    setDetailProps({visible: true, enumTypeCode: record.code});
  }
  const handleReturn = () => {
    setDetailProps({visible: false});
    // setDetailVisible(false);
    setSelectEnumType({});
  }
  const addButtonOnClick = () => {
    setAddVisible(true);
  }
  const addModelOnOk = () => {
    setAddVisible(false);
    actionRef.current.reload();
  }
  const addModelOnCancel = () => {
    setAddVisible(false);
  }

  const editButtonOnClick = (record) => {
    setSelectEnumType(record);
    setEditVisible(true);
  }
  const editModelOnOk = () => {
    setEditVisible(false);
    actionRef.current.reload();
    setSelectEnumType({});
  }
  const editModelOnCancel = () => {
    setEditVisible(false);
    setSelectEnumType({});
  }


  function optionButtons() {
    let options = [];
    if (hasAuthority(buttons.manager.enumCache.index.refresh)) {
      options.push({
        text: '刷新枚举缓存',
        onClick: refreshButtonOnClick,
      });
    }
    if (hasAuthority(buttons.manager.enumCache.index.add)) {
      options.push({
        text: '新增',
        onClick: addButtonOnClick,
      });
    }
    return options;
  }

  const request = (params) => {
    return getEnumTypes(params).then((res) => {
      return {data: res.data.data, success: true, total: res.data.total};
    })
  }

  return (
    <>
      <ProTable<TableListItem>
        style={{display: detailProps.visible ? 'none' : ''}}
        bordered
        options={false}
        toolBarRender={false}
        actionRef={actionRef}
        search={{
          optionRender: (searchConfig, props) => (
            <SearchFormOption
              searchConfig={searchConfig}
              {...props}
              optionButtons={optionButtons()}
            />
          ),
        }}
        rowKey="id"
        request={request}
        columns={columns}
      />
      {addVisible && <AddEnumType onOk={addModelOnOk} onCancel={addModelOnCancel}/>}
      {editVisible && <EditEnumType enumType={selectEnumType} onOk={editModelOnOk} onCancel={editModelOnCancel}/>}
      {detailProps.visible && <Details enumTypeCode={detailProps.enumTypeCode} handleReturn={handleReturn}/>}
    </>
  );
};

export default TableList;
