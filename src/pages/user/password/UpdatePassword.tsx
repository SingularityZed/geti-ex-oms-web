import {Form, Input, message, Modal} from 'antd';
import React, {FC, useEffect, useState} from 'react';
import {userPassword, passwordCheck} from "@/services/manager.ts";

interface Props {
  handleReturn: () => void;
}

const layout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14},
};

const Edit: FC<Props> = (props) => {
  const [form] = Form.useForm();

  const [username, setUsername] = useState();
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(
    () => {
      setUsername(JSON.parse(localStorage.getItem("USERINFO")).user.username)
    }
    , []);

  /**
   *  表单提交
   */
  const onFinish = () => {
    form.validateFields().then(values => {
      if (values.newPassword.trim() != values.confirmPassword.trim()) {
        message.error('两次输入新密码不一致')
        return;
      }
      //先校验原先密码
      passwordCheck({
        password: values.oldPassword,
        username: username
      }).then((r) => {
        if (r.data) {
          //校验通过后在修改密码
          userPassword({
            password: values.newPassword,
            username: username
          }).then(() => {
            setVisible(false)
            //重新登录
            message.success('修改密码成功')
            Modal.error({
              title: "更新密码成功",
              content: "更新密码成功，请重新登录",
              okText: "重新登录",
              mask: false,
              onOk: () => {
                return new Promise((resolve, reject) => {
                  localStorage.clear()
                  location.reload();
                });
              }
            })
          })
        } else {
          message.error('旧密码不正确')
          return;
        }
      })


    })
  }

  function onCancel() {
    props.handleReturn()
  }

  return (

    <Modal visible={visible} onCancel={onCancel} onOk={onFinish} maskClosable={false}>
      <Form {...layout} form={form}>
        <Form.Item label='旧密码' name='oldPassword' rules={[{required: true, message: '请输入旧密码'}]}>
          <Input autoComplete={"off"}/>
        </Form.Item>
        <Form.Item label='新密码' name='newPassword'
                   rules={[{required: true, message: '请输入新密码'}, {min: 6, message: '至少6位密码'}]}>
          <Input type={"password"}/>
        </Form.Item>
        <Form.Item label='再次确认' name='confirmPassword'
                   rules={[{required: true, message: '请输入再次确认密码'}, {min: 6, message: '至少6位密码'}]}>
          <Input type={"password"}/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Edit;
