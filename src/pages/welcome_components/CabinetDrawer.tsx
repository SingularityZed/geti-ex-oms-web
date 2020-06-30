import React, { FC, useEffect, useState } from 'react';
import { Drawer, Form, Select, Card, Result, Spin, Tooltip } from 'antd';
import { getCabinetData } from '@/services/businessMonitor';
import { Chart } from '@antv/g2';
import battery from '@/static/battery.jpg';
import { InfoCircleOutlined } from '@ant-design/icons';
import styles from './Style.less';

interface CabinetDrawerProps {
  orgdata: any;
  onCancel: () => void;
  isPlatform: boolean;
}

const CabinetDrawer: FC<CabinetDrawerProps> = (props) => {
  const organizationOptions = props.orgdata;
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };
  const [cabinetloading, setcabinetloading] = useState<boolean>(true);
  const [cabinetdata, setcabinetdata] = useState<object>({});
  const [cabinetsuccess, setcabinetsuccess] = useState<boolean>();

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
  const opratedata = (data) => {
    setcabinetdata(data);
    createChart('circle', 100 - data.unusePercent);
    createChart('circle2', data.unusePercent);
  };
  useEffect(() => {
    getCabinetData()
      .then((r) => {
        setcabinetloading(false);
        setcabinetsuccess(true);
        const { data } = r.data;
        opratedata(data);
        setcabinetloading(false);
      })
      .catch((r) => {
        setcabinetsuccess(false);
      });
  }, []);
  const cabinethandleChange = (value) => {
    setcabinetloading(true);
    let merchantId = value;
    if (value === 10000) merchantId = null;
    getCabinetData({ merchantId })
      .then((r) => {
        setcabinetloading(false);
        const { data } = r.data;
        opratedata(data);
      })
      .catch((r) => {
        setcabinetsuccess(false);
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
      {cabinetsuccess === false && <Result status={500} title="抱歉，服务器出错了" />}
      {cabinetsuccess === true && (
        <>
          {props.isPlatform && (
            <Form {...layout} style={{ marginLeft: '20%', width: '80%' }}>
              <Form.Item name="name" label="运营商选择">
                <Select defaultValue={10000} style={{ width: 300 }} onChange={cabinethandleChange}>
                  {organizationOptions}
                </Select>
              </Form.Item>
            </Form>
          )}
          <div style={{ marginLeft: '5%' }}>
            <Card style={{ width: '40%', float: 'left', marginRight: '5%', marginBottom: '10px' }}>
              <div style={{ width: '30%', float: 'left' }}>
                <img src={battery} alt="123" style={{ marginTop: '10px' }} />
              </div>
              <div style={{ width: '60%', float: 'left' }}>
                <p style={{ fontSize: '18px', marginBottom: '0px' }}>运营中电柜数</p>
                <span style={{ fontSize: '30px', fontWeight: 800 }}>
                  <Spin spinning={cabinetloading}>
                    {!cabinetloading && <>{toThousands(cabinetdata.enableCount)}</>}
                  </Spin>
                </span>
              </div>
            </Card>
            <Card style={{ width: '40%', float: 'left', marginRight: '5%', marginBottom: '10px' }}>
              <div style={{ width: '30%', float: 'left' }}>
                <img src={battery} alt="123" style={{ marginTop: '10px' }} />
              </div>
              <div style={{ width: '60%', float: 'left' }}>
                <p style={{ fontSize: '18px', marginBottom: '0px' }}>禁用电柜数</p>
                <span style={{ fontSize: '30px', fontWeight: 800 }}>
                  <Spin spinning={cabinetloading}>
                    {!cabinetloading && <>{toThousands(cabinetdata.disableCount)}</>}
                  </Spin>
                </span>
              </div>
            </Card>
            <Card style={{ width: '40%', float: 'left', marginRight: '5%', marginBottom: '10px' }}>
              <div style={{ width: '30%', float: 'left' }}>
                <img src={battery} alt="123" style={{ marginTop: '10px' }} />
              </div>
              <div style={{ width: '60%', float: 'left' }}>
                <p style={{ fontSize: '18px', marginBottom: '0px' }}>在线电柜数</p>
                <span style={{ fontSize: '30px', fontWeight: 800 }}>
                  <Spin spinning={cabinetloading}>
                    {!cabinetloading && <>{toThousands(cabinetdata.onlineCount)}</>}
                  </Spin>
                </span>
              </div>
            </Card>
            <Card style={{ width: '40%', float: 'left', marginRight: '5%', marginBottom: '10px' }}>
              <div style={{ width: '30%', float: 'left' }}>
                <img src={battery} alt="123" style={{ marginTop: '10px' }} />
              </div>
              <div style={{ width: '60%', float: 'left' }}>
                <p style={{ fontSize: '18px', marginBottom: '0px' }}>
                  离线电柜数
                  <Tooltip title="可在“电柜管理”中查询具体离线电柜详情">
                    <InfoCircleOutlined style={{ marginLeft: '5%' }} />
                  </Tooltip>
                </p>
                <span style={{ fontSize: '30px', fontWeight: 800 }}>
                  <Spin spinning={cabinetloading}>
                    {!cabinetloading && <>{toThousands(cabinetdata.offlineCount)}</>}
                  </Spin>
                </span>
              </div>
            </Card>
            <Card style={{ width: '40%', float: 'left', marginRight: '5%', marginBottom: '10px' }}>
              <div style={{ width: '50%', float: 'left' }}>
                <p style={{ fontSize: '16px', marginBottom: '0px' }}>电柜运营效率</p>
                <span style={{ fontSize: '24px', fontWeight: 800 }}>
                  <Spin spinning={cabinetloading}>
                    {!cabinetloading && <>{`${cabinetdata.usePercent}%`}</>}
                  </Spin>
                </span>
              </div>
              <div style={{ width: '40%', float: 'left' }}>
                <div id="circle" style={{ width: '100px' }} />
              </div>
            </Card>
            <Card style={{ width: '40%', float: 'left', marginBottom: '10px' }}>
              <div style={{ width: '50%', float: 'left' }}>
                <p style={{ fontSize: '16px', marginBottom: '0px' }}>电柜闲置率</p>
                <span style={{ fontSize: '24px', fontWeight: 800 }}>
                  <Spin spinning={cabinetloading}>
                    {!cabinetloading && <>{`${cabinetdata.unusePercent}%`}</>}
                  </Spin>
                </span>
              </div>
              <div style={{ width: '40%', float: 'left' }}>
                <div id="circle2" style={{ width: '100px' }} />
              </div>
            </Card>
          </div>
        </>
      )}
    </Drawer>
  );
};
export default CabinetDrawer;
