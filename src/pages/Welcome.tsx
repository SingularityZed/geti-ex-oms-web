import React, { useEffect, useState } from 'react';
import { Card, Col, Drawer, Form, Row, Select, Tag, Tooltip, Spin, Result } from 'antd';
import { Chart, Util } from '@antv/g2';
import {
  getcabinetExchangeRank,
  getConsumerBizDataRes,
  getConsumerBuisnessDataRes,
  getcountBusinessInfo,
  getcountExchangeOrderInfo,
  getcountPackageDIST,
  getcountPackageInfo,
  getConsumerBuisnessMonthData,
} from '@/services/businessMonitor';
import { getOrganizationAll } from '@/services/merchant';
import { getUserInfo } from '@/utils/authority';
import NumberInfo from '@/components/NumberInfo';
import styles from './Welcome.less';
import UserDrawer from './welcome_components/UserDrawer';
import BatteryDrawer from './welcome_components/BatteryDrawer';
import CabinetDrawer from './welcome_components/CabinetDrawer';
import OrderDrawer from './welcome_components/OrderDrawer';

const Index: React.FC<{}> = () => {
  // 详情抽屉显示控制
  const [uservisible, setuservisible] = useState<boolean>(false);
  const [batteryvisible, setbatteryvisible] = useState<boolean>(false);
  const [cabinetvisible, setcabinetvisible] = useState<boolean>(false);
  const [ordervisible, setordervisible] = useState<boolean>(false);

  // 平台判断
  const [isPlatform, setisPlatform] = useState<boolean>(false);
  const [countBusinessInfo, setcountBusinessInfo] = useState<object>({
    countExchangeOrder: 0,
    countPackageUser: 0,
    countBattery: 0,
    countCabinet: 0,
  });
  const [orderdata, setorderdata] = useState<[]>([]);
  const [ranklist, setranklist] = useState<any>([]);
  const [countPackageInfo, setcountPackageInfo] = useState<object>({
    packageAmount: 0,
    currentMonthAmount: 0,
    lastMonthAmount: 0,
    weekDifference: 0,
    monthDifference: 0,
  });
  const [weektag, setweektag] = useState<string>('up');
  const [monthtag, setmonthtag] = useState<string>('up');
  const [packagedata, setpackagedata] = useState<any>([]);
  const [orderweekchecked, setorderweekchecked] = useState<boolean>(true);
  const [ordermonthchecked, setordermonthchecked] = useState<boolean>(false);
  const [orderyearchecked, setorderyearchecked] = useState<boolean>(false);
  const [organizationOptions, setOrganizationOptions] = useState<object>([]);
  const [userpackagedata, setuserpackagedata] = useState<[]>([]);
  const [titleloading, settitleloading] = useState<boolean>(true);
  const [dateType, setdateType] = useState<number>(1);
  const [usermerchantId, setusermerchantId] = useState<number>();

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

  useEffect(() => {
    // 获取是否是平台
    // console.log(JSON.parse(localStorage.getItem("USERINFO")).user.userId)
    if (JSON.parse(localStorage.getItem('USERINFO')).user.userId === 1) {
      setisPlatform(true);
    }
  }, []);

  useEffect(() => {
    // 获取运营商全部信息
    getOrganizationAll().then((res) => {
      res.data.data.organizationInfoList.unshift({ id: 10000, operationName: '总览' });
      let options = res.data.data.organizationInfoList.map((organizationInfo) => (
        <Select.Option key={organizationInfo.id} value={organizationInfo.id}>
          {organizationInfo.operationName}
        </Select.Option>
      ));
      setOrganizationOptions(options);
    });
  }, []);
  const cutstring = (str, num) => {
    let newstr = str;
    if (str.length < num) {
      for (let i = 0; i < num - str.length; i += 1) {
        newstr += ' ';
      }
    }
    if (str.length >= num) {
      newstr = str.substring(0, num);
      newstr += '...';
    }
    return newstr;
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
  useEffect(() => {
    // 数据加载
    getcountBusinessInfo().then((r) => {
      const { data } = r.data;
      setcountBusinessInfo(data);
      settitleloading(false);
    });
    getcountExchangeOrderInfo().then((r) => {
      const { data } = r.data;
      const newdata = [];
      data.map((item, index) => {
        newdata.push(
          Object.assign({}, item, {
            month: item.month,
            订单量: item.exchangeCount,
            用户数: item.exchangeConsumerCount,
          }),
        );
      });

      setorderdata(newdata);
    });
    getcabinetExchangeRank({
      dateType: 1,
    }).then((r) => {
      const { data } = r.data;
      setranklist(data);
    });
    getcountPackageInfo().then((r) => {
      const { data } = r.data;
      data.monthDifference = (data.monthDifference / 100).toFixed(2);
      if (data.monthDifference > 0) {
        data.monthDifference = `+${data.monthDifference}`;
      }
      data.weekDifference = (data.weekDifference / 100).toFixed(2);
      if (data.weekDifference > 0) {
        data.weekDifference = `+${data.weekDifference}`;
      }
      if (data.weekDifference < 0) {
        setweektag('down');
      }
      if (data.monthDifference < 0) {
        setmonthtag('down');
      }
      setcountPackageInfo(data);
    });
    getcountPackageDIST().then((r) => {
      const { data } = r.data;
      for (let i = 0; i < data.length; i += 1) {
        data[i].packageId = data[i].packageId.toString();
      }
      setpackagedata(data);
    });
  }, []);
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
  useEffect(() => {
    // 近一年订单增长趋势
    if (orderdata.length > 1) {
      const chart = new Chart({
        container: 'ordercontainer',
        autoFit: true,
        height: 260,
        padding: [30, 50, 50, 50],
      });
      chart.data(orderdata.reverse());
      chart.scale('订单量', {
        min: 0,
        type: 'quantize',
        tickMethod: (scale) => {
          const { min, max, tickCount } = scale;
          const avg = 30000;
          const ticks = [];
          for (let i = min; i <= max + 30000; i += avg) {
            ticks.push(i);
          }
          return ticks;
        },
      });
      chart.scale('用户数', {
        min: 0,
        type: 'quantize',
        tickMethod: (scale) => {
          const { min, max, tickCount } = scale;
          const avg = 500;
          const ticks = [];
          for (let i = min; i < max + 500; i += avg) {
            ticks.push(i);
          }
          return ticks;
        },
      });
      chart.tooltip({
        showMarkers: false,
        showTitle: true, // 关闭标题
        showCrosshairs: true,
        shared: true,
      });
      chart.interval().position('month*订单量').color('#1770d6');
      chart
        .line()
        .position('month*用户数')
        .color('#13C2C2')
        .label('用户数', {
          style: {
            fill: '#13C2C2',
            fontSize: 14,
          },
          offset: 20,
        });
      chart.point().position('month*用户数').tooltip(false);
      chart.legend({
        custom: true,
        items: [
          {
            value: '用户量',
            name: '用户量',
            marker: {
              style: {
                fill: '#13C2C2',
              },
            },
          },
          {
            value: '订单量',
            name: '订单量',
            marker: {
              style: {
                fill: '#1770d6',
              },
            },
          },
        ],
      });
      chart.render();
    }
  }, [orderdata]);

  useEffect(() => {
    // 套餐占比
    if (packagedata.length > 0) {
      const chart = new Chart({
        container: 'package',
        autoFit: true,
        height: 300,
      });
      chart.data(packagedata);
      chart.legend({ position: 'right' });
      chart.coordinate('theta', {
        radius: 0.75,
        innerRadius: 0.4,
      });
      chart.tooltip({
        showMarkers: false,
      });

      chart.tooltip({
        showMarkers: false,
        showTitle: false, // 关闭标题
        itemTpl:
          '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{packageName}({packageAmount}元): {packageCount}笔 {packagePercent}</li>',
      });
      chart.legend({
        position: 'right',
        itemName: {
          spacing: 1,
          formatter(val) {
            let data = {};
            for (let i = 0; i < packagedata.length; i += 1) {
              if (packagedata[i].uniquePackage === val) {
                data = packagedata[i];
              }
            }
            return `${cutstring(data.packageName, 5)}  |  ${cutstring(
              data.packagePercent,
              6,
            )}   ￥${data.packageAmount}`;
          },
        },
      });
      chart
        .interval()
        .adjust('stack')
        .position('packageCount')
        .color('uniquePackage', ['#063d8a', '#1770d6', '#47abfc', '#38c060', '#FFC847', '#E96C5B'])
        .style({ opacity: 0.4 })
        .state({
          active: {
            style: (element) => {
              const { shape } = element;
              return {
                matrix: Util.zoom(shape, 1.1),
              };
            },
          },
        })
        .tooltip('uniquePackage*packageName*packagePercent*packageCount*packageAmount', function (
          uniquePackage,
          packageName,
          packagePercent,
          packageCount,
          packageAmount,
        ) {
          return {
            packageName,
            packagePercent,
            packageCount,
            packageAmount,
          };
        });

      chart.interaction('legend-active');

      chart.render();
    }
  }, [packagedata]);
  return (
    <>
      <Row gutter={16}>
        <Col xs={24} lg={6} className={styles.item}>
          <Card bodyStyle={{ padding: '20px 24px 8px 24px' }}>
            <div className={styles.chartCard}>
              <div className={styles.cardTop}>
                <div className={styles.metaWrap}>
                  <div className={styles.meta}>
                    <span className={styles.title}>换电订单总数</span>
                    <span className={styles.action}>
                      <Tag
                        color="geekblue"
                        onClick={() => {
                          setordervisible(true);
                        }}
                      >
                        查看详情
                      </Tag>
                    </span>
                  </div>
                  <div className={styles.content}>
                    <Spin spinning={titleloading}>
                      {!titleloading && <>{toThousands(countBusinessInfo.countExchangeOrder)}</>}
                    </Spin>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={6} className={styles.item}>
          <Card bodyStyle={{ padding: '20px 24px 8px 24px' }}>
            <div className={styles.chartCard}>
              <div className={styles.cardTop}>
                {/* <div className={styles.avatar}>{avatar}</div> */}
                <div className={styles.metaWrap}>
                  <div className={styles.meta}>
                    <span className={styles.title}>付费用户数</span>
                    <span className={styles.action}>
                      <Tag
                        color="geekblue"
                        onClick={() => {
                          setuservisible(true);
                        }}
                      >
                        查看详情
                      </Tag>
                    </span>
                  </div>
                  <div className={styles.content}>
                    <Spin spinning={titleloading}>
                      {!titleloading && <>{toThousands(countBusinessInfo.countPackageUser)}</>}
                    </Spin>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={6} className={styles.item}>
          <Card bodyStyle={{ padding: '20px 24px 8px 24px' }}>
            <div className={styles.chartCard}>
              <div className={styles.cardTop}>
                {/* <div className={styles.avatar}>{avatar}</div> */}
                <div className={styles.metaWrap}>
                  <div className={styles.meta}>
                    <span className={styles.title}>运营中电池数</span>
                    <span className={styles.action}>
                      <Tag
                        color="geekblue"
                        onClick={() => {
                          setbatteryvisible(true);
                        }}
                      >
                        查看详情
                      </Tag>
                    </span>
                  </div>
                  <div className={styles.content}>
                    <Spin spinning={titleloading}>
                      {!titleloading && <>{toThousands(countBusinessInfo.countBattery)}</>}
                    </Spin>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={6} className={styles.item}>
          <Card bodyStyle={{ padding: '20px 24px 8px 24px' }}>
            <div className={styles.chartCard}>
              <div className={styles.cardTop}>
                {/* <div className={styles.avatar}>{avatar}</div> */}
                <div className={styles.metaWrap}>
                  <div className={styles.meta}>
                    <span className={styles.title}>运营中电柜数</span>
                    <span className={styles.action}>
                      <Tag
                        color="geekblue"
                        onClick={() => {
                          setcabinetvisible(true);
                        }}
                      >
                        查看详情
                      </Tag>
                    </span>
                  </div>
                  <div className={styles.content}>
                    <Spin spinning={titleloading}>
                      {!titleloading && <>{toThousands(countBusinessInfo.countCabinet)}</>}
                    </Spin>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      <Card style={{ marginTop: '10px' }}>
        <Row gutter={16} style={{ width: '100%' }}>
          <Col xs={24} lg={16}>
            <Card
              title="近一年订单增长趋势"
              style={{ width: '100%', height: '350px', margin: '0px' }}
            >
              <div id="ordercontainer" style={{ width: '100%' }} />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card
              extra={
                <div>
                  <span
                    className={orderweekchecked ? styles.actived : null}
                    style={{ marginRight: '10px', cursor: 'pointer' }}
                    onClick={() => {
                      getcabinetExchangeRank({
                        dateType: 1,
                      }).then((r) => {
                        const { data } = r.data;
                        setranklist(data);
                        setorderweekchecked(true);
                        setordermonthchecked(false);
                        setorderyearchecked(false);
                      });
                    }}
                  >
                    本周
                  </span>
                  <span
                    className={ordermonthchecked ? styles.actived : null}
                    style={{ marginRight: '10px', cursor: 'pointer' }}
                    onClick={() => {
                      getcabinetExchangeRank({
                        dateType: 2,
                      }).then((r) => {
                        const { data } = r.data;
                        setranklist(data);
                        setorderweekchecked(false);
                        setordermonthchecked(true);
                        setorderyearchecked(false);
                      });
                    }}
                  >
                    本月
                  </span>
                  <span
                    className={orderyearchecked ? styles.actived : null}
                    style={{ marginRight: '10px', cursor: 'pointer' }}
                    onClick={() => {
                      getcabinetExchangeRank({
                        dateType: 3,
                      }).then((r) => {
                        const { data } = r.data;
                        setranklist(data);
                        setorderweekchecked(false);
                        setordermonthchecked(false);
                        setorderyearchecked(true);
                      });
                    }}
                  >
                    全年
                  </span>
                </div>
              }
              style={{ width: '98%', height: '350px', marginLeft: '2%' }}
              title="电柜换电次数排名"
            >
              <div style={{ padding: '0px' }}>
                <ul className={styles.rankingList}>
                  {ranklist.map((item, i) => (
                    <li key={item.name + item.count}>
                      <span className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}>
                        {i + 1}
                      </span>
                      <span className={styles.rankingItemTitle} title={item.title}>
                        {item.name}
                      </span>
                      <span className={styles.rankingItemValue}>{toThousands(item.count)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>
      <Card style={{ marginTop: '10px' }}>
        <Row gutter={24}>
          <Col xs={24} lg={10}>
            <Card title="套餐收入" style={{ width: '100%', height: '380px', margin: '0px' }}>
              <Row gutter={24} type="flex" style={{ marginTop: '20px' }}>
                <Col
                  xs={12}
                  lg={8}
                  style={{
                    marginBottom: 24,
                  }}
                >
                  <NumberInfo
                    subTitle={<span>当前套餐总收入</span>}
                    total={`${toThousands((countPackageInfo.packageAmount / 100).toFixed(2))}元`}
                  />
                </Col>
                <Col
                  xs={12}
                  lg={8}
                  style={{
                    marginBottom: 24,
                  }}
                >
                  <NumberInfo
                    subTitle={<span>本月套餐收入</span>}
                    total={`${toThousands(
                      (countPackageInfo.currentMonthAmount / 100).toFixed(2),
                    )}元`}
                  />
                </Col>
                <Col
                  xs={12}
                  lg={8}
                  style={{
                    marginBottom: 24,
                  }}
                >
                  <NumberInfo
                    subTitle={<span>上月套餐收入</span>}
                    total={`${toThousands((countPackageInfo.lastMonthAmount / 100).toFixed(2))}元`}
                  />
                </Col>
              </Row>
              <Row gutter={68} type="flex" style={{ marginTop: '30px' }}>
                <Col
                  sm={12}
                  xs={24}
                  style={{
                    marginBottom: 24,
                  }}
                >
                  <NumberInfo
                    subTitle={<span>较上周同比</span>}
                    gap={8}
                    suffix="周环比"
                    total={
                      countPackageInfo.weekDifference.toString().slice(0, 1) +
                      toThousands(countPackageInfo.weekDifference.toString().slice(1))
                    }
                    status={weektag}
                    subTotal={countPackageInfo.weekDifferencePercentage}
                  />
                </Col>
                <Col
                  sm={12}
                  xs={24}
                  style={{
                    marginBottom: 24,
                  }}
                >
                  <NumberInfo
                    subTitle={<span>较上月同比</span>}
                    total={
                      countPackageInfo.monthDifference.toString().slice(0, 1) +
                      toThousands(countPackageInfo.monthDifference.toString().slice(1))
                    }
                    suffix="月环比"
                    status={monthtag}
                    subTotal={countPackageInfo.monthDifferencePercentage}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} lg={14}>
            <Card
              title="当月套餐销售占比"
              style={{ width: '95%', height: '380px', marginLeft: '5%' }}
            >
              <div id="package" style={{ width: '100%' }} />
            </Card>
          </Col>
        </Row>
      </Card>
      {uservisible && (
        <UserDrawer
          isPlatform={isPlatform}
          onCancel={() => setuservisible(false)}
          orgdata={organizationOptions}
        />
      )}
      {batteryvisible && (
        <BatteryDrawer
          isPlatform={isPlatform}
          onCancel={() => setbatteryvisible(false)}
          orgdata={organizationOptions}
        />
      )}
      {cabinetvisible && (
        <CabinetDrawer
          isPlatform={isPlatform}
          onCancel={() => setcabinetvisible(false)}
          orgdata={organizationOptions}
        />
      )}
      {ordervisible && (
        <OrderDrawer
          isPlatform={isPlatform}
          onCancel={() => setordervisible(false)}
          orgdata={organizationOptions}
        />
      )}
    </>
  );
};

export default Index;
