import { Button, Card, Descriptions, message, Modal } from 'antd';
import React, { FC, useEffect, useRef, useState } from 'react';
import {
  changeDischargeEnable, changeOperatingStatus,
  disableDeposit,
  getBatteryDetail,
  getBatteryFaultRecord,
} from '@/services/merchant';
import { enums, getEnumText } from '@/utils/enums';
import DetailSiderBar from '@/components/DetailSiderBar';
import ExchangeOrderModelTable from '@/components/ExchangeOrderModelTable';
import { TableListItem } from '@/pages/consumers/refund/data';
import ProTable from '@ant-design/pro-table';
import { ActionType } from '@ant-design/pro-table/lib/Table';
import { Map, Marker } from 'react-amap';
import { buttons, hasAuthority } from '@/utils/buttons';
import { ExclamationCircleOutlined } from '@ant-design/icons/lib';

interface DetailModalProps {
  batteryId: number | undefined;
  handleReturn: () => void;
}

const columns = [
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

const Details: FC<DetailModalProps> = (props) => {
  const actionRef = useRef<ActionType>();
  const [exchangeOrderTableVisible, setExchangeOrderTableVisible] = useState<boolean>(false);
  const [mapVisible, setMapVisible] = useState<boolean>(false);
  const { confirm } = Modal;

  const [detail, setDetail] = useState({});
  useEffect(() => {
    getBatteryDetail(props.batteryId).then((res) => {
      setDetail({ ...res.data.data });
    });
  }, []);
  const [faultInfoList, setFaultInfoList] = useState<object>([]);
  useEffect(() => {
    {
      detail.deviceCode != undefined &&
        getBatteryFaultRecord(detail.deviceCode).then((res) => {
          setFaultInfoList(res.data.data);
        });
    }
  }, [detail]);
  /**
   * 重新获取
   */
  const refreshOnClick = () => {
    getBatteryDetail(detail.id).then((res) => {
      setDetail({ ...res.data.data });
      message.success(res.data.message);
    });
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

  // 控制地图显示
  const showmodal = () => {
    setMapVisible(true);
  };
  const closemodal = () => {
    setMapVisible(false);
  };

  /**
   * 禁止骑行
   * @param record
   */
  const disableDischargeStatus = () => {
    confirm({
      title: '禁止骑行',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk: disableDischargeStatusOK,
    });
  };
  /**
   *
   */
  const disableDischargeStatusOK = () => {
    let params = {
      deviceCode: detail.deviceCode,
      dischargeEnable: 2,
    };
    changeDischargeEnable(params).then((res) => {
      message.success(res.data.message);
      getBatteryDetail(props.batteryId).then(res => {
        setDetail({...res.data.data})
      })
    });
  }

  /**
   * 允许骑行
   * @param record
   */
  const enableDischargeStatus = () => {
    confirm({
      title: '允许骑行',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk: enableDischargeStatusOK,
    });
  };
  /**
   *
   */
  const enableDischargeStatusOK = () => {
    let params = {
      deviceCode: detail.deviceCode,
      dischargeEnable: 1,
    };
    changeDischargeEnable(params).then((res) => {
      message.success(res.data.message);
      getBatteryDetail(props.batteryId).then(res => {
        setDetail({...res.data.data})
      })
    });

  };

  /**
   * 设置运维状态
   * @param record
   */
  const changeOperatorStatusLost = () => {
    confirm({
      title: '确认丢失',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk: changeOperatorStatusLostOK,
    });
  };
  const changeOperatorStatusLostOK = () => {
    let params = {
      id: props.batteryId,
      deviceCode: detail.deviceCode,
      operatingStatus: 2,
    };
    changeOperatingStatus(params).then((res) => {
      message.success(res.data.message);
      getBatteryDetail(props.batteryId).then(res => {
        setDetail({...res.data.data})
      })
    });
  }
  /**
   * 设置运维状态
   * @param record
   */
  const changeOperatorStatusRepair = () => {
    confirm({
      title: '确认故障',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk: changeOperatorStatusRepairOK,
    });
  };
  const changeOperatorStatusRepairOK = () => {
    let params = {
      id: props.batteryId,
      deviceCode: detail.deviceCode,
      operatingStatus: 4,
    };
    changeOperatingStatus(params).then((res) => {
      message.success(res.data.message);
      getBatteryDetail(props.batteryId).then(res => {
        setDetail({...res.data.data})
      })
    });
  }
  /**
   * 设置运维状态
   * @param record
   */
  const changeOperatorStatusNormal = () => {
    confirm({
      title: '恢复正常',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk: changeOperatorStatusNormalOK,
    });
  };
  const changeOperatorStatusNormalOK = () => {
    let params = {
      id: props.batteryId,
      deviceCode: detail.deviceCode,
      operatingStatus: 1,
    };
    changeOperatingStatus(params).then((res) => {
      message.success(res.data.message);
      getBatteryDetail(props.batteryId).then(res => {
        setDetail({...res.data.data})
      })
    });

  }


  return (
    <div>
      <DetailSiderBar handleReturn={props.handleReturn} />
      <Card title="基本信息"
            style={{ marginTop: '30px' }}
            extra={
              <>
                {hasAuthority(buttons.equipment.battery.index.operatorStatusLost) &&
                detail.operatingStatus != 2 && <a onClick={changeOperatorStatusLost}>丢失</a>}
                <>  </>
                {hasAuthority(buttons.equipment.battery.index.operatorStatusRepair) &&
                detail.operatingStatus != 4 && <a onClick={changeOperatorStatusRepair}>故障</a>}
                <>  </>
                {hasAuthority(buttons.equipment.battery.index.operatorStatusNormal) &&
                detail.operatingStatus != 1 && <a onClick={changeOperatorStatusNormal}>恢复正常</a>}
              </>
            }
      >
        <Descriptions column={2}>
          <Descriptions.Item label="电池编码">{detail.deviceCode}</Descriptions.Item>
          <Descriptions.Item label="IMEI号">{detail.imei}</Descriptions.Item>
          <Descriptions.Item label="CCID">{detail.simIccid}</Descriptions.Item>
          <Descriptions.Item label="供应商">{detail.supplierName}</Descriptions.Item>
          <Descriptions.Item label="批次">{detail.batchNo}</Descriptions.Item>
          <Descriptions.Item label="规格描述">
            {getEnumText(enums.BatterySpecificationEnum, detail.deviceSpecification)}
          </Descriptions.Item>
          <Descriptions.Item label="生产日期">{detail.productionDate}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card
        title="业务信息"
        style={{ marginTop: '30px' }}
        extra={
          <>
            {hasAuthority(buttons.equipment.battery.index.exchangeOrder) && (
              <a onClick={exchangeOrderInfoOnClick}>换电记录</a>
            )}
          </>
        }
      >
        <Descriptions column={2}>
          <Descriptions.Item label="电量">{detail.soc}</Descriptions.Item>
          <Descriptions.Item label="当前归属">
            {getEnumText(enums.OwnerTypeEnum, detail.ownerType)}
          </Descriptions.Item>
          <Descriptions.Item label="归属信息">{detail.ownerName}</Descriptions.Item>
          <Descriptions.Item label="归属变更时间">{detail.ownerChangeTime}</Descriptions.Item>
          <Descriptions.Item label="归属变更原因">
            {getEnumText(enums.OwnerChangeReasonEnum, detail.ownerChangeReason)}
          </Descriptions.Item>
          <Descriptions.Item label="位置信息">
            {hasAuthority(buttons.equipment.battery.index.point) && (
              <Button size="small" type="primary" onClick={showmodal}>
                查看
              </Button>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="电池异常码">{detail.batteryExceptionCode}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card
        title="状态信息"
        style={{ marginTop: '30px' }}
        extra={
          <>
            {hasAuthority(buttons.equipment.battery.index.disableDischarge) &&
              detail.dischargeEnable == 1 && <a onClick={disableDischargeStatus}>禁止骑行</a>}
            {hasAuthority(buttons.equipment.battery.index.enableDischarge) &&
              detail.dischargeEnable == 2 && <a onClick={enableDischargeStatus}>允许骑行</a>}
          </>
        }
      >
        <Descriptions column={2}>
          <Descriptions.Item label="是否在线">
            {getEnumText(enums.IsOnlineEnum, detail.isOnline)}
          </Descriptions.Item>
          <Descriptions.Item label="运维状态">
            {getEnumText(enums.BatteryOperationStatusEnum, detail.operatingStatus)}
          </Descriptions.Item>
          <Descriptions.Item label="是否可换电">
            {getEnumText(enums.BatteryExchangeEnableEnum, detail.exchangeEnable)}
          </Descriptions.Item>
          <Descriptions.Item label="是否可骑行">
            {getEnumText(enums.BatteryDischargeEnableEnum, detail.dischargeEnable)}
          </Descriptions.Item>
          <Descriptions.Item label="充电状态">
            {getEnumText(enums.ChargeStatusEnum, detail.chargeStatus)}
          </Descriptions.Item>
          <Descriptions.Item label="放电状态">
            {getEnumText(enums.BatteryDischargeStatusEnum, detail.dischargeStatus)}
          </Descriptions.Item>
          <Descriptions.Item label="实时电柜信息">{detail.cabinetDeviceCode}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{detail.updateTime}</Descriptions.Item>
          <Descriptions.Item label="禁用原因">{detail.forbidReason}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="实时数据" style={{ marginTop: '30px' }}>
        <Descriptions column={2}>
          <Descriptions.Item label="电池包状态">
            {getEnumText(enums.BatteryStatus, detail.batteryStatus)}
          </Descriptions.Item>
          <Descriptions.Item label="累计用电量">{detail.totalPower}</Descriptions.Item>
          <Descriptions.Item label="电池包总电压(V)">
            {detail.batteryTotalVoltage / 10}
          </Descriptions.Item>
          <Descriptions.Item label="电池包总电流">
            {detail.batteryTotalElectricity * 10}
          </Descriptions.Item>
          <Descriptions.Item label="最高单体电压(mV)">
            {detail.unitHighestVoltage}
          </Descriptions.Item>
          <Descriptions.Item label="最低单体电压(mV)">{detail.unitLowestVoltage}</Descriptions.Item>
          <Descriptions.Item label="平均单体电压(mV)">
            {detail.unitAverageVoltage}
          </Descriptions.Item>
          <Descriptions.Item label="BMS充放电循环次数">{detail.bmsLoopCount}</Descriptions.Item>
          <Descriptions.Item label="电池包最高温度(℃)">
            {detail.batteryHighestTemp}
          </Descriptions.Item>
          <Descriptions.Item label="电池包最低温度(℃)">
            {detail.batteryLowestTemp}
          </Descriptions.Item>
          <Descriptions.Item label="充放电MOS温度(℃)">{detail.mosTemp}</Descriptions.Item>
          <Descriptions.Item label="均衡电阻温度(℃)">
            {detail.equalResistanceTemp}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card
        title="电池历史信息"
        style={{ marginTop: '30px' }}
        extra={
          <>
            {hasAuthority(buttons.equipment.battery.index.reGet) && (
              <a style={{ marginLeft: 10 }} onClick={refreshOnClick}>
                重新获取
              </a>
            )}
          </>
        }
      >
        <Descriptions column={2}>
          <Descriptions.Item label="历史最高单体电压(mV)">
            {detail.historyUnitHighestVoltage}
          </Descriptions.Item>
          <Descriptions.Item label="历史最低单体电压(mV)">
            {detail.historyUnitLowestVoltage}
          </Descriptions.Item>
          <Descriptions.Item label="历史最大单体压差(mV)">
            {detail.historyMaxDifferenceVoltage}
          </Descriptions.Item>
          <Descriptions.Item label="历史最高温度(℃)">{detail.historyHighestTemp}</Descriptions.Item>
          <Descriptions.Item label="历史最低温度(℃)">{detail.historyLowestTemp}</Descriptions.Item>
          <Descriptions.Item label="历史最大充电电流(mA)">
            {detail.historyHighestDischargeElectricity * 10}
          </Descriptions.Item>
          <Descriptions.Item label="历史最大放电电流(mA)">
            {detail.historyHighestChargeElectricity * 10}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">{detail.hisUpdateTime}</Descriptions.Item>
        </Descriptions>
        <Card title="故障报告" style={{ marginTop: '30px' }}>
          <ProTable<TableListItem>
            bordered
            options={{
              density: false,
              fullScreen: false,
              reload: false,
              setting: false,
            }}
            actionRef={actionRef}
            rowKey="id"
            columns={columns}
            search={false}
            dataSource={faultInfoList}
            pagination={false}
          />
        </Card>
      </Card>
      {exchangeOrderTableVisible && (
        <ExchangeOrderModelTable
          closeModel={exchangeOrderTableClose}
          batteryDeviceCode={detail.deviceCode}
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
