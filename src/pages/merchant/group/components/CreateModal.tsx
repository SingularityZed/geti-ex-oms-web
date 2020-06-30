import React, {FC, useRef, useState} from 'react';
import {Form, Input, message, Modal, notification, Radio} from "antd";
import {enumConverter, enums} from "@/utils/enums";
import ProTable from "@ant-design/pro-table";
import {TableListItem} from "./data";
import {amountFormat} from "@/utils/amountUtils";
import {addGroup, getGroupPackage} from "@/services/merchant";
import {ActionType, ProColumns} from "@ant-design/pro-table/lib/Table";

interface CreateModalProps {
  handleModelClose: () => void;
}

const radios = enums.BatterySpecificationEnum.map(_enum =>
  <Radio.Button key={_enum.value} value={_enum.value}>{_enum.text}
  </Radio.Button>)
const initialValues = {
  deviceSpecification: 'A001',
  useCoupon: 1
}
const layout = {
  labelCol: {span: 6},
  wrapperCol: {span: 12},
};

const CreateModal: FC<CreateModalProps> = (props) => {
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();
  const [selectedRow, setSelectedRow] = useState();
  const [selectedDeviceSpecification, setSelectedDeviceSpecification] = useState('A001');

  const columns: ProColumns<TableListItem>[] = [
    {
      title: "序号",
      dataIndex: 'index',
      renderText: (text, row, index) => index + 1
    },
    {
      title: '套餐名称',
      dataIndex: 'packageName'
    },
    {
      title: '套餐价格(元)',
      dataIndex: 'packagePrice',
      renderText: (val: number) => amountFormat(val, '-')
    },
    {
      title: '套餐折后价',
      dataIndex: 'discount_amount',
      renderText: (val: number) => amountFormat(val, '-')
    },
    {
      title: '套餐类型',
      dataIndex: 'packageType',
      valueEnum: enumConverter(enums.PackageTypeEnum),
    },
    {
      title: '最大使用次数',
      dataIndex: 'packageTimes',
      renderText: (text, row, index) => (row.packageTimes ? text : '-')
    },
    {
      title: '套餐时长(天)',
      dataIndex: 'packageDays'
    },
    {
      title: '电池规格',
      dataIndex: 'batterySpecification',
      valueEnum: enumConverter(enums.BatterySpecificationEnum),
    }
  ]

  /**
   *  model框ok按钮事件
   */
  const modelOnOk = () => {
    if (!selectedRow) {
      notification.error({
        message: '系统提示',
        description: "群组套餐方案必选",
        duration: 2,
      });
      return;
    }
    form.validateFields().then(values => {
      let params = {...values}
      params.packageId = selectedRow.id;
      addGroup(params).then((res) => {
        message.success(res.data.message);
        props.handleModelClose();
      }).catch(errorInfo => {
      });
    }).catch(errorInfo => {
    });
  }

  /**
   * model框cancel按钮事件
   */
  const modelOnCancel = () => {
    form.resetFields();
    props.handleModelClose()
  }

  const formOnValuesChange = (changedValues) => {
    if (changedValues.deviceSpecification) {
      setSelectedDeviceSpecification(changedValues.deviceSpecification);
      actionRef.current.reload();
    }
  }

  /**
   * 表单查询请求
   * @param params
   */
  const request = (params) => {
    params.packageAttributes = 2;
    params.batterySpecification = selectedDeviceSpecification;
    params.packageStatus = 1;
    return getGroupPackage(params).then((res) => {
      return {data: res.data.data, success: true, total: res.data.total};
    })
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      if (selectedRows.length > 0) {
        setSelectedRow(selectedRows[0]);
      } else {
        setSelectedRow(null);
      }
    },
    type: "radio"
  };

  return (
    <Modal title="新建群组" visible={true} onOk={modelOnOk} onCancel={modelOnCancel} width={800}>
      <Form {...layout} form={form} initialValues={initialValues} onValuesChange={formOnValuesChange}>
        <Form.Item name="groupName" label="群组名称" rules={[{required: true}]}>
          <Input autoComplete={"off"}/>
        </Form.Item>
        <Form.Item name="contactPerson" label="群组联系人" rules={[{required: true}]}>
          <Input autoComplete={"off"}/>
        </Form.Item>
        <Form.Item name="contactTelephone" label="群组联系电话" rules={[{required: true}]}>
          <Input autoComplete={"off"}/>
        </Form.Item>
        <Form.Item name="remark" label="备注" rules={[{required: true}]}>
          <Input autoComplete={"off"}/>
        </Form.Item>
        <Form.Item name="deviceSpecification" label="电池规格" rules={[{required: true}]}>
          <Radio.Group buttonStyle="solid">
            {radios}
          </Radio.Group>
        </Form.Item>
        <Form.Item name="useCoupon" label="是否允许使用优惠券" rules={[{required: true}]}>
          <Radio.Group buttonStyle="solid">
            <Radio.Button key={0} value={0} disabled={true}>是</Radio.Button>
            <Radio.Button key={1} value={1}>否</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Form>
      <ProTable<TableListItem>
        bordered
        rowKey="id"
        options={false}
        toolBarRender={false}
        rowSelection={rowSelection}
        actionRef={actionRef}
        columns={columns}
        search={false}
        request={request}
      />
    </Modal>

  );
};
export default CreateModal;
