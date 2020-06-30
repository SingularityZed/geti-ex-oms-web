import React, { useRef, useState, useEffect } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { TableListItem } from './data';
import { enumConverter, enums } from '../../../utils/enums';
import { Col, Row, Divider, message, Button } from 'antd';
import moment from 'moment';
import ExportTable from '@/components/ExportTable';
import { getdepositeList, getdepositeAmount } from '@/services/pay';
import { getOrganizationAll } from '@/services/merchant';
import { exportdepositeList } from '@/services/businessMonitor';
import { hasAuthority, buttons } from '@/utils/buttons';
import { getUserInfo } from '@/utils/authority';
import SearchFormOption from '@/components/SearchFormOption';

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [organizationOptions, setOrganizationOptions] = useState<object>([]);
  const [currentAmount, setcurrentAmount] = useState<any>('0.00');
  const [totalInAmount, settotalInAmount] = useState<any>('0.00');
  const [totalRefundAmount, settotalRefundAmount] = useState<any>('0.00');
  const [prevMonthAmount, setprevMonthAmount] = useState<any>('0.00');
  const [prevMonthRefundAmount, setprevMonthRefundAmount] = useState<any>('0.00');
  const [currentMonthAmount, setcurrentMonthAmount] = useState<any>('0.00');
  const [currentMonthRefundAmount, setcurrentMonthRefundAmount] = useState<any>('0.00');
  const [exportlistvisible, setexportlistvisible] = useState<boolean>(false);
  const style = { background: '#0092ff', padding: '8px 0', borderRadius: '15px' };
  const secstyle = { background: '#465881', padding: '8px 0', borderRadius: '15px' };
  const item = { fontSize: '16px', marginBottom: '10px', marginTop: '10px' };
  const secitem = { fontSize: '20px', marginBottom: '20px' };
  const block = { height: '60px', marginBottom: '10px' };
  const title = { textAlign: 'center', fontSize: '20px', color: '#fff',marginTop:'-14px' };
  const sectitle ={marginTop:'4px' }
  const head = { textAlign: 'center', color: '#fff' };
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
    getdepositeAmount().then((res) => {
      const data = res.data.data;
      setcurrentAmount((data.currentAmount / 100).toFixed(2));
      setcurrentMonthAmount((data.currentMonthAmount / 100).toFixed(2));
      setcurrentMonthRefundAmount((data.currentMonthRefundAmount / 100).toFixed(2));
      setprevMonthAmount((data.prevMonthAmount / 100).toFixed(2));
      setprevMonthRefundAmount((data.prevMonthRefundAmount / 100).toFixed(2));
      settotalInAmount((data.totalInAmount / 100).toFixed(2));
      settotalRefundAmount((data.totalRefundAmount / 100).toFixed(2));
    });
  }, []);
  const beforeSearchSubmit = (params) => {
    // 修改日期数据格式
    if (Array.isArray(params.dateTimeRange)) {
      params.startTime =moment (params.dateTimeRange[0]).startOf('day').format("YYYY/MM/DD HH:mm:ss");
      params.endTime =moment (params.dateTimeRange[1]).endOf('day').format("YYYY/MM/DD HH:mm:ss");
    }
    delete params.dateTimeRange;
    return params;
  };
  // 控制导出列表显示
  const showmodal = () => {
    setexportlistvisible(true);
  };
  const closemodal = () => {
    setexportlistvisible(false);
  };
  function handleExportExcel() {
    // 导出
    const queryParams = formRef.current.getFieldsValue();
    queryParams.orderTypes = [1, 5];
    if (Array.isArray(queryParams.dateTimeRange)) {
      queryParams.startTime = moment(queryParams.dateTimeRange[0]).startOf('day').format("YYYY-MM-DD HH:mm:ss");
      queryParams.endTime = moment(queryParams.dateTimeRange[1]).endOf('day').format("YYYY-MM-DD HH:mm:ss");
    }
    exportdepositeList(queryParams).then((res) => {
      message.success('请稍后在导出列表中下载！');
    });
  }
  const formRef = useRef();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '运营商',
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
      title: '用户名',
      align: 'center',
      dataIndex: 'consumerName',
      hideInSearch: true,
    },
    {
      title: '产品名称',
      align: 'center',
      dataIndex: 'goodsName',
      hideInSearch: true,
    },
    {
      title: '实付金额(元)',
      align: 'center',
      dataIndex: 'settlementTotalAmount',
      renderText: (text) => (text / 100).toFixed(2),
      hideInSearch: true,
    },
    {
      title: '支付方式',
      align: 'center',
      dataIndex: 'payType',
      valueEnum: enumConverter(enums.PayTypeEnum),
      hideInSearch: true,
    },
    {
      title: '业务类型',
      align: 'center',
      dataIndex: 'orderType',
      valueEnum: enumConverter([
        { text: '缴纳押金', value: 1 },
        { text: '退还押金', value: 5 },
      ]),
      formItemProps: {
        allowClear: true,
      },
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
  const optionButtons = hasAuthority(buttons.finance.deposit.index.export) ? [
    {
      text: "导出",
      onClick: handleExportExcel
    },
    {
      text: "导出列表",
      onClick: showmodal
    }
  ] : []
  return (
    <>
        <Row gutter={16} style={{ marginBottom: '10px' }}>
          <Col className="gutter-row" {...collayout}>
            <div style={style}>
              <div style={block}>
                <Row style={head}>
                  <Col span={24} style={secitem}>
                    <div>{currentAmount}元</div>
                  </Col>
                </Row>
                <div style={title}>当前系统押金总额</div>
              </div>
            </div>
          </Col>
          <Col className="gutter-row" {...collayout}>
            <div style={secstyle}>
              <div style={block}>
                <Row style={head}>
                  <Col span={11} style={item}>
                    <div>{totalInAmount}元</div>
                    <div style={sectitle}>总收入押金</div>
                  </Col>
                  <Col span={2}>
                    <Divider type="vertical" style={{ height: '74px' }} />
                  </Col>
                  <Col span={11} style={item}>
                    <div>{totalRefundAmount}元</div>
                    <div style={sectitle}>总退还押金</div>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
          <Col className="gutter-row" {...collayout}>
            <div style={style}>
              <div style={block}>
                <Row style={head}>
                  <Col span={11} style={item}>
                    <div>{prevMonthAmount}元</div>
                    <div style={sectitle}>上月收入押金</div>
                  </Col>
                  <Col span={2}>
                    <Divider type="vertical" style={{ height: '74px' }} />
                  </Col>
                  <Col span={11} style={item}>
                    <div>{prevMonthRefundAmount}元</div>
                    <div style={sectitle}>上月退还押金</div>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
          <Col className="gutter-row" {...collayout}>
            <div style={secstyle}>
              <div style={block}>
                <Row style={head}>
                  <Col span={11} style={item}>
                    <div>{currentMonthAmount}元</div>
                    <div style={sectitle}>本月收入押金</div>
                  </Col>
                  <Col span={2}>
                    <Divider type="vertical" style={{ height: '74px' }} />
                  </Col>
                  <Col span={11} style={item}>
                    <div>{currentMonthRefundAmount}元</div>
                    <div style={sectitle}>本月退还押金</div>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
        <ProTable<TableListItem>
        bordered
          options={{
            density: false,
            fullScreen: false,
            reload: false,
            setting: false,
          }}
          actionRef={actionRef}
          rowKey="tradeNo"
          formRef={formRef}
          beforeSearchSubmit={beforeSearchSubmit}
          toolBarRender={false}
          search={{
            optionRender: (searchConfig, props) =>
              <SearchFormOption searchConfig={searchConfig}
                                {...props}
                                optionButtons={optionButtons}/>
          }}
          params={{ orderTypes: [1, 5] }}
          request={(params) => {
            return getdepositeList(params).then((res) => {
              return { data: res.data.data, success: true, total: res.data.total };
            });
          }}
          columns={columns}
        />
      {exportlistvisible && <ExportTable module="6" cancel={closemodal} />}
    </>
  );
};

export default TableList;
