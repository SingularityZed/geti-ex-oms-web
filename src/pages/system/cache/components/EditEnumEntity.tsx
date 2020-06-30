import {Form, Input, message, Modal} from 'antd';
import React, {FC} from 'react';
import {updateEnumEntity} from "@/services/manager";

interface EditEnumEntityProps {
  entityEntity: object;
  onOk: () => void;
  onCancel: () => void;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const EditEnumEntity: FC<EditEnumEntityProps> = (props) => {

  const [form] = Form.useForm();

  const onOk = () => {
    form.validateFields().then((values) => {
      let params = {...values}
      params.id = props.entityEntity.id;
      updateEnumEntity(params).then((res) => {
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
      title="修改枚举实体"
      okText="保存"
      cancelText="取消"
      onCancel={props.onCancel}
      onOk={onOk}
    >
      <Form {...layout} form={form} initialValues={{...props.entityEntity}}>
        <Form.Item name="enumTypeCode" label="枚举类型码" rules={[{required: true}]}>
          <Input disabled/>
        </Form.Item>
        <Form.Item name="entityKey" label="枚举Key" rules={[{required: true}]}>
          <Input disabled/>
        </Form.Item>
        <Form.Item name="entityValue" label="枚举键值" rules={[{required: true}]}>
          <Input autoComplete={"off"}/>
        </Form.Item>
        <Form.Item name="entityName" label="枚举名称">
          <Input autoComplete={"off"}/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditEnumEntity;
