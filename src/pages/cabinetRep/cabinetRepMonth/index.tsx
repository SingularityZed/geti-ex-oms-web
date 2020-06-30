import React, {useEffect, useRef, useState} from 'react';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import {cabinetRepMonthexport, getCabinetRepMonth} from '@/services/businessMonitor';
import {DatePicker, message} from 'antd';
import ExportTable from '@/components/ExportTable';
import moment from 'moment';
import {getOrganizationAll} from '@/services/merchant';
import {getUserInfo} from '@/utils/authority';
import {buttons, hasAuthority} from '@/utils/buttons';
import SearchFormOption from '@/components/SearchFormOption';

interface TableListItem {
}

const {RangePicker} = DatePicker;
const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef();
  const [organizationOptions, setOrganizationOptions] = useState<object>([]);
  const [exportlistvisible, setexportlistvisible] = useState<boolean>(false);
  const [dateStrings, setDateStrings] = useState<[string]>();
  const paramRef = useRef();
  paramRef.current = {dateStrings}

  useEffect(() => {
    //获取运营商全部信息
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
  }, []);

  const handelShowExportList = () => {
    setexportlistvisible(true);
  };
  const closemodal = () => {
    setexportlistvisible(false);
  };

  const rangePickerOnChange = (dates, _dateStrings) => {
    setDateStrings(_dateStrings);
  }

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '时间区间',
      align: 'center',
      dataIndex: 'dateTimeRange',
      hideInTable: true,
      order: 8,
      renderFormItem: (item, config, form) => {
        return <RangePicker picker='month' onChange={rangePickerOnChange}/>;
      },
    },
    {
      title: '序号',
      align: 'center',
      dataIndex: 'index',
      hideInSearch: true,
      renderText: (text, row, index) => index + 1,
    },
    {
      title: '电柜设备号',
      align: 'center',
      dataIndex: 'cabinetDeviceCode',
      order: 10,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '电柜名称',
      align: 'center',
      dataIndex: 'cabinetName',
      order: 9,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '商户',
      align: 'center',
      dataIndex: 'merchantId',
      valueEnum: organizationOptions,
      order: 7,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '换电网络',
      align: 'center',
      dataIndex: 'powerExchangeNetworkName',
      hideInSearch: true,
    },
    {
      title: '统计月份',
      align: 'center',
      dataIndex: 'repMonth',
      hideInSearch: true,
    },
    {
      title: '换电人数',
      align: 'center',
      dataIndex: 'exchangeConsumer',
      hideInSearch: true,
    },
    {
      title: '换电次数',
      align: 'center',
      dataIndex: 'exchangeOrder',
      hideInSearch: true,
    },
    {
      title: '紧急换电次数',
      align: 'center',
      dataIndex: 'urgentExchangeOrder',
      hideInSearch: true,
    },
    {
      title: '异常订单数',
      align: 'center',
      dataIndex: 'exceptionExchangeOrder',
      hideInSearch: true,
    },
    {
      title: 'soc耗电量',
      align: 'center',
      dataIndex: 'totalSoc',
      hideInSearch: true,
      renderText: (text, row, index) =>
        row.totalSoc
          ? row.totalSoc + '(' + (row.totalSoc * 0.012).toFixed(2) + 'kW·h)'
          : '0(0kW·h)',
    },
  ];

  function handleExportExcel() {
    // 导出
    const queryParams = formRef.current.getFieldsValue();
    const _dateStrings = paramRef.current.dateStrings;
    if (_dateStrings && Array.isArray(_dateStrings)) {
      if (_dateStrings[0] && _dateStrings[0] !== '') {
        queryParams.repDateStart = moment(_dateStrings[0]).format('YYYYMM');
      }
      if (_dateStrings[1] && _dateStrings[1] !== '') {
        queryParams.repDateEnd = moment(_dateStrings[1]).format('YYYYMM');
      }
    }
    cabinetRepMonthexport(queryParams).then((res) => {
      message.success('请稍后在导出列表中下载！');
    });
  }

  const optionButtons = hasAuthority(buttons.cabinetRep.cabinetRepMonth.index.export)
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
        actionRef={actionRef}
        formRef={formRef}
        rowKey={(record, index) => index}
        request={(params) => {
          const _dateStrings = paramRef.current.dateStrings;
          if (_dateStrings && Array.isArray(_dateStrings)) {
            console.log(paramRef.current)
            try {
              if (_dateStrings[0] && _dateStrings[0] !== '') {
                params.repDateStart = moment(_dateStrings[0]).format('YYYYMM');
              }
              if (_dateStrings[1] && _dateStrings[1] !== '') {
                params.repDateEnd = moment(_dateStrings[1]).format('YYYYMM');
              }
            } catch (e) {
              console.log(e)
            }
          }
          return getCabinetRepMonth(params).then((res) => {
            return {data: res.data.data, success: true, total: res.data.total};
          });
        }}
        columns={columns}
      />
      {exportlistvisible && <ExportTable module='8' cancel={closemodal}/>}
    </>
  );
};

export default TableList;
