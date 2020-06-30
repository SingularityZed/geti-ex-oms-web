import React, { useEffect, useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { TableListItem } from './data';
import { enumConverter, enums } from '@/utils/enums';
import {
  addPackage,
  disablePackage,
  queryPackage,
  setDefault,
  setDiscount,
  getOrganizationAll,
} from '@/services/merchant';
import { Button, DatePicker, Form, Input, message, Modal, Radio, Select, Space } from 'antd';
import moment from 'moment';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons/lib';
import RadioGroup from 'antd/es/radio/group';
import { buttons, hasAuthority } from '@/utils/buttons';
import { getUserInfo } from '@/utils/authority';
import SearchFormOption from '@/components/SearchFormOption';

const { RangePicker } = DatePicker;

const Index: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [specialPriceModalTitle, setSpecialPriceModalTitle] = useState<string>('');
  const [specialPriceModalVisible, setSpecialPriceModalVisible] = useState<boolean>(false);
  const [id, setId] = useState<number>();
  const [originalPrice, setOriginalPrice] = useState<number>();
  const [discountStartTime, setDiscountStartTime] = useState<Date>();
  const [discountEndTime, setDiscountEndTime] = useState<Date>();
  const [form] = Form.useForm();
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [addPackageForm] = Form.useForm();
  const [organizationOptions, setOrganizationOptions] = useState<object>([]);
  const [typeInputVisible, setTypeInputVisible] = useState<boolean>(true);
  const [attrInputVisible, setAttrInputVisible] = useState<boolean>(true);
  const [orgId, setOrgId] = useState<number>(0);
  const [defaultPackage, setDefaultPackage] = useState<number>(0);
  const { confirm } = Modal;

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
      dataIndex: 'no',
      hideInSearch: true,
      renderText: (val: string, _, index) => `${index + 1}`,
    },
    {
      title: '套餐名称',
      align: 'center',
      dataIndex: 'packageName',
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '套餐价格(元)',
      dataIndex: 'packagePrice',
      align: 'center',
      hideInSearch: true,
      renderText: (val: number) => (val / 100).toFixed(2),
    },
    {
      title: '折扣后套餐价格(元)',
      align: 'center',
      dataIndex: 'discountAmount',
      hideInSearch: true,
      renderText: (val: number) => (val / 100).toFixed(2),
    },
    {
      title: '套餐类型',
      align: 'center',
      dataIndex: 'packageType',
      valueEnum: enumConverter(enums.PackageTypeEnum),
      formItemProps: {
        allowClear: true,
      },
    },
    {
      title: '最大使用次数',
      align: 'center',
      dataIndex: 'packageTimes',
      hideInSearch: true,
    },
    {
      title: '套餐属性',
      align: 'center',
      dataIndex: 'packageAttributes',
      hideInSearch: true,
      valueEnum: enumConverter(enums.packageAttributesEnum),
    },
    {
      title: '套餐时长',
      align: 'center',
      dataIndex: 'packageDays',
      hideInSearch: true,
    },
    {
      title: '套餐状态',
      align: 'center',
      dataIndex: 'packageStatus',
      valueEnum: enumConverter(enums.PackageStatusEnum),
      formItemProps: {
        allowClear: true,
      },
    },
    {
      title: '电池规格',
      align: 'center',
      dataIndex: 'batterySpecification',
      valueEnum: enumConverter(enums.BatterySpecificationEnum),
      formItemProps: {
        allowClear: true,
      },
    },
    {
      title: '是否默认套餐',
      align: 'center',
      dataIndex: 'defaultPackage',
      hideInSearch: true,
      valueEnum: enumConverter(enums.defaultPackageEnum),
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
      valueType: 'dateRange',
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
      align: 'center',
      dataIndex: 'option',
      hideInSearch: true,
      render: (_, record) => (
        <>
          <Space>
            {hasAuthority(buttons.merchant.package.index.disable) && record.packageStatus == 1 && (
              <a onClick={disablePackageOnclick.bind(_, record)}>停用</a>
            )}
            {hasAuthority(buttons.merchant.package.index.setDefault) &&
              record.defaultPackage == 2 &&
              record.packageStatus == 1 &&
              record.packageType != 3 &&
              record.packageAttributes == 1 && (
                <a onClick={defaultPackageOnclick.bind(_, record)}>设为默认</a>
              )}
            {hasAuthority(buttons.merchant.package.index.enable) && record.packageStatus == 2 && (
              <a onClick={enablePackageOnclick.bind(_, record)}>启用</a>
            )}
            {hasAuthority(buttons.merchant.package.index.setDiscount) && (
              <a onClick={specialPriceOnclick.bind(_, record)}>设置限时折扣</a>
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
  const disablePackageOnclick = (record) => {
    confirm({
      title: '停用',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk: disablePackageModalOnOk.bind(this, record),
    });
  };

  /**
   * 禁用 model框ok按钮事件
   */
  const disablePackageModalOnOk = (record) => {
    let params = {
      id: record.id,
      packageStatus: 2,
    };
    disablePackage(params).then((res) => {
      message.success(res.data.message);
      actionRef.current.reload();
    });
  };

  /********************************************/
  /**
   * 设为默认 按钮点击事件
   * @param record
   */
  const defaultPackageOnclick = (record) => {
    confirm({
      title: '设为默认',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk: defaultPackageModalOnOk.bind(this, record),
    });
  };
  /**
   * 设为默认 model框ok按钮事件
   */
  const defaultPackageModalOnOk = (record) => {
    setDefault(record.id).then((res) => {
      message.success(res.data.message);
      actionRef.current.reload();
    });
  };

  /********************************************/
  /**
   * 启用 按钮点击事件
   * @param record
   */
  const enablePackageOnclick = (record) => {
    confirm({
      title: '启用',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk: enablePackageModalOnOk.bind(this, record),
    });
  };
  /**
   * 启用 model框ok按钮事件
   */
  const enablePackageModalOnOk = (record) => {
    let params = {
      id: record.id,
      packageStatus: 1,
    };
    disablePackage(params).then((res) => {
      message.success(res.data.message);
      actionRef.current.reload();
    });
  };

  /********************************************/
  /**
   * 设置限时折扣 按钮点击事件
   * @param record
   */
  const specialPriceOnclick = (record) => {
    setSpecialPriceModalTitle('设置限时折扣');
    setSpecialPriceModalVisible(true);
    setId(record.id);
    setOriginalPrice((record.packagePrice / 100).toFixed(2));
    record.discountStartTime && setDiscountStartTime(record.discountStartTime);
    record.discountEndTime && setDiscountEndTime(record.discountEndTime);
    form.setFieldsValue({
      discountAmount: record.discountAmount
        ? (record.discountAmount / 100).toFixed(2)
        : (0.0).toFixed(2),
      date: [
        moment(
          record.discountStartTime ? record.discountStartTime : moment(),
          'YYYY-MM-DD HH:mm:ss',
        ),
        moment(record.discountEndTime ? record.discountEndTime : moment(), 'YYYY-MM-DD HH:mm:ss'),
      ],
    });
  };

  /**
   * 限时折扣 model框ok按钮事件
   */
  const specialPriceModalOnOk = () => {
    form
      .validateFields()
      .then((values) => {
        let params = {
          id: id,
          discountAmount: (values.discountAmount * 100).toFixed(0),
          discountStartTime: discountStartTime,
          discountEndTime: discountEndTime,
        };
        setDiscount(params).then((res) => {
          message.success(res.data.message);
          form.resetFields();
          actionRef.current.reload();
          setSpecialPriceModalVisible(false);
        });
      })
      .catch((errorInfo) => {});
  };
  /**
   * 限时折扣 model框cancel按钮事件
   */
  const specialPriceModalOnCancel = () => {
    form.resetFields();
    setSpecialPriceModalVisible(false);
  };

  /**
   *
   * @param dates
   * @param dateStrings
   */
  function onChange(_, dates: any[]) {
    setDiscountStartTime(dates[0]);
    setDiscountEndTime(dates[1]);
  }

  /**
   * 新增 model框ok按钮事件
   */
  const addModalOnOk = () => {
    //新增数据
    addPackageForm.validateFields().then((values) => {
      addPackageForm.resetFields();
      values.packagePrice = values.packagePrice * 100;
      if(values.defaultPackage === undefined){
        values.defaultPackage = 2
      }
      addPackage(values);
      actionRef.current.reload();
      setAddModalVisible(false);
    });
  };
  /**
   * 新增 model框cancel按钮事件
   */
  const addModalOnCancel = () => {
    addPackageForm.resetFields();
    setAddModalVisible(false);
  };

  /**
   * 设置新增套餐  form item 隐藏
   * @param dates
   * @param dateStrings
   */
  const typeRadioOnChange = (e) => {
    if (e.target.value === 2) {
      setTypeInputVisible(false);
    } else {
      setTypeInputVisible(true);
    }
  };
  /**
   * 设置新增套餐  form item 隐藏
   * @param dates
   * @param dateStrings
   */
  const attrRadioOnChange = (e) => {
    if (e.target.value === 2) {
      setAttrInputVisible(false);
    } else {
      setAttrInputVisible(true);
    }
  };

  function addOnClick() {
    if (orgId !== 1) {
      addPackageForm.setFieldsValue({ merchantId: String(orgId) });
    }
    setAddModalVisible(true);
  }

  const optionButtons = hasAuthority(buttons.merchant.package.index.add)
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
          queryPackage(params).then((res) => {
            return { data: res.data.data, success: true, total: res.data.total };
          })
        }
      />

      <Modal
        title={specialPriceModalTitle}
        visible={specialPriceModalVisible}
        onOk={specialPriceModalOnOk}
        onCancel={specialPriceModalOnCancel}
      >
        <Form form={form} layout="horizontal" name="form_in_modal">
          <Form.Item label="原金额(元)">
            <span>{originalPrice}</span>
          </Form.Item>
          <Form.Item
            name="discountAmount"
            label="折扣后金额(元)"
            rules={[
              { required: true },
              { pattern: /^\d+(\.\d{0,2})?$/, message: '请输入整数或两位小数' },
            ]}
          >
            <Input autoComplete={"off"}/>
          </Form.Item>
          <Form.Item name="date" label="折扣时间">
            <RangePicker format="YYYY-MM-DD HH:mm:ss" onChange={onChange} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="新增套餐"
        visible={addModalVisible}
        onOk={addModalOnOk}
        onCancel={addModalOnCancel}
      >
        <Form
          form={addPackageForm}
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
        >
          <Form.Item
            name="packageName"
            label="套餐名称"
            rules={[{ required: true, message: '套餐名称' }]}
          >
            <Input placeholder="套餐名称" autoComplete="off"/>
          </Form.Item>
          <Form.Item
            name="packagePrice"
            label="套餐价格(元)"
            rules={[
              { required: true },
              { pattern: /^\d+(\.\d{0,2})?$/, message: '请输入整数或两位小数' },
            ]}
          >
            <Input type={'packagePrice'} placeholder="请输入套餐金额" autoComplete="off"/>
          </Form.Item>
          <Form.Item
            name="packageType"
            label="套餐类型"
            rules={[{ required: true, message: '必选' }]}
          >
            <Radio.Group onChange={typeRadioOnChange}>
              <Radio value={1}>时长</Radio>
              <Radio value={2}>次数</Radio>
              <Radio value={3}>体验</Radio>
            </Radio.Group>
          </Form.Item>
          {typeInputVisible && (
            <Form.Item
              name="packageDays"
              label="套餐时长"
              rules={[{ required: true, message: '必选' }]}
            >
              <Input type={'packageDays'} placeholder="请输入套餐时长" autoComplete="off"/>
            </Form.Item>
          )}
          {!typeInputVisible && (
            <Form.Item
              name="packageTimes"
              label="最大套餐使用次数"
              rules={[{ required: true, message: '必选' }]}
            >
              <Input type={'packageTimes'} placeholder="最大套餐使用次数" />
            </Form.Item>
          )}
          <Form.Item
            name="batterySpecification"
            label="电池规格"
            rules={[{ required: true, message: '必选' }]}
          >
            <Select placeholder="电池规格">
              <Select.Option value="A001">60V-20AH</Select.Option>
              <Select.Option value="A003">48V-20AH</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="packageAttributes"
            label="套餐属性"
            rules={[{ required: true, message: '必选' }]}
          >
            <RadioGroup onChange={attrRadioOnChange}>
              <Radio value={1}>通用</Radio>
              <Radio value={2}>群组</Radio>
            </RadioGroup>
          </Form.Item>
          {attrInputVisible && (
            <Form.Item name="defaultPackage" label="是否当前电池规格默认套餐">
              <Radio.Group>
                <Radio value={1}>是</Radio>
                <Radio value={2}>否</Radio>
              </Radio.Group>
            </Form.Item>
          )}
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
