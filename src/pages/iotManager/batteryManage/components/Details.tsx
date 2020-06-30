import { Card, Descriptions,Button, Modal} from 'antd';
import React, { FC, useState, useEffect } from 'react';
import DetailSiderBar from '@/components/DetailSiderBar';
import { Map, Marker } from 'react-amap';
import { TableListItem } from '../data';
import {enums,getEnumText} from "@/utils/enums";
import { BatteryDetail } from '@/services/device';

interface OperationModalProps {
  done: boolean;
  visible: boolean;
  current: Partial<TableListItem> | undefined;
  code: string | undefined
  onCancel: () => void;
  handleReturn: () => void;
}
const Details: FC<OperationModalProps> = (props) => {
  const {code,handleReturn} = props;
  const [data,setdata] =useState<object>();
  const [visible,setvisible] = useState<boolean>(false);
  useEffect(() => {
    BatteryDetail(code).then((res) => {
      setdata(res.data.data)
    })
  }, []);
  // 控制地图显示
  const showmodal= () =>{
    setvisible(true)
  }
  const closemodal = () =>{
    setvisible(false)
  }
    return (
      <div>
        <DetailSiderBar handleReturn={handleReturn}/>
        <Card title="电池出厂数据">
          {data&&<Descriptions column={2}>
            <Descriptions.Item label="AT固件版本">{data.batteryFactoryInfoInfo.atFirmwareVersion}</Descriptions.Item>
            <Descriptions.Item label="电池标称电压(V)">{data.batteryFactoryInfoInfo.batteryNominalVoltage/10}</Descriptions.Item>
            <Descriptions.Item label="电池标称容量(mAh)">{data.batteryFactoryInfoInfo.batteryRatedCapacity*10}</Descriptions.Item>
            <Descriptions.Item label="电池类型">{getEnumText(enums.ModelProperty,data.batteryFactoryInfoInfo.batteryType)}</Descriptions.Item>
            <Descriptions.Item label="BCU硬件版本">{data.batteryFactoryInfoInfo.bcuHardwareVersion}</Descriptions.Item>
            <Descriptions.Item label="BCU硬件更新日期">{data.batteryFactoryInfoInfo.bcuHwUpdateTime}</Descriptions.Item>
            <Descriptions.Item label="BMS硬件版本">{data.batteryFactoryInfoInfo.bcuHardwareVersion}</Descriptions.Item>
            <Descriptions.Item label="BMS软件版本">{data.batteryFactoryInfoInfo.bmsSoftwareVersion}</Descriptions.Item>
            <Descriptions.Item label="电芯串数">{data.batteryFactoryInfoInfo.cellSum}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{data.batteryFactoryInfoInfo.createTime}</Descriptions.Item>
            <Descriptions.Item label="设备号">{data.batteryFactoryInfoInfo.deviceCode}</Descriptions.Item>
            <Descriptions.Item label="IMEI码">{data.batteryFactoryInfoInfo.imei}</Descriptions.Item>
            <Descriptions.Item label="生产日期">{data.batteryFactoryInfoInfo.productionDate}</Descriptions.Item>
            <Descriptions.Item label="温度传感器个数">{data.batteryFactoryInfoInfo.tempSensorCount}</Descriptions.Item>
          </Descriptions>}
        </Card>
        <Card title="电池故障信息" style={{marginTop:"30px"}}>
          {data&&<Descriptions column={2}>
            <Descriptions.Item label="创建时间">{data.batteryFaultInfo.createTime}</Descriptions.Item>
            <Descriptions.Item label="设备号">{data.batteryFaultInfo.deviceCode}</Descriptions.Item>
            <Descriptions.Item label="故障码">{data.batteryFaultInfo.faultCode?JSON.parse(data.batteryFaultInfo.faultCode).join(','):''}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{data.batteryFaultInfo.updateTime}</Descriptions.Item>
            <Descriptions.Item label="故障详情">{data.batteryFaultInfo.faultCode?JSON.parse(data.batteryFaultInfo.faultCode).map(item=>data.batteryFaultInfo.maps[item]).join(','):''}</Descriptions.Item>
          </Descriptions>}
        </Card>
        <Card title="电池心跳信息" style={{marginTop:"30px"}}>
          {data&&<Descriptions column={2}>
            <Descriptions.Item label="设备号">{data.batteryHeartbeatInfo.deviceCode}</Descriptions.Item>
            <Descriptions.Item label="bms故障数">{data.batteryHeartbeatInfo.bmsFaultNum}</Descriptions.Item>
            <Descriptions.Item label="GRPS信号强度">{data.batteryHeartbeatInfo.gprsSignalStrength}</Descriptions.Item>
            <Descriptions.Item label="GPS搜星数">{data.batteryHeartbeatInfo.gpsSatelliteNum}</Descriptions.Item>
            <Descriptions.Item label="加速度传感器-x轴">{data.batteryHeartbeatInfo.gsSensorX}</Descriptions.Item>
            <Descriptions.Item label="加速度传感器-Y轴">{data.batteryHeartbeatInfo.gsSensorY}</Descriptions.Item>
            <Descriptions.Item label="加速度传感器-Z轴">{data.batteryHeartbeatInfo.gsSensorZ}</Descriptions.Item>
            <Descriptions.Item label="霍尔传感器状态">{data.batteryHeartbeatInfo.hallSensorStatus}</Descriptions.Item>
            <Descriptions.Item label="霍尔传感器开关">{data.batteryHeartbeatInfo.hallSensorSwitch}</Descriptions.Item>
            <Descriptions.Item label="IMEI码">{data.batteryHeartbeatInfo.imei}</Descriptions.Item>
            <Descriptions.Item label="纬度(°)">{data.batteryHeartbeatInfo.latitude}</Descriptions.Item>
            <Descriptions.Item label="经度(°)">{data.batteryHeartbeatInfo.longitude}</Descriptions.Item>
            <Descriptions.Item label="磁场状态检测">{data.batteryHeartbeatInfo.magneticFieldStatus}</Descriptions.Item>
            <Descriptions.Item label="SIM卡ICCID">{data.batteryHeartbeatInfo.singleCycleDistance}</Descriptions.Item>
            <Descriptions.Item label="速度(Km/h)">{data.batteryHeartbeatInfo.speed}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{data.batteryHeartbeatInfo.updateTime}</Descriptions.Item>
            <Descriptions.Item label="详细地址">{data.batteryHeartbeatInfo.address}</Descriptions.Item>
            <Descriptions.Item label="位置信息">
              <Button size="small" type="primary" onClick={showmodal}>去地图</Button>
              </Descriptions.Item>
            <Descriptions.Item label="地址更新时间">{data.batteryHeartbeatInfo.regionUpdateTime}</Descriptions.Item>
          </Descriptions>}
        </Card>
        <Card title="电池历史数据" style={{marginTop:"30px"}}>
          {data&&<Descriptions column={2}>
            <Descriptions.Item label="设备号">{data.batteryHistoryRecordInfo.deviceCode}</Descriptions.Item>
            <Descriptions.Item label="历史最大放电电流(mA)">{data.batteryHistoryRecordInfo.historyHighestChargeElectricity*10}</Descriptions.Item>
            <Descriptions.Item label="历史最大充电电流(mA)">{data.batteryHistoryRecordInfo.historyHighestDischargeElectricity*10}</Descriptions.Item>
            <Descriptions.Item label="历史最高温度(℃)">{data.batteryHistoryRecordInfo.historyHighestTemp}</Descriptions.Item>
            <Descriptions.Item label="历史最低温度(℃)">{data.batteryHistoryRecordInfo.historyLowestTemp}</Descriptions.Item>
            <Descriptions.Item label="历史最大单体压差(℃)">{data.batteryHistoryRecordInfo.historyMaxDifferenceVoltage}</Descriptions.Item>
            <Descriptions.Item label="历史最高单体电压(mV)">{data.batteryHistoryRecordInfo.historyUnitHighestVoltage}</Descriptions.Item>
            <Descriptions.Item label="历史最低单体电压(mV)">{data.batteryHistoryRecordInfo.historyUnitLowestVoltage}</Descriptions.Item>
            <Descriptions.Item label="IMEI码">{data.batteryHistoryRecordInfo.imei}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{data.batteryHistoryRecordInfo.updateTime}</Descriptions.Item>
          </Descriptions>}
        </Card>
        <Card title="电池数据" style={{marginTop:"30px"}}>
          {data&&<Descriptions column={2}>
            <Descriptions.Item label="设备号">{data.batteryInfo.deviceCode}</Descriptions.Item>
            <Descriptions.Item label="产品ID">{data.batteryInfo.productId}</Descriptions.Item>
            <Descriptions.Item label="IMEI码">{data.batteryInfo.imei}</Descriptions.Item>
            <Descriptions.Item label="设备在线状态">{getEnumText(enums.BatteryStatusIsOnline,data.batteryInfo.isOnline)}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{data.batteryInfo.updateTime}</Descriptions.Item>
          </Descriptions>}
          <Card title="电池信息" style={{marginTop:"30px"}}>
          {data&&<Descriptions column={2}>
            <Descriptions.Item label="电池最高温度(℃)">{data.batteryInfoInfo.batteryHighestTemp}</Descriptions.Item>
            <Descriptions.Item label="电池最低温度(℃)">{data.batteryInfoInfo.batteryLowestTemp}</Descriptions.Item>
            <Descriptions.Item label="电池包状态">{getEnumText(enums.BatteryStatus,data.batteryInfoInfo.batteryStatus)}</Descriptions.Item>
            <Descriptions.Item label="总电压(V)">{data.batteryInfoInfo.batteryTotalVoltage/10}</Descriptions.Item>
            <Descriptions.Item label="BMS充放电循环次数">{data.batteryInfoInfo.bmsLoopCount}</Descriptions.Item>
            <Descriptions.Item label="充电MOS状态">{getEnumText(enums.ChargeStatus,data.batteryInfoInfo.chargeMosStatus)}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{data.batteryInfoInfo.createTime}</Descriptions.Item>
            <Descriptions.Item label="瞬时功率">{data.batteryInfoInfo.currentPower}</Descriptions.Item>
            <Descriptions.Item label="设备号">{data.batteryInfoInfo.deviceCode}</Descriptions.Item>
            <Descriptions.Item label="放电MOS状态">{getEnumText(enums.ChargeStatus,data.batteryInfoInfo.dischargeMosStatus)}</Descriptions.Item>
            <Descriptions.Item label="均衡电阻温度(℃)">{data.batteryInfoInfo.equalResistanceTemp}</Descriptions.Item>
            <Descriptions.Item label="IMEI码">{data.batteryInfoInfo.imei}</Descriptions.Item>
            <Descriptions.Item label="MOS温度(℃)">{data.batteryInfoInfo.mosTemp}</Descriptions.Item>
            <Descriptions.Item label="电量(%)">{data.batteryInfoInfo.soc}</Descriptions.Item>
            <Descriptions.Item label="累计用电量">{data.batteryInfoInfo.totalPower||'——'}</Descriptions.Item>
            <Descriptions.Item label="最高单体电压(mV)">{data.batteryInfoInfo.unitHighestVoltage}</Descriptions.Item>
            <Descriptions.Item label="平均单体电压(mV)">{data.batteryInfoInfo.unitAverageVoltage}</Descriptions.Item>
            <Descriptions.Item label="最高单体编码">{data.batteryInfoInfo.unitHighestCode}</Descriptions.Item>
            <Descriptions.Item label="最低单体电压(mV)">{data.batteryInfoInfo.unitLowestVoltage}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{data.batteryInfoInfo.updateTime}</Descriptions.Item>
          </Descriptions>}
        </Card>
        </Card>
        <Modal visible={visible} title='电池位置' onOk={closemodal} onCancel={closemodal} width='60%'>
        <div style={{ width: '100%', height: '350px', position: 'relative' }}>
          {data&&<Map amapkey="309d27a9a912a6011ecf07aff92e8e2d" zoom={16} center={[data.batteryHeartbeatInfo.longitude,data.batteryHeartbeatInfo.latitude]}>
            <Marker position={[data.batteryHeartbeatInfo.longitude,data.batteryHeartbeatInfo.latitude]}/>
          </Map>}
        </div>
        </Modal>
      </div>
    );
};

export default Details;
