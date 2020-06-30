import React, {useRef, useState} from 'react';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import {TableListItem} from './data';
import {queryOrder} from '@/services/pay';
import {payOrderExcel} from '@/services/businessMonitor';
import {enumConverter, enums} from '../../../../src/utils/enums';
import {message} from "antd";
import moment from "moment";
import ExportTable from "@/components/ExportTable";
import {buttons, hasAuthority} from "@/utils/buttons";
import SearchFormOption from "@/components/SearchFormOption";


const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef()
  const [exportListVisiable, setExportListVisiable] = useState<boolean>(false);

  const beforeSubmit = (params) => {
    if (Array.isArray(params.createTime)) {
      params.startTime = moment(params.createTime[0]).startOf('day').format("YYYY/MM/DD HH:mm:ss");
      params.endTime = moment(params.createTime[1]).endOf('day').format("YYYY/MM/DD HH:mm:ss");
    }
    return params;
  }

  const request = (params) => {
    params.orderTypes ? "" : (params.orderTypes = "3,4,6");
    return queryOrder(params).then((res) => {
      return {data: res.data.data, success: true, total: res.data.total};
    })
  }

  /**
   * 导出
   *
   * @param queryParams
   */
  function handleExportExcel() {
    // 导出
    let queryParams = formRef.current.getFieldsValue()
    queryParams.orderTypes = [3, 4, 6]
    if (Array.isArray(queryParams.createTime)) {
      queryParams.startTime = moment(queryParams.createTime[0]).startOf('day').format("YYYY-MM-DD HH:mm:ss");
      queryParams.endTime = moment(queryParams.createTime[1]).endOf('day').format("YYYY-MM-DD HH:mm:ss");
    }
    payOrderExcel(queryParams).then(res => {
      if (res.data.code === "000000") {
        message.success("请稍后在导出列表中下载！");
      }
    });
  }

  function handelShowExportList() {
    setExportListVisiable(true)
  }

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      align: 'center',
      renderText: (text, row, index) => index + 1,
    },
    {
      title: '订单号',
      align: 'center',
      dataIndex: 'orderNo',
      order: 9,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '商户订单号',
      align: 'center',
      dataIndex: 'tradeNo',
      order: 8,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '骑手手机号',
      align: 'center',
      dataIndex: 'mobileNo',
      order: 10,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '业务类型',
      align: 'center',
      dataIndex: 'orderType',
      valueEnum: enumConverter(enums.OrderPackageTypeEnum),
      order: 7,
      formItemProps: {
        allowClear: true,
      },
    },
    {
      title: '产品名称',
      align: 'center',
      dataIndex: 'goodsName',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '标价金额(元)',
      align: 'center',
      dataIndex: 'totalAmount',
      renderText: (val: number) => (val / 100).toFixed(2),
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '用券数量',
      align: 'center',
      dataIndex: 'couponCount',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '优惠金额(元)',
      align: 'center',
      // dataIndex: "couponTotalAmount",
      renderText: (text, row, index) =>
        ((row.totalAmount - row.settlementTotalAmount) / 100).toFixed(2),
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '实付金额(元)',
      align: 'center',
      dataIndex: 'settlementTotalAmount',
      renderText: (val: number) => (val / 100).toFixed(2),
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '用户名',
      align: 'center',
      dataIndex: 'consumerName',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '支付状态',
      align: 'center',
      dataIndex: 'orderStatus',
      valueEnum: enumConverter(enums.OrderStatusEnum),
      order: 6,
      formItemProps: {
        allowClear: true,
      },
    },
    {
      title: '商户名称',
      align: 'center',
      dataIndex: 'merchantName',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '时间区间',
      align: 'center',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      hideInForm: true,
      hideInTable: true,
      order: 5,
    },
    {
      title: '支付时间',
      align: 'center',
      dataIndex: 'finishTime',
      valueType: 'dateTime',
      hideInForm: true,
      hideInSearch: true,
      renderText: (text, row, index) => (row.orderStatus == 2 || 4 ? text : ''),
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInForm: true,
      hideInSearch: true,
    },
  ];


  function optionButtons() {
    let options = [];
    if (hasAuthority(buttons.order.payOrder.index.export)) {
      options.push({
        text: "导出",
        onClick: handleExportExcel
      });
    options.push({
      text: "导出列表",
      onClick: handelShowExportList
    });
    }

    return options;
  }

  return (
    <>
      <ProTable<TableListItem>
        bordered
        options={false}
        toolBarRender={false}
        search={{
          optionRender: (searchConfig, props) =>
            <SearchFormOption searchConfig={searchConfig}
                              {...props}
                              optionButtons={optionButtons()}/>
        }}
        actionRef={actionRef}
        rowKey="id"
        beforeSearchSubmit={beforeSubmit}
        request={request}
        columns={columns}
        formRef={formRef}
      />
      {(exportListVisiable) && <ExportTable module='3' cancel={() => {
        setExportListVisiable(false)
      }}/>}
    </>

  )
    ;
};

export default TableList;
