import React, {useRef, useState} from 'react';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';

import {TableListItem} from './data';
import {subList} from '@/services/consumer';
import {enumConverter, enums} from '@/utils/enums';
import SubPackageModal from "@/pages/merchant/substitute/components/SubPackageModal";
import SubDepositModal from "@/pages/merchant/substitute/components/SubDepositModal";
import WithdrawModal from "@/pages/merchant/substitute/components/WithdrawModal";
import {buttons, hasAuthority} from "@/utils/buttons";
import SearchFormOption from "@/components/SearchFormOption";
import moment from "moment";

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [subDepositVisible, setSubDepositVisible] = useState<boolean>(false);
  const [subPackageVisible, setSubPackageVisible] = useState<boolean>(false);
  const [withdrawVisible, setWithdrawVisible] = useState<boolean>(false);
  const [selectedRowList, setSelectedRowList] = useState<[]>([]);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '代缴时间范围',
      align: 'center',
      dataIndex: 'dateRange',
      valueType: 'dateRange',
      hideInTable: true,
      order: 9,
    },
    {
      title: '序号',
      align: 'center',
      dataIndex: 'index',
      hideInSearch: true,
      renderText: (text, row, index) => index + 1,
    },
    {
      title: '用户名',
      align: 'center',
      dataIndex: 'name',
      hideInSearch: true,
    },
    {
      title: '手机号码',
      align: 'center',
      dataIndex: 'mobileNo',
      order: 10,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '绑定电池编号',
      align: 'center',
      dataIndex: 'batteryDeviceCode',
      hideInSearch: true,
    },
    {
      title: '电池规格',
      align: 'center',
      dataIndex: 'batterySpecification',
      valueEnum: enumConverter(enums.BatterySpecificationEnum),
      hideInSearch: true,
    },
    {
      title: '运营商',
      align: 'center',
      dataIndex: 'merchantName',
      hideInSearch: true,
    },
    {
      title: '押金状态',
      align: 'center',
      dataIndex: 'depositStatus',
      valueEnum: enumConverter(enums.ConsumerDepositStatusEnum),
      order: 8,
      formItemProps: {
        allowClear: true,
      },
    },
    {
      title: '押金缴纳方式',
      align: 'center',
      dataIndex: 'depositModel',
      valueEnum: enumConverter(enums.ConsumerDepositModelEnum),
      hideInSearch: true,
    },
    {
      title: '代缴金额(元)',
      align: 'center',
      dataIndex: 'depositAmount',
      renderText: (val: number) => (val / 100).toFixed(2),
      hideInSearch: true,
    },
    {
      title: '代缴时间',
      align: 'center',
      dataIndex: 'depositTime',
      hideInSearch: true,
    },
  ];

  /**
   * 代缴押金 按钮点击事件
   */
  const subDepositOnClick = () => {
    setSubDepositVisible(true);
  }

  /**
   * 代缴押金 model框关闭
   */
  const subDepositHandleModelClose = () => {
    setSubDepositVisible(false);
    actionRef.current.reload();
  }

  /**
   * 代缴套餐 按钮点击事件
   */
  const subPackageOnClick = () => {
    setSubPackageVisible(true);
  }

  /**
   * 代缴套餐 model框关闭
   */
  const subPackageHandleModelClose = () => {
    setSubPackageVisible(false);
    actionRef.current.reload();
  }
  /**
   * 提现 按钮点击事件
   */
  const withdrawOnClick = () => {
    setWithdrawVisible(true);
  }

  /**
   * 提现 model框关闭
   */
  const withdrawHandleModelClose = () => {
    setWithdrawVisible(false);
    actionRef.current.reload();
  }
  /**
   * 查询表单参数预处理
   * @param params
   */
  const beforeSearchSubmit = (params) => {
    if (Array.isArray(params.dateRange)) {
      params.depositStartTime = moment(params.dateRange[0]).startOf('day').format('YYYY/MM/DD HH:mm:ss');
      params.depositEndTime = moment(params.dateRange[1]).endOf('day').format('YYYY/MM/DD HH:mm:ss');
    }
    return params;
  }

  /**
   * 表单查询请求
   * @param params
   */
  const request = (params) => {
    return subList(params).then((res) => {
      setSelectedRowList([]);
      return {data: res.data.data, success: true, total: res.data.total};
    })
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowList(selectedRows);
    },
    getCheckboxProps: record => ({
      disabled: record.batteryDeviceCode !== null || record.depositStatus !== 1 || record.depositModel !== 2
    }),
  };

  function optionButtons() {
    let options = [];
    if (hasAuthority(buttons.merchant.substitute.index.subDeposit)) {
      options.push({
        text: "代缴押金",
        firstRow: false,
        onClick: subDepositOnClick
      })
    }
    if (hasAuthority(buttons.merchant.substitute.index.subDeposit)) {
      options.push({
        text: "代缴套餐",
        firstRow: false,
        onClick: subPackageOnClick
      });
    }
    if (hasAuthority(buttons.merchant.substitute.index.subDeposit)) {
      options.push({
        text: "提现",
        firstRow: false,
        onClick: withdrawOnClick
      });
    }
    return options;
  }
  const searchButtonsColConfig = {
    xs: 24,
    sm: 12,
    md: 12,
    lg: 12,
    xl: 8,
    xxl: 6,
  }
  return (
    <>
      <ProTable<TableListItem>
        bordered
        options={false}
        toolBarRender={false}
        search={{
          span: searchButtonsColConfig,
          optionRender: (searchConfig, props) =>
            <SearchFormOption searchConfig={searchConfig}
                              {...props}
                              optionButtons={optionButtons()}/>
        }}
        rowKey="consumerId"
        rowSelection={rowSelection}
        actionRef={actionRef}
        beforeSearchSubmit={beforeSearchSubmit}
        request={request}
        columns={columns}

      />
      {subDepositVisible && <SubDepositModal handleModelClose={subDepositHandleModelClose}/>}
      {subPackageVisible && <SubPackageModal handleModelClose={subPackageHandleModelClose}/>}
      {withdrawVisible && <WithdrawModal handleModelClose={withdrawHandleModelClose} selectedRows={selectedRowList}/>}
    </>
  );
};

export default TableList;
