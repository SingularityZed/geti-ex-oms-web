import React, {useRef, useState} from 'react';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import {Card, message, Modal, Space, Tabs, Tag} from 'antd';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import {TableListItem} from './data';
import {deleteOrganization, getOrganizationPage} from '@/services/merchant';
import {enumConverter, enums} from '@/utils/enums';
import Details from "@/pages/merchant/merchant/components/Details";
import Create from "@/pages/merchant/merchant/components/Create";
import Edit from "@/pages/merchant/merchant/components/Edit";
import DetailSiderBar from "@/components/DetailSiderBar";
import AssignCabinet from "@/pages/merchant/merchant/components/AssignCabinet";
import AssignBattery from "@/pages/merchant/merchant/components/AssignBattery";
import {buttons, hasAuthority} from "@/utils/buttons";
import SearchFormOption from "@/components/SearchFormOption";
import moment from "moment";

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const cabinetActionRef = useRef();
  const batteryActionRef = useRef();
  const {confirm} = Modal;
  const {TabPane} = Tabs;
  const [createVisible, setCreateVisible] = useState<boolean>(false);
  const [detailsVisible, setDetailsVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [assignDeviceVisible, setAssignDeviceVisible] = useState<boolean>(false);
  const [orgId, setOrgId] = useState<number>();

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '创建时间范围',
      align: 'center',
      dataIndex: 'dateTimeRange',
      valueType: 'dateRange',
      hideInTable: true,
      order: 7,
    },
    {
      title: '序号',
      align: 'center',
      dataIndex: 'index',
      hideInSearch: true,
      renderText: (text, row, index) => index + 1,
    },
    {
      title: '运营商名称',
      align: 'center',
      dataIndex: 'operationName',
      order: 10,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '换电网络名称',
      align: 'center',
      dataIndex: 'powerExchangeNetworkName',
      hideInSearch: true,
    },
    {
      title: '联系人',
      align: 'center',
      dataIndex: 'contactPerson',
      hideInSearch: true,
    },
    {
      title: '联系电话',
      align: 'center',
      dataIndex: 'contactTelephone',
      hideInSearch: true,
    },
    {
      title: '合作模式',
      align: 'center',
      dataIndex: 'cooperationName',
      hideInSearch: true,
    },
    {
      title: '区域',
      align: 'center',
      dataIndex: 'area',
      hideInSearch: true,
      renderText: (text, row, index) =>
        (row.province || '') + ' ' + (row.city || '') + ' ' + (row.area || ''),
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'enabled',
      valueEnum: enumConverter(enums.UserStatusEnum),
      order: 8,
      render: (_, record) => {
        switch (record.enabled) {
          case true:
            return <Tag color="green">启用</Tag>;
          case false:
            return <Tag color="red">禁用</Tag>;
          default:
            return <span>record.enabled</span>;
        }
      },
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '设备数',
      align: 'center',
      dataIndex: 'deviceCount',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Space>
            {hasAuthority(buttons.merchant.merchant.index.detail) && (
              <a onClick={detailOnClick.bind(_, record)}>查看</a>
            )}
            {hasAuthority(buttons.merchant.merchant.index.edit) && (
              <a onClick={editOnClick.bind(_, record)}>编辑</a>
            )}
            {hasAuthority(buttons.merchant.merchant.index.delete) && (
              <a onClick={deleteOnClick.bind(_, record)}>删除</a>
            )}
            {hasAuthority(buttons.merchant.merchant.index.assign) && (
              <a onClick={assignDeviceOnClick.bind(_, record)}>分配设备</a>
            )}
          </Space>
        </>
      ),
    },
  ];

  /**
   * 查看 按钮点击事件
   */
  const createOnClick = (record) => {
    setCreateVisible(true);
  }

  /**
   * 查看 按钮点击事件
   */
  const detailOnClick = (record) => {
    setDetailsVisible(true);
    setOrgId(record.id);
  }

  /**
   * 编辑 按钮点击事件
   */
  const editOnClick = (record) => {
    setEditVisible(true);
    setOrgId(record.id);
  }

  /**
   * 删除 按钮点击事件
   */
  const deleteOnClick = (record) => {
    confirm({
      title: '删除商户?',
      icon: <ExclamationCircleOutlined/>,
      content: '当您点击确定按钮后，这些记录将会被彻底删除',
      onOk: deleteModelOnOk.bind(this, record.id)
    })
  };

  /**
   * 删除 model框ok按钮事件
   * @param orgId
   */
  const deleteModelOnOk = (orgId) => {
    deleteOrganization(orgId).then((res) => {
      message.success(res.data.message);
      actionRef.current.reload();
    })
  }

  /**
   * 分配设备 按钮点击事件
   */
  const assignDeviceOnClick = (record) => {
    setAssignDeviceVisible(true);
    setOrgId(record.id);
  }

  /**
   * 查询表单参数预处理
   * @param params
   */
  const beforeSearchSubmit = (params) => {
    if (Array.isArray(params.dateTimeRange)) {
      params.startTime = moment(params.dateTimeRange[0]).startOf('day').format('YYYY/MM/DD HH:mm:ss');
      params.endTime = moment(params.dateTimeRange[1]).endOf('day').format('YYYY/MM/DD HH:mm:ss');
    }
    return params;
  }

  /**
   * 表单查询请求
   * @param params
   */
  const request = (params) => {
    return getOrganizationPage(params).then((res) => {
      return {data: res.data.data, success: true, total: res.data.total};
    }).catch(error => {
    })
  }

  /**
   * 详情页返回
   */
  const handleDetailsReturn = () => {
    setDetailsVisible(false);
    actionRef.current.reload();
  }

  /**
   *  新增页返回
   */
  const handleCreateReturn = () => {
    setCreateVisible(false);
    actionRef.current.reload();
  }

  /**
   *  修改页返回
   */
  const handleEditReturn = () => {
    setEditVisible(false);
    actionRef.current.reload();
  }

  /**
   *  设备分配页返回
   */
  const handleAssignDeviceReturn = () => {
    setAssignDeviceVisible(false);
    actionRef.current.reload();
  }

  /**
   * 分配设备标签页tab变更事件
   */
  const assignDeviceTabsOnChange = (key) => {
    if (key == 'cabinet') {
      batteryActionRef.current.clear();
    }
    if (key == 'battery') {
      cabinetActionRef.current.clear();
    }
  }

  const optionButtons = hasAuthority(buttons.merchant.merchant.index.add) ? [
    {
      text: "新建",
      onClick: createOnClick
    }
  ] : []

  return (
    <>
      <ProTable<TableListItem>
        style={{display: (detailsVisible || createVisible || editVisible || assignDeviceVisible) ? 'none' : ''}}
        bordered
        options={false}
        toolBarRender={false}
        search={{
          optionRender: (searchConfig, props) =>
            <SearchFormOption searchConfig={searchConfig}
                              {...props}
                              optionButtons={optionButtons}/>
        }}
        rowKey="id"
        actionRef={actionRef}
        beforeSearchSubmit={beforeSearchSubmit}
        request={request}
        columns={columns}
      />
      {createVisible && <Create handleReturn={handleCreateReturn}/>}
      {detailsVisible && <Details orgId={orgId} handleReturn={handleDetailsReturn}/>}
      {editVisible && <Edit orgId={orgId} handleReturn={handleEditReturn}/>}
      {assignDeviceVisible &&
      <Card title="设备分配">
        <DetailSiderBar handleReturn={handleAssignDeviceReturn}/>
        <Tabs defaultActiveKey="1" onChange={assignDeviceTabsOnChange}>
          <TabPane tab="分配电柜" key="cabinet">
            <AssignCabinet merchantId={orgId} actionRef={cabinetActionRef}/>
          </TabPane>
          <TabPane tab="分配电池" key="battery">
            <AssignBattery merchantId={orgId} actionRef={batteryActionRef}/>
          </TabPane>
        </Tabs>
      </Card>
      }
    </>
  );
};

export default TableList;
