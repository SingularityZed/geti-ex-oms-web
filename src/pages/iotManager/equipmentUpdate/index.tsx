import React, { useRef, useState, useEffect } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Modal, Button, Select, message } from 'antd';
import { TableListItem } from './data';
import { enumConverter, enums } from '../../../utils/enums';
import { getUpdateready, upGrade, packageList } from '@/services/device';
import { hasAuthority, buttons } from '@/utils/buttons';

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [selectionType, setSelectionType] = useState('checkbox');
  const [selected, setselected] = useState<any>([]);
  const [packagelist, setpackagelist] = useState<any>([]);
  const [version, setversion] = useState<number>();
  const [visible, setvisible] = useState<boolean>(false);
  function update() {
    upGrade({ deviceCodeList: selected, upgradeId: version }).then((res) => {
      message.success('升级成功');
      actionRef.current.reload();
    });
    closemodal();
  }
  function showmodal() {
    setvisible(true);
  }
  function closemodal() {
    setvisible(false);
  }
  useEffect(() => {
    packageList().then((res) => {
      // 获取供应商列表
      const { data } = res.data;
      const datalist = [];
      for (let i = 0; i < data.length; i += 1) {
        datalist.push({ value: data[i].id, key:data[i].id, text: data[i].versionName });
      }
      setpackagelist(datalist);
    });
  }, []);
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(selectedRowKeys, selectedRows)
      setselected(selectedRowKeys);
    },
  };
  const { Option } = Select;
  const packageChange = (value) => {
    setversion(value);
  };
  useEffect(() => {}, [selected]);
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      renderText: (text, row, index) => index + 1,
    },
    {
      title: '换电柜编号',
      dataIndex: 'deviceCode',
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '格口总数',
      dataIndex: 'gridNum',
      hideInSearch: true,
    },
    {
      title: '在线状态',
      dataIndex: 'isOnline',
      valueEnum: enumConverter(enums.IsOnlineEnum),
      formItemProps: {
        allowClear: true,
      },
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      hideInSearch: true,
    },
    {
      title: '产品类型',
      dataIndex: 'productType',
      valueEnum: enumConverter(enums.ProductType),
      formItemProps: {
        allowClear: true,
      },
    },
    {
      title: '最近一次在线时间',
      dataIndex: 'onlineUpdateTime',
      hideInSearch: true,
    },
  ];

  return (
    <>
      <>
        <ProTable<TableListItem>
          bordered
          options={{
            density: false,
            fullScreen: false,
            reload: false,
            setting: false,
          }}
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          actionRef={actionRef}
          rowKey="deviceCode"
          request={(params) => {
            return getUpdateready(params).then((res) => {
              return { data: res.data.data, success: true, total: res.data.total };
            });
          }}
          toolBarRender={(action) =>
            hasAuthority(buttons.iotManager.equipmentUpdate.index.update)
              ? [
                  <Select
                    style={{ width: 500 }}
                    onChange={packageChange}
                    placeholder="请选择升级版本"
                    allowClear
                  >
                    {packagelist.map((item) => (
                      <Option key="item.value" value={item.value}>
                        {item.text}
                      </Option>
                    ))}
                  </Select>,
                  <Button onClick={showmodal} type="primary">
                    升级
                  </Button>,
                  <Modal title="设备升级" visible={visible} onOk={update} onCancel={closemodal}>
                    <p>确认升级这些设备吗？</p>
                  </Modal>,
                ]
              : []
          }
          columns={columns}
        />
      </>
    </>
  );
};

export default TableList;
