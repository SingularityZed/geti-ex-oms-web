import React, {useRef, useState} from "react";
import ProTable, {ActionType, ProColumns} from "@ant-design/pro-table";
import {TableListItem} from "@/pages/devOps/batteryOwnershipHistory/data";
import {getBatteryDeviceList} from "@/services/device";
import {batchAddDevice} from "@/services/merchant";
import {message} from "antd";
import {buttons, hasAuthority} from "@/utils/buttons";
import {enumConverter, enums} from "@/utils/enums";
import SearchFormOption from "@/components/SearchFormOption";

const BatteryAdd: React.FC<{}> = () => {
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
      valueEnum: enumConverter(enums.BatterySpecificationEnum),
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
        deviceType: 1,
        deviceList: deviceCodeList
      }
      batchAddDevice(param).then((res) => {
        if (res.data.data.failDeviceCode){
          message.warn('添加'+' '+'电池编号'+res.data.data.failDeviceCode.toString()+'失败',5)
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


  const optionButtons = hasAuthority(buttons.equipment.add.battery.addBatch) ?  [
    {
      text: "批量新增",
      onClick: batchAdd
    }
  ] : []

  return (
    <div>
      <ProTable<TableListItem>
        bordered
        options={{
          density: false,
          fullScreen: false,
          reload: false,
          setting: false,
        }}
        actionRef={actionRef}
        rowKey="deviceCode"
        columns={columns}
        rowSelection={rowSelection}
        toolBarRender={false}
        search={{
          optionRender: (searchConfig, props) =>
            <SearchFormOption searchConfig={searchConfig}
                              {...props}
                              optionButtons={optionButtons}/>
        }}
        request={(params) =>
          getBatteryDeviceList(params).then((res) => {
            return {data: res.data.data, success: true, total: res.data.total};
          })
        }
      />
    </div>
  );
};

export default BatteryAdd;
