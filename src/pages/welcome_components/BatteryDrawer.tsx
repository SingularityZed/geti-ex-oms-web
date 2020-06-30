import React, { FC, useEffect, useState } from 'react';
import { Drawer, Form, Select, Card, Result, Spin } from 'antd';
import { Chart } from '@antv/g2';
import battery from '@/static/battery.jpg';
import { getBatteryData } from '@/services/businessMonitor';
import BatteryCard from './BatteryCard';

interface BatteryDrawerProps {
  orgdata: any;
  onCancel: () => void;
  isPlatform: boolean;
}

const BatteryDrawer: FC<BatteryDrawerProps> = (props) => {
  const organizationOptions = props.orgdata;
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };
  const [batterydata, setbatterydata] = useState<object>({});
  const [batteryloading, setbatteryloading] = useState<boolean>(true);
  const [batterysuccess, setbatterysuccess] = useState<boolean>();
  const loaddrawer = () => {};
  const createChart = (container, percent) => {
    document.getElementById(container).innerHTML = '';
    const chart = new Chart({
      container,
      autoFit: true,
      height: 100,
    });
    chart.tooltip(false);
    chart.legend(false);
    chart.coordinate('theta', {
      radius: 0.75,
      innerRadius: 0.4,
    });
    chart
      .interval()
      .adjust('stack')
      .position('value')
      .color('type', ['#3fd7d9', '#6988f9'])
      .style({ opacity: 0.4 });
    chart.data([
      { type: '1', value: percent },
      { type: '2', value: 100 - percent },
    ]);
    chart.render();
    return chart;
  };
  const operatedata = (data) => {
    setbatterysuccess(true);
    setbatterydata(data);
    createChart('circle3', data.lastMonthPercent);
    createChart('circle4', data.currentMonthPercent);
    setbatteryloading(false);
  };
  useEffect(() => {
    getBatteryData()
      .then((r) => {
        const { data } = r.data;
        operatedata(data);
      })
      .catch((r) => {
        setbatterysuccess(false);
      });
  }, []);
  const batteryhandleChange = (value) => {
    setbatteryloading(true);
    let merchantId = value;
    if (value === 10000) merchantId = null;
    getBatteryData({ merchantId })
      .then((r) => {
        const { data } = r.data;
        operatedata(data);
      })
      .catch((r) => {
        setbatterysuccess(false);
      });
  };
  const toThousands = (num) => {
    let newStr = '';
    let count = 0;
    // 当数字是整数
    let str = `${num}`;
    if (str.indexOf('.') === -1) {
      for (let i = str.length - 1; i >= 0; i -= 1) {
        if (count % 3 === 0 && count !== 0) {
          newStr = `${str.charAt(i)},${newStr}`;
        } else {
          newStr = str.charAt(i) + newStr;
        }
        count += 1;
      }
      str = newStr; // 自动补小数点后两位
      return str;
    }
    // 当数字带有小数

    for (let i = str.indexOf('.') - 1; i >= 0; i -= 1) {
      if (count % 3 === 0 && count !== 0) {
        newStr = `${str.charAt(i)},${newStr}`;
      } else {
        newStr = str.charAt(i) + newStr; // 逐个字符相接起来
      }
      count += 1;
    }
    str = newStr + `${str}00`.substr(`${str}00`.indexOf('.'), 3);
    return str;
  };
  return (
    <Drawer
      width="50%"
      visible
      title="电池详情"
      placement="right"
      afterVisibleChange={loaddrawer}
      closable={false}
      onClose={props.onCancel}
      destroyOnClose
    >
      {batterysuccess === false && <Result status={500} title="抱歉，服务器出错了" />}
      {batterysuccess === true && (
        <>
          {props.isPlatform && (
            <Form {...layout} style={{ marginLeft: '20%', width: '80%' }}>
              <Form.Item name="name" label="运营商选择">
                <Select defaultValue={10000} style={{ width: 300 }} onChange={batteryhandleChange}>
                  {organizationOptions}
                </Select>
              </Form.Item>
            </Form>
          )}
          <div style={{ marginLeft: '5%' }}>
            <Card style={{ width: '40%', float: 'left', marginRight: '50%', marginBottom: '10px' }}>
              <div style={{ width: '30%', float: 'left' }}>
                <img src={battery} alt="123" style={{ marginTop: '10px' }} />
              </div>
              <div style={{ width: '60%', float: 'left' }}>
                <p style={{ fontSize: '14px', marginBottom: '0px' }}>总电池数</p>
                <span style={{ fontSize: '30px', fontWeight: 800 }}>
                  <Spin spinning={batteryloading}>
                    {!batteryloading && <>{toThousands(batterydata.totalCount)}</>}
                  </Spin>
                </span>
              </div>
            </Card>
            <BatteryCard
              name="柜内电池数"
              number={batterydata.inCabinet}
              batteryloading={batteryloading}
            />
            <BatteryCard
              name="用户手中电池数"
              number={batterydata.inConsumer}
              batteryloading={batteryloading}
            />
            <BatteryCard
              name="禁用电池数"
              number={batterydata.disableCount}
              batteryloading={batteryloading}
            />
            <BatteryCard
              name="超15天未上报电池数"
              number={batterydata.missMsgCount}
              batteryloading={batteryloading}
            />
            <BatteryCard
              name="本月流转电池数"
              number={batterydata.currentMonthCount}
              batteryloading={batteryloading}
            />
            <BatteryCard
              name="上月流转电池数"
              number={batterydata.lastMonthCount}
              batteryloading={batteryloading}
            />
            <Card style={{ width: '40%', float: 'left', marginRight: '5%', marginBottom: '10px' }}>
              <div style={{ width: '50%', float: 'left' }}>
                <p style={{ fontSize: '16px', marginBottom: '0px' }}>上月流转效率</p>
                <Spin spinning={batteryloading}>
                  {!batteryloading && (
                    <>
                      {' '}
                      <span
                        style={{ fontSize: '24px', fontWeight: 800 }}
                      >{`${batterydata.lastMonthPercent}%`}</span>
                    </>
                  )}
                </Spin>
              </div>
              <div style={{ width: '40%', float: 'left' }}>
                <div id="circle3" style={{ width: '100px' }} />
              </div>
            </Card>
            <Card style={{ width: '40%', float: 'left', marginBottom: '10px' }}>
              <div style={{ width: '50%', float: 'left' }}>
                <p style={{ fontSize: '16px', marginBottom: '0px' }}>本月流转效率</p>
                <Spin spinning={batteryloading}>
                  {!batteryloading && (
                    <>
                      {' '}
                      <span
                        style={{ fontSize: '24px', fontWeight: 800 }}
                      >{`${batterydata.currentMonthPercent}%`}</span>
                    </>
                  )}
                </Spin>
              </div>
              <div style={{ width: '40%', float: 'left' }}>
                <div id="circle4" style={{ width: '100px' }} />
              </div>
            </Card>
          </div>
        </>
      )}
    </Drawer>
  );
};
export default BatteryDrawer;
