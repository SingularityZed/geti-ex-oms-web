import React, {FC, useEffect, useState} from 'react';
import {Form, Input, message, Modal, Radio, Select} from "antd";
import {getOrganizationAll} from "@/services/merchant";
import {channelEdit} from "@/services/channel";
import {enums} from "@/utils/enums";

interface CreateModalProps {
  data:{};
  handleModelClose: () => void;
}

const layout = {
  labelCol: {span: 6},
  wrapperCol: {span: 12},
};

const EditModel: FC<CreateModalProps> = (props) => {
  const data = props.data;
  const [form] = Form.useForm();
  const [organizationOptions, setOrganizationOptions] = useState<object>([]);
  const [selectMerchant, setSelectMerchant] = useState<object>();

  //渠道状态
  const statusRadios = enums.ChannelEnableStatus.map(_enum =>
    <Radio.Button key={_enum.value} value={_enum.value}>{_enum.text}
    </Radio.Button>
  )

  //渠道是否可提现
  const accountRadios = enums.ChannelAccountStatus.map(_enum =>
    <Radio.Button key={_enum.value} value={_enum.value}>{_enum.text}
    </Radio.Button>
  )


  /**
   *  model框ok按钮事件
   */
  const modelOnOk = () => {
    form.validateFields().then(values => {
      let params = {...values}
      params.shareBenefitAmount = (Number(params.shareBenefitAmount) * 100).toString()
      params.merchantId = selectMerchant.key
      params.merchantName = selectMerchant.children
      params.id = data.id
      channelEdit(params).then((res) => {
        message.success("编辑渠道成功");
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
    setSelectMerchant({
      merchantId : data.merchantId,
      merchantName : data.merchantName
    })
    data.shareBenefitAmount = data.shareBenefitAmount / 100
    //获取运营商全部信息
    getOrganizationAll().then((res) => {
      let dataList = []
      res.data.data.organizationInfoList.forEach(item => {
        dataList.push(<Select.Option key={item.id}>{item.operationName}</Select.Option>)
      })
      setOrganizationOptions(dataList)
    })
  }, []);

  return (
    <Modal title="编辑渠道" visible={true} onOk={modelOnOk} onCancel={modelOnCancel} width={800} maskClosable={false}>
      <Form {...layout} form={form} initialValues={{...data}}>
        <Form.Item name="operatorName" label="姓名" rules={[{required: true}]}>
          <Input placeholder="请输入姓名" autoComplete="off"/>
        </Form.Item>
        <Form.Item name="shareBenefitAmount" label="分润金额(元)"
                   rules={[{required: true, message: '请输入分润金额'}, {pattern: /^[1-9]\d*$/, message: '请输入正整数'}]}>
          <Input placeholder="每笔订单分润金额" defaultValue={0}/>
        </Form.Item>
        <Form.Item name="remark" label="备注" rules={[{required: true}]}>
          <Input placeholder="请输入渠道备注" autoComplete="off"/>
        </Form.Item>
        {/*渠道禁止改商户*/}
        {/*<Form.Item*/}
        {/*  name="merchantName"*/}
        {/*  label="运营商"*/}
        {/*  rules={[{required: true, message: '请选择运营商'}]}*/}
        {/*>*/}
        {/*  <Select placeholder="请选择运营商" onSelect={(key, value) => {*/}
        {/*    setSelectMerchant(value)*/}
        {/*  }}>*/}
        {/*    {organizationOptions}*/}
        {/*  </Select>*/}
        {/*</Form.Item>*/}
        <Form.Item name="channelStatus" label="渠道状态" rules={[{required: true}]}>
          <Radio.Group buttonStyle="solid">
            {statusRadios}
          </Radio.Group>
        </Form.Item>
        <Form.Item name="accountStatus" label="是否可提现" rules={[{required: true}]}>
          <Radio.Group buttonStyle="solid">
            {accountRadios}
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>

  );
};
export default EditModel;
