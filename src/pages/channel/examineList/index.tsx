import React, { useEffect, useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { TableListItem } from './data.d';
import { channelApplylist, channelPassApply, channelRejectApply } from '@/services/channel';
import { getOrganizationAll } from '@/services/merchant';
import { Form, Input, InputNumber, message, Modal, Select, Space } from 'antd';

const TableList: React.FC<{}> = () => {
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const [applyInfo, setApplyInfo] = useState<object>();
  const [organizationOptions, setOrganizationOptions] = useState<object>([]);
  const [selectMerchant, setSelectMerchant] = useState<object>();
  const [applyVisible, setApplyVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  useEffect(() => {
    //获取运营商全部信息
    getOrganizationAll().then((res) => {
      let options = res.data.data.organizationInfoList.map((organizationInfo) => (
        <Select.Option key={organizationInfo.id}>{organizationInfo.operationName}</Select.Option>
      ));
      setOrganizationOptions(options);
    });
  }, []);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
  };

  //通过渠道申请
  function passApply(values) {
    values.shareBenefitAmount = values.shareBenefitAmount * 100;
    values.merchantId = selectMerchant.key;
    values.merchantName = selectMerchant.children;
    values.id = applyInfo.id;
    channelPassApply(values).then(() => {
      message.success('通过渠道申请成功');
      actionRef.current.reload();
      setApplyVisible(false);
    });
  }

  //通过渠道申请弹窗
  function onPassApply(record) {
    setApplyInfo(record);
    setApplyVisible(true);
  }

  //拒绝渠道申请
  function onRejectApply(record) {
    confirm({
      title: '拒绝申请',
      content: '确认拒绝这条申请吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        let id = record.id;
        channelRejectApply({ id }).then((that) => {
          message.success('拒绝申请成功');
          actionRef.current.reload();
        });
      },
    });
  }

  function formOk() {
    form.validateFields().then((values) => {
      form.resetFields();
      passApply(values);
    });
  }

  function formCancel() {
    setApplyVisible(false);
  }

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      align: 'center',
      renderText: (text, row, index) => index + 1,
    },
    {
      title: '姓名',
      align: 'center',
      dataIndex: 'operatorName',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '手机号',
      align: 'center',
      dataIndex: 'mobileNo',
      formItemProps: {
        autoComplete: "off",
        allowClear: true,
      },
    },
    {
      title: '时间区间',
      align: 'center',
      dataIndex: 'createTime',
      valueType: 'dateTimeRange',
      hideInForm: true,
      hideInTable: true,
    },
    {
      title: '申请时间',
      align: 'center',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      align: 'center',
      valueType: 'option',
      dataIndex: 'applyStatus',
      render: (_, record) => (
        <>
          <Space>
            {record.applyStatus == 2 && <span>已通过</span>}
            {record.applyStatus == 3 && <span>已拒绝</span>}
            {record.applyStatus == 1 && <a onClick={onPassApply.bind(_, record)}>通过</a>}
            {record.applyStatus == 1 && <a onClick={onRejectApply.bind(_, record)}>拒绝</a>}
          </Space>
        </>
      ),
    },
  ];

  return (
    <>
      {
        <ProTable<TableListItem>
          bordered
          options={false}
          toolBarRender={false}
          actionRef={actionRef}
          rowKey="id"
          beforeSearchSubmit={(params) => {
            if (Array.isArray(params.createTime)) {
              params.createTimeFrom = params.createTime[0];
              params.createTimeTo = params.createTime[1];
            }
            return params;
          }}
          request={(params) =>
            channelApplylist(params).then((res) => {
              return { data: res.data.data, success: true, total: res.data.total };
            })
          }
          columns={columns}
        />
      }
      <Modal title="配置渠道信息" visible={applyVisible} onOk={formOk} onCancel={formCancel}>
        <Form
          {...layout}
          form={form}
          layout="horizontal"
          name="form_in_modal"
          initialValues={{ ...applyInfo }}
        >
          <Form.Item name="operatorName" label="姓名">
            <Input disabled={true} />
          </Form.Item>
          <Form.Item name="mobileNo" label="手机号">
            <Input disabled={true} />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input autoComplete={"off"}/>
          </Form.Item>
          <Form.Item
            name="shareBenefitAmount"
            label="单笔分润金额(元)"
            rules={[{ type: 'number', min: 0 }, { required: true }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item name="merchantId" label="所属运营商" rules={[{ required: true }]}>
            <Select
              onSelect={(key, value) => {
                setSelectMerchant(value);
              }}
            >
              {organizationOptions}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TableList;
