import React, { useEffect, useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { TableListItem } from './data';
import { Col, message, Row } from 'antd';
import ExportTable from '@/components/ExportTable';
import moment from 'moment';
import { getPackageAmount, getPackagelist } from '@/services/pay';
import { getOrganizationAll } from '@/services/merchant';
import { exportpackageList } from '@/services/businessMonitor';
import { buttons, hasAuthority } from '@/utils/buttons';
import { getUserInfo } from '@/utils/authority';
import SearchFormOption from '@/components/SearchFormOption';

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [organizationOptions, setOrganizationOptions] = useState<object>([]);
  const [totalAmount, settotalAmount] = useState<any>('0.00');
  const [totalCouponAmount, settotalCouponAmount] = useState<any>('0.00');
  const [totalSettleAmount, settotalSettleAmount] = useState<any>('0.00');
  const [allSettlementTotalAmount, setallSettlementTotalAmount] = useState<any>('0.00');
  const [totalWithdrawAmount, settotalWithdrawAmount] = useState<any>('0.00');
  const [prevMonthAmount, setprevMonthAmount] = useState<any>('0.00');
  const [currentMonthAmount, setcurrentMonthAmount] = useState<any>('0.00');
  const [exportlistvisible, setexportlistvisible] = useState<boolean>(false);
  const collayout = {
    xs: 24,
    lg: 6,
  };
  useEffect(() => {
    // 获取运营商全部信息
    getOrganizationAll().then((res) => {
      let str = getUserInfo();
      let userInfo = str == '' ? {} : JSON.parse(getUserInfo());
      let obj = {};
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
    getPackageAmount().then((res) => {
      const data = res.data.data;
      setallSettlementTotalAmount((data.allSettlementTotalAmount / 100).toFixed(2));
      settotalWithdrawAmount((data.totalWithdrawAmount / 100).toFixed(2));
      setprevMonthAmount((data.prevMonthAmount / 100).toFixed(2));
      setcurrentMonthAmount((data.currentMonthAmount / 100).toFixed(2));
    });
  }, []);
  // 修改日期格式
  const beforeSearchSubmit = (params) => {
    if (Array.isArray(params.dateTimeRange)) {
      params.startTime =moment (params.dateTimeRange[0]).startOf('day').format("YYYY/MM/DD HH:mm:ss");
      params.endTime =moment (params.dateTimeRange[1]).endOf('day').format("YYYY/MM/DD HH:mm:ss");
    }
    delete params.dateTimeRange;
    return params;
  };

  const style = { background: '#0092ff', padding: '8px 0', borderRadius: '15px' };
  const secstyle = { background: '#465881', padding: '8px 0', borderRadius: '15px' };
  const item = { fontSize: '18px', marginBottom: '10px', marginTop: '4px' };
  const secitem = { fontSize: '20px', marginBottom: '20px', marginTop: '4px' };
  const block = { height: '70px', marginBottom: '10px', marginTop: '-10px' };
  const title = { textAlign: 'center', fontSize: '20px', color: '#fff', marginTop: '-10px' };
  const sectitle = { marginTop: '4px', fontSize: '10px' };
  const head = { textAlign: 'center', color: '#fff' };

  const formRef = useRef();
  const handelShowExportList = () => {
    setexportlistvisible(true);
  };
  const closemodal = () => {
    setexportlistvisible(false);
  };

  function handleExportExcel() {
    // 导出
    const queryParams = formRef.current.getFieldsValue();
    queryParams.orderTypes = [3];
    queryParams.hasRefund = 0;
    queryParams.orderStatus = 2;
    if (Array.isArray(queryParams.dateTimeRange)) {
      queryParams.startTime = moment(queryParams.dateTimeRange[0]).startOf('day').format("YYYY-MM-DD HH:mm:ss");
      queryParams.endTime = moment(queryParams.dateTimeRange[1]).endOf('day').format("YYYY-MM-DD HH:mm:ss");
    }
    exportpackageList(queryParams).then((res) => {
      message.success('请稍后在导出列表中下载！');
    });
  }

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '运营商',
      align: 'center',
      dataIndex: 'merchantId',
      valueEnum: organizationOptions,
      hideInTable: true,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '时间区间',
      align: 'center',
      dataIndex: 'dateTimeRange',
      valueType: 'dateRange',
      hideInTable: true,
    },
    {
      title: '序号',
      align: 'center',
      renderText: (text, row, index) => index + 1,
    },
    {
      title: '商户订单号',
      align: 'center',
      dataIndex: 'tradeNo',
      hideInSearch: true,
    },
    {
      title: '微信支付订单号',
      align: 'center',
      dataIndex: 'outTradeNo',
      hideInSearch: true,
    },
    {
      title: '产品名称',
      align: 'center',
      dataIndex: 'goodsName',
      hideInSearch: true,
    },
    {
      title: '标价金额',
      align: 'center',
      dataIndex: 'totalAmount',
      renderText: (text) => (text / 100).toFixed(2),
      hideInSearch: true,
    },
    {
      title: '优惠券使用量',
      align: 'center',
      dataIndex: 'couponCount',
      hideInSearch: true,
    },
    {
      title: '优惠金额（元）',
      align: 'center',
      dataIndex: 'couponTotalAmount',
      renderText: (text) => (text / 100).toFixed(2),
      hideInSearch: true,
    },
    {
      title: '实收套餐金额（元）',
      align: 'center',
      dataIndex: 'settlementTotalAmount',
      renderText: (text) => (text / 100).toFixed(2),
      hideInSearch: true,
    },
    {
      title: '套餐分润金额（元）',
      align: 'center',
      dataIndex: 'shareBenefitAmount',
      renderText: (text) => (text / 100).toFixed(2),
      hideInSearch: true,
    },
    {
      title: '用户名',
      align: 'center',
      dataIndex: 'consumerName',
      hideInSearch: true,
    },
    {
      title: '商户名称',
      align: 'center',
      dataIndex: 'merchantName',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
      hideInSearch: true,
    },
    {
      title: '更新时间',
      align: 'center',
      dataIndex: 'updateTime',
      hideInSearch: true,
    },
  ];

  const optionButtons = hasAuthority(buttons.finance.package.index.export)
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
      <Row gutter={16} style={{ marginBottom: '10px' }}>
        <Col className="gutter-row" {...collayout}>
          <div style={style}>
            <div style={block}>
              <Row style={head}>
                <Col span={12} style={item}>
                  <div>{allSettlementTotalAmount}元</div>
                  <div style={sectitle}>税前</div>
                </Col>
                <Col span={12} style={item}>
                  <div>{(Number(allSettlementTotalAmount) * 0.994).toFixed(2)}元</div>
                  <div style={sectitle}>税后（税率0.6%）</div>
                </Col>
              </Row>
              <div style={title}>当前总收入</div>
            </div>
          </div>
        </Col>
        <Col className="gutter-row" {...collayout}>
          <div style={secstyle}>
            <div style={block}>
              <Row style={head}>
                <Col span={24} style={secitem}>
                  <div>{totalWithdrawAmount}元</div>
                </Col>
              </Row>
              <div
                style={{ textAlign: 'center', fontSize: '20px', color: '#fff', marginTop: '-4px' }}
              >
                累计已提现
              </div>
            </div>
          </div>
        </Col>
        <Col className="gutter-row" {...collayout}>
          <div style={style}>
            <div style={block}>
              <Row style={head}>
                <Col span={12} style={item}>
                  <div>{prevMonthAmount}元</div>
                  <div style={sectitle}>税前</div>
                </Col>
                <Col span={12} style={item}>
                  <div>{(Number(prevMonthAmount) * 0.994).toFixed(2)}元</div>
                  <div style={sectitle}>税后（税率0.6%）</div>
                </Col>
              </Row>
              <div style={title}>上月总收入</div>
            </div>
          </div>
        </Col>
        <Col className="gutter-row" {...collayout}>
          <div style={secstyle}>
            <div style={block}>
              <Row style={head}>
                <Col span={12} style={item}>
                  <div>{currentMonthAmount}元</div>
                  <div style={sectitle}>税前</div>
                </Col>
                <Col span={12} style={item}>
                  <div>{(Number(currentMonthAmount) * 0.994).toFixed(2)}元</div>
                  <div style={sectitle}>税后（税率0.6%）</div>
                </Col>
              </Row>
              <div style={title}>本月套餐收入</div>
            </div>
          </div>
        </Col>
      </Row>
      <ProTable<TableListItem>
        bordered
        options={false}
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
        title={() => [
          <span
            style={{
              display: 'block',
              paddingTop: '9px',
              width: '100%',
              height: '40px',
              backgroundColor: '#E6F7FF',
              color: '#000',
              fontSize: '14px',
              border: '1px #91D5FF',
              lineHeight: '22px',
              MozBorderRadius: '10%',
              borderRadius: '5px',
            }}
          >
            &nbsp;&nbsp;&nbsp;&nbsp;总标价金额
            <span style={{ color: '#2496FF' }}>{totalAmount}</span>元&nbsp;&nbsp;总优惠金额
            <span style={{ color: '#2496FF' }}>{totalCouponAmount}</span>
            元&nbsp;&nbsp;总实收金额<span style={{ color: '#2496FF' }}>{totalSettleAmount}</span>
            元&nbsp;&nbsp;&nbsp;&nbsp;
          </span>,
        ]}
        actionRef={actionRef}
        rowKey="id"
        formRef={formRef}
        beforeSearchSubmit={beforeSearchSubmit}
        params={{ orderTypes: 3, hasRefund: 0, orderStatus: 2 }}
        request={(params) => {
          return getPackagelist(params).then((res) => {
            settotalAmount((res.data.data.totalAmount / 100).toFixed(2));
            settotalCouponAmount((res.data.data.totalCouponAmount / 100).toFixed(2));
            settotalSettleAmount((res.data.data.totalSettleAmount / 100).toFixed(2));
            return {
              data: res.data.data.payOrderInfoList,
              success: true,
              total: res.data.data.total,
            };
          });
        }}
        columns={columns}
      />
      {exportlistvisible && <ExportTable module="3" cancel={closemodal} />}
    </>
  );
};

export default TableList;
