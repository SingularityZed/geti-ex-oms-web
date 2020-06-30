import React, { useEffect, useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { addDeposit, disableDeposit, getOrganizationAll, queryDeposit } from '@/services/merchant';
import { enumConverter, enums } from '@/utils/enums';
import { Button, Form, Input, message, Modal, Select, Space } from 'antd';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons/lib';
import { buttons, hasAuthority } from '@/utils/buttons';
import { getUserInfo } from '@/utils/authority';
import { TableListItem } from './data';
import SearchFormOption from '@/components/SearchFormOption';

const Index: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [addDepositForm] = Form.useForm();
  const { confirm } = Modal;
  const [organizationOptions, setOrganizationOptions] = useState<[]>([]);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [orgId, setOrgId] = useState<number>(0);

  useEffect(() => {
    let str = getUserInfo();
    let userInfo = str == '' ? {} : JSON.parse(getUserInfo());
    setOrgId(userInfo.user.orgId);
    //获取运营商全部信息
    getOrganizationAll().then((res) => {
      let dataList = [];
      res.data.data.organizationInfoList.forEach((item) => {
        dataList.push(<Select.Option key={item.id}>{item.operationName}</Select.Option>);
      });
      setOrganizationOptions(dataList);
    });
  }, []);

  // 列表及搜索条件
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      align: 'center',
      dataIndex: 'index',
      hideInSearch: true,
      renderText: (val: string, _, index) => `${index + 1}`,
    },
    {
      title: '模式名称',
      align: 'center',
      dataIndex: 'patternName',
      order: 9,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '押金金额',
      dataIndex: 'depositAmount',
      align: 'center',
      hideInSearch: true,
      renderText: (val: number) => (val / 100).toFixed(2),
    },
    {
      title: '押金状态',
      align: 'center',
      dataIndex: 'depositStatus',
      hideInSearch: false,
      order: 10,
      valueEnum: enumConverter(enums.DepositStatusEnum),
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '电池规格',
      align: 'center',
      dataIndex: 'batterySpecification',
      hideInSearch: false,
      order: 8,
      valueEnum: enumConverter(enums.BatterySpecificationEnum),
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '商户名称',
      align: 'center',
      dataIndex: 'operationName',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
      hideInSearch: true,
    },
    {
      title: '更新时间',
      align: 'center',
      dataIndex: 'updateTime',
      valueType: 'dateRange',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, record) => (
        <>
          <Space>
            {hasAuthority(buttons.merchant.deposit.index.forbid) && record.depositStatus == 1 && (
              <a onClick={disableBatteryOnclick.bind(_, record)}>禁用</a>
            )}
          </Space>
        </>
      ),
    },
  ];

  /**
   * 禁用 按钮点击事件
   * @param record
   */
  const disableBatteryOnclick = (record) => {
    confirm({
      title: '禁用押金?',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk: disableModalOnOk.bind(this, record),
    });
  };

  /**
   * 禁用 model框ok按钮事件
   */
  const disableModalOnOk = (record) => {
    let params = {
      id: record.id,
      depositStatus: 2,
    };
    disableDeposit(params).then((res) => {
      message.success(res.data.message);
      actionRef.current.reload();
    });
  };

  /**
   * 新增 按钮点击事件
   * @param record
   */
  function addOnClick() {
    if (orgId !== 1) {
      addDepositForm.setFieldsValue({ merchantId: String(orgId) });
    }
    setAddModalVisible(true);
  }

  /**
   * 新增 model框ok按钮事件
   */
  const addModalOnOk = () => {
    //新增数据
    addDepositForm
      .validateFields()
      .then((values) => {
        let params = { ...values };
        params.depositAmount = values.depositAmount * 100;
        params.merchantId = Number(values.merchantId);
        addDeposit(params)
          .then((res) => {
            message.success(res.data.data);
            actionRef.current.reload();
            addDepositForm.resetFields();
            setAddModalVisible(false);
          })
          .catch((error) => {});
      })
      .catch((error) => {});
  };
  /**
   * 新增 model框cancel按钮事件
   */
  const addModalOnCancel = () => {
    addDepositForm.resetFields();
    setAddModalVisible(false);
  };

  const optionButtons = hasAuthority(buttons.merchant.deposit.index.add)
    ? [
        {
          text: '新建',
          onClick: addOnClick,
        },
      ]
    : [];

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
        actionRef={actionRef}
        rowKey="id"
        beforeSearchSubmit={(params) => {
          return params;
        }}
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
        columns={columns}
        request={(params) =>
          queryDeposit(params).then((res) => {
            return { data: res.data.data, success: true };
          })
        }
      />

      <Modal
        title="新增押金模式"
        visible={addModalVisible}
        onOk={addModalOnOk}
        onCancel={addModalOnCancel}
      >
        <Form
          form={addDepositForm}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
        >
          <Form.Item
            name="patternName"
            label="模式名称"
            rules={[{ required: true, message: '模式名称' }]}
          >
            <Input placeholder="模式名称" autoComplete="off"/>
          </Form.Item>
          <Form.Item
            name="depositAmount"
            label="押金金额(元)"
            rules={[
              { required: true },
              { pattern: /^\d+(\.\d{0,2})?$/, message: '请输入整数或两位小数' },
            ]}
          >
            <Input type={'depositAmount'} placeholder="请输入押金金额" autoComplete="off"/>
          </Form.Item>
          <Form.Item
            name="batterySpecification"
            label="电池规格"
            rules={[{ required: true, message: '必选' }]}
          >
            <Select placeholder="电池规格">
              <Option value="A001">60V-20AH</Option>
              <Option value="A003">48V-20AH</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="merchantId"
            label="运营商"
            rules={[{ required: true, message: '请选择运营商' }]}
          >
            <Select placeholder="请选择运营商" disabled={orgId !== 1}>
              {organizationOptions}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Index;
