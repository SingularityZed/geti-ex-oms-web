import React, { FC, useEffect, useState } from 'react';
import { Drawer, Form, Select, Card, Result, Spin, Tooltip } from 'antd';
import {
  getErrorExchangeData,
  getExceptionExchangeData,
  getExchangeRushHourData,
  getDistanceSocData,
} from '@/services/businessMonitor';
import { Chart } from '@antv/g2';
import styles from './Style.less';
import { InfoCircleOutlined } from '@ant-design/icons';

interface OrderDrawerProps {
  orgdata: any;
  onCancel: () => void;
  isPlatform: boolean;
}

const OrderDrawer: FC<OrderDrawerProps> = (props) => {
  const [merchantid, setmerchantid] = useState<number>();
  // 行驶与用电量分析状态
  const [driverloading, setdriverloading] = useState<boolean>(true);
  const [driversuccess, setdriversuccess] = useState<boolean>();
  const [drivedateType, setdrivedateType] = useState<number>(1);
  const [driveweekchecked, setdriveweekchecked] = useState<boolean>(true);
  const [drivemonthchecked, setdrivemonthchecked] = useState<boolean>(false);
  const [driveyearchecked, setdriveyearchecked] = useState<boolean>(false);
  // 时段状态
  const [timeloading, settimeloading] = useState<boolean>(true);
  const [timesuccess, settimesuccess] = useState<boolean>();
  const [ordertimedateType, setordertimedateType] = useState<number>(0);
  const [ordertimetodaychecked, setordertimetodaychecked] = useState<boolean>(true);
  const [ordertimeweekchecked, setordertimeweekchecked] = useState<boolean>(false);
  const [ordertimemonthchecked, setordertimemonthchecked] = useState<boolean>(false);
  const [ordertimeyearchecked, setordertimeyearchecked] = useState<boolean>(false);
  // 订单状态
  const [orderloading, setorderloading] = useState<boolean>(true);
  const [ordersuccess, steordersuccess] = useState<boolean>();
  const [orderdateType, setorderdateType] = useState<number>(1);
  const [orderweekchecked, setorderweekchecked] = useState<boolean>(true);
  const [ordermonthchecked, setordermonthchecked] = useState<boolean>(false);
  const [orderyearchecked, setorderyearchecked] = useState<boolean>(false);
  // 故障状态
  const [faultloading, setfaultloading] = useState<boolean>(true);
  const [faultsuccess, setfaultsuccess] = useState<boolean>();
  const [faultorderdateType, setfaultorderdateType] = useState<number>(1);
  const [faultorderweekchecked, setfaultorderweekchecked] = useState<boolean>(true);
  const [faultordermonthchecked, setfaultordermonthchecked] = useState<boolean>(false);
  const [faultorderyearchecked, setfaultorderyearchecked] = useState<boolean>(false);
  const organizationOptions = props.orgdata;
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  const loaddrawer = () => {};
  const createline = (container, data, type) => {
    document.getElementById(container).innerHTML = '';
    const chart = new Chart({
      container,
      autoFit: true,
      height: 300,
      padding: [20, 20, 50, 50],
    });

    chart.data(data);
    chart.tooltip({
      showCrosshairs: true, // 展示 Tooltip 辅助线
      shared: true,
    });

    chart.line().position(type);
    chart.point().position(type);

    chart.render();
  };
  const createtwoline = (container, data, type, name) => {
    document.getElementById(container).innerHTML = '';
    const chart = new Chart({
      container,
      autoFit: true,
      height: 300,
      padding: [20, 20, 50, 50],
    });

    chart.data(data);

    chart.tooltip({
      showCrosshairs: true,
      shared: true,
    });

    chart.line().position(type).color(name);

    chart.point().position(type).color(name);

    chart.render();
  };
  const operatefaultdata = (data) => {
    const faultdata = [];
    for (let item = 0; item < data.length; item++) {
      faultdata.push({
        date: data[item].date.substr(data[item].date.length - 5, 5),
        num: data[item].totalTimes,
        name: '换电订单',
      });
      faultdata.push({
        date: data[item].date.substr(data[item].date.length - 5, 5),
        num: data[item].errorTimes,
        name: '故障订单',
      });
    }
    setfaultsuccess(true);
    setfaultloading(false);
    createtwoline('fault', faultdata, 'date*num', 'name');
  };
  const operateordertimedata = (data) => {
    const ordertimedata = [];
    for (let item = 0; item < data.length; item++) {
      ordertimedata.push({ hour: data[item].hour, 换电订单: data[item].exchangeOrderTimes });
    }
    settimesuccess(true);
    settimeloading(false);
    createline('time', ordertimedata, 'hour*换电订单');
  };
  const operateorderdata = (data) => {
    const orderdata = [];
    for (let item = 0; item < data.length; item++) {
      orderdata.push({
        date: data[item].date.substr(data[item].date.length - 5, 5),
        num: data[item].totalTimes,
        name: '换电订单',
      });
      orderdata.push({
        date: data[item].date.substr(data[item].date.length - 5, 5),
        num: data[item].exceptionTimes,
        name: '异常订单',
      });
    }
    steordersuccess(true);
    setorderloading(false);
    createtwoline('order', orderdata, 'date*num', 'name');
  };
  const creatGrouphistogram = (container, data, type) => {
    document.getElementById(container).innerHTML = '';
    const chart = new Chart({
      container,
      autoFit: true,
      height: 260,
      padding: [30, 50, 50, 60],
    });
    chart.data(data);
    chart.scale({
      kwh: {
        alias: '用电量(kW·h)',
        min: 0,
      },
      distance: {
        alias: '行驶里程(km)',
        min: 0,
      },
    });
    chart.tooltip({
      showMarkers: false,
      showTitle: true, // 关闭标题
      showCrosshairs: true,
      shared: true,
    });
    chart.interval().position('date*distance').color('#1770d6');
    chart.line().position('date*kwh').color('#13C2C2');

    chart.point().position('date*kwh').tooltip(false);
    chart.legend({
      custom: true,
      items: [
        {
          value: '用电量',
          name: '用电量',
          marker: {
            style: {
              fill: '#13C2C2',
            },
          },
        },
        {
          value: '行驶里程',
          name: '行驶里程',
          marker: {
            style: {
              fill: '#1770d6',
            },
          },
        },
      ],
    });
    chart.render();
  };
  const operatordrivedata = (data) => {
    let drivedata = [];
    for (let item = 0; item < data.length; item += 1) {
      drivedata.push({
        date: data[item].date.substr(data[item].date.length - 5, 5),
        kwh: Number(data[item].kwh),
        distance: Number(data[item].distance),
      });
    }
    setdriversuccess(true);
    setdriverloading(false);
    creatGrouphistogram('drive', drivedata, 'date*num');
  };
  useEffect(() => {
    getErrorExchangeData({ dateType: 1 })
      .then((r) => {
        let { data } = r.data;
        operatefaultdata(data);
      })
      .catch((r) => {
        setfaultsuccess(false);
      });
    getExceptionExchangeData({ dateType: 1 })
      .then((r) => {
        let { data } = r.data;
        operateorderdata(data);
      })
      .catch((r) => {
        steordersuccess(false);
      });
    getExchangeRushHourData({ dateType: 0 })
      .then((r) => {
        let { data } = r.data;
        operateordertimedata(data);
      })
      .catch((r) => {
        settimesuccess(false);
      });
    getDistanceSocData({ dateType: 1 })
      .then((r) => {
        let { data } = r.data;
        operatordrivedata(data);
      })
      .catch((r) => {
        setdriversuccess(false);
      });
  }, []);
  const setloading = () => {
    settimeloading(true);
    setorderloading(true);
    setfaultloading(true);
    setdriverloading(true);
  };
  const orderhandleChange = (value) => {
    setloading();
    let merchantId = value;
    if (value === 10000) merchantId = null;
    setmerchantid(merchantId);
    getErrorExchangeData({ dateType: faultorderdateType, merchantId }).then((r) => {
      let { data } = r.data;
      operatefaultdata(data);
    });
    getExceptionExchangeData({ dateType: orderdateType, merchantId }).then((r) => {
      let { data } = r.data;
      operateorderdata(data);
    });
    getExchangeRushHourData({ dateType: ordertimedateType, merchantId }).then((r) => {
      let { data } = r.data;
      operateordertimedata(data);
    });
    getDistanceSocData({ dateType: drivedateType, merchantId }).then((r) => {
      let { data } = r.data;
      operatordrivedata(data);
    });
  };
  return (
    <Drawer
      width="50%"
      visible
      title="订单详情"
      placement="right"
      afterVisibleChange={loaddrawer}
      closable={false}
      onClose={props.onCancel}
      destroyOnClose
    >
      {props.isPlatform && (
        <Form {...layout} style={{ marginLeft: '20%', width: '80%' }}>
          <Form.Item name="name" label="运营商选择">
            <Select defaultValue={10000} style={{ width: 300 }} onChange={orderhandleChange}>
              {organizationOptions}
            </Select>
          </Form.Item>
        </Form>
      )}
      <Spin spinning={orderloading}>
        <Card
          title={
            <>
              <span>换电订单数据分析</span>
              <Tooltip title="异常订单是指影响用户体验">
                <InfoCircleOutlined style={{ marginLeft: '5%' }} />
              </Tooltip>
            </>
          }
          style={{ width: '100%' }}
          extra={
            <>
              <div>
                <span
                  className={orderweekchecked ? styles.actived : null}
                  style={{ marginRight: '10px', cursor: 'pointer' }}
                  onClick={() => {
                    setorderloading(true);
                    setorderdateType(1);
                    setorderweekchecked(true);
                    setordermonthchecked(false);
                    setorderyearchecked(false);
                    getExceptionExchangeData({ dateType: 1, merchantId: merchantid })
                      .then((r) => {
                        let { data } = r.data;
                        operateorderdata(data);
                      })
                      .catch((r) => {
                        steordersuccess(false);
                      });
                  }}
                >
                  本周
                </span>
                <span
                  className={ordermonthchecked ? styles.actived : null}
                  style={{ marginRight: '10px', cursor: 'pointer' }}
                  onClick={() => {
                    setorderloading(true);
                    setorderdateType(2);
                    setorderweekchecked(false);
                    setordermonthchecked(true);
                    setorderyearchecked(false);
                    getExceptionExchangeData({ dateType: 2, merchantId: merchantid })
                      .then((r) => {
                        let { data } = r.data;
                        operateorderdata(data);
                      })
                      .catch((r) => {
                        steordersuccess(false);
                      });
                  }}
                >
                  本月
                </span>
                <span
                  className={orderyearchecked ? styles.actived : null}
                  style={{ marginRight: '10px', cursor: 'pointer' }}
                  onClick={() => {
                    setorderloading(true);
                    setorderdateType(3);
                    setorderweekchecked(false);
                    setordermonthchecked(false);
                    setorderyearchecked(true);
                    getExceptionExchangeData({ dateType: 3, merchantId: merchantid })
                      .then((r) => {
                        let { data } = r.data;
                        operateorderdata(data);
                      })
                      .catch((r) => {
                        steordersuccess(false);
                      });
                  }}
                >
                  全年
                </span>
              </div>
            </>
          }
        >
          {ordersuccess === false && <Result status={500} title="抱歉，服务器出错了" />}
          {ordersuccess === true && <div id="order" style={{ width: '100%' }} />}
        </Card>
      </Spin>
      <Spin spinning={faultloading}>
        <Card
          title={
            <>
              <span>换电故障订单分析</span>
              <Tooltip title="故障订单是指设备故障无法提供换电服务">
                <InfoCircleOutlined style={{ marginLeft: '5%' }} />
              </Tooltip>
            </>
          }
          style={{ width: '100%' }}
          extra={
            <div>
              <span
                className={faultorderweekchecked ? styles.actived : null}
                style={{ marginRight: '10px', cursor: 'pointer' }}
                onClick={() => {
                  setfaultloading(true);
                  setfaultorderdateType(1);
                  setfaultorderweekchecked(true);
                  setfaultordermonthchecked(false);
                  setfaultorderyearchecked(false);
                  getErrorExchangeData({ dateType: 1, merchantId: merchantid })
                    .then((r) => {
                      let { data } = r.data;
                      operatefaultdata(data);
                    })
                    .catch((r) => {
                      setfaultsuccess(false);
                    });
                }}
              >
                本周
              </span>
              <span
                className={faultordermonthchecked ? styles.actived : null}
                style={{ marginRight: '10px', cursor: 'pointer' }}
                onClick={() => {
                  setfaultloading(true);
                  setfaultorderdateType(2);
                  setfaultorderweekchecked(false);
                  setfaultordermonthchecked(true);
                  setfaultorderyearchecked(false);
                  getErrorExchangeData({ dateType: 2, merchantId: merchantid })
                    .then((r) => {
                      let { data } = r.data;
                      operatefaultdata(data);
                    })
                    .catch((r) => {
                      setfaultsuccess(false);
                    });
                }}
              >
                本月
              </span>
              <span
                className={faultorderyearchecked ? styles.actived : null}
                style={{ marginRight: '10px', cursor: 'pointer' }}
                onClick={() => {
                  setfaultloading(true);
                  setfaultorderdateType(3);
                  setfaultorderweekchecked(false);
                  setfaultordermonthchecked(false);
                  setfaultorderyearchecked(true);
                  getErrorExchangeData({ dateType: 3, merchantId: merchantid })
                    .then((r) => {
                      let { data } = r.data;
                      operatefaultdata(data);
                    })
                    .catch((r) => {
                      setfaultsuccess(false);
                    });
                }}
              >
                全年
              </span>
            </div>
          }
        >
          {faultsuccess === false && <Result status={500} title="抱歉，服务器出错了" />}
          {faultsuccess === true && <div id="fault" style={{ width: '100%' }} />}
        </Card>
      </Spin>
      <Spin spinning={driverloading}>
        <Card
          title="行驶与用电量分析"
          style={{ width: '100%' }}
          extra={
            <div>
              <span
                className={driveweekchecked ? styles.actived : null}
                style={{ marginRight: '10px', cursor: 'pointer' }}
                onClick={() => {
                  setdriverloading(true);
                  setdrivedateType(1);
                  setdriveweekchecked(true);
                  setdrivemonthchecked(false);
                  setdriveyearchecked(false);
                  getDistanceSocData({ dateType: 1, merchantId: merchantid })
                    .then((r) => {
                      let { data } = r.data;
                      operatordrivedata(data);
                    })
                    .catch((r) => {
                      setdriversuccess(false);
                    });
                }}
              >
                本周
              </span>
              <span
                className={drivemonthchecked ? styles.actived : null}
                style={{ marginRight: '10px', cursor: 'pointer' }}
                onClick={() => {
                  setdrivedateType(2);
                  setdriverloading(true);
                  setdriveweekchecked(false);
                  setdrivemonthchecked(true);
                  setdriveyearchecked(false);
                  getDistanceSocData({ dateType: 2, merchantId: merchantid })
                    .then((r) => {
                      let { data } = r.data;
                      operatordrivedata(data);
                    })
                    .catch((r) => {
                      setdriversuccess(false);
                    });
                }}
              >
                本月
              </span>
              <span
                className={driveyearchecked ? styles.actived : null}
                style={{ marginRight: '10px', cursor: 'pointer' }}
                onClick={() => {
                  setdrivedateType(3);
                  setdriverloading(true);
                  setdriveweekchecked(false);
                  setdrivemonthchecked(false);
                  setdriveyearchecked(true);
                  getDistanceSocData({ dateType: 3, merchantId: merchantid })
                    .then((r) => {
                      let { data } = r.data;
                      operatordrivedata(data);
                    })
                    .catch((r) => {
                      setdriversuccess(false);
                    });
                }}
              >
                全年
              </span>
            </div>
          }
        >
          {driversuccess === false && <Result status={500} title="抱歉，服务器出错了" />}
          {driversuccess === true && <div id="drive" style={{ width: '100%' }} />}
        </Card>
      </Spin>
      <Spin spinning={timeloading}>
        <Card
          title="换电时段统计"
          style={{ width: '100%' }}
          extra={
            <div>
              <span
                className={ordertimetodaychecked ? styles.actived : null}
                style={{ marginRight: '10px', cursor: 'pointer' }}
                onClick={() => {
                  settimeloading(true);
                  setordertimedateType(0);
                  setordertimetodaychecked(true);
                  setordertimeweekchecked(false);
                  setordertimemonthchecked(false);
                  setordertimeyearchecked(false);
                  getExchangeRushHourData({ dateType: 0, merchantId: merchantid })
                    .then((r) => {
                      let { data } = r.data;
                      operateordertimedata(data);
                    })
                    .catch((r) => {
                      settimesuccess(false);
                    });
                }}
              >
                今日
              </span>
              <span
                className={ordertimeweekchecked ? styles.actived : null}
                style={{ marginRight: '10px', cursor: 'pointer' }}
                onClick={() => {
                  settimeloading(true);
                  setordertimedateType(1);
                  setordertimetodaychecked(false);
                  setordertimeweekchecked(true);
                  setordertimemonthchecked(false);
                  setordertimeyearchecked(false);
                  getExchangeRushHourData({ dateType: 1, merchantId: merchantid })
                    .then((r) => {
                      let { data } = r.data;
                      operateordertimedata(data);
                    })
                    .catch((r) => {
                      settimesuccess(false);
                    });
                }}
              >
                本周
              </span>
              <span
                className={ordertimemonthchecked ? styles.actived : null}
                style={{ marginRight: '10px', cursor: 'pointer' }}
                onClick={() => {
                  settimeloading(true);
                  setordertimedateType(2);
                  setordertimetodaychecked(false);
                  setordertimeweekchecked(false);
                  setordertimemonthchecked(true);
                  setordertimeyearchecked(false);
                  getExchangeRushHourData({ dateType: 2, merchantId: merchantid })
                    .then((r) => {
                      let { data } = r.data;
                      operateordertimedata(data);
                    })
                    .catch((r) => {
                      settimesuccess(false);
                    });
                }}
              >
                本月
              </span>
              <span
                className={ordertimeyearchecked ? styles.actived : null}
                style={{ marginRight: '10px', cursor: 'pointer' }}
                onClick={() => {
                  settimeloading(true);
                  setordertimedateType(3);
                  setordertimetodaychecked(false);
                  setordertimeweekchecked(false);
                  setordertimemonthchecked(false);
                  setordertimeyearchecked(true);
                  getExchangeRushHourData({ dateType: 3, merchantId: merchantid })
                    .then((r) => {
                      let { data } = r.data;
                      operateordertimedata(data);
                    })
                    .catch((r) => {
                      settimesuccess(false);
                    });
                }}
              >
                全年
              </span>
            </div>
          }
        >
          {timesuccess === false && <Result status={500} title="抱歉，服务器出错了" />}
          {timesuccess === true && <div id="time" style={{ width: '100%' }} />}
        </Card>
      </Spin>
    </Drawer>
  );
};
export default OrderDrawer;
