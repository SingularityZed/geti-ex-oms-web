import React, { useRef } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { TableListItem } from './data';
import { channelWithdrawConfirm, channelWithdrawList } from '@/services/channel';
import DetailSiderBar from '@/components/DetailSiderBar';
import { Space, Input, message, Modal } from 'antd';
import moment from 'moment';

interface WithdrawListModelProps {
  data: {};
  handleModelClose: () => void;
}

const WithdrawListModel: React.FC<WithdrawListModelProps> = (props) => {
  const actionRef = useRef<ActionType>();
  const { data, handleModelClose } = { ...props };

  const beforeSearchSubmit = (params) => {
    if (Array.isArray(params.createTime)) {
      params.startTime = moment(params.createTime[0]).startOf('day').replaceAll('-', '/');
      params.endTime = moment(params.createTime[1]).endOf('day').replaceAll('-', '/');
    }
    return params;
  };

  const request = (params) => {
    params.channelId = data.id;
    return channelWithdrawList(params).then((res) => {
      return { data: res.data.data, success: true, total: res.data.total };
    });
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      renderText: (text, row, index) => {
        return index + 1;
      },
    },
    {
      title: '提现订单号',
      dataIndex: 'tradeNo',
    },
    {
      title: '提现金额（元）',
      dataIndex: 'tradeAmount',
      renderText: (text, row, index) => (text / 100).toFixed(2),
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '渠道名称',
      dataIndex: 'operatorName',
      hideInTable: true,
      renderFormItem: (item, config, form) => {
        return <Input defaultValue={data.operatorName} disabled={true}></Input>;
      },
    },
    {
      title: '操作',
      align: 'center',
      valueType: 'option',
      dataIndex: 'option',
      render: (_, record) => (
        <>
          <Space>
            {record.tradeStatus == 1 && <span>初始状态</span>}
            {record.tradeStatus == 4 && <span>确认失败</span>}
            {record.tradeStatus == 3 && <span>确认成功</span>}
            {record.tradeStatus == 2 && (
              <a
                onClick={() => {
                  Modal.confirm({
                    title: '是否确认这条提现申请？',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                      channelWithdrawConfirm(record.tradeNo).then(() => {
                        message.success('确认提现申请成功');
                      });
                    },
                    onCancel: () => {},
                  });
                }}
              >
                确认
              </a>
            )}
          </Space>
        </>
      ),
    },
  ];

  return (
    <>
      <DetailSiderBar handleReturn={handleModelClose} />
      <ProTable<TableListItem>
        bordered
        options={false}
        toolBarRender={false}
        actionRef={actionRef}
        rowKey={(record, index) => index}
        request={request}
        beforeSearchSubmit={beforeSearchSubmit}
        columns={columns}
      />
    </>
  );
};

export default WithdrawListModel;
