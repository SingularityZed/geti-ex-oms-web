import React, {FC, useEffect, useState} from 'react';
import {Form, Input, message, Modal, Select} from "antd";
import {getOrganizationAll} from "@/services/merchant";
import {channelAdd} from "@/services/channel";

interface CreateModalProps {
  handleModelClose: () => void;
}

const layout = {
  labelCol: {span: 6},
  wrapperCol: {span: 12},
};

const CreateModel: FC<CreateModalProps> = (props) => {
  const [form] = Form.useForm();
  const [organizationOptions, setOrganizationOptions] = useState<object>([]);
  const [selectMerchant, setSelectMerchant] = useState<object>();


  /**
   *  model框ok按钮事件
   */
  const modelOnOk = () => {
    form.validateFields().then(values => {
      let params = {...values}
      params.shareBenefitAmount = (Number(params.shareBenefitAmount) * 100).toString()
      params.merchantId = selectMerchant.key
      params.merchantName = selectMerchant.children
      channelAdd(params).then((res) => {
        message.success("新增渠道成功");
        props.handleModelClose();
      }).catch(errorInfo => {
      });
    });
  }

  /**
   * model框cancel按钮事件
   */
  const modelOnCancel = () => {
    form.resetFields();
    props.handleModelClose()
  }

  useEffect(() => {
    //获取运营商全部信息
    getOrganizationAll().then((res) => {
        let dataList = []
        res.data.data.organizationInfoList.forEach(item => {
          dataList.push(<Select.Option key={item.id} value={item.operationName}>{item.operationName}</Select.Option>)
        })
        setOrganizationOptions(dataList)
      })
    },[]);

  return (
    <Modal title="新增渠道" visible={true} onOk={modelOnOk} onCancel={modelOnCancel} width={800} maskClosable={false}>
      <Form {...layout} form={form}>
        <Form.Item name="operatorName" label="姓名" rules={[{required: true}]}>
          <Input placeholder="请输入姓名" autoComplete="off"/>
        </Form.Item>
        <Form.Item name="mobileNo" label="手机号" rules={[{required: true}]}>
          <Input placeholder="请输入手机号码" autoComplete="off"/>
        </Form.Item>
        <Form.Item name="shareBenefitAmount"  label="分润金额(元)" rules={[{required:true,message: '请输入分润金额'}, {pattern: /^[1-9]\d*$/, message: '请输入正整数'}]}
        >
          <Input placeholder="每笔订单分润金额" defaultValue={0}/>
        </Form.Item>
        <Form.Item name="remark" label="备注" rules={[{required: true}]}>
          <Input placeholder="请输入渠道备注" autoComplete="off"/>
        </Form.Item>
        <Form.Item
          name="merchantName"
          label="运营商"
          rules={[{required: true, message: '请选择运营商'}]}
        >
          <Select placeholder="请选择运营商" onSelect={(key,value)=>{setSelectMerchant(value)}}>
            {organizationOptions}
          </Select>
        </Form.Item>
      </Form>
    </Modal>

  );
};
export default CreateModel;
