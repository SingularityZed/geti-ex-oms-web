import {Form, Input, message, Modal} from 'antd';
import React, {FC} from 'react';
import {addEnumType} from "@/services/manager";

interface AddEnumTypeProps {
  onCancel: () => void;
  onOk: () => void;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const AddEnumType: FC<AddEnumTypeProps> = (props) => {

  const [form] = Form.useForm();

  const onOk = () => {
    form.validateFields().then((values) => {
      let params = {...values}
      addEnumType(params).then((res) => {
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
      title="新增枚举类型"
      okText="保存"
      cancelText="取消"
      onCancel={props.onCancel}
      onOk={onOk}
    >
      <Form form={form} {...layout}>
        <Form.Item name="code" label="枚举类型码" rules={[{required: true}]}>
          <Input autoComplete={"off"}/>
        </Form.Item>
        <Form.Item name="name" label="枚举类型名称" rules={[{required: true}]}>
          <Input autoComplete={"off"}/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEnumType;
