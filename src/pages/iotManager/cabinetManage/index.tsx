import React, { useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import Details from '@/pages/iotManager/cabinetManage/components/Details';
import { message, Modal, Space } from 'antd';
import { enumConverter, enums } from '@/utils/enums';
import { getCabinetList, uploadLog } from '@/services/device';
import { TableListItem } from './data';
import { hasAuthority, buttons } from '@/utils/buttons';

const { confirm } = Modal;
const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [detailsVisible, setDetailsVisible] = useState<boolean>(false);
  const [cabinetId, setcabinetId] = useState<number>();

  function showConfirm(id: any) {
    confirm({
      title: '上传日志',
      content: '确认上传该设备的日志吗？',
      onOk() {
        uploadLog(id).then((res) => {
          message.success('下发上传日志指令成功');
          actionRef.current.reload();
        });
      },
      onCancel() {},
    });
  }

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      align: 'center',
      renderText: (text, row, index) => index + 1,
    },
    {
      title: '换电柜编号',
      dataIndex: 'deviceCode',
      align: 'center',
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '格口总数',
      dataIndex: 'gridNum',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '在线状态',
      dataIndex: 'isOnline',
      valueEnum: enumConverter(enums.IsOnlineEnum),
      align: 'center',
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '最近一次在线时间',
      dataIndex: 'onlineUpdateTime',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Space>
            {hasAuthority(buttons.iotManager.cabinetManage.index.detail) && (
              <a
                onClick={() => {
                  setDetailsVisible(true);
                  setcabinetId(record.deviceCode);
                }}
              >
                详情
              </a>
            )}
            {hasAuthority(buttons.iotManager.cabinetManage.index.uplogs) && (
              <a
                onClick={() => {
                  showConfirm(record.deviceCode);
                }}
              >
                上传日志
              </a>
            )}
          </Space>
        </>
      ),
    },
  ];

  return (
    <>
      <>
        <ProTable<TableListItem>
          bordered
          style={{ display: detailsVisible ? 'none' : '' }}
          toolBarRender={false}
          actionRef={actionRef}
          rowKey="deviceCode"
          request={(params) => {
            return getCabinetList(params).then((res) => {
              return { data: res.data.data, success: true, total: res.data.total };
            });
          }}
          columns={columns}
        />

        {detailsVisible && (
          <Details
            cabinetId={cabinetId}
            handleReturn={() => {
              setDetailsVisible(false);
              actionRef.current.reload();
            }}
          />
        )}
      </>
    </>
  );
};

export default TableList;
