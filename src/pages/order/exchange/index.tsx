import React, {useEffect, useRef, useState} from 'react';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import {TableListItem} from './data.d';
import {queryExchangeOrder, resolveExceptionBattery} from '@/services/order';
import {exportExchangeExcel} from '@/services/businessMonitor';
import {getEnumEntities} from '@/services/manager';
import Details from './components/Details';
import {message, Modal, Tag, Space} from 'antd';
import {enumConverter, enums} from '@/utils/enums';
import moment from 'moment';
import ExportTable from '@/components/ExportTable';
import {getOrganizationAll} from '@/services/merchant';
import {buttons, hasAuthority} from '@/utils/buttons';
import SearchFormOption from '@/components/SearchFormOption';

const TableList: React.FC<{}> = () => {
  const [detailsVisible, setdetailsVisible] = useState<boolean>(false);
  const [exchangeOrderId, setExchangeOrderId] = useState<object>();
  const [entityList, setEntityList] = useState<object>([]);
  const actionRef = useRef<ActionType>();
  const formRef = useRef();
  const [exportListVisiable, setExportListVisiable] = useState<boolean>(false);

  useEffect(() => {
    //获取运营商全部信息
    getOrganizationAll().then((res) => {
      getEnumEntities('EXCHANGE_ORDER_RESULT_CODE').then((res) => {
        let obj = {};
        res.data.data.forEach((item) => {
          obj[item.entityKey] = item.entityValue;
        });
        setEntityList(obj);
      });
    });
  }, []);

  /**
   * 请求参数设置
   *
   * @param params
   */
  const beforeSubmit = (params) => {
    if (Array.isArray(params.createTime)) {
      params.startTime = moment(params.createTime[0]).format("YYYY/MM/DD HH:mm:ss");
      params.endTime = moment(params.createTime[1]).format("YYYY/MM/DD HH:mm:ss");
    }
    if (params.returnBatteryCode) {
      params.batteryDeviceCode = params.returnBatteryCode
    }
    return params;
  };

  /**
   * 请求数据
   *
   * @param params
   */
  const request = (params) => {
    return queryExchangeOrder(params).then((res) => {
      return {data: res.data.data, success: true, total: res.data.total};
    });
  };

  /**
   * 详情
   * @param record
   */
  const handelDetail = (record) => {
    setdetailsVisible(true);
    setExchangeOrderId(record.exchangeOrderId);
  };
  /**
   * 解除异常订单
   * @param record
   */
  const handleResolveBattery = (record) => {
    Modal.confirm({
      title: '解除订单异常',
      content: '确认解除订单异常',
      onOk: () => {
        resolveExceptionBattery({
          exchangeOrderId: record.exchangeOrderId,
          returnBatteryCode: record.returnBatteryCode,
        }).then(() => {
          message.success('解除订单异常成功');
          actionRef.current.reload();
        });
      },
    });
  };

  /**
   * 导出
   *
   * @param queryParams
   */
  function handleExportExcel() {
    // 导出
    let queryParams = formRef.current.getFieldsValue();
    if (Array.isArray(queryParams.createTime)) {
      queryParams.startTime = moment(queryParams.createTime[0]).format('YYYY-MM-DD HH:mm:ss');
      queryParams.endTime = moment(queryParams.createTime[1]).format('YYYY-MM-DD HH:mm:ss');
    }
    if (queryParams.returnBatteryCode) {
      queryParams.batteryDeviceCode = queryParams.returnBatteryCode
    }
    exportExchangeExcel(queryParams).then((res) => {
      if (res.data.code === '000000') {
        message.success('请稍后在导出列表中下载！');
      }
    });
  }

  function handelShowExportList() {
    setExportListVisiable(true);
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
      dataIndex: 'exchangeOrderId',
      order: 4,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '点位名称',
      align: 'center',
      dataIndex: 'cabinetName',
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
      title: '换电柜编号',
      align: 'center',
      dataIndex: 'cabinetDeviceCode',
      order: 9,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '电池编号',
      align: 'center',
      dataIndex: 'returnBatteryCode',
      hideInForm: true,
      hideInTable: true,
      order: 3,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '归还电池',
      align: 'center',
      dataIndex: 'returnBatteryCode',
      children: [
        {
          title: '编号',
          dataIndex: 'returnBatteryCode',
        },
        {
          title: '电量',
          dataIndex: 'returnBatterySoc',
        },
      ],
      hideInSearch: true,
    },
    {
      title: '借出电池',
      align: 'center',
      dataIndex: 'borrowBatteryCode',
      children: [
        {
          title: '编号',
          dataIndex: 'borrowBatteryCode',
        },
        {
          title: '电量',
          dataIndex: 'borrowBatterySoc',
        },
      ],
      hideInSearch: true,
    },
    {
      title: '订单状态',
      align: 'center',
      dataIndex: 'status',
      valueEnum: enumConverter(enums.ExchangeOrderStatusEnum),
      order: 5,
      render: (_, record) => {
        let obj = enums.ExchangeOrderStatusEnum.find((item) => item.value == record.status);
        return <Tag color={obj.color}>{obj.text}</Tag>;
      },
      formItemProps: {
        allowClear: true,
      },
    },
    {
      title: '异常原因',
      align: 'center',
      dataIndex: 'resultCodeName',
      renderText: (text, row, index) => (row.status == 2 ? '' : text),
      hideInSearch: true,
      ellipsis: true,
      onCell: () => {
        return {
          style: {
            maxWidth: 150,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            cursor: 'pointer',
          },
        };
      },
    },
    {
      title: '异常原因',
      align: 'center',
      dataIndex: 'resultCode',
      valueEnum: entityList,
      hideInTable: true,
      order: 6,
      formItemProps: {
        allowClear: true,
      },
    },
    {
      title: '换电类型',
      align: 'center',
      dataIndex: 'exchangeType',
      valueEnum: enumConverter(enums.ExchangeType),
      hideInSearch: true,
    },
    {
      title: '业务标识',
      align: 'center',
      dataIndex: 'bizField',
      valueEnum: enumConverter(enums.bizField),
      order: 1,
      formItemProps: {
        allowClear: true,
      },
    },
    {
      title: '完成时间',
      align: 'center',
      dataIndex: 'completeTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '时间区间',
      align: 'center',
      dataIndex: 'createTime',
      valueType: 'dateTimeRange',
      hideInForm: true,
      hideInTable: true,
      order: 2,
    },
    {
      title: '操作',
      align: 'center',
      valueType: 'option',
      dataIndex: 'option',
      width: '150px',
      render: (_, record) => (
        <>
          <Space>
            {hasAuthority(buttons.order.exchange.index.detail) && (
              <a onClick={handelDetail.bind(_, record)}>详情</a>
            )}
            {hasAuthority(buttons.order.exchange.index.resolve) && record.status == 4 && (
              <a onClick={handleResolveBattery.bind(_, record)}>解除订单异常</a>
            )}
          </Space>
        </>
      ),
    },
  ];

  function optionButtons() {
    let options = [];
    if (hasAuthority(buttons.order.exchange.index.export)) {
      options.push({
        text: '导出',
        onClick: handleExportExcel,
      });
      options.push({
        text: '导出列表',
        onClick: handelShowExportList,
      });
      return options;
    }
  }

  return (
    <>
      <ProTable<TableListItem>
        style={{display: detailsVisible ? 'none' : ''}}
        bordered
        options={false}
        toolBarRender={false}
        search={{
          optionRender: (searchConfig, props) => (
            <SearchFormOption
              searchConfig={searchConfig}
              {...props}
              optionButtons={optionButtons()}
            />
          ),
        }}
        actionRef={actionRef}
        rowKey="exchangeOrderId"
        beforeSearchSubmit={beforeSubmit}
        request={request}
        columns={columns}
        formRef={formRef}
      />

      {detailsVisible && (
        <Details
          handleReturn={() => {
            setdetailsVisible(false);
            actionRef.current.reload();
          }}
          exchangeOrderId={exchangeOrderId}
        />
      )}

      {exportListVisiable && (
        <ExportTable
          module="1"
          cancel={() => {
            setExportListVisiable(false);
          }}
        />
      )}
    </>
  );
};

export default TableList;
