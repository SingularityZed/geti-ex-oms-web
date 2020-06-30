import React, {useRef, useState} from 'react';
import {Tooltip} from 'antd';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import {TableListItem} from './data';
import {querySendDetail} from '@/services/consumer';
import {enumConverter, enums} from '@/utils/enums';

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [requestTimes, setRequestTimes] = useState<number>(0);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      align: 'center',
      dataIndex: 'index',
      hideInSearch: true,
      renderText: (text, row, index) => index + 1,
    },
    {
      title: '手机号码',
      align: 'center',
      dataIndex: 'phoneNum',
      order: 10,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '发送时间',
      align: 'center',
      dataIndex: 'sendDate',
      valueType: 'date',
      order: 9,
    },
    {
      title: '接收时间',
      align: 'center',
      dataIndex: 'receiveDate',
      hideInSearch: true,
    },
    {
      title: '模板类型',
      align: 'center',
      dataIndex: 'templateContent',
      hideInSearch: true,
    },

    {
      title: '短信内容',
      align: 'center',
      dataIndex: 'content',
      hideInSearch: true,
      render: (_, record) => {
        return (
          <Tooltip title={record.content}>
            <span>查看详细内容</span>
          </Tooltip>
        );
      },
    },
    {
      title: '发送状态',
      align: 'center',
      dataIndex: 'sendStatus',
      valueEnum: enumConverter(enums.SendStatusEnums),
      hideInSearch: true,
    },
  ];

  /**
   * 表单查询请求
   * @param params
   */
  const request = (params) => {
    if (requestTimes < 1) {
      setRequestTimes(requestTimes + 1);
      return new Promise(params).then((res => {
        return {data: [], success: true, total: 0};
      }))
    }
    setRequestTimes(requestTimes + 1);
    let reqParams = {
      phoneNumber: params.phoneNum,
      sendDate: params.sendDate ? params.sendDate.replaceAll("-", "") : null,
      currentPage: params.current,
      pageSize: params.pageSize
    }
    return querySendDetail(reqParams).then((res) => {
      return {data: res.data.data.smsSendDetailDTOs, success: true, total: res.data.data.totalCount};
    })
  }

  return (
    <>
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

export default TableList;
