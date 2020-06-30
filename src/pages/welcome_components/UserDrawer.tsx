import React, { FC, useEffect, useState } from 'react';
import { Drawer, Form, Select, Card, Result, Spin } from 'antd';
import {
  getConsumerBizDataRes,
  getConsumerBuisnessDataRes,
  getConsumerBuisnessMonthData,
} from '@/services/businessMonitor';
import { Chart } from '@antv/g2';
import styles from './Style.less';

interface UserDrawerProps {
  orgdata: any;
  onCancel: () => void;
  isPlatform: boolean;
}

const UserDrawer: FC<UserDrawerProps> = (props) => {
  const organizationOptions = props.orgdata;
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };
  const [dateType, setdateType] = useState<number>(1);
  const [userupweekchecked, setuserupweekchecked] = useState<boolean>(true);
  const [userupmonthchecked, setuserupmonthchecked] = useState<boolean>(false);
  const [userupyearchecked, setuserupyearchecked] = useState<boolean>(false);
  const [usermerchantId, setusermerchantId] = useState<>();
  const [registersuccess, setregistersuccess] = useState<boolean>();
  const [packagesuccess, setpackagesuccess] = useState<boolean>();
  const [activesuccess, setactivesuccess] = useState<boolean>();

  const [registerloading, setregisterloading] = useState<boolean>(true);
  const [packageloading, setpackageloading] = useState<boolean>(true);
  const [activeloading, setactiveloading] = useState<boolean>(true);
  const loaddrawer = () => {};
  const creatbar = (container, data, position) => {
    document.getElementById(container).innerHTML = '';
    const chart = new Chart({
      container,
      autoFit: true,
      height: 400,
      width: 150,
    });
    chart.data(data);
    chart.interval().position(position);
    chart.render();
  };
  const creatGrouphistogram = (container, data, type) => {
    document.getElementById(container).innerHTML = '';
    const chart = new Chart({
      container,
      autoFit: true,
      height: 300,
    });
    chart.data(data.reverse());
    chart.scale('人数', {
      nice: true,
    });
    chart.tooltip({
      showMarkers: false,
      shared: true,
    });

    chart
      .interval()
      .position(type)
      .color('name')
      .adjust([
        {
          type: 'dodge',
          marginRatio: 0,
        },
      ]);

    chart.interaction('active-region');

    chart.render();
  };
  const operateregisterdata = (data) => {
    setregistersuccess(true);
    const registerdata = [];
    for (let i = 0; i < data.length; i += 1) {
      data[i].date = data[i].date.substr(data[i].date.length - 5, 5);
      registerdata.unshift({
        name: '注册用户',
        month: data[i].date,
        number: data[i].regUserCount,
      });
      registerdata.unshift({
        name: '押金用户',
        month: data[i].date,
        number: data[i].depositUserCount,
      });
    }
    creatGrouphistogram('register', registerdata, 'month*number');
    setregisterloading(false);
  };
  const operatepackagedata = (data) => {
    setpackagesuccess(true);
    const packagedata = [];
    for (let i = 0; i < data.length; i += 1) {
      data[i].date = data[i].date.substr(data[i].date.length - 5, 5);
      packagedata.unshift({
        name: '套餐用户数',
        month: data[i].date,
        number: data[i].firstBuyPackageUser,
      });
      packagedata.unshift({
        name: '换电用户数',
        month: data[i].date,
        number: data[i].exchangeUserCount,
      });
    }
    creatGrouphistogram('packageuser', packagedata, 'month*number');
    setpackageloading(false);
  };
  const operateactivedata = (data) => {
    setactivesuccess(true);
    const continuedata = [];
    const activedata = [];
    for (let i = 0; i < data.length; i += 1) {
      data[i].date = data[i].date.substr(data[i].date.length - 5, 5);
      continuedata.unshift({
        name: '续租用户',
        number: data[i].notFirstBuyPackageUserCount,
        date: data[i].date,
      });
      continuedata.unshift({
        name: '退租用户',
        number: data[i].refundUserCount,
        date: data[i].date,
      });
      activedata.push({
        活跃用户: data[i].exchangeUserCount,
        date: data[i].date,
      });
    }
    console.log(continuedata,'continuedata')
    creatGrouphistogram('continue', continuedata, 'date*number');
    // creatbar('continue', continuedata, 'date*续租用户');
    creatbar('active', activedata, 'date*活跃用户');
    setactiveloading(false);
  };
  useEffect(() => {
    getConsumerBizDataRes({ dateType: 1 })
      .then((r) => {
        const { data } = r.data;
        operateregisterdata(data);
        setregisterloading(false);
      })
      .catch((r) => {
        setregisterloading(false);
        setregistersuccess(false);
      });
    getConsumerBuisnessDataRes({ dateType: 1 })
      .then((r) => {
        const { data } = r.data;
        operatepackagedata(data);
        setpackageloading(false);
      })
      .catch((r) => {
        setpackageloading(false);
        setpackagesuccess(false);
      });
    getConsumerBuisnessMonthData({ dateType: 1 })
      .then((r) => {
        const { data } = r.data;
        operateactivedata(data);
        setactiveloading(false);
      })
      .catch((r) => {
        setactiveloading(false);
        setactivesuccess(false);
      });
  }, []);
  const setloading = () => {
    setactiveloading(true);
    setpackageloading(true);
    setregisterloading(true);
  };
  const userhandleChange = (value) => {
    setloading();
    setusermerchantId(value);
    let merchantId = value;
    if (value === 10000) {
      merchantId = null;
      setusermerchantId(null);
    }
    getConsumerBizDataRes({ dateType, merchantId })
      .then((r) => {
        const { data } = r.data;
        operateregisterdata(data);
      })
      .catch((r) => {
        setregisterloading(false);
        setregistersuccess(false);
      });
    getConsumerBuisnessDataRes({ dateType, merchantId })
      .then((r) => {
        const { data } = r.data;
        operatepackagedata(data);
      })
      .catch((r) => {
        setpackageloading(false);
        setpackagesuccess(false);
      });
    getConsumerBuisnessMonthData({ dateType, merchantId })
      .then((r) => {
        const { data } = r.data;
        operateactivedata(data);
      })
      .catch((r) => {
        setactiveloading(false);
        setactivesuccess(false);
      });
  };
  return (
    <Drawer
      width="50%"
      visible
      title="用户详情"
      placement="right"
      afterVisibleChange={loaddrawer}
      closable={false}
      onClose={props.onCancel}
      destroyOnClose
    >
      {props.isPlatform && (
        <Form {...layout} style={{ marginLeft: '20%', width: '80%' }}>
          <Form.Item name="name" label="运营商选择">
            <Select defaultValue={10000} style={{ width: 300 }} onChange={userhandleChange}>
              {organizationOptions}
            </Select>
          </Form.Item>
        </Form>
      )}
      <Card
        title="用户数据"
        style={{ width: '100%' }}
        extra={
          <div>
            <span
              className={userupweekchecked ? styles.actived : null}
              style={{ marginRight: '10px', cursor: 'pointer' }}
              onClick={() => {
                setloading();
                setdateType(1);
                setuserupweekchecked(true);
                setuserupmonthchecked(false);
                setuserupyearchecked(false);
                getConsumerBuisnessDataRes({ dateType: 1, merchantId: usermerchantId }).then(
                  (r) => {
                    const { data } = r.data;
                    operatepackagedata(data);
                  },
                );
                getConsumerBizDataRes({ dateType: 1, merchantId: usermerchantId }).then((r) => {
                  const { data } = r.data;
                  operateregisterdata(data);
                });
                getConsumerBuisnessMonthData({ dateType: 1, merchantId: usermerchantId }).then(
                  (r) => {
                    const { data } = r.data;
                    operateactivedata(data);
                  },
                );
              }}
            >
              本周
            </span>
            <span
              className={userupmonthchecked ? styles.actived : null}
              style={{ marginRight: '10px', cursor: 'pointer' }}
              onClick={() => {
                setloading();
                setdateType(2);
                setuserupweekchecked(false);
                setuserupmonthchecked(true);
                setuserupyearchecked(false);
                getConsumerBuisnessDataRes({ dateType: 2, merchantId: usermerchantId }).then(
                  (r) => {
                    const { data } = r.data;
                    operatepackagedata(data);
                  },
                );
                getConsumerBizDataRes({ dateType: 2, merchantId: usermerchantId }).then((r) => {
                  const { data } = r.data;
                  operateregisterdata(data);
                });
                getConsumerBuisnessMonthData({ dateType: 2, merchantId: usermerchantId }).then(
                  (r) => {
                    const { data } = r.data;
                    operateactivedata(data);
                  },
                );
              }}
            >
              本月
            </span>
            <span
              className={userupyearchecked ? styles.actived : null}
              style={{ marginRight: '10px', cursor: 'pointer' }}
              onClick={() => {
                setloading();
                setdateType(3);
                setuserupweekchecked(false);
                setuserupmonthchecked(false);
                setuserupyearchecked(true);
                getConsumerBuisnessDataRes({ dateType: 3, merchantId: usermerchantId }).then(
                  (r) => {
                    const { data } = r.data;
                    operatepackagedata(data);
                  },
                );
                getConsumerBizDataRes({ dateType: 3, merchantId: usermerchantId }).then((r) => {
                  const { data } = r.data;
                  operateregisterdata(data);
                });
                getConsumerBuisnessMonthData({ dateType: 3, merchantId: usermerchantId }).then(
                  (r) => {
                    const { data } = r.data;
                    operateactivedata(data);
                  },
                );
              }}
            >
              全年
            </span>
          </div>
        }
      >
        <Spin spinning={registerloading}>
          {registersuccess === false && <Result status={500} title="抱歉，服务器出错了" />}
          {registersuccess === true && (
            <>
              <Card title="注册/押金用户数">
                <div id="register" style={{ width: '100%' }} />
              </Card>
            </>
          )}
        </Spin>
        <Spin spinning={packageloading}>
          {packagesuccess === false && <Result status={500} title="抱歉，服务器出错了" />}
          {packagesuccess === true && (
            <>
              <Card title="套餐用户/换电用户数" style={{ marginTop: '30px' }}>
                <div id="packageuser" style={{ width: '100%' }} />
              </Card>
            </>
          )}
        </Spin>
        <Spin spinning={activeloading}>
          {activesuccess === false && <Result status={500} title="抱歉，服务器出错了" />}
          {activesuccess === true && (
            <>
              <Card title="续租/退租用户对比" style={{ width: '100%', marginTop: '30px' }}>
                <div id="continue" style={{ width: '100%' }} />
              </Card>
              <Card title="活跃用户" style={{ width: '100%', marginTop: '30px' }}>
                <div id="active" style={{ width: '100%' }} />
              </Card>
            </>
          )}
        </Spin>
      </Card>
    </Drawer>
  );
};
export default UserDrawer;
