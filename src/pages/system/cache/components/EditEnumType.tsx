import {Form, Input, message, Modal} from 'antd';
import React, {FC} from 'react';
import {updateEnumType} from "@/services/manager";

interface EditEnumTypeProps {
  enumType: object,
  onCancel: () => void;
  onOk: () => void;
}
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const EditEnumType: FC<EditEnumTypeProps> = (props) => {

  const [form] = Form.useForm();

  const onOk = () => {
    form.validateFields().then((values) => {
      let params = {...values}
      params.id = props.enumType.id;
      updateEnumType(params).then((res) => {
        message.success(res.data.message);
        form.resetFields();
        props.onOk();
      }).catch((info) => {
      });
    }).catch((info) => {
    });
  }

  return (
    <Modal
      visible={true}
      title="修改枚举类型"
      okText="保存"
      cancelText="取消"
      onCancel={props.onCancel}
      onOk={onOk}
    >
      <Form {...layout} form={form} initialValues={{...props.enumType}}>
        <Form.Item name="code" label="枚举类型码" rules={[{required: true}]}>
          <Input disabled/>
        </Form.Item>
        <Form.Item name="name" label="枚举类型名称" rules={[{required: true}]}>
          <Input autoComplete={"off"}/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditEnumType;
