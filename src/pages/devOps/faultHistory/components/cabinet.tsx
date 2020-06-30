import React, { useEffect, useState } from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { TableListItem } from '@/pages/devOps/batteryOwnershipHistory/data';
import { queryCabinetFaultHistory } from '@/services/merchant';
import { getEnumEntities } from '@/services/manager';
import { enumConverter, enums } from '@/utils/enums';
import { Cascader } from 'antd';
import { getRegions, loadRegionData } from '@/utils/region';

const faultTypes = enums.FaultType.map((_) => ({ value: _.value, label: _.text, isLeaf: false }));
const CabinetFault: React.FC<{}> = () => {
  const [faultOptions, setFaultOptions] = useState<[]>(faultTypes);
  const [regionOptions, setRegionOptions] = useState<[]>();

  const [regionData, setRegionData] = useState<[]>([]);
  const [faultData, setFaultData] = useState<[]>([]);

  /**
   * 页面初始化加载数据
   */
  useEffect(() => {
    getRegions().then((res) => {
      setRegionOptions(res);
    });
  }, []);

  const loadRegion = (selectedOptions) => {
    loadRegionData(selectedOptions).then(() => {
      setRegionOptions([...regionOptions]);
    });
  };

  const loadFaultData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    let enumTypeCode = null;
    switch (targetOption.value) {
      case 1:
        enumTypeCode = 'CABINET_FAULT_CODE';
        break;
      case 2:
        enumTypeCode = 'CHARGE_FAULT_CODE';
        break;
      case 3:
        enumTypeCode = 'GRID_FAULT_CODE';
        break;
    }

    getEnumEntities(enumTypeCode)
      .then((res) => {
        targetOption.loading = false;
        targetOption.children = res.data.data.map((_) => ({
          value: _.entityKey,
          label: _.entityValue,
        }));
        setFaultOptions([...faultOptions]);
      })
      .catch((error) => {});
  };

  // 列表及搜索条件
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '城市',
      dataIndex: 'region',
      order: 9,
      hideInTable: true,
      renderFormItem: () => (
        <Cascader
          options={regionOptions}
          loadData={loadRegion}
          changeOnSelect
          onChange={onChangeRegion}
        />
      ),
    },
    {
      title: '故障类型',
      dataIndex: 'fault',
      order: 8,
      hideInTable: true,
      renderFormItem: () => (
        <Cascader
          options={faultOptions}
          loadData={loadFaultData}
          changeOnSelect
          onChange={onChangeFault}
        />
      ),
    },
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
      hideInSearch: true,
    },
    {
      title: '格口号',
      dataIndex: 'gridId',
      align: 'center',
      hideInSearch: true,
      valueType: 'textarea',
      renderText: (text, row, index) => {
        return row.gridId + 1;
      },
    },
    {
      title: '故障类型',
      align: 'center',
      dataIndex: 'faultType',
      hideInSearch: true,
      valueEnum: enumConverter(enums.FaultType),
    },
    {
      title: '故障码',
      align: 'center',
      dataIndex: 'faultCode',
      hideInSearch: true,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '故障详情',
      align: 'center',
      dataIndex: 'faultCodeDesc',
      hideInSearch: true,
    },
    {
      title: '故障时间',
      align: 'center',
      dataIndex: 'faultTime',
      hideInSearch: true,
    },
  ];

  function onChangeRegion(value) {
    setRegionData(value);
  }
  function onChangeFault(value) {
    setFaultData(value);
  }

  /**
   * 表单查询请求
   * @param params
   */
  const request = (params) => {
    let _params = { ...params };
    delete _params.fault;
    delete _params.region;

    if (faultData && faultData.length > 1) {
      _params.faultType = faultData[0];
      _params.faultCode = faultData[1];
    }

    if (regionData && regionData.length > 1) {
      _params.province = regionData[0];
      _params.city = regionData[1];
      _params.area = regionData[2];
    }
    return queryCabinetFaultHistory(_params).then((res) => {
      return { data: res.data.data, success: true, total: res.data.total };
    });
  };

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
      beforeSearchSubmit={(params) => {
        return params;
      }}
      columns={columns}
      request={request}
    />
  );
};
export default CabinetFault;
