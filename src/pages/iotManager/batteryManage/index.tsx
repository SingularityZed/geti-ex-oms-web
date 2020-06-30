import { Modal, Space } from 'antd';
import React, { useState, useRef } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import { BatteryList } from '@/services/device';
import { hasAuthority, buttons } from '@/utils/buttons';
import Details from './components/Details';
import Soc from './components/Soc';
import { TableListItem } from './data.d';
import styles from './style.less';

const QRCode = require('qrcode.react');

interface TableListProps {}

const TableList: React.FC<TableListProps> = () => {
  const actionRef = useRef<ActionType>();
  const [, setSorter] = useState<string>('');
  const [qrcodeUrl, setQrcodeUrl] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);
  const [socvisible, setsocVisible] = useState<boolean>(false);
  const [code, setcode] = useState<string>('');
  const [socdetail, setsocdetail] = useState<object>();
  const [detailsVisible, setdetailsVisible] = useState<boolean>(false);
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      align: 'center',
      renderText: (val: string, _, index) => `${index + 1}`,
    },
    {
      title: '设备号',
      dataIndex: 'deviceCode',
      align: 'center',
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: 'IMEI码',
      dataIndex: 'imei',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '电池包状态',
      dataIndex: 'batteryStatus',
      hideInSearch: true,
      align: 'center',
      renderText: (val) => {
        switch (val) {
          case 0:
            return '搁置';
          case 1:
            return '放电';
          case 2:
            return '充电';
          default:
            return '';
        }
      },
    },
    {
      title: '电量(%)',
      dataIndex: 'soc',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '设备规格',
      dataIndex: 'deviceSpecification',
      hideInSearch: true,
      align: 'center',
      renderText: (val) => {
        switch (val) {
          case 'A001':
            return '60V-20AH';
          case 'A003':
            return '48V-20AH';
          default:
            return '';
        }
      },
    },
    {
      title: '在线',
      dataIndex: 'isOnline',
      align: 'center',
      valueEnum: {
        0: {
          text: '离线',
          isOnline: '0',
        },
        1: {
          text: '在线',
          isOnline: '1',
        },
      },
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '详细地址',
      dataIndex: 'address',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, record) => (
        <>
          <Space>
            {hasAuthority(buttons.iotManager.batteryManage.index.detail) && (
              <a
                onClick={() => {
                  setdetailsVisible(true);
                  setcode(record.deviceCode);
                }}
              >
                详情
              </a>
            )}
            {hasAuthority(buttons.iotManager.batteryManage.index.soc) && (
              <a
                onClick={() => {
                  setsocdetail(record);
                  setsocVisible(true);
                }}
              >
                电量曲线
              </a>
            )}
            {hasAuthority(buttons.iotManager.batteryManage.index.code) && (
              <a
                onClick={() => {
                  setVisible(true);
                  setQrcodeUrl(record.deviceCode);
                }}
              >
                电池码
              </a>
            )}
          </Space>
        </>
      ),
    },
  ];
  // 控制电池二维码显示
  const handleOk = () => {
    setVisible(false);
  };
  const handleCancel = () => {
    setVisible(false);
    setdetailsVisible(false);
  };
  return (
    <>
      <ProTable<TableListItem>
        bordered
        style={{ display: detailsVisible || socvisible ? 'none' : '' }}
        dateFormatter="string"
        rowKey="deviceCode"
        actionRef={actionRef}
        toolBarRender={false}
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<TableListItem>;
          if (sorterResult.field) {
            setSorter(`${sorterResult.field}_${sorterResult.order}`);
          }
        }}
        request={(params) =>
          BatteryList(params).then((res) => {
            return { data: res.data.data, success: true, total: res.data.total };
          })
        }
        columns={columns}
        rowSelection={false}
      />
      <Modal title="电池码" visible={visible} onOk={handleOk} onCancel={handleCancel}>
        <div className={styles.imagebox}>
          <QRCode
            value={qrcodeUrl} // value参数为生成二维码的链接
            size={200} // 二维码的宽高尺寸
            fgColor="#000000" // 二维码的颜色
          />
        </div>
      </Modal>
      {detailsVisible && (
        <Details
          handleReturn={() => {
            actionRef.current.reload();
            setdetailsVisible(false);
          }}
          code={code}
        />
      )}
      {socvisible && (
        <Soc
          handleReturn={() => {
            actionRef.current.reload();
            setsocVisible(false);
          }}
          data={socdetail}
        />
      )}
    </>
  );
};
export default TableList;
