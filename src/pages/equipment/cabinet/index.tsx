import React, { useEffect, useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import {
  changeCabinet,
  edit,
  entryMaintenance,
  getCabinetDetail,
  getOrganizationAll,
  queryBizCabinetList,
} from '@/services/merchant';
import { TableListItem } from './data';
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Tag,
  TimePicker,
  Space,
  Dropdown,
  Menu,
} from 'antd';
import { BasicListItemDataType } from './data.d';
import { DownOutlined } from '@ant-design/icons';
import Details from './components/Details';
import { enumConverter, enums } from '@/utils/enums';
import moment from 'moment';
import { Map, Marker } from 'react-amap';
import PicturesWall from '@/components/PicturesWall/PicturesWall';
import { buttons, hasAuthority } from '@/utils/buttons';
import { getUserInfo } from '@/utils/authority';
import { ExclamationCircleOutlined } from '@ant-design/icons/lib';
import ExportTable from '@/components/ExportTable';
import { exportCabinetExcel } from '@/services/businessMonitor';
import SearchFormOption from '@/components/SearchFormOption';

const Index: React.FC<{ TableListProps }> = (props) => {
  const actionRef = useRef<ActionType>();
  const [detailsVisible, setDetailsVisible] = useState<boolean>(false);
  const [cabinetId, setCabinetId] = useState<number>();
  const [deviceCode, setDeviceCode] = useState<number>();
  const [orgId, setOrgId] = useState<number>();
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [cabinetEnableModalTitle, setCabinetEnableModalTitle] = useState<string>('');
  const [cabinetForbidFlag, setCabinetForbidFlag] = useState<boolean>(false);
  const [cabinetEnableModalVisible, setCabinetEnableModalVisible] = useState<boolean>(false);
  const [organizationOptions, setOrganizationOptions] = useState<object>([]);
  const [editGps, setEditGps] = useState<[]>([]);
  const [checked, setChecked] = useState();
  const { confirm } = Modal;
  const { RangePicker } = TimePicker;
  const [exportListVisible, setExportListVisible] = useState<boolean>(false);
  const formRef = useRef();

  useEffect(() => {
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
      title: '换电柜编号',
      align: 'center',
      hideInSearch: false,
      dataIndex: 'deviceCode',
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '电柜名称',
      dataIndex: 'cabinetName',
      align: 'center',
      hideInSearch: false,
      valueType: 'textarea',
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
      title: '电池/格口',
      align: 'center',
      dataIndex: 'batteryAndGrid',
      hideInSearch: true,
    },
    {
      title: '可换',
      align: 'center',
      dataIndex: 'exBattery',
      valueType: 'dateRange',
      hideInSearch: true,
    },
    {
      title: '在线',
      align: 'center',
      dataIndex: 'isOnline',
      hideInSearch: false,
      valueEnum: enumConverter(enums.CabinetStatusIsOnline),
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '故障',
      align: 'center',
      dataIndex: 'isFault',
      hideInSearch: true,
      valueEnum: enumConverter(enums.IsFaultEnum),
    },
    {
      title: '配置状态',
      align: 'center',
      dataIndex: 'configurationStatus',
      hideInSearch: false,
      valueEnum: enumConverter(enums.ConfigurationStatusIsOnline),
      render: (_, record) => {
        switch (record.configurationStatus) {
          case 1:
            return <Tag color="green">正常</Tag>;
          case 2:
            return <Tag color="red">禁用</Tag>;
          case 3:
            return <Tag color="red">维护中</Tag>;
          case 4:
            return <Tag color="red">故障中</Tag>;
        }
      },
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '运行状态',
      align: 'center',
      dataIndex: 'operatingStatus',
      hideInSearch: false,
      valueEnum: enumConverter(enums.CabinetOperatingStatusEnum),
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
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
      hideInSearch: true,
      render: (_, record) => (
        <>
          <Space>
            {hasAuthority(buttons.equipment.cabinet.index.detail) && (
              <a onClick={detailOnClick.bind(_, record)}>详情</a>
            )}
            <MoreBtn key="more" item={record} />
            {/* {hasAuthority(buttons.equipment.cabinet.index.edit) && (
              <a onClick={editOnClick.bind(_, record)}>编辑</a>
            )}
            {hasAuthority(buttons.equipment.cabinet.index.inRepair) &&
              record.configurationStatus == 1 && (
                <a onClick={enterMaintainOnClick.bind(_, record)}>进入维护</a>
              )}
            {hasAuthority(buttons.equipment.cabinet.index.inRepair) &&
              record.configurationStatus == 3 && (
                <a onClick={exitMaintainOnClick.bind(_, record)}>退出维护</a>
              )}
            {hasAuthority(buttons.equipment.cabinet.index.disable) &&
              record.operatingStatus == 1 && (
                <a onClick={disableCabinetOnclick.bind(_, record)}>禁用</a>
              )}
            {hasAuthority(buttons.equipment.cabinet.index.enable) &&
              record.operatingStatus == 2 && (
                <a onClick={enableCabinetOnclick.bind(_, record)}>启用</a>
              )} */}
          </Space>
        </>
      ),
    },
  ];

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
          {hasAuthority(buttons.equipment.cabinet.index.edit) && (
            <Menu.Item key="edit">
              <Button type="link">编辑</Button>
            </Menu.Item>
          )}
          {hasAuthority(buttons.equipment.cabinet.index.inRepair) && item.configurationStatus == 1 && (
            <Menu.Item key="enter">
              <Button type="link">进入维护</Button>
            </Menu.Item>
          )}
          {hasAuthority(buttons.equipment.cabinet.index.inRepair) && item.configurationStatus == 3 && (
            <Menu.Item key="exit">
              <Button type="link">退出维护</Button>
            </Menu.Item>
          )}
          {hasAuthority(buttons.equipment.cabinet.index.enable) && item.operatingStatus == 2 && (
            <Menu.Item key="enable">
              <Button type="link">启用</Button>
            </Menu.Item>
          )}
          {hasAuthority(buttons.equipment.cabinet.index.disable) && item.operatingStatus == 1 && (
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
    if (key === 'edit') editOnClick(currentItem);
    else if (key === 'enter') enterMaintainOnClick(currentItem);
    else if (key === 'exit') exitMaintainOnClick(currentItem);
    else if (key === 'enable') enableCabinetOnclick(currentItem);
    else if (key === 'disable') disableCabinetOnclick(currentItem);
  };

  /**
   * 详情 按钮点击事件
   */
  const detailOnClick = (record) => {
    setDetailsVisible(true);
    setCabinetId(record.id);
  };

  /**
   * 编辑 按钮点击事件
   */
  const editOnClick = (record) => {
    getCabinetDetail(record.id).then((res) => {
      let data = res.data.data;
      setEditVisible(true);
      form.setFieldsValue({
        deviceCode: data.deviceCode,
        cabinetName: data.cabinetName,
        operationName: data.operationName,
        servicePhone: data.servicePhone,
        region: data.province + data.city,
        address: data.address,
        gpsCoordinates: '经度:' + data.longitude + ',维度:' + data.latitude,
        description: data.description,
        date: [
          moment(data.workOnTime ? data.workOnTime : '00:00', 'HH:mm'),
          moment(data.workOffTime ? data.workOffTime : '00:00', 'HH:mm'),
        ],
        imgUrlList: data.cabinetPicture ? [data.cabinetPicture] : [],
      });
      setChecked(data.totalPower);
      setCabinetId(data.id);
      setOrgId(data.orgId);
      setEditGps([data.longitude, data.latitude]);
    });
  };
  /**
   * 编辑 modal样式
   */
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  /**
   * 编辑 modal 确定按钮点击事件
   */
  const editModalOnOk = () => {
    form.validateFields().then((values) => {
      let params = { ...values };
      params.id = cabinetId;
      params.orgId = orgId;
      params.workOnTime = moment(values.date[0]).format('HH:mm');
      params.workOffTime = moment(values.date[1]).format('HH:mm');
      params.cabinetPicture = values.imgUrlList[0];
      params.totalPower = Number(values.totalPower);
      edit(params)
        .then((res) => {
          message.success(res.data.message);
          actionRef.current.reload();
          setEditVisible(false);
          form.resetFields();
        })
        .catch((error) => {});
    });
  };

  /**
   * 编辑 modal 取消按钮点击事件
   */
  const editModalOnCancel = () => {
    setEditVisible(false);
    form.resetFields();
  };

  /**
   * 进入维护 按钮点击事件
   * @param record
   */
  const enterMaintainOnClick = (record) => {
    confirm({
      title: '进入维护',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk: disableMaintainModalOnOk.bind(this, record),
    });
  };
  /**
   * 退出维护 按钮点击事件
   * @param record
   */
  const exitMaintainOnClick = (record) => {
    confirm({
      title: '退出维护',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk: enableMaintainModalOnOk.bind(this, record),
    });
  };

  /**
   * 启用电柜 按钮点击事件
   * @param record
   */
  const enableCabinetOnclick = (record) => {
    setCabinetEnableModalTitle('启用电柜');
    setCabinetForbidFlag(false);
    setDeviceCode(record.deviceCode);
    setCabinetEnableModalVisible(true);
    return;
  };

  /**
   * 禁用电柜 按钮点击事件
   * @param record
   */
  const disableCabinetOnclick = (record) => {
    setCabinetEnableModalTitle('禁用电柜');
    setCabinetForbidFlag(true);
    setDeviceCode(record.deviceCode);
    setCabinetEnableModalVisible(true);
    return;
  };

  /**
   * 禁用电柜 model框cancel按钮事件
   */
  const disableCabinetModalOnCancel = () => {
    form.resetFields();
    setCabinetEnableModalVisible(false);
  };
  /**
   * 禁用电柜 model框ok按钮事件
   */
  const disableCabinetModalOnOk = () => {
    form
      .validateFields()
      .then((values) => {
        let params = {
          deviceCode: deviceCode,
          operatingStatus: cabinetForbidFlag ? 2 : 1,
          forbidReason: values.forbidReason,
        };
        changeCabinet(params, values.response).then((res) => {
          message.success(res.data.message);
          form.resetFields();
          actionRef.current.reload();
          setCabinetEnableModalVisible(false);
        });
      })
      .catch((errorInfo) => {});
  };

  /**
   * 进入维护 model框ok按钮事件
   */
  const disableMaintainModalOnOk = (record) => {
    let params = {
      deviceCode: record.deviceCode,
      status: true,
    };
    entryMaintenance(params).then((res) => {
      message.success(res.data.message);
      form.resetFields();
      actionRef.current.reload();
    });
  };
  /**
   * 进入维护 model框ok按钮事件
   */
  const enableMaintainModalOnOk = (record) => {
    let params = {
      deviceCode: record.deviceCode,
      status: false,
    };
    entryMaintenance(params).then((res) => {
      message.success(res.data.message);
      form.resetFields();
      actionRef.current.reload();
    });
  };

  /**
   * 详情页返回
   */
  const handleDetailsReturn = () => {
    setDetailsVisible(false);
    actionRef.current.reload();
  };

  function checkChange(checkedValues) {
    setChecked(checkedValues);
  }

  function handleExportExcel() {
    // 导出
    const queryParams = formRef.current.getFieldsValue();
    exportCabinetExcel(queryParams).then((res) => {
      message.success('请稍后在导出列表中下载！');
    });
  }

  /**
   * excel model显示
   */
  function handelShowExportList() {
    setExportListVisible(true);
  }

  const closemodal = () => {
    setExportListVisible(false);
  };

  const optionButtons = hasAuthority(buttons.equipment.cabinet.index.export)
    ? [
        {
          text: '导出',
          onClick: handleExportExcel,
        },
        {
          text: '导出列表',
          onClick: handelShowExportList,
        },
      ]
    : [];

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
          formRef={formRef}
          actionRef={actionRef}
          rowKey="id"
          beforeSearchSubmit={(params) => {
            return params;
          }}
          toolBarRender={false}
          search={{
            optionRender: (searchConfig, props) => (
              <SearchFormOption
                searchConfig={searchConfig}
                {...props}
                optionButtons={optionButtons}
              />
            ),
          }}
          columns={columns}
          request={(params) =>
            queryBizCabinetList(params).then((res) => {
              return { data: res.data.data, success: true, total: res.data.total };
            })
          }
        />

      <Modal
        title="编辑换电柜信息"
        visible={editVisible}
        onOk={editModalOnOk}
        onCancel={editModalOnCancel}
      >
        <Form {...layout} form={form} layout="horizontal" name="form_in_modal">
          <Form.Item name="deviceCode" label="换电柜编号">
            <Input disabled={true} />
          </Form.Item>
          <Form.Item name="cabinetName" label="点位名称">
            <Input autoComplete={"off"}/>
          </Form.Item>
          <Form.Item name="operationName" label="运营商">
            <Input disabled={true} />
          </Form.Item>
          <Form.Item name="servicePhone" label="服务电话" rules={[{ required: true }]}>
            <Input autoComplete={"off"}/>
          </Form.Item>
          <Form.Item name="region" label="地区">
            <Input disabled={true} />
          </Form.Item>
          <Form.Item name="address" label="详细地址">
            <Input autoComplete={"off"}/>
          </Form.Item>
          <Form.Item name="gpsCoordinates" label="GPS坐标">
            <Input disabled={true} />
          </Form.Item>
          <Form.Item name="description" label="描述信息"  rules={[{ required: true }]}>
            <Input autoComplete={"off"}/>
          </Form.Item>
          <Form.Item name="totalPower" label="电柜总功率">
            <Select
              placeholder="电柜总功率"
              onChange={checkChange}
              value={checked}
              defaultValue={checked}
            >
              <Option value="5000">5000W</Option>
              <Option value="6000">6000W</Option>
              <Option value="7000">7000W</Option>
            </Select>
          </Form.Item>
          <Form.Item name="date" label="电柜营业开始时间">
            <RangePicker format={'HH:mm'} />
          </Form.Item>
          <Form.Item name="map" label="地图">
            <div style={{ width: '100%', height: '350px', position: 'relative' }}>
              <Map amapkey="309d27a9a912a6011ecf07aff92e8e2d" zoom={16} center={editGps}>
                <Marker position={editGps} />
              </Map>
            </div>
          </Form.Item>
          <Form.Item name="imgUrlList" label="电柜图片"  rules={[{ required: true }]}>
            <PicturesWall imgMaxSize={1} fileBizType={'businessLicensePhoto'} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={cabinetEnableModalTitle}
        visible={cabinetEnableModalVisible}
        onOk={disableCabinetModalOnOk}
        onCancel={disableCabinetModalOnCancel}
      >
        {cabinetForbidFlag && (
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

      {detailsVisible && (
        <Details cabinetId={cabinetId} key={cabinetId} handleReturn={handleDetailsReturn} />
      )}

      {exportListVisible && <ExportTable module="4" cancel={closemodal} />}
    </>
  );
};

export default Index;
