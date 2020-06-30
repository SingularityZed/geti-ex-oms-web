import React, {useRef, useState} from "react";
import ProTable, {ActionType, ProColumns} from "@ant-design/pro-table";
import {TableListItem} from "@/pages/devOps/batteryOwnershipHistory/data";
import {getCabinetDeviceList} from "@/services/device";
import {batchAddCabinetDevice} from "@/services/merchant";
import {Button, message} from "antd";
import {buttons, hasAuthority} from "@/utils/buttons";
import SearchFormOption from "@/components/SearchFormOption";

const CabinetAdd: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [deviceCodeList, setDeviceCodeList] = useState<object>([]);

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
      title: '设备规格',
      dataIndex: 'deviceSpecification',
      align: 'center',
      hideInSearch: true,
      valueType: 'textarea',
    },
    {
      title: '批次号',
      align: 'center',
      dataIndex: 'batchNo',
      hideInSearch: true,
    },
    {
      title: '产品ID',
      align: 'center',
      dataIndex: 'productId',
      hideInSearch: true,
    },
    {
      title: '产品名称',
      align: 'center',
      dataIndex: 'productName',
      hideInSearch: true,
    },
    {
      title: '产品类型',
      align: 'center',
      dataIndex: 'productType',
      hideInSearch: true,
    },
    {
      title: '厂商名称',
      align: 'center',
      dataIndex: 'supplierName',
      hideInSearch: true,
    },
  ];

  const rowSelection = {
    onChange(selectedRowKeys, selectedRows) {
      let list: any[] = [];
      if (selectedRows.length > 0) {
        selectedRows.map((item: { deviceCode: any; }) => {
          list.push(item.deviceCode)
        })
      }
      setDeviceCodeList(list);
    },
  };

  function batchAdd() {
    if (deviceCodeList.length > 0) {
      let param = {
        deviceType: 2,
        deviceList: deviceCodeList
      }
      batchAddCabinetDevice(param).then((res) => {
        if (res.data.data.failDeviceCode) {
          message.warn('添加' + ' ' + '电柜编号' + res.data.data.failDeviceCode.toString() + '失败', 5)
        } else {
          message.success(res.data.message);
        }
        actionRef.current.reload();
      }).catch(errorInfo => {

      })
    } else {
      alert("请先选择设备")
    }
  }

  const optionButtons = hasAuthority(buttons.equipment.add.cabinet.addBatch) ? [
    {
      text: "批量新增",
      onClick: batchAdd
    }
  ] : []


  return (
    <ProTable<TableListItem>
      bordered
      options={{
        density: false,
        fullScreen: false,
        reload: false,
        setting: false,
      }}
      actionRef={actionRef}
      toolBarRender={false}
      search={{
        optionRender: (searchConfig, props) =>
          <SearchFormOption searchConfig={searchConfig}
                            {...props}
                            optionButtons={optionButtons}/>
      }}
      rowKey="deviceCode"
      columns={columns}
      rowSelection={rowSelection}
      request={(params) =>
        getCabinetDeviceList(params).then((res) => {
          return {data: res.data.data, success: true, total: res.data.total};
        })
      }
    />
  );
};

export default CabinetAdd;
