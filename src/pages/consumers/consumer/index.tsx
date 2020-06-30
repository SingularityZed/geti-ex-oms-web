import React, { useEffect, useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Form, message, Modal, Select, Tag, Space, Dropdown, Menu, Button } from 'antd';
import { ExclamationCircleOutlined, DownOutlined } from '@ant-design/icons';
import { TableListItem } from './data';
import { bindGroup, exportConsumerExcel, getConsumerList } from '@/services/consumer';
import { groupSearch } from '@/services/merchant';
import { refund } from '@/services/pay';
import { enumConverter, enums } from '@/utils/enums';
import Details from '@/pages/consumers/consumer/components/Details';
import ExchangeOrderModelTable from '@/components/ExchangeOrderModelTable';
import { ExchangeOrderModelTableProps } from '@/components/ExchangeOrderModelTable/data';
import ExportTable from '@/components/ExportTable';
import moment from 'moment';
import { buttons, hasAuthority } from '@/utils/buttons';
import SearchFormOption from '@/components/SearchFormOption';
import { BasicListItemDataType } from './data.d';

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();
  const formRef = useRef();
  const { confirm } = Modal;
  const [detailsVisible, setDetailsVisible] = useState<boolean>(false);
  const [joinGroupModelVisible, setJoinGroupModelVisible] = useState<boolean>(false);
  const [exchangeOrderTableVisible, setExchangeOrderTableVisible] = useState<boolean>(false);
  const [exchangeOrderTableProps, setExchangeOrderTableProps] = useState<
    ExchangeOrderModelTableProps
  >();
  const [consumerId, setConsumerId] = useState<number>();
  const [groupOptions, setGroupOptions] = useState<number>();
  const [exportListVisible, setExportListVisible] = useState<boolean>(false);

  useEffect(() => {
    groupSearch({}).then((res) => {
      let options = res.data.data.map((group) => (
        <Select.Option key={group.id}>{group.groupName}</Select.Option>
      ));
      setGroupOptions(options);
    });
  }, []);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '套餐到期时间',
      align: 'center',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      hideInTable: true,
      order: 9,
    },
    {
      title: '套餐类别',
      align: 'center',
      dataIndex: 'packageType',
      valueEnum: enumConverter(enums.PackageTypeEnum),
      hideInTable: true,
      order: 7,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
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
      title: '骑手姓名',
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
      title: '用户类别',
      align: 'center',
      dataIndex: 'userType',
      valueEnum: enumConverter(enums.UserTypeEnum),
      order: 8,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '运营商',
      align: 'center',
      dataIndex: 'merchantName',
      hideInSearch: true,
    },
    {
      title: '换电网络',
      align: 'center',
      dataIndex: 'powerExchangeNetworkName',
      hideInSearch: true,
    },
    {
      title: '归属渠道名称',
      align: 'center',
      dataIndex: 'channelOperatorName',
      hideInSearch: true,
    },
    {
      title: '渠道手机号',
      align: 'center',
      dataIndex: 'channelMobileNo',
      hideInSearch: true,
    },
    {
      title: '电池编号',
      align: 'center',
      dataIndex: 'batteryDeviceCode',
      hideInSearch: true,
    },
    {
      title: '规格',
      align: 'center',
      dataIndex: 'batterySpecification',
      valueEnum: enumConverter(enums.BatterySpecificationEnum),
      hideInSearch: true,
    },
    {
      title: '押金(元)',
      align: 'center',
      dataIndex: 'depositAmount',
      renderText: (val: number) => (val / 100).toFixed(2),
      hideInSearch: true,
    },
    {
      title: '押金模式',
      align: 'center',
      dataIndex: 'depositModel',
      valueEnum: enumConverter(enums.ConsumerDepositModelEnum),
      hideInSearch: true,
    },
    {
      title: '套餐到期时间',
      align: 'center',
      dataIndex: 'packageType',
      renderText: (text: number, row: TableListItem) => {
        switch (text) {
          case 1:
            return row.packageEndDay;
          case 2:
            return row.packageTimes + '(次)';
          default:
            return '暂无套餐';
        }
      },
      hideInSearch: true,
    },
    {
      title: '注册日期',
      align: 'center',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '用户状态',
      align: 'center',
      dataIndex: 'userStatus',
      valueEnum: enumConverter(enums.UserStatusEnum),
      order: 6,
      render: (_, record) => {
        switch (record.userStatus) {
          case 1:
            return <Tag color="green">启用</Tag>;
          case 2:
            return <Tag color="red">禁用</Tag>;
          case 3:
            return <Tag color="red">停用</Tag>;
        }
      },
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Space>
            {hasAuthority(buttons.consumers.consumer.index.detail) && (
              <a onClick={detailOnClick.bind(_, record)}>详情</a>
            )}
            <MoreBtn key="more" item={record} />
            {/* {hasAuthority(buttons.consumers.consumer.index.exchangeOrder) && (
              <a onClick={exchangeOrderOnClick.bind(_, record)}>换电记录</a>
            )}
            {hasAuthority(buttons.consumers.consumer.index.refund) && record.depositStatus == 1 && (
              <a onClick={refundOnClick.bind(_, record)}>退押金</a>
            )}
            {hasAuthority(buttons.consumers.consumer.index.joinGroup) && !record.groupId && (
              <a onClick={joinGroupOnClick.bind(_, record)}>加入群组</a>
            )} */}
          </Space>
        </>
      ),
    },
  ];

  /**
   * 更多
   * @param param
   */
  const MoreBtn: React.FC<{
    item: BasicListItemDataType;
  }> = ({ item }) => (
    <Dropdown
      overlay={
        <Menu onClick={({ key }) => moreOperate(key, item)}>
          {hasAuthority(buttons.consumers.consumer.index.exchangeOrder) && (
            <Menu.Item key="exchange">
              <Button type="link">换电记录</Button>
            </Menu.Item>
          )}
          {hasAuthority(buttons.consumers.consumer.index.refund) && item.depositStatus == 1 && (
            <Menu.Item key="refund">
              <Button type="link">退押金</Button>
            </Menu.Item>
          )}
          {hasAuthority(buttons.consumers.consumer.index.joinGroup) && !item.groupId && (
            <Menu.Item key="addGroup">
              <Button type="link">加入群组</Button>
            </Menu.Item>
          )}
        </Menu>
      }
    >
      <a>
        更多 <DownOutlined />
      </a>
    </Dropdown>
  );
  const moreOperate = (key: string, currentItem: BasicListItemDataType) => {
    if (key === 'exchange') exchangeOrderOnClick(currentItem);
    else if (key === 'refund') refundOnClick(currentItem);
    else if (key === 'addGroup') joinGroupOnClick(currentItem);
  };

  /**
   * 详情 按钮点击事件
   */
  const detailOnClick = (record) => {
    setDetailsVisible(true);
    setConsumerId(record.id);
  };

  /**
   * 换电记录 按钮点击事件
   */
  const exchangeOrderOnClick = (record) => {
    setExchangeOrderTableProps({ mobileNo: record.mobileNo });
    setExchangeOrderTableVisible(true);
  };

  /**
   * 换电记录 model框close
   */
  const exchangeOrderTableClose = () => {
    setExchangeOrderTableVisible(false);
    setExchangeOrderTableProps({});
  };

  /**
   * 退押金 按钮点击事件
   */
  const refundOnClick = (record) => {
    confirm({
      title: '退押金?',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk: refundModelOnOk.bind(this, record.id),
    });
  };

  /**
   * 退押金 model框ok按钮事件
   */
  const refundModelOnOk = (consumerId) => {
    refund(consumerId).then((res) => {
      message.success(res.data.message);
      actionRef.current.reload();
    });
  };

  /**
   * 加入群组 按钮点击事件
   */
  const joinGroupOnClick = (record) => {
    setConsumerId(record.id);
    setJoinGroupModelVisible(true);
  };

  /**
   * 加入群组 model框ok按钮事件
   */
  const joinGroupModelOnOk = () => {
    form
      .validateFields()
      .then((values) => {
        let params = {
          consumerId: consumerId,
          groupId: values.groupId,
        };
        bindGroup(params).then((res) => {
          message.success(res.data.message);
          form.resetFields();
          actionRef.current.reload();
          setJoinGroupModelVisible(false);
        });
      })
      .catch((errorInfo) => {});
  };

  /**
   * 加入群组 model框cancel按钮事件
   */
  const joinGroupModelOnCancel = () => {
    form.resetFields();
    setJoinGroupModelVisible(false);
  };

  /**
   * 查询表单参数预处理
   * @param params
   */
  const beforeSearchSubmit = (params) => {
    if (Array.isArray(params.createTime)) {
      params.packageQueryStartTime = params.createTime[0].replaceAll('-', '/');
      params.packageQueryEndTime = params.createTime[1].replaceAll('-', '/');
    }
    return params;
  };

  /**
   * 表单查询请求
   * @param params
   */
  const request = (params) => {
    return getConsumerList(params).then((res) => {
      return { data: res.data.data, success: true, total: res.data.total };
    });
  };

  /**
   * 详情页返回
   */
  const handleDetailsReturn = () => {
    actionRef.current.reload();
    setDetailsVisible(false);
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
      queryParams.packageQueryStartTime = moment(queryParams.createTime[0]).format(
        'YYYY-MM-DD HH:mm:ss',
      );
      queryParams.packageQueryEndTime = moment(queryParams.createTime[1]).format(
        'YYYY-MM-DD HH:mm:ss',
      );
    }
    exportConsumerExcel(queryParams).then((res) => {
      message.success('请稍后在导出列表中下载！');
    });
  }

  /**
   * excel model显示
   */
  function handelShowExportList() {
    setExportListVisible(true);
  }

  const optionButtons = hasAuthority(buttons.consumers.consumer.index.exportExcel)
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

  const searchButtonsColConfig = {
    xs: 24,
    sm: 12,
    md: 12,
    lg: 12,
    xl: 8,
    xxl: 6,
  };

  return (
    <>
      <ProTable<TableListItem>
        style={{ display: detailsVisible ? 'none' : '' }}
        bordered
        options={false}
        toolBarRender={false}
        search={{
          span: searchButtonsColConfig,
          optionRender: (searchConfig, props) => (
            <SearchFormOption
              searchConfig={searchConfig}
              {...props}
              optionButtons={optionButtons}
            />
          ),
        }}
        rowKey="id"
        actionRef={actionRef}
        formRef={formRef}
        beforeSearchSubmit={beforeSearchSubmit}
        request={request}
        columns={columns}
      />

      {exportListVisible && (
        <ExportTable
          module="5"
          cancel={() => {
            setExportListVisible(false);
          }}
        />
      )}
      {detailsVisible && <Details consumerId={consumerId} handleReturn={handleDetailsReturn} />}
      {exchangeOrderTableVisible && (
        <ExchangeOrderModelTable
          closeModel={exchangeOrderTableClose}
          {...exchangeOrderTableProps}
        />
      )}
      {joinGroupModelVisible && (
        <Modal
          title="加入群组"
          visible={joinGroupModelVisible}
          onOk={joinGroupModelOnOk}
          onCancel={joinGroupModelOnCancel}
        >
          <Form form={form} initialValues={{}}>
            <Form.Item
              name="groupId"
              label="群组"
              rules={[{ required: true, message: '请选择群组' }]}
            >
              <Select showSearch placeholder="请选择群组" notFoundContent={null}>
                {groupOptions}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default TableList;
