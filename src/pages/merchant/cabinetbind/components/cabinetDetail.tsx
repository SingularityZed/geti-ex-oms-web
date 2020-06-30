import React, { FC, useEffect, useState, useRef } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { getqueryPage, removeBind } from '@/services/merchant';
import DetailSiderBar from '@/components/DetailSiderBar';
import { Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { enumConverter, enums } from '@/utils/enums';
import { hasAuthority, buttons } from '@/utils/buttons';

interface CabinetbindDetailProps {
  userId: number | undefined;
  handleClose: () => void;
  username: string;
}
interface TableListItem {}

const CabinetbindDetail: FC<CabinetbindDetailProps> = (props) => {
  const actionRef = useRef<ActionType>();
  const { confirm } = Modal;
  function showConfirm(cabinetname, id) {
    confirm({
      title: '解除绑定关系',
      icon: <ExclamationCircleOutlined />,
      content: `即将解除运维人员"${props.username}"与电柜"${cabinetname}"的绑定关系,你还要继续吗?`,
      onOk() {
        removeBind(id).then((r) => {
          if (r.data.code === '000000') {
            message.success('解绑成功！');
            actionRef.current.reload();
          }
        });
      },
      onCancel() {},
    });
  }
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'no',
      renderText: (val: string, _, index) => `${index + 1}`,
      hideInSearch: true,
    },
    {
      title: '设备编号',
      align: 'center',
      dataIndex: 'deviceCode',
      formItemProps: {
        allowClear: true,
        autoComplete: 'off',
      },
    },
    {
      title: '电柜名称',
      align: 'center',
      dataIndex: 'cabinetName',
      formItemProps: {
        autoComplete: 'off',
        allowClear: true,
      },
    },
    {
      title: '所属商户',
      align: 'center',
      dataIndex: 'merchantName',
      hideInSearch: true,
    },
    {
      title: '绑定关系类型',
      align: 'center',
      dataIndex: 'bindType',
      hideInSearch: true,
      valueEnum: enumConverter(enums.BindType),
    },
    {
      title: '所绑用户',
      align: 'center',
      dataIndex: 'userName',
      hideInSearch: true,
    },
    {
      title: '电话',
      align: 'center',
      dataIndex: 'mobileNo',
      hideInSearch: true,
    },
    {
      title: '姓名',
      align: 'center',
      dataIndex: 'realName',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, record) => (
        <>
          {hasAuthority(buttons.merchant.cabinetbind.index.unbind) && (
            <a
              onClick={() => {
                showConfirm(record.cabinetName, record.id);
              }}
            >
              解除绑定
            </a>
          )}
        </>
      ),
    },
  ];
  return (
    <>
      <ProTable<TableListItem>
        bordered
        options={false}
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={false}
        columns={columns}
        request={(params) =>
          getqueryPage({ ...params, userId: props.userId }).then((res) => {
            return { data: res.data.data, success: true, total: res.data.total };
          })
        }
      />
      <DetailSiderBar handleReturn={props.handleClose} />
    </>
  );
};
export default CabinetbindDetail;
