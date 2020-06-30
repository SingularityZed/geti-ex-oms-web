import { Card, Descriptions, message, Modal, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import React, { FC, useEffect, useRef, useState } from 'react';
import { enumConverter, enums, getEnumText } from '@/utils/enums';
import { confirmRefundResult, getRefundDetail } from '@/services/pay';
import DetailSiderBar from '@/components/DetailSiderBar';
import { ActionType, ProColumns } from '@ant-design/pro-table/lib/Table';
import { TableListItem } from '@/pages/consumers/refund/data';
import ProTable from '@ant-design/pro-table';
import { buttons, hasAuthority } from '@/utils/buttons';

interface DetailModalProps {
  refundId: number | undefined;
  handleReturn: () => void;
}

const Details: FC<DetailModalProps> = (props) => {
  const actionRef = useRef<ActionType>();
  const { confirm } = Modal;
  const [refundDetail, setRefundDetail] = useState({});

  /**
   * 页面初始化加载数据
   */
  useEffect(() => {
    getRefundDetail(props.refundId).then((res) => {
      setRefundDetail(res.data.data);
    });
  }, []);

  /**
   * 页面刷新加载数据
   */
  function refresh() {
    getRefundDetail(props.refundId).then((res) => {
      setRefundDetail(res.data.data);
    });
  }

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '退款订单号',
      align: 'center',
      dataIndex: 'refundNo',
    },
    {
      title: '原订单号',
      align: 'center',
      dataIndex: 'orderNo',
    },
    {
      title: '退款结果',
      align: 'center',
      dataIndex: 'refundResult',
      valueEnum: enumConverter(enums.RefundResult),
    },
    {
      title: '退款交易流水号',
      align: 'center',
      dataIndex: 'refundTradeNo',
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
    },
    {
      title: '更新时间',
      align: 'center',
      dataIndex: 'updateTime',
    },
    {
      title: '完成时间',
      align: 'center',
      dataIndex: 'finishTime',
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Space>
            {hasAuthority(buttons.consumers.refund.detail.wxRefundConfirm) &&
              record.refundResult == 1 && (
                <a onClick={wxRefundConfirmOnClick.bind(_, record)}>微信退款结果确认</a>
              )}
          </Space>
        </>
      ),
    },
  ];

  /**
   * 微信退款结果确认 按钮点击事件
   */
  const wxRefundConfirmOnClick = (record) => {
    confirm({
      title: '退款结果确认',
      icon: <ExclamationCircleOutlined />,
      onOk: wxRefundConfirmModelOnClick.bind(this, record.refundTradeNo),
    });
  };

  /**
   * 微信退款结果确认 model框ok按钮事件
   */
  const wxRefundConfirmModelOnClick = (refundTradeNo) => {
    confirmRefundResult(refundTradeNo).then((res) => {
      refresh();
      message.success(res.data.message);
    });
  };

  return (
    <div>
      <DetailSiderBar handleReturn={props.handleReturn} />
      <Card title="基本信息">
        <Descriptions column={{ xxl: 2, xl: 2, sm: 2, xs: 1 }}>
          <Descriptions.Item label="用户名:">{refundDetail.consumerName}</Descriptions.Item>
          <Descriptions.Item label="电话号码:">{refundDetail.consumerMobileNo}</Descriptions.Item>
          <Descriptions.Item label="退款订单号:">{refundDetail.refundNo}</Descriptions.Item>
          <Descriptions.Item label="退款总金额:">
            {(refundDetail.totalRefundAmount / 100).toFixed(2)}
          </Descriptions.Item>
          <Descriptions.Item label="退款类型:">
            {getEnumText(enums.RefundType, refundDetail.refundType)}
          </Descriptions.Item>
          <Descriptions.Item label="退款方式:">
            {getEnumText(enums.RefundWay, refundDetail.refundWay)}
          </Descriptions.Item>
          <Descriptions.Item label="退款结果:">
            {getEnumText(enums.RefundResult, refundDetail.refundResult)}
          </Descriptions.Item>
          <Descriptions.Item label="完成时间:">{refundDetail.finishTime}</Descriptions.Item>
          <Descriptions.Item label="退款失败原因:">{refundDetail.failMessage}</Descriptions.Item>
          <Descriptions.Item label="退款操作员账号:">{refundDetail.updateUser}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="退款明细" style={{ marginTop: '30px' }}>
        <ProTable<TableListItem>
          bordered
          options={false}
          toolBarRender={false}
          actionRef={actionRef}
          rowKey="refundNo"
          columns={columns}
          search={false}
          dataSource={refundDetail.refundDetailInfoList}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default Details;
