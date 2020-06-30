import React, { useEffect, useState } from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { TableListItem } from './data';
import { getOrganizationAll, getOwnChangeLog } from '@/services/merchant';
import { enumConverter, enums } from '@/utils/enums';
import moment from 'moment';

const Index: React.FC<{}> = () => {
  const [organizationOptions, setOrganizationOptions] = useState<object>([]);
  useEffect(() => {
    //获取运营商全部信息
    getOrganizationAll().then((res) => {
      let obj = {};
      res.data.data.organizationInfoList.forEach((item) => {
        obj[item.id] = item.powerExchangeNetworkName;
      });
      setOrganizationOptions(obj);
    });
  }, []);

  // 列表及搜索条件
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'no',
      align: 'center',
      renderText: (val: string, _, index) => `${index + 1}`,
      hideInSearch: true,
    },
    {
      title: '换电网络',
      dataIndex: 'orgId',
      align: 'center',
      order: 7,
      valueEnum: organizationOptions,
      hideInTable: true,
      formItemProps: {
        allowClear: true,
      },
    },

    {
      title: '电池编号',
      align: 'center',
      dataIndex: 'deviceCode',
      order: 10,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '换电网络名称',
      dataIndex: 'powerExchangeNetworkName',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '归属类型',
      align: 'center',
      dataIndex: 'ownerType',
      hideInSearch: false,
      order: 8,
      valueEnum: enumConverter(enums.OwnerTypeEnum),
      formItemProps: {
        allowClear: true,
      },
    },
    {
      title: '归属实体名称',
      align: 'center',
      dataIndex: 'ownerName',
      hideInSearch: true,
    },
    {
      title: '手机号',
      align: 'center',
      dataIndex: 'ownerMobileNo',
      order: 9,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '变更原因',
      align: 'center',
      dataIndex: 'ownerChangeReason',
      valueEnum: enumConverter(enums.OwnerChangeReasonEnum),
      formItemProps: {
        allowClear: true,
      },
    },
    {
      title: '变更时间',
      align: 'center',
      dataIndex: 'ownerChangeTime',
      valueType: 'dateRange',
    },
    {
      title: '操作人',
      align: 'center',
      dataIndex: 'userName',
      hideInSearch: true,
    },
    {
      title: '备注',
      align: 'center',
      dataIndex: 'remark',
      hideInSearch: true,
      ellipsis: true,
      onCell: () => {
        return {
          style: {
            maxWidth: 120,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            cursor: 'pointer',
          },
        };
      },
    },
  ];

  const beforeSubmit = (params) => {
    if (Array.isArray(params.ownerChangeTime)) {
      params.ownerChangeTimeBegin = moment(params.ownerChangeTime[0])
        .startOf('day')
        .format('YYYY/MM/DD HH:mm:ss');
      params.ownerChangeTimeEnd = moment(params.ownerChangeTime[1])
        .endOf('day')
        .format('YYYY/MM/DD HH:mm:ss');
    }
    return params;
  };

  const request = (params) => {
    return getOwnChangeLog(params).then((res) => {
      return { data: res.data.data, success: true, total: res.data.total };
    });
  };

  return (
    <>
      <ProTable<TableListItem>
        bordered
        options={{
          density: false,
          fullScreen: false,
          reload: false,
          setting: false,
        }}
        rowKey="deviceCode"
        toolBarRender={false}
        beforeSearchSubmit={beforeSubmit}
        columns={columns}
        request={request}
      />
    </>
  );
};

export default Index;
