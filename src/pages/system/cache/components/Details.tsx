import {Space} from 'antd';
import React, {FC, useRef, useState} from 'react';
import DetailSiderBar from "@/components/DetailSiderBar";
import {buttons, hasAuthority} from "@/utils/buttons";
import SearchFormOption from "@/components/SearchFormOption";
import {queryEnumEntities} from "@/services/manager";
import ProTable from "@ant-design/pro-table";
import {ActionType, ProColumns} from "@ant-design/pro-table/lib/Table";
import AddEnumEntity from "@/pages/system/cache/components/AddEnumEntity";
import EditEnumEntity from "@/pages/system/cache/components/EditEnumEntity";

interface DetailModalProps {
  handleReturn: () => void;
  enumTypeCode: string;
}

interface TableListItem {
}

const Details: FC<DetailModalProps> = (props) => {
  const actionRef = useRef<ActionType>();
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [selectEnumEntity, setSelectEnumEntity] = useState({});
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
      dataIndex: 'enumTypeCode',
      hideInSearch: true,
      formItemProps: {
        allowClear: true,
      },
    },
    {
      title: '枚举类型Key',
      align: 'center',
      dataIndex: 'entityKey',
      formItemProps: {
        allowClear: true,
      },
    },
    {
      title: '枚举键值',
      align: 'center',
      dataIndex: 'entityValue',
      formItemProps: {
        allowClear: true,
      },
    },
    {
      title: '枚举名称',
      align: 'center',
      dataIndex: 'entityName',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Space>
            {hasAuthority(buttons.manager.enumCache.index.updateDetail) && (
              <a onClick={editButtonOnClick.bind(_, record)}>编辑</a>
            )}
          </Space>
        </>
      ),
    },
  ];

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
    setSelectEnumEntity(record);
    setEditVisible(true);
  }
  const editModelOnOk = () => {
    setEditVisible(false);
    actionRef.current.reload();
    setSelectEnumEntity({});
  }
  const editModelOnCancel = () => {
    setEditVisible(false);
    setSelectEnumEntity({});
  }
  const optionButtons = hasAuthority(buttons.manager.enumCache.index.addDetail) ? [
    {
      text: '新增',
      onClick: addButtonOnClick,
    },
  ] : [];

  /**
   * 表单查询请求
   * @param params
   */
  const request = (params) => {
    let pm = {...params};
    pm.enumTypeCode = props.enumTypeCode;
    return queryEnumEntities(pm).then((res) => {
      return {data: res.data.data, success: true, total: res.data.total};
    }).catch(error => {
    })
  }

  return (
    <>
      <DetailSiderBar handleReturn={props.handleReturn}/>
      <ProTable<TableListItem>
        rowKey="id"
        bordered
        options={false}
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
        actionRef={actionRef}
        request={request}
        columns={columns}
      />
      {addVisible &&
      <AddEnumEntity enumTypeCode={props.enumTypeCode} onOk={addModelOnOk} onCancel={addModelOnCancel}/>}
      {editVisible &&
      <EditEnumEntity entityEntity={selectEnumEntity} onOk={editModelOnOk} onCancel={editModelOnCancel}/>}
    </>
  );
};

export default Details;
