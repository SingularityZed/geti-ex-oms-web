import React, { useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { message, Modal, Tooltip, Space, Tag } from 'antd';
import { TableListItem } from './data';
import { canceldepositRefund, depositRefund, refund, refundPage } from '@/services/pay';
import { enumConverter, enums } from '@/utils/enums';
import Details from '@/pages/consumers/refund/components/Details';
import { buttons, hasAuthority } from '@/utils/buttons';
import { ExclamationCircleOutlined } from '@ant-design/icons/lib';
import moment from "moment";
const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [detailsVisible, setDetailsVisible] = useState<boolean>(false);
  const [refundId, setRefundId] = useState<number>();
  const { confirm } = Modal;

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '申请时间区间',
      align: 'center',
      dataIndex: 'dateTimeRange',
      valueType: 'dateRange',
      hideInTable: true,
      order: 7,
    },
    {
      title: '序号',
      align: 'center',
      dataIndex: 'index',
      hideInSearch: true,
      renderText: (text, row, index) => index + 1,
    },
    {
      title: '用户名',
      align: 'center',
      dataIndex: 'consumerName',
      hideInSearch: true,
    },
    {
      title: '用户手机号',
      align: 'center',
      dataIndex: 'consumerMobileNo',
      order: 10,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '商户信息',
      align: 'center',
      dataIndex: 'merchantName',
      hideInSearch: true,
    },
    {
      title: '申请时间',
      align: 'center',
      dataIndex: 'createTime',
      hideInSearch: true,
    },
    {
      title: '完成时间',
      align: 'center',
      dataIndex: 'finishTime',
      hideInSearch: true,
    },
    {
      title: '退款订单号',
      align: 'center',
      dataIndex: 'refundNo',
      order: 9,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '退款类型',
      align: 'center',
      dataIndex: 'refundType',
      valueEnum: enumConverter(enums.RefundType),
      hideInSearch: true,
    },
    {
      title: '退款方式',
      align: 'center',
      dataIndex: 'refundWay',
      valueEnum: enumConverter(enums.RefundWay),
      hideInSearch: true,
    },
    {
      title: '退押原因',
      align: 'center',
      dataIndex: 'refundReasonType',
      valueEnum: enumConverter(enums.RefundReason),
      formItemProps: {
        allowClear: true,
      },
      render: (_, record) => {
        return<Tooltip placement="top" title={record.refundReasonDesc}>
        <Tag color="blue">退款原因</Tag>
      </Tooltip>;
      },
    },
    {
      title: '退款总金额(元)',
      align: 'center',
      dataIndex: 'totalRefundAmount',
      renderText: (val: number) => (val / 100).toFixed(2),
      hideInSearch: true,
    },
    {
      title: '退款结果',
      align: 'center',
      dataIndex: 'refundResult',
      valueEnum: enumConverter(enums.RefundResult),
      order: 8,
      formItemProps: {
        allowClear: true,
      },
    },
    {
      title: '退款失败原因',
      align: 'center',
      dataIndex: 'failMessage',
      hideInSearch: true,
      render: (_, record) => {
        return record.refundResult == 4 ? (
          <Tooltip title={record.failMessage}>
            <span>查看详细内容</span>
          </Tooltip>
        ) : null;
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
            {hasAuthority(buttons.consumers.refund.index.detail) && record.refundResult == 5 && (
              <a onClick={passOnClick.bind(_, record)}>通过</a>
            )}
            {hasAuthority(buttons.consumers.refund.index.pass) && record.refundResult == 5 && (
              <a onClick={cancelOnClick.bind(_, record)}>取消</a>
            )}
            {hasAuthority(buttons.consumers.refund.index.cancel) && (
              <a onClick={detailOnClick.bind(_, record)}>详情</a>
            )}
          </Space>
        </>
      ),
    },
  ];

  /**
   * 详情 按钮点击事件
   */
  const detailOnClick = (record) => {
    setDetailsVisible(true);
    setRefundId(record.id);
  };

  /**
   * 详情页返回
   */
  const handleDetailsReturn = () => {
    setDetailsVisible(false);
    actionRef.current.reload();
  };

  /**
   * 通过 按钮点击事件
   */
  const passOnClick = (record) => {
    confirm({
      title: '确定退还押金?',
      icon: <ExclamationCircleOutlined />,
      content: '当您点击确定按钮后，将发起退还押金',
      onOk: passModelOnOk.bind(this, record.refundNo),
    });
  };

  /**
   * 通过 model框ok按钮事件
   */
  const passModelOnOk = (refundNo) => {
    depositRefund(refundNo).then((res) => {
      message.success(res.data.message);
      actionRef.current.reload();
    });
  };

  /**
   * 取消 按钮点击事件
   */
  const cancelOnClick = (record) => {
    confirm({
      title: '确定拒绝退还押金?',
      icon: <ExclamationCircleOutlined />,
      content: '当您点击确定按钮后，将取消退还押金',
      onOk: cancelModelOnOk.bind(this, record.refundNo),
    });
  };

  /**
   * 通过 model框ok按钮事件
   */
  const cancelModelOnOk = (refundNo) => {
    canceldepositRefund(refundNo).then((res) => {
      message.success(res.data.message);
      actionRef.current.reload();
    });
  };

  /**
   * 查询表单参数预处理
   * @param params
   */
  const beforeSearchSubmit = (params) => {
    if (Array.isArray(params.dateTimeRange)) {
      params.startTime = moment(params.dateTimeRange[0]).startOf('day').format("YYYY/MM/DD HH:mm:ss");
      params.endTime = moment(params.dateTimeRange[1]).endOf('day').format("YYYY/MM/DD HH:mm:ss");
    }
    return params;
  };

  /**
   * 表单查询请求
   * @param params
   */
  const request = (params) => {
    return refundPage(params).then((res) => {
      return { data: res.data.data, success: true, total: res.data.total };
    });
  };

  return (
    <>
        <ProTable<TableListItem>
          style={{display: detailsVisible ? 'none' : ''}}
          bordered
          options={false}
          toolBarRender={false}
          actionRef={actionRef}
          rowKey="id"
          beforeSearchSubmit={beforeSearchSubmit}
          request={request}
          columns={columns}
        />
      {detailsVisible && <Details refundId={refundId} handleReturn={handleDetailsReturn} />}
    </>
  );
};

export default TableList;
