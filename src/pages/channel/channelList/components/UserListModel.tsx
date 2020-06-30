import React, {useRef} from 'react';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import {TableListItem} from './data';
import {channelConsumerList} from '@/services/consumer'
import DetailSiderBar from "@/components/DetailSiderBar";
import {Form, Input} from "antd";

interface UserListModelProps {
  data: {};
  handleModelClose: () => void;
}

const UserListModel: React.FC<UserListModelProps> = (props) => {
  const actionRef = useRef<ActionType>();
  const {data, handleModelClose} = {...props};

  const request = (params) => {
    params.channelCode = data.channelCode
    return channelConsumerList(params).then((res) => {
      return {data: res.data.data, success: true, total: res.data.total};
    })
  }

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      renderText: (val: string, record, index) => `${index + 1}`,
    },
    {
      title: "用户名",
      dataIndex: "name",
      hideInSearch: true

    },
    {
      title: "手机号",
      dataIndex: "mobileNo"
    },
    {
      title: "套餐到期时间",
      dataIndex: "packageEndDay",
      hideInSearch: true,
    },
    {
      title: "渠道名称",
      dataIndex: "operatorName",
      hideInTable:true,
      renderFormItem: (item, config, form) => {
        return <Input defaultValue={data.operatorName} disabled={true}></Input>
      }
    },
    {
      title: "所属运营商",
      dataIndex: "merchantName",
      hideInTable:true,
      renderFormItem: (item, config, form) => {
        return <Input defaultValue={data.merchantName} disabled={true}></Input>
      }
    }
  ];

  return (
    <>
      <DetailSiderBar handleReturn={handleModelClose}/>
      <ProTable<TableListItem>
        bordered
        options={false}
        toolBarRender={false}
        actionRef={actionRef}
        rowKey="id"
        request={request}
        columns={columns}
      />
    </>
  );
};

export default UserListModel;
