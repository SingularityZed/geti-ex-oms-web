import {
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  Table,
  Tag,
  Tooltip,
  Space,
} from 'antd';
import React, { FC, useEffect, useRef, useState } from 'react';
import {
  changeGridForbid,
  getCabinetDetail,
  getCabinetFaultRecord,
  openGrid,
} from '@/services/merchant';
import { enums, getEnumText } from '@/utils/enums';
import DetailSiderBar from '@/components/DetailSiderBar';
import { ActionType } from '@ant-design/pro-table/lib/Table';
import ExchangeOrderModelTable from '@/components/ExchangeOrderModelTable';
import { Map, Marker } from 'react-amap';
import { buttons, hasAuthority } from '@/utils/buttons';

interface OperationModalProps {
  cabinetId: number | undefined;
}

const Details: FC<OperationModalProps> = (props) => {
  const actionRef = useRef<ActionType>();
  const [detail, setDetail] = useState({});
  const [gridInfoList, setGridInfoList] = useState<object>([]);
  const [openGridModalTitle, setOpenGridModalTitle] = useState<string>();
  const [deviceCode, setDeviceCode] = useState<number>();
  const [gridId, setGridId] = useState<number>();
  const [openGridModalVisible, setOpenGridModalVisible] = useState<boolean>(false);
  const [gridForbidModalTitle, setGridForbidModalTitle] = useState<string>();
  const [gridForbidFlag, setGridForbidFlag] = useState<boolean>(false);
  const [gridForbidModalVisible, setGridForbidModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [exchangeOrderTableVisible, setExchangeOrderTableVisible] = useState<boolean>(false);
  const [mapVisible, setMapVisible] = useState<boolean>(false);

  useEffect(() => {
    getCabinetDetail(props.cabinetId).then((res) => {
      setDetail({ ...res.data.data });
      setGridInfoList(res.data.data.cabinetGridList);
    });
  }, []);
  const [faultInfoList, setFaultInfoList] = useState<object>([]);
  useEffect(() => {
    {
      detail.deviceCode != undefined &&
        getCabinetFaultRecord(detail.deviceCode).then((res) => {
          setFaultInfoList(res.data.data);
        });
    }
  }, [detail]);

  const faultColumns = [
    {
      title: '故障码',
      dataIndex: 'faultCode',
      key: 'faultCode',
      align: 'center',
    },
    {
      title: '故障详情',
      dataIndex: 'faultCodeDesc',
      key: 'faultCodeDesc',
      align: 'center',
    },
    {
      title: '故障时间',
      dataIndex: 'faultTime',
      key: 'faultTime',
      align: 'center',
      sorter: (a, b) => Date.parse(b.faultTime) - Date.parse(a.faultTime),
    },
  ];
  const gridColumns = [
    {
      title: '格口编号',
      dataIndex: 'gridId',
      key: 'gridId',
      render: (text) => text + 1,
    },
    {
      title: '电池编号',
      dataIndex: 'batteryDeviceCode',
      key: 'batteryDeviceCode',
    },
    {
      title: '规格描述',
      dataIndex: 'deviceSpecification',
      key: 'deviceSpecification',
    },
    {
      title: '充电状态',
      dataIndex: 'batteryIsCharging',
      key: 'batteryIsCharging',
      renderText: (text, row, index) => {
        switch (row.batteryIsCharging) {
          case true:
            return '充电中';
            break;
          case false:
            return '未充电';
            break;
          default:
            return '-';
            break;
        }
      },
    },
    {
      title: '电量(%)',
      dataIndex: 'batterySoc',
      key: 'batterySoc',
    },
    {
      title: '门锁状态',
      dataIndex: 'gridInLock',
      key: 'gridInLock',
      render: (text) => (text == 0 ? '关' : '开'),
    },
    {
      title: '禁用原因',
      dataIndex: 'gridForbidReason',
      key: 'gridForbidReason',
    },
    {
      title: '格口故障码',
      dataIndex: 'gridFaultCode',
      key: 'gridFaultCode',
      render: (text, row, index) =>
        row.gridFaultCodeMap ? (
          <Tooltip
            key="tag"
            title={
              row.gridFaultCodeMap &&
              Object.keys(row.gridFaultCodeMap).map((item) => {
                return row.gridFaultCodeMap[item];
              })
            }
          >
            <Tag change color="red">
              查看故障
            </Tag>
          </Tooltip>
        ) : (
          '-'
        ),
    },
    {
      title: '充电器故障码',
      dataIndex: 'chargeFaultCode',
      key: 'chargeFaultCode',
      render: (text, row, index) =>
        row.chargeFaultCodeMap ? (
          <Tooltip
            key="tag"
            title={
              row.chargeFaultCodeMap &&
              Object.keys(row.chargeFaultCodeMap).map((item) => {
                return row.chargeFaultCodeMap[item];
              })
            }
          >
            <Tag change color="red">
              查看故障
            </Tag>
          </Tooltip>
        ) : (
          '-'
        ),
    },
    {
      title: '操作',
      align: 'center',
      render: (_, record) => (
        <>
          <Space>
            {record.gridInLock == 0 &&
              record.gridOutLock == 0 &&
              hasAuthority(buttons.equipment.cabinet.index.open) && (
                <a onClick={openGridOnClick.bind(_, record)}>开门</a>
              )}
            {(record.gridInLock == 0 && record.gridOutLock == 0) === false && <a>舱门已开</a>}
            <a> </a>
            {record.gridForbidden && hasAuthority(buttons.equipment.cabinet.index.gridEnable) && (
              <a onClick={enableGridOnclick.bind(_, record)}>启用</a>
            )}
            {record.gridForbidden === false &&
              hasAuthority(buttons.equipment.cabinet.index.gridDisable) && (
                <a onClick={disableGridOnclick.bind(_, record)}>禁用</a>
              )}
          </Space>
        </>
      ),
    },
  ];
  /**
   * 电柜格口开门 按钮点击事件
   * @param record
   */
  const openGridOnClick = (record) => {
    setOpenGridModalTitle('远程开门，电池有丢失风险，请联系运维人员操作。');
    setDeviceCode(record.deviceCode);
    setGridId(record.gridId);
    setOpenGridModalVisible(true);
    return;
  };

  /**
   * 电柜格口开门 model框cancel按钮事件
   */
  const openGridModalOnCancel = () => {
    setOpenGridModalVisible(false);
  };
  /**
   * 电柜格口开门 model框ok按钮事件
   */
  const openGridModalOnOk = () => {
    let params = {
      deviceCode: deviceCode,
      gridId: gridId,
    };
    openGrid(params);
    setOpenGridModalVisible(false);
  };

  /**************************/
  /**
   * 启用格口 按钮点击事件
   * @param record
   */
  const enableGridOnclick = (record) => {
    setGridForbidModalTitle('确认启用格口');
    setDeviceCode(record.deviceCode);
    setGridId(record.gridId);
    setGridForbidModalVisible(true);
    setGridForbidFlag(false);
    return;
  };

  /**
   * 禁用格口 按钮点击事件
   * @param record
   */
  const disableGridOnclick = (record) => {
    setGridForbidModalTitle('禁用格口后该格口将被锁定，无法换电');
    setDeviceCode(record.deviceCode);
    setGridId(record.gridId);
    setGridForbidModalVisible(true);
    setGridForbidFlag(true);
    return;
  };

  /**
   * 禁用格口 model框cancel按钮事件
   */
  const disableGridModalOnCancel = () => {
    form.resetFields();
    setGridForbidModalVisible(false);
  };
  /**
   * 禁用格口 model框ok按钮事件
   */
  const disableGridModalOnOk = () => {
    form
      .validateFields()
      .then((values) => {
        let params = {
          deviceCode: deviceCode,
          gridId: gridId,
          forbidden: gridForbidFlag ? true : false,
          forbidReason: values.forbidReason,
        };
        changeGridForbid(params, values.response).then((res) => {
          message.success(res.data.message);
          form.resetFields();
          // actionRef.current.reload();
          setGridForbidModalVisible(false);
          refreshOnClick();
        });
      })
      .catch((errorInfo) => {});
  };

  /**
   * 换电记录 按钮点击事件
   */
  const exchangeOrderInfoOnClick = () => {
    setExchangeOrderTableVisible(true);
  };

  /**
   * 换电记录 model框close
   */
  const exchangeOrderTableClose = () => {
    setExchangeOrderTableVisible(false);
  };

  /**
   * 重新获取
   */
  const refreshOnClick = () => {
    getCabinetDetail(detail.id).then((res) => {
      setDetail({ ...res.data.data });
      setGridInfoList(res.data.data.cabinetGridList);
    });
  };

  // 控制地图显示
  const showmodal = () => {
    setMapVisible(true);
  };
  const closemodal = () => {
    setMapVisible(false);
  };
  return (
    <div>
      <DetailSiderBar handleReturn={props.handleReturn} />
      <Card title="基本信息">
        <Descriptions column={2}>
          <Descriptions.Item label="换电柜编码">{detail.deviceCode}</Descriptions.Item>
          <Descriptions.Item label="换电柜名称">{detail.cabinetName}</Descriptions.Item>
          <Descriptions.Item label="批次">{detail.batchNo}</Descriptions.Item>
          <Descriptions.Item label="总功率">{detail.totalPower}</Descriptions.Item>
          <Descriptions.Item label="关联项目名称">{detail.projectName}</Descriptions.Item>
          <Descriptions.Item label="中控版本">{detail.appVersion}</Descriptions.Item>
          <Descriptions.Item label="电柜营业时间">
            {detail.workOnTime}-{detail.workOffTime}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card
        title="业务信息"
        style={{ marginTop: '30px' }}
        extra={
          <>
            {hasAuthority(buttons.equipment.cabinet.index.exchangePage) && (
              <a onClick={exchangeOrderInfoOnClick}>换电记录</a>
            )}
          </>
        }
      >
        <Descriptions column={2}>
          <Descriptions.Item label="电池/格口">{detail.batteryAndGrid}</Descriptions.Item>
          <Descriptions.Item label="可用数量">{detail.exBattery}</Descriptions.Item>
          <Descriptions.Item label="地址">{detail.address}</Descriptions.Item>
          <Descriptions.Item label="地图图标">
            {hasAuthority(buttons.equipment.cabinet.index.point) && (
              <Button size="small" type="primary" onClick={showmodal}>
                查看
              </Button>
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="状态信息" style={{ marginTop: '30px' }}>
        <Descriptions column={2}>
          <Descriptions.Item label="是否在线">
            {getEnumText(enums.IsOnlineEnum, detail.isOnline)}
          </Descriptions.Item>
          <Descriptions.Item label="配置状态">
            {getEnumText(enums.ConfigurationStatusIsOnline, detail.configurationStatus)}
          </Descriptions.Item>
          <Descriptions.Item label="运行状态">
            {getEnumText(enums.CabinetOperatingStatusEnum, detail.operatingStatus)}
          </Descriptions.Item>
          <Descriptions.Item label="是否故障">
            {detail.isFault ? <Tag color={'red'}>是</Tag> : <Tag color={'green'}>否</Tag>}
          </Descriptions.Item>
          <Descriptions.Item label="禁用原因">{detail.forbidReason}</Descriptions.Item>
          <Descriptions.Item label="最近断网重启记录">
            {detail.recentRestartTimes}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="故障报告" style={{ marginTop: '30px' }}>
        <Table
          actionRef={actionRef}
          rowKey="id"
          columns={faultColumns}
          search={false}
          dataSource={faultInfoList}
          pagination={false}
        />
      </Card>
      <Card
        title="格口信息"
        style={{ marginTop: '30px' }}
        extra={
          <>
            <a style={{ marginLeft: 10 }} onClick={refreshOnClick}>
              刷新
            </a>
          </>
        }
      >
        <Table columns={gridColumns} dataSource={gridInfoList} pagination={false} />
      </Card>

      <Modal
        title={openGridModalTitle}
        visible={openGridModalVisible}
        onOk={openGridModalOnOk}
        onCancel={openGridModalOnCancel}
      ></Modal>

      <Modal
        title={gridForbidModalTitle}
        visible={gridForbidModalVisible}
        onOk={disableGridModalOnOk}
        onCancel={disableGridModalOnCancel}
      >
        {gridForbidFlag && (
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
      {exchangeOrderTableVisible && (
        <ExchangeOrderModelTable
          closeModel={exchangeOrderTableClose}
          cabinetDeviceCode={detail.deviceCode}
        />
      )}

      <Modal
        visible={mapVisible}
        title="电池位置"
        onOk={closemodal}
        onCancel={closemodal}
        width="60%"
      >
        <div style={{ width: '100%', height: '350px', position: 'relative' }}>
          {detail && (
            <Map
              amapkey="309d27a9a912a6011ecf07aff92e8e2d"
              zoom={16}
              center={[detail.longitude, detail.latitude]}
            >
              <Marker position={[detail.longitude, detail.latitude]} />
            </Map>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Details;
