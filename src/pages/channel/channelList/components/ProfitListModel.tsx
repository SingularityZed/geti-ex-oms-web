import React, {useEffect, useRef, useState} from 'react';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import {TableListItem} from './data';
import {channelProfitList, channelWithdrawConfirm, channelDetail} from '@/services/channel'
import DetailSiderBar from "@/components/DetailSiderBar";
import {Col, Form, Input, message, Modal, Row} from "antd";
import moment from "moment";
import {enumConverter, enums} from "@/utils/enums";

interface ProfitListModelProps {
  data: {};
  handleModelClose: () => void;
}

const ProfitListModel: React.FC<ProfitListModelProps> = (props) => {
  const actionRef = useRef<ActionType>();
  const {data, handleModelClose} = {...props};
  const [profit, setProfit] = useState<object>({});
  const collayout = {
    xs: 24,
    lg: 12
  }
  const style = {background: '#0092ff', padding: '8px 0', borderRadius: '15px'};
  const secstyle = {background: '#465881', padding: '8px 0', borderRadius: '15px'};
  const block = {height: '70px', marginBottom: '10px'};
  const title = {textAlign: 'center', fontSize: '26px', color: '#fff'};

  const beforeSearchSubmit = (params) => {
    if (Array.isArray(params.createTime)) {
      params.startTime = moment(params.createTime[0]).startOf('day').replaceAll("-", "/");
      params.endTime = moment(params.createTime[1]).endOf('day').replaceAll("-", "/");
    }
    return params
  }

  const request = (params) => {
    params.channelId = data.id
    return channelProfitList(params).then((res) => {
      return {data: res.data.data, success: true, total: res.data.total};
    })
  }

  useEffect(() => {
    channelDetail(data.id).then((r) => {
      setProfit({
        totalWithdrawAmount: ((r.data.data.totalWithdrawAmount) / 100).toFixed(2),
        canWithdrawAmount: ((r.data.data.canWithdrawAmount) / 100).toFixed(2)
      })
    })
  }, [])

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      renderText: (text, row, index) => {
        return index + 1
      }
    },
    {
      title: '商户订单号',
      dataIndex: 'tradeNo',
      hideInSearch: true
    },
    {
      title: '用户手机号',
      dataIndex: 'mobileNo',
    },
    {
      title: '用户名',
      dataIndex: 'consumerName',
      hideInSearch: true
    },
    {
      title: '产品名称',
      dataIndex: 'goodsName',
      hideInSearch: true
    },
    {
      title: '实收套餐分润（元）',
      dataIndex: 'shareBenefitAmount',
      renderText: (text, row, index) => (text / 100).toFixed(2),
      hideInSearch: true
    },
    {
      title: '分润状态',
      dataIndex: 'shareBenefitStatus',
      valueEnum: enumConverter(enums.ShareBenefitStatus),
      hideInSearch: true
    },
    {
      title: '商户名称',
      dataIndex: 'merchantName',
      hideInSearch: true
    },
    {
      title: '时间区间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      hideInTable: true
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      hideInSearch: true
    },
    {
      title: "渠道名称",
      dataIndex: "operatorName",
      hideInTable: true,
      renderFormItem: (item, config, form) => {
        return <Input defaultValue={data.operatorName} disabled={true}></Input>
      }
    },
    {
      title: "所属运营商",
      dataIndex: "merchantName",
      hideInTable: true,
      renderFormItem: (item, config, form) => {
        return <Input defaultValue={data.merchantName} disabled={true}></Input>
      }
    }
  ];

  return (
    <>
      <Row gutter={16} style={{marginBottom: '10px'}}>
        <Col className="gutter-row" {...collayout}>
          <div style={style}>
            <div style={block}>
              <div style={title}>{profit.totalWithdrawAmount}元</div>
              <div style={title}>累计已提现</div>
            </div>
          </div>
        </Col>
        <Col className="gutter-row" {...collayout}>
          <div style={secstyle}>
            <div style={block}>
              <div style={title}>{profit.canWithdrawAmount}元</div>
              <div style={title}>当前可提现</div>
            </div>
          </div>
        </Col>
      </Row>
      <DetailSiderBar handleReturn={handleModelClose}/>
      <ProTable<TableListItem>
        bordered
        options={false}
        toolBarRender={false}
        actionRef={actionRef}
        rowKey="id"
        request={request}
        beforeSearchSubmit={beforeSearchSubmit}
        columns={columns}
      />
    </>
  );
};

export default ProfitListModel;
