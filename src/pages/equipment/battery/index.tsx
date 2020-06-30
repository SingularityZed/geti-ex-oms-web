import { Form, Input, message, Modal, Tag, Space, Dropdown, Button, Menu } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import Details from './components/Details';
import { Dispatch } from 'umi';
import {  DownOutlined } from '@ant-design/icons';
import { queryBizBatteryList, getOrganizationAll, changeExchangeEnable } from '@/services/merchant';
import { TableListItem, BasicListItemDataType } from './data.d';
import { StateType } from './model';
import styles from './style.less';
import { enumConverter, enums } from '@/utils/enums';
import { ExchangeOrderTableProps } from '@/components/ExchangeOrderModelTable/data';
import ExchangeOrderModelTable from '@/components/ExchangeOrderModelTable';
import { buttons, hasAuthority } from '@/utils/buttons';
import { getUserInfo } from '@/utils/authority';

const QRCode = require('qrcode.react');

interface TableListProps {
  dispatch: Dispatch;
  userManager: StateType;
}

const TableList: React.FC<TableListProps> = (props) => {
  const actionRef = useRef<ActionType>();
  const [qrcodeUrl, setQrcodeUrl] = useState<string>('');
  const [batteryEnableModalTitle, setBatteryEnableModalTitle] = useState<string>('');
  const [batteryForbidFlag, setBatteryForbidFlag] = useState<boolean>(false);
  const [batteryQrcodeVisible, setBatteryQrcodeVisible] = useState<boolean>(false);
  const [detailsVisible, setDetailsVisible] = useState<boolean>(false);
  const [batteryId, setBatteryId] = useState<number>();
  const [deviceCode, setDeviceCode] = useState<number>();
  const [batteryEnableModalVisible, setBatteryEnableModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [organizationOptions, setOrganizationOptions] = useState<object>([]);
  const [exchangeOrderTableProps, setExchangeOrderTableProps] = useState<ExchangeOrderTableProps>();
  const [exchangeOrderTableVisible, setExchangeOrderTableVisible] = useState<boolean>(false);
  const colors = ['#F4333C', '#F3C623', '#F4333C', '#00A650'];
  const [color, setcolor] = useState<string>('');
  const [health, sethealth] = useState<number>();
  useEffect(() => {
    //获取运营商全部信息
    let str = getUserInfo();
    let userInfo = str == '' ? {} : JSON.parse(getUserInfo());
    let obj = {};
    //获取运营商全部信息
    getOrganizationAll().then((res) => {
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

  // 列表及搜索条件
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      align: 'center',
      dataIndex: 'no',
      hideInSearch: true,
      renderText: (val: string, _, index) => `${index + 1}`,
    },
    {
      title: '运营商',
      dataIndex: 'orgId',
      align: 'center',
      order: 7,
      valueEnum: organizationOptions,
      hideInTable: true,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },

    {
      title: '电池编号',
      align: 'center',
      dataIndex: 'deviceCode',
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '骑手手机号',
      align: 'center',
      hideInTable: true,
      dataIndex: 'ownerMobileNo',
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '规格描述',
      dataIndex: 'deviceSpecification',
      align: 'center',
      hideInSearch: true,
      valueType: 'textarea',
      valueEnum: enumConverter(enums.BatterySpecificationEnum),
    },
    {
      title: '使用状态',
      align: 'center',
      dataIndex: 'exchangeEnable',
      valueEnum: enumConverter(enums.BatteryExchangeEnableEnum),
      render: (_, record) => {
        switch (record.exchangeEnable) {
          case 1:
            return <Tag color="green">启用</Tag>;
          case 2:
            return <Tag color="red">禁用</Tag>;
        }
      },
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '所属商户',
      align: 'center',
      dataIndex: 'operationName',
      hideInSearch: true,
    },
    {
      title: '换电网络',
      align: 'center',
      dataIndex: 'powerExchangeNetworkName',
      hideInSearch: true,
    },
    {
      title: '电量',
      align: 'center',
      dataIndex: 'soc',
      hideInSearch: true,
    },
    {
      title: '运维状态',
      align: 'center',
      dataIndex: 'operatingStatus',
      valueEnum: enumConverter(enums.BatteryOperationStatusEnum),
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '充电状态',
      align: 'center',
      dataIndex: 'chargeStatus',
      valueEnum: enumConverter(enums.BatteryChargeStatusEnum),
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '归属信息',
      align: 'center',
      dataIndex: 'ownerInfo',
      hideInSearch: true,
      renderText: (text, row, index) => {
        switch (row.ownerType) {
          case 1:
            return row.ownerId;
            break;
          case 3:
            return row.ownerMobileNo;
            break;
          default:
            return '';
            break;
        }
      },
    },
    {
      title: '归属实体名称',
      align: 'center',
      dataIndex: 'ownerName',
      hideInSearch: true,
    },
    {
      title: '更新时间',
      align: 'center',
      dataIndex: 'updateTime',
      hideInSearch: true,
    },
    {
      title: '禁用原因',
      align: 'center',
      dataIndex: 'forbidReason',
      hideInSearch: true,
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'option',
      width: '150px',
      hideInSearch: true,
      render: (_, record) => (
        <>
          <Space>
            {hasAuthority(buttons.equipment.battery.index.detail) && (
              <a onClick={detailOnClick.bind(_, record)}> 详情</a>
            )}
            {hasAuthority(buttons.equipment.battery.index.code) && (
              <a onClick={batteryQrcodeOnClick.bind(_, record)}>电池码</a>
            )}
            <MoreBtn key="more" item={record} />
            {/* {hasAuthority(buttons.equipment.battery.index.exchangeOrder) && (
              <a onClick={exchangeOrderOnClick.bind(_, record)}>换电记录</a>
            )}
            {hasAuthority(buttons.equipment.battery.index.disable) &&
              record.exchangeEnable == 1 && (
                <a onClick={disableBatteryOnclick.bind(_, record)}>禁用</a>
              )}
            {hasAuthority(buttons.equipment.battery.index.enable) && record.exchangeEnable == 2 && (
              <a onClick={enableBatteryOnclick.bind(_, record)}>启用</a>
            )} */}
          </Space>
        </>
      ),
    },
  ];
  const selectcolor = () => {
    switch (health) {
      case 1:
        return colors[1];
      case 2:
        return colors[2];
      case 3:
        return colors[3];
      default:
        return colors[0];
    }
  };

    /**
   * 更多
   * @param param
   */
  const MoreBtn: React.FC<{
    item: BasicListItemDataType;
  }> = ({ item }) => (
    <Dropdown
      overlay={
        <Menu onClick={({ key }) => moreOperate(key, item)}>
          {hasAuthority(buttons.equipment.battery.index.exchangeOrder) && (
            <Menu.Item key="exchange">
              <Button type="link">换电记录</Button>
            </Menu.Item>
          )}
          {hasAuthority(buttons.equipment.battery.index.enable) && item.exchangeEnable == 2 && (
            <Menu.Item key="enable">
              <Button type="link">启用</Button>
            </Menu.Item>
          )}
          {hasAuthority(buttons.equipment.battery.index.disable) && item.exchangeEnable == 1 && (
            <Menu.Item key="disable">
              <Button type="link">禁用</Button>
            </Menu.Item>
          )}
        </Menu>
      }
    >
      <a>
        更多 <DownOutlined />
      </a>
    </Dropdown>
  );
  const moreOperate = (key: string, currentItem: BasicListItemDataType) => {
    if (key === 'exchange') exchangeOrderOnClick(currentItem);
    else if (key === 'enable') enableBatteryOnclick(currentItem);
    else if (key === 'disable') disableBatteryOnclick(currentItem);
  };


  /**
   * 详情 按钮点击事件
   */
  const detailOnClick = (record) => {
    setDetailsVisible(true);
    setBatteryId(record.id);
  };

  /**
   * 换电记录 按钮点击事件
   */
  const exchangeOrderOnClick = (record) => {
    setExchangeOrderTableProps({ batteryDeviceCode: record.deviceCode });
    setExchangeOrderTableVisible(true);
  };

  /**
   * 换电记录 model框close
   */
  const exchangeOrderTableClose = () => {
    setExchangeOrderTableVisible(false);
    setExchangeOrderTableProps({});
  };

  /**
   * 电池码qrcode 按钮点击事件
   */
  const batteryQrcodeOnClick = (record) => {
    setBatteryQrcodeVisible(true);
    setQrcodeUrl(record.deviceCode);
    sethealth(record.healthCodeColor);
  };
  useEffect(() => {
    setcolor(selectcolor());
  }, [health]);

  /**
   * 启用电池 按钮点击事件
   * @param record
   */
  const enableBatteryOnclick = (record) => {
    setBatteryEnableModalTitle('启用电池');
    setBatteryForbidFlag(false);
    setDeviceCode(record.deviceCode);
    setBatteryEnableModalVisible(true);
    return;
  };

  /**
   * 禁用电池 按钮点击事件
   * @param record
   */
  const disableBatteryOnclick = (record) => {
    setBatteryEnableModalTitle('禁用电池');
    setBatteryForbidFlag(true);
    setDeviceCode(record.deviceCode);
    setBatteryEnableModalVisible(true);
    return;
  };

  /**
   * 禁用电池 model框cancel按钮事件
   */
  const disableBatteryModalOnCancel = () => {
    form.resetFields();
    setBatteryEnableModalVisible(false);
  };
  /**
   * 禁用电池 model框ok按钮事件
   */
  const disableBatteryModalOnOk = () => {
    form
      .validateFields()
      .then((values) => {
        let params = {
          deviceCode: deviceCode,
          exchangeEnable: batteryForbidFlag ? 2 : 1,
          forbidReason: values.forbidReason,
        };
        changeExchangeEnable(params, values.response).then((res) => {
          message.success(res.data.message);
          form.resetFields();
          actionRef.current.reload();
          setBatteryEnableModalVisible(false);
        });
      })
      .catch((errorInfo) => {});
  };

  /**
   * 电池二维码 model框ok按钮事件
   */
  const batteryQrcodeModalOk = () => {
    setBatteryQrcodeVisible(false);
  };
  /**
   * 电池二维码 model框calcel按钮事件
   */
  const batteryQrcodeModalCancel = () => {
    setBatteryQrcodeVisible(false);
  };

  /**
   * 详情页返回
   */
  const handleDetailsReturn = () => {
    setDetailsVisible(false);
    actionRef.current.reload();
  };

  return (
    <>
        <ProTable<TableListItem>
          style={{display: detailsVisible ? 'none' : ''}}
          bordered
          options={{
            density: false,
            fullScreen: false,
            reload: false,
            setting: false,
          }}
          toolBarRender={false}
          actionRef={actionRef}
          rowKey="id"
          request={(params) =>
            queryBizBatteryList(params).then((res) => {
              return { data: res.data.data, success: true, total: res.data.total };
            })
          }
          columns={columns}
          rowSelection={false}
        />
      <Modal
        title={batteryEnableModalTitle}
        visible={batteryEnableModalVisible}
        onOk={disableBatteryModalOnOk}
        onCancel={disableBatteryModalOnCancel}
      >
        {batteryForbidFlag && (
          <Form form={form} initialValues={{}}>
            <Form.Item
              name="forbidReason"
              label="禁用原因"
              rules={[{ required: true, message: '请输入禁用原因' }]}
            >
              <Input.TextArea
                placeholder="请输入禁用原因"
                autoSize={{ minRows: 1, maxRows: 255 }}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
      <Modal
        title="电池码"
        visible={batteryQrcodeVisible}
        onOk={batteryQrcodeModalOk}
        onCancel={batteryQrcodeModalCancel}
      >
        <div className={styles.imagebox}>
          <QRCode
            value={qrcodeUrl} // value参数为生成二维码的链接
            size={200} // 二维码的宽高尺寸
            fgColor={color}
          />
        </div>
      </Modal>
      {detailsVisible && <Details batteryId={batteryId} handleReturn={handleDetailsReturn} />}
      {exchangeOrderTableVisible && (
        <ExchangeOrderModelTable
          closeModel={exchangeOrderTableClose}
          {...exchangeOrderTableProps}
        />
      )}
    </>
  );
};

export default TableList;
