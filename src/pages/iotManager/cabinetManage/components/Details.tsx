import { Card, Descriptions, Table, Tag, Tooltip, Modal, Space } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { getCabinetDetail } from '@/services/device';
import DetailSiderBar from '@/components/DetailSiderBar';

interface DetailModalProps {
  cabinetId: number | undefined;
  handleReturn: () => void;
}

const Details: FC<DetailModalProps> = (props) => {
  const { handleReturn, cabinetId } = props;
  const [cabinetInfo, setCabinetInfo] = useState({});
  const [cabinetPhysicalInfo, setCabinetPhysicalInfo] = useState({});
  const [cabinetPowerInfo, setCabinetPowerInfo] = useState({});
  const [listdata, setlistdata] = useState<any>([]);
  const [detail, setdetail] = useState<any>({});
  const [DetailsVisible, setDetailsVisible] = useState<boolean>(false);
  const detailOnClick = (record: any) => {
    setDetailsVisible(true);
    setdetail(record);
  };
  const cancel = () => {
    setDetailsVisible(false);
  };
  useEffect(() => {
    getCabinetDetail(cabinetId).then((res) => {
      setlistdata(res.data.data.cabinetBatteryRoomInfos);
      setCabinetInfo(res.data.data.cabinetInfo);
      setCabinetPhysicalInfo(res.data.data.cabinetPhysicalInfo);
      setCabinetPowerInfo(res.data.data.cabinetPowerInfo);
    });
  }, []);
  useEffect(() => {
  }, [listdata]);
  const columns = [
    {
      title: '格口编号',
      dataIndex: 'gridId',
      render: (text) => text + 1,
      align: 'center',
    },
    {
      title: '电池编号',
      dataIndex: 'batteryDeviceCode',
      align: 'center',
    },
    {
      title: '隔口是否禁用',
      dataIndex: 'gridForbidden',
      render: (text) => (text===true ? '是' : '否'),
      align: 'center',
    },
    {
      title: '隔口内锁',
      dataIndex: 'gridInLock',
      render: (text) => (text == 0 ? '关' : '开'),
      align: 'center',
    },
    {
      title: '隔口外锁',
      dataIndex: 'gridOutLock',
      render: (text) => (text == 0 ? '关' : '开'),
      align: 'center',
    },
    {
      title: '电池是否充电中',
      dataIndex: 'batteryIsCharging',
      render: (text) => (text ? '是' : '否'),
      align: 'center',
    },
    {
      title: '电量(%)',
      dataIndex: 'batterySoc',
      align: 'center',
    },
    {
      title: '充电器故障码',
      dataIndex: 'chargeFaultCode',
      render: (_, record) => (
        <>
          {record.chargeFaultCodeMap && (
            <Tooltip
              placement="top"
              title={
                record.chargeFaultCodeMap &&
                Object.keys(record.chargeFaultCodeMap).map((item) => {
                  return record.chargeFaultCodeMap[item];
                })
              }
            >
              <Tag color="#2db7f5">查看详细</Tag>
            </Tooltip>
          )}
        </>
      ),
      align: 'center',
    },
    {
      title: '格口故障码',
      dataIndex: 'gridFaultCode',
      render: (_, record) => (
        <>
          {record.gridFaultCodeMap && (
            <Tooltip
              placement="top"
              title={
                record.gridFaultCodeMap &&
                Object.keys(record.gridFaultCodeMap).map((item) => {
                  return record.gridFaultCodeMap[item];
                })
              }
            >
              <Tag color="#2db7f5">查看详细</Tag>
            </Tooltip>
          )}
        </>
      ),
      align: 'center',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      align: 'center',
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      render: (_, record) => (
        <>
          <Space>
            <a onClick={detailOnClick.bind(_, record)}>详情</a>
          </Space>
        </>
      ),
    },
  ];
  return (
    <div>
      <DetailSiderBar handleReturn={handleReturn} />
      <Card title="电柜信息">
        <Descriptions column={2}>
          <Descriptions.Item label="设备号">{cabinetInfo.deviceCode}</Descriptions.Item>
          <Descriptions.Item label="格口总数">{cabinetInfo.gridNum}</Descriptions.Item>
          <Descriptions.Item label="imei编号">{cabinetInfo.imei}</Descriptions.Item>
          <Descriptions.Item label="在线状态">
            {cabinetInfo.isOnline === false ? '离线' : '在线'}
          </Descriptions.Item>
          <Descriptions.Item label="安全板版本号">
            {cabinetInfo.secureBoardVersion}
          </Descriptions.Item>
          <Descriptions.Item label="信号强度">{cabinetInfo.signalStrength}</Descriptions.Item>
          <Descriptions.Item label="SIM卡号">{cabinetInfo.simIccid}</Descriptions.Item>
          <Descriptions.Item label="通信信号类型">{cabinetInfo.signalType}</Descriptions.Item>
          <Descriptions.Item label="最近断网重启记录">
            {cabinetInfo.recentRestartTimes}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="电柜状态信息" style={{ marginTop: '30px' }}>
        <Descriptions column={2}>
          <Descriptions.Item label="设备号">{cabinetPhysicalInfo.deviceCode}</Descriptions.Item>
          <Descriptions.Item label="黑烟浓度(%)">
            {cabinetPhysicalInfo.blackSmoke}
          </Descriptions.Item>
          <Descriptions.Item label="烟雾传感器通信异常">
            {cabinetPhysicalInfo.smokeSensorFault}
          </Descriptions.Item>
          <Descriptions.Item label="电柜温度(℃)">{cabinetPhysicalInfo.tmp}</Descriptions.Item>
          <Descriptions.Item label="逻辑板是否离线">
            {cabinetPhysicalInfo.logicBoardOffline}
          </Descriptions.Item>
          <Descriptions.Item label="是否断电">{cabinetPhysicalInfo.powerOff}</Descriptions.Item>
          <Descriptions.Item label="是否浸泡">{cabinetPhysicalInfo.soak}</Descriptions.Item>
          <Descriptions.Item label="白烟浓度(%)">
            {cabinetPhysicalInfo.whiteSmoke}
          </Descriptions.Item>
          <Descriptions.Item label="温湿度传感器通信异常">
            {cabinetPhysicalInfo.temHumSensorFault}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">{cabinetPhysicalInfo.updateTime}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="电柜耗电量记录" style={{ marginTop: '30px' }}>
        <Descriptions column={2}>
          <Descriptions.Item label="设备编号">{cabinetPowerInfo.deviceCode}</Descriptions.Item>
          <Descriptions.Item label="上报电量">{cabinetPowerInfo.power}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{cabinetPowerInfo.updateTime}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="电柜详情" style={{ marginTop: '30px' }}>
        <Table columns={columns} dataSource={listdata} pagination={false} />
      </Card>
      <Modal width={800} title="格口详情" visible={DetailsVisible} onOk={cancel} onCancel={cancel}>
        <Descriptions column={2}>
          <Descriptions.Item label="电池编号">{detail.batteryDeviceCode}</Descriptions.Item>
          <Descriptions.Item label="电池是否充电中">
            {detail.batteryIsCharging ? '是' : '否'}
          </Descriptions.Item>
          <Descriptions.Item label="电池历史高温">{detail.batteryMaxTemp}</Descriptions.Item>
          <Descriptions.Item label="电池历史低温">{detail.batteryMinTemp}</Descriptions.Item>
          <Descriptions.Item label="电池mos温度">{detail.batteryMosTemp}</Descriptions.Item>
          <Descriptions.Item label="电池soc(%)">{detail.batterySoc}</Descriptions.Item>
          <Descriptions.Item label="电池信息更新时间">{detail.batteryUpdateTime}</Descriptions.Item>
          <Descriptions.Item label="电池电压">{detail.batteryVoltage}</Descriptions.Item>
          <Descriptions.Item label="充电器电流">{detail.chargeElectric}</Descriptions.Item>
          <Descriptions.Item label="充电器故障码">{detail.chargeFaultCode}</Descriptions.Item>
          <Descriptions.Item label="充电器故障">{detail.gridFaultCodeMap && Object.keys(detail.gridFaultCodeMap).map((item) => detail.gridFaultCodeMap[item])}</Descriptions.Item>
          <Descriptions.Item label="充电器硬件版本">{detail.chargeHVersion}</Descriptions.Item>
          <Descriptions.Item label="充电器电池充电功率">{detail.chargePower}</Descriptions.Item>
          <Descriptions.Item label="充电器软件版本">{detail.chargeSVersion}</Descriptions.Item>
          <Descriptions.Item label="充电器状态">{detail.chargeStatus}</Descriptions.Item>
          <Descriptions.Item label="充电器信息更新时间">
            {detail.chargeUpdateTime}
          </Descriptions.Item>
          <Descriptions.Item label="充电器电压">{detail.chargeVoltage}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{detail.createTime}</Descriptions.Item>
          <Descriptions.Item label="柜子设备编号">{detail.deviceCode}</Descriptions.Item>
          <Descriptions.Item label="隔口故障码">{detail.deviceCode}</Descriptions.Item>
          <Descriptions.Item label="隔口内锁开关状态">
            {detail.gridInLock ? '开' : '关'}
          </Descriptions.Item>
          <Descriptions.Item label="隔口外锁开关状态">
            {detail.gridOutLock ? '开' : '关'}
          </Descriptions.Item>
          <Descriptions.Item label="隔口信息更新时间">{detail.gridUpdateTime}</Descriptions.Item>
          <Descriptions.Item label="隔口故障信息">{detail.gridFaultCodeMap && Object.keys(detail.gridFaultCodeMap).map((item) => detail.gridFaultCodeMap[item])}</Descriptions.Item>
          <Descriptions.Item label="副柜设备号(p06)">{detail.subDeviceCode}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{detail.updateTime}</Descriptions.Item>
        </Descriptions>
      </Modal>
    </div>
  );
};

export default Details;
