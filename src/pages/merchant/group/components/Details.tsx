import { Card, Descriptions, message, Modal, Space } from 'antd';
import React, { FC, useRef } from 'react';
import { enumConverter, enums, getEnumText } from '@/utils/enums';
import { deleteGroupUser, getGroupUser } from '@/services/consumer';
import DetailSiderBar from '@/components/DetailSiderBar';
import { ActionType, ProColumns } from '@ant-design/pro-table/lib/Table';
import { TableListItem } from '@/pages/consumers/refund/data';
import ProTable from '@ant-design/pro-table';
import { ExclamationCircleOutlined } from '@ant-design/icons/lib';
import { buttons, hasAuthority } from '@/utils/buttons';

interface DetailModalProps {
  group: object | undefined;
  handleReturn: () => void;
}

const Details: FC<DetailModalProps> = (props) => {
  const { group, handleReturn } = { ...props };
  const actionRef = useRef<ActionType>();
  const { confirm } = Modal;

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '用户名',
      align: 'center',
      dataIndex: 'name',
      hideInSearch: true,
    },
    {
      title: '手机号码',
      align: 'center',
      dataIndex: 'mobileNo',
      order: 10,
      formItemProps:{
        allowClear: true,
        autoComplete: "off",
      }

    },
    {
      title: '用户类别',
      align: 'center',
      dataIndex: 'userType',
      valueEnum: enumConverter(enums.UserTypeEnum),
      hideInSearch: true,
    },
    {
      title: '电池编码',
      align: 'center',
      dataIndex: 'batteryCode',
      hideInSearch: true,
    },
    {
      title: '规格',
      align: 'center',
      dataIndex: 'deviceSpecification',
      valueEnum: enumConverter(enums.BatterySpecificationEnum),
      hideInSearch: true,
    },
    {
      title: '套餐到期时间',
      align: 'center',
      dataIndex: 'packageEndDay',
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
            {hasAuthority(buttons.merchant.group.detail.remove) && (
              <a onClick={removeUserOnClick.bind(_, record)}>移除用户</a>
            )}
          </Space>
        </>
      ),
    },
  ];

  /**
   * 移除用户 按钮点击事件
   */
  const removeUserOnClick = (record) => {
    confirm({
      title: '确认移除群组?',
      icon: <ExclamationCircleOutlined />,
      onOk: removeUserConfirmModelOnClick.bind(this, record.id),
    });
  };

  /**
   * 微信退款结果确认 model框ok按钮事件
   */
  const removeUserConfirmModelOnClick = (id) => {
    deleteGroupUser(id)
      .then((res) => {
        message.success(res.data.message);
        actionRef.current.reload();
      })
      .catch((errer) => {});
  };

  /**
   * 表单查询请求
   * @param params
   */
  const request = (params) => {
    params.groupId = group.id;
    return getGroupUser(params).then((res) => {
      return { data: res.data.data, success: true, total: res.data.total };
    });
  };

  return (
    <div>
      <DetailSiderBar handleReturn={handleReturn} />
      <Card title="群组基本信息">
        <Descriptions column={2}>
          <Descriptions.Item label="群组名称">{group.groupName}</Descriptions.Item>
          <Descriptions.Item label="群组套餐">{group.packageName}</Descriptions.Item>
          <Descriptions.Item label="联系人">
            {group.contactPerson}/{group.contactTelephone}
          </Descriptions.Item>
          <Descriptions.Item label="电池规格">
            {getEnumText(enums.BatterySpecificationEnum, group.deviceSpecification)}
          </Descriptions.Item>
          <Descriptions.Item label="是否允许使用优惠:">
            {group.useCoupon == 1 ? '否' : '是'}
          </Descriptions.Item>
          <Descriptions.Item label="群组套餐">{group.merchantName}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="群组用户列表" style={{ marginTop: '30px' }}>
        <ProTable<TableListItem>
          bordered
          options={false}
          toolBarRender={false}
          actionRef={actionRef}
          options={false}
          rowKey="id"
          columns={columns}
          request={request}
        />
      </Card>
    </div>
  );
};

export default Details;
