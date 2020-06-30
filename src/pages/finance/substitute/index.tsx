import React, { useRef, useEffect, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { TableListItem } from './data';
import { enumConverter, enums } from '../../../utils/enums';
import { Popconfirm, message, Modal, Space } from 'antd';
import {
  getsubstitute,
  refundBatchpaid,
  refundBatchcancel,
  refundBatchdetail,
} from '@/services/pay';
import { getOrganizationAll } from '@/services/merchant';
import { hasAuthority, buttons } from '@/utils/buttons';
import { getUserInfo } from '@/utils/authority';

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [organizationOptions, setOrganizationOptions] = useState<object>([]);
  const [visible, setvisible] = useState<boolean>(false);
  const [dataSource, setdataSource] = useState<any>([]);
  const cancel = () => {
    message.error('取消确认');
  };
  useEffect(() => {
    // 获取运营商全部信息
    getOrganizationAll().then((res) => {
      let str = getUserInfo();
      let userInfo = str == '' ? {} : JSON.parse(getUserInfo());
      let obj = {};
      res.data.data.organizationInfoList.forEach((item) => {
        if (userInfo.user.orgId === 1) {
          obj[item.id] = item.operationName;
        } else {
          if (item.id == userInfo.user.orgId) {
            obj[item.id] = item.operationName;
          }
        }
      });
      setOrganizationOptions(obj);
    });
  }, []);
  // 控制退押订单用户列表Modal显示
  const handleOk = () => {
    setvisible(false);
  };
  const handleCancel = () => {
    setvisible(false);
  };
  const confirm = (record) => {
    // 确认打款
    refundBatchpaid(record.id).then((res) => {
      message.success('确认打款');
      actionRef.current.reload();
    });
  };
  // 获取订单用户列表
  const detail = (record) => {
    refundBatchdetail(record.id).then((res) => {
      setdataSource(res.data.data);
    });
    setvisible(true);
  };
  const refuse = (record) => {
    // 拒绝申请
    refundBatchcancel(record.id).then((res) => {
      message.success('退押申请已拒绝');
      actionRef.current.reload();
    });
  };
  const detailcolumns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      renderText: (text, row, index) => index + 1,
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '用户名',
      dataIndex: 'consumerName',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '商户订单号',
      dataIndex: 'tradeNo',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '微信支付订单号',
      dataIndex: 'outTradeNo',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '手机号码',
      dataIndex: 'mobileNo',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '运营商',
      dataIndex: 'merchantName',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '电池规格',
      dataIndex: 'batterySpecification',
      valueEnum: enumConverter(enums.BatterySpecificationEnum),
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '代缴金额（元）',
      dataIndex: 'settlementTotalAmount',
      renderText: (text) => (text / 100).toFixed(2),
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '代缴时间',
      dataIndex: 'subTime',
      align: 'center',
      hideInSearch: true,
    },
  ];
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      renderText: (text, row, index) => index + 1,
      align: 'center',
    },
    {
      title: '运营商',
      dataIndex: 'merchantName',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '运营商',
      dataIndex: 'merchantId',
      valueEnum: organizationOptions,
      hideInTable: true,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '提现用户数',
      dataIndex: 'totalRefundCount',
      hideInSearch: true,
      align: 'center',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              detail(record);
            }}
          >
            {record.totalRefundCount}
          </a>
        </>
      ),
    },
    {
      title: '提现总额（元）',
      dataIndex: 'totalRefundAmount',
      renderText: (text) => (text / 100).toFixed(2),
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'dealStatus',
      valueEnum: enumConverter([
        { text: '未退款', value: 1 },
        { text: '已退款', value: 2 },
        { text: '已拒绝', value: 3 },
      ]),
      hideInTable: true,
      align: 'center',
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, record) => (
        <>
          {record.dealStatus === 1 && (
            <Space>
              {hasAuthority(buttons.finance.substitute.index.agree) && (
                <Popconfirm
                  title="将该笔押金款项打给对应商户后才可确认打款，确认已打款？"
                  onConfirm={() => {
                    confirm(record);
                  }}
                  onCancel={cancel}
                  okText="确认"
                  cancelText="取消"
                >
                  <a href="#">确认打款</a>
                </Popconfirm>
              )}
              {hasAuthority(buttons.finance.substitute.index.refuse) && (
                <a href="#" onClick={refuse.bind(_, record)}>
                  拒绝
                </a>
              )}
            </Space>
          )}
          {record.dealStatus === 2 && <span>已打款</span>}
          {record.dealStatus === 3 && <span>已撤销</span>}
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
        actionRef={actionRef}
        toolBarRender={false}
        rowKey="id"
        request={(params) => {
          return getsubstitute(params).then((res) => {
            return { data: res.data.data, success: true, total: res.data.total };
          });
        }}
        columns={columns}
      />
      <Modal
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1100}
        title="代缴提现用户名单"
      >
        <ProTable<TableListItem>
          bordered
          options={{
            density: false,
            fullScreen: false,
            reload: false,
            setting: false,
          }}
          dataSource={dataSource}
          columns={detailcolumns}
          rowKey="tradeNo"
          search={false}
          toolBarRender={false}
        />
      </Modal>
    </>
  );
};

export default TableList;
