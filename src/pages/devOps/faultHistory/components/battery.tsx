import React, {useEffect, useState} from "react";
import ProTable, {ProColumns} from "@ant-design/pro-table";
import {TableListItem} from "@/pages/devOps/batteryOwnershipHistory/data";
import {queryBatteryFaultHistory} from "@/services/merchant";
import {getEnumEntities} from "@/services/manager";
import moment from "moment";

const BatteryFault: React.FC<{}> = () => {

  const [faultInfo, setFaultInfo] = useState<object>([]);
  useEffect(() => {
    //获取故障码全部信息
    getEnumEntities('BATTERY_FAULT_CODE').then((res) => {
        let obj = {}
        res.data.data.forEach(item => {
          obj[item.entityKey] = item.entityValue;
        })
        setFaultInfo(obj)
      }
    )
  }, []);

  const beforeSubmit = (params) => {
    if (Array.isArray(params.date)) {
      params.beginTime = moment(params.date[0]).startOf('day').format("YYYY/MM/DD HH:mm:ss");
      params.endTime = moment(params.date[1]).endOf('day').format("YYYY/MM/DD HH:mm:ss");
    }
    return params;
  }

  const request = (params) => {
    return queryBatteryFaultHistory(params).then((res) => {
      return {data: res.data.data, success: true, total: res.data.total};
    })
  }


  // 列表及搜索条件
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      align: 'center',
      dataIndex: 'no',
      hideInSearch: true,
      renderText: (val: string, _, index) => `${index + 1}`,
    },
    {
      title: '设备编号',
      align: 'center',
      dataIndex: 'deviceCode',
      hideInSearch: false,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '故障码',
      dataIndex: 'faultCode',
      align: 'center',
      valueEnum: faultInfo,
      hideInSearch: false,
      hideInTable: true,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '故障码',
      dataIndex: 'faultCode',
      align: 'center',
      hideInTable: false,
      hideInSearch: true,
    },
    {
      title: '故障描述',
      align: 'center',
      dataIndex: 'faultCodeDesc',
      hideInSearch: true,
    },
    {
      title: '故障时间',
      align: 'center',
      dataIndex: 'faultTime',
      valueType: 'dateRange',
      hideInSearch: true,
    },
    {
      title: '时间区间',
      align: 'center',
      dataIndex: 'date',
      valueType: 'dateRange',
      hideInSearch: false,
      hideInTable: true,
    },
  ];
  return (
    <ProTable<TableListItem>
      bordered
      options={{
        density: false,
        fullScreen: false,
        reload: false,
        setting: false,
      }}
      rowKey="id"
      toolBarRender={false}
      columns={columns}
      beforeSearchSubmit={beforeSubmit}
      request={request}
    />
  );
};

export default BatteryFault;
